import { LightningElement,track,wire } from 'lwc';
import getAvailableProducts from '@salesforce/apex/ShopingCartController.getAvailableProducts';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import ProductCode_FIELD from '@salesforce/schema/Product2.ProductCode';
import UNIT_FIELD from '@salesforce/schema/Product2.Units__c';
import { publish, MessageContext } from 'lightning/messageService';
import CHECKOUT_CHANNEL from '@salesforce/messageChannel/Checkout__c';
const COLUMNS = [
{ label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
{ label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
{ label: 'Product Code', fieldName: ProductCode_FIELD.fieldApiName, type: 'text' },
{ label: 'Available Units', fieldName: UNIT_FIELD.fieldApiName, type: 'number' }
];


const RECORD_PER_PAGE=10;

export default class ProductList extends LightningElement {
columns = COLUMNS;
    editableTableCOlumns= [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
    { label: 'Product Code', fieldName: ProductCode_FIELD.fieldApiName, type: 'text' },
    { label: 'Units', fieldName: UNIT_FIELD.fieldApiName, type: 'number',editable: true},
    { label: 'Delete', type: 'button-icon',  typeAttributes:  { iconName: 'utility:delete', name: 'delete'  }}
];
@wire(MessageContext)
messageContext;
@track products;
@track error;
@track selectedRows;

connectedCallback() {
    this.loadProducts();
}

loadProducts(){
    getAvailableProducts()
        .then(result => {      
            this.products=result;                          
        })
        .catch(error => {                
            this.error=error;
        });
}

addToCart=function(event) {
    const selectedRows = event.detail;
    let existingSelectedRecords=[];
    let productRecords = this.products.map(element => ({...element}));
    let newSelectedRecords = selectedRows.map(element => ({...element}));      

    if(this.selectedRows){
        existingSelectedRecords = this.selectedRows.map(element => ({...element}));    
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
   
    productRecords.forEach((objValue, index) => { 
        let _obj=objValue;   
        const selectedObj = selectedRows.find(function (element) {  return element.Id==objValue.Id;});
        if(selectedObj){
            _obj.Units__c=_obj.Units__c-1;   
        }
        
        if( _obj.Units__c==0){
            productRecords.splice(index,1);
        }

    });
    
    this.products=[...productRecords];
    this.selectedRows = [...existingSelectedRecords];    
    }

updateProductList=function(event) {
    const selectedRows = event.detail;
    selectedRows.forEach((objValue, index) => { 
        objValue.Units__c=1;                
    });
    
    this.selectedRows = [...selectedRows];    
    }

checkout=function(event) {
    let checkOutRows = event.detail;

    if(checkOutRows==undefined)
        return false;

    let selectedRows = checkOutRows.map(element => ({...element}));

    if(selectedRows==undefined)
        return false;

    selectedRows.forEach((objValue, index) => { 
        let _obj=objValue;
        _obj.Total= _obj.Price__c*_obj.Units__c;            
    });

    const payload = { lineitems: selectedRows};
    publish(this.messageContext, CHECKOUT_CHANNEL, payload);
}

cartDeleteAction=function(event) {

    const deletedRow = event.detail; 
    let selectedRows = this.selectedRows.map(element => ({...element}));

    selectedRows.forEach((objValue, index) => { 
        let _obj=objValue;       
        if(_obj.Id==deletedRow.Id){
            selectedRows.splice(index,1);
        }              
    });
    this.selectedRows = [...selectedRows];
    
    if(this.selectedRows.length==0)
        this.selectedRows=undefined;
    
    let productRecords = this.products.map(element => ({...element}));
    
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

    this.products=[...productRecords];        
}
    
cartUpdateAction=function(event) {
    
    const updatedRows = event.detail;
    let productRecords = this.products.map(element => ({...element}));
    
    
    productRecords.forEach((objValue, index) => { 
            let _obj=objValue;
            const updatedObj = updatedRows.find(function (element) {  return element.Id==_obj.Id;});
                       
            if(updatedObj==undefined)
                return;

            if(updatedObj.Units__c==1 && updatedObj.changeType!='Sub')
                return;

            if(updatedObj.changeType=='Add'){
                _obj.Units__c=_obj.Units__c-(parseInt(updatedObj.Units__c)-1);
            }else{                
                _obj.Units__c=_obj.Units__c+parseInt(updatedObj.Units__c);
            }  
        });
        this.products=[...productRecords];
    }

}