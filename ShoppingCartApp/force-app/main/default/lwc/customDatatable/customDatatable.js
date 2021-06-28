import { LightningElement, api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { RECORD_PER_PAGE, getLabel } from './constant';

export default class CustomDatatable extends LightningElement {

componentLabel=getLabel();
@track state={
    recordsToDisplay:null,
    draftValues:[],
    searchTerm:'',
    totalRecords:0,
    pageNo:1,
    TotalPages:0,
    endRecord:null,
    end:false,
    delayTimeout:null,
    selectedRows:null
};


@api 
get records(){
    return this._records;
}
set records(value){
    this._records=value;
        this.state._recordsToDisplay=value;
        this.applyPagination();
}
@api columns;
@api keyfield;
@api btnLabel;
@api btnIconName;
@api textSearchOn;
@api origRecords;

get hasResults() {
    return (this.records && this.records.length > 0);
} 

handleClick(event) {
    let label = event.target.label;
    if (label === this.componentLabel.FIRST) {
        this.handleFirst();
    } else if (label === this.componentLabel.PREVIOUS) {
        this.handlePrevious();
    } else if (label === this.componentLabel.NEXT) {
        this.handleNext();
    } else if (label === this.componentLabel.LAST) {
        this.handleLast();
    }
}

handleNext() {
    this.state.pageNo += 1;
    this.applyPagination();
}

handlePrevious() {
    this.state.pageNo -= 1;
    this.applyPagination();
}

handleFirst() {
    this.state.pageNo = 1;
    this.applyPagination();
}

handleLast() {
    this.state.pageNo = this.state.totalPages;
    this.applyPagination();
}

applyPagination() { 
    let allData = this.records;
    let searchField= this.textSearchOn;   
    
    if (''!= this.state.searchTerm) {  
        allData = allData.filter(record => record[searchField].includes( this.state.searchTerm));
    }

    this.setPaginationParam(allData);    
}

setPaginationParam(allData){
    const totalRecords=allData.length;
    this.state.totalPages = Math.ceil(totalRecords / RECORD_PER_PAGE);
    let begin = (this.state.pageNo - 1) * parseInt(RECORD_PER_PAGE);
    let end = parseInt(begin) + parseInt(RECORD_PER_PAGE);
    this.state.recordsToDisplay = allData.slice(begin, end);
    
    this.startRecord = begin + parseInt(1);
    this.state.endRecord = end > totalRecords ?  totalRecords : end;
    this.state.end = end >  totalRecords ? true : false;
    this.state.totalRecords = totalRecords;
    this.callDisableActionWithDelay();
    
}

callDisableActionWithDelay(){
    window.clearTimeout(this.state.delayTimeout);
    this.state.delayTimeout = setTimeout(() => {
        this.disableEnableActions();
    }, 300);
}

disableEnableActions() {
    let buttons = this.template.querySelectorAll("lightning-button");
    buttons.forEach(bun => {
        if (bun.label === this.state.pageNo) {
            bun.disabled = true;
        } else {
            bun.disabled = false;
        }

        if (bun.label === this.componentLabel.FIRST) {
            bun.disabled = this.state.pageNo === 1 ? true : false;
        } else if (bun.label === this.componentLabel.PREVIOUS) {
            bun.disabled = this.state.pageNo === 1 ? true : false;
        } else if (bun.label === this.componentLabel.NEXT) {
            bun.disabled = this.state.pageNo === this.totalPages ? true : false;
        } else if (bun.label === this.componentLabel.LAST) {
            bun.disabled = this.state.pageNo === this.state.totalPages ? true : false;
        }
    });
}

handleSearchTermChange(event) {
    this.state.searchTerm = event.target.value;
    this.applyPagination();
}

handleRowSelection(event){     
    const selectedRows = event.detail.selectedRows;
    this.state.selectedRows=[...selectedRows];
}

handleRowAction(event) {      
    const selectedObj = event.detail.row;
    this.updateRecordToDisplayOnDelete(selectedObj);
    this.dispatchEvent(new CustomEvent('deleteaction',{ detail: selectedObj}));        
}

updateRecordToDisplayOnDelete(selectedObj){
    let recordsToDisplay = this.createMutableObj(this.state.recordsToDisplay);    
    recordsToDisplay.forEach((objValue, index) => {
        let _obj=objValue;         
        if(_obj.Id==selectedObj.Id){
            recordsToDisplay.splice(index,1);
        }                 
    });
    this.state.recordsToDisplay=[...recordsToDisplay];   
}

handleBtnClick(event){  
        let btLabel=event.currentTarget.label;           
        if (btLabel === 'Checkout') {   
            this.dispatchEvent(new CustomEvent('btnclick',{ detail: this.records}));
        }else if (btLabel === 'Add to Cart') {   
            if(!this.state.selectedRows)
                return this.showNoProductSelectedToast();
            
            this.dispatchEvent(new CustomEvent('btnclick',{ detail: this.state.selectedRows}));                
        }else{                
            this.dispatchEvent(new CustomEvent('btnclick'));
        } 
    }

showNoProductSelectedToast(){
    const toastEvent = new ShowToastEvent({
        title: 'No Product Selected',
        message: 'Please select any product from Product list for Add to Cart.',
        variant: 'error',
    });
    this.dispatchEvent(toastEvent);
    return false;
}

handleSave(event) {
        const updatedFields = event.detail.draftValues; 
        let recordsToDisplay = this.createMutableObj(this.state.recordsToDisplay);

        recordsToDisplay.forEach((objValue, index) => {
            let _obj=objValue;  
            let updatedObj = updatedFields.find(function (element) {  return element.Id==_obj.Id;});

            if(updatedObj==undefined)
            return;
            
            const origObj=this.origRecords.find(function (element) {  return element.Id==_obj.Id;});
            const newUnits=updatedObj.Units__c;
            if(_obj.Units__c<updatedObj.Units__c)
                updatedObj.changeType='Add';
            else{
                updatedObj.Units__c=_obj.Units__c-updatedObj.Units__c;
                updatedObj.changeType='Sub';
            }

            if(newUnits>origObj.Units__c){
                return this.showErrorTast('Units can not be greater than available Product Units.');
            }

            if(newUnits<=0){
              return this.showErrorTast('Units value can not be zero or negative.');
            }

            _obj.Units__c=newUnits;                     
    });  

    this.records=[...recordsToDisplay]; 
    this.dispatchEvent(new CustomEvent('updateaction',{ detail: updatedFields}));
}

showErrorTast(message){
    const toastEvent = new ShowToastEvent({
        title: 'Not Allowed',
        message: message,
        variant: 'error',
    });
    this.dispatchEvent(toastEvent);
    this.state.draftValues=[];
    return false;
}

createMutableObj(immutableObj){
    return immutableObj.map(element => ({...element}));
}


}