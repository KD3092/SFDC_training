import { LightningElement,track,wire } from 'lwc';
import getAvailableProducts from '@salesforce/apex/ShopingCartController.getAvailableProducts';
import { publish, MessageContext } from 'lightning/messageService';
import CHECKOUT_CHANNEL from '@salesforce/messageChannel/Checkout__c';
import { COLUMNS, CART_COLUMNS, getLabel } from './constant';

export default class ProductList extends LightningElement {
columns = COLUMNS;
editableTableCOlumns=CART_COLUMNS;
componentLabel=getLabel();

@wire(MessageContext)
messageContext;

@track state={products:null,error:null,selectedRows:null};

connectedCallback() {
    this.loadProducts();
}

loadProducts(){
    getAvailableProducts()
        .then(result => {      
            this.state.products=result;                          
        })
        .catch(error => {                
            this.state.error=error;
        });
}

addToCart=function(event) {
    const selectedRows = event.detail;
    this.updateSelectedForAddtoCart(selectedRows);
    this.updateProductListForAddToCart(selectedRows);  
}

updateSelectedForAddtoCart(selectedRows){
    let existingSelectedRecords=[];
    let newSelectedRecords = this.createMutableObj(selectedRows);

    if( this.state.selectedRows){
        existingSelectedRecords =  this.createMutableObj( this.state.selectedRows);
        existingSelectedRecords.forEach((objValue, index) => { 
        let _obj=objValue;

        const newObj = newSelectedRecords.find(function (element) {  return element.Id==_obj.Id;});
        if(newObj){
                _obj.Units__c= _obj.Units__c+1;
                newSelectedRecords.splice(newSelectedRecords.indexOf(newObj),1);
            }                            
        });
    }

    newSelectedRecords.forEach((objValue, index) => { 
        let _obj=objValue;       
        _obj.Units__c=1;
        existingSelectedRecords.push(_obj);        
    });

    this.state.selectedRows = [...existingSelectedRecords];    
}

updateProductListForAddToCart(selectedRows){
    let productRecords = this.createMutableObj(this.state.products);
    productRecords.forEach((objValue, index) => {
        let _obj=objValue;   
        const selectedObj = selectedRows.find(function (element) {  return element.Id==objValue.Id;});
      
        if(selectedObj){
            _obj.Units__c=_obj.Units__c-1;   
        }     
    });
    productRecords = productRecords.filter(element => element.Units__c!=0);
    this.state.products=[...productRecords];
}

checkout=function(event) {
    let checkOutRows = event.detail;

    if(checkOutRows==undefined)
        return false;

    let selectedRows = this.createMutableObj(checkOutRows);

    if(selectedRows==undefined)
        return false;

    selectedRows=this.calculateTotal(selectedRows);
    this.publishCheckoutData(selectedRows);
}

calculateTotal(selectedRows){
    selectedRows.forEach((objValue, index) => { 
        let _obj=objValue;
        _obj.Total= _obj.Price__c*_obj.Units__c;            
    });
    return selectedRows;
}

publishCheckoutData(selectedRows){
    const payload = { lineitems: selectedRows};
    publish(this.messageContext, CHECKOUT_CHANNEL, payload);
}

cartDeleteAction=function(event) {
    const deletedRow = event.detail; 
    this.deleteRowFromSelected(deletedRow);
    this.updateProductsForDeleteAction(deletedRow);        
}

updateProductsForDeleteAction(deletedRow){
    let productRecords = this.createMutableObj(this.state.products);
    
    const selectedObj = productRecords.find(function (element) {  return element.Id==deletedRow.Id;});
    if(selectedObj){
        productRecords.forEach((objValue, index) => { 
            let _obj=objValue;
            if(_obj.Id==selectedObj.Id){
                _obj.Units__c=_obj.Units__c+parseInt(deletedRow.Units__c);   
            }
            
        });
    }else{
        productRecords.push(deletedRow);
    }

    this.state.products=[...productRecords];   
}

deleteRowFromSelected(deletedRow){
    let selectedRows = this.createMutableObj( this.state.selectedRows);
    selectedRows.forEach((objValue, index) => { 
        let _obj=objValue;       
        if(_obj.Id==deletedRow.Id)
            selectedRows.splice(index,1);           
    });
    
    this.state.selectedRows=selectedRows.length==0?undefined:[...selectedRows];
}

cartUpdateAction(event) {
    
    const updatedRows = event.detail;
    let productRecords = this.createMutableObj(this.state.products);

    productRecords.forEach((objValue, index) => { 
            let _obj=objValue;
            const updatedObj = updatedRows.find(function (element) {  return element.Id==_obj.Id;});
                       
            if(updatedObj==undefined)
                return;

            const{Units__c:updateObjUnit, changeType }=updatedObj;
            if(updateObjUnit==1 && changeType!=this.componentLabel.SUB)
                return;

            const valueToAdd = changeType == this.componentLabel.ADD ? - (parseInt(updateObjUnit)-1): parseInt(updateObjUnit);
            _obj.Units__c += valueToAdd;

        });
        this.state.products=[...productRecords];
    }

    createMutableObj(immutableObj){
        return immutableObj.map(element => ({...element}));
    }

}