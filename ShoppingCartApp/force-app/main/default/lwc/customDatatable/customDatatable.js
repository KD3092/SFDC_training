import { LightningElement, api,track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const RECORD_PER_PAGE=10;
export default class CustomDatatable extends LightningElement {

@track recordsToDisplay;

@api 
get records(){
    return this._records;
}
set records(value){
    this._records=value;
        this._recordsToDisplay=value;
        this.applyPagination();
}
@api columns;
@api keyfield;
@api btnLabel;
@api btnIconName;
@api textSearchOn;
@api origRecords;
@track error;

@track draftValues = [];

searchTerm = '';
totalRecords;
pageNo=1;
TotalPages;
startRecored;
endRecord;
end=false;
selectedRows;

get hasResults() {
    return (this.records && this.records.length > 0);
} 

handleClick(event) {
    let label = event.target.label;
    if (label === "First") {
        this.handleFirst();
    } else if (label === "Previous") {
        this.handlePrevious();
    } else if (label === "Next") {
        this.handleNext();
    } else if (label === "Last") {
        this.handleLast();
    }
}

handleNext() {
    this.pageNo += 1;
    this.applyPagination();
}

handlePrevious() {
    this.pageNo -= 1;
    this.applyPagination();
}

handleFirst() {
    this.pageNo = 1;
    this.applyPagination();
}

handleLast() {
    this.pageNo = this.totalPages;
    this.applyPagination();
}


applyPagination() { 
    let allData = this.records;
    let searchField= this.textSearchOn;   
    
    if (''!=this.searchTerm) {  
        allData = allData.filter(record => record[searchField].includes(this.searchTerm));
    }

    this.totalRecords = allData.length;
    this.totalPages = Math.ceil(this.totalRecords / RECORD_PER_PAGE);
    
    let begin = (this.pageNo - 1) * parseInt(RECORD_PER_PAGE);
    let end = parseInt(begin) + parseInt(RECORD_PER_PAGE);
    this.recordsToDisplay = allData.slice(begin, end);
    
    this.startRecord = begin + parseInt(1);
    this.endRecord = end > this.totalRecords ? this.totalRecords : end;
    this.end = end > this.totalRecords ? true : false;
    
    window.clearTimeout(this.delayTimeout);
    this.delayTimeout = setTimeout(() => {
        this.disableEnableActions();
    }, 300);
    this.isLoading = false;
}

disableEnableActions() {
    let buttons = this.template.querySelectorAll("lightning-button");
    buttons.forEach(bun => {
        if (bun.label === this.pageNo) {
            bun.disabled = true;
        } else {
            bun.disabled = false;
        }

        if (bun.label === "First") {
            bun.disabled = this.pageNo === 1 ? true : false;
        } else if (bun.label === "Previous") {
            bun.disabled = this.pageNo === 1 ? true : false;
        } else if (bun.label === "Next") {
            bun.disabled = this.pageNo === this.totalPages ? true : false;
        } else if (bun.label === "Last") {
            bun.disabled = this.pageNo === this.totalPages ? true : false;
        }
    });
}

handleSearchTermChange(event) {
    let searchTerm = event.target.value;
    this.searchTerm = searchTerm;
    this.applyPagination();
}

handleRowSelection(event){     
    const selectedRows = event.detail.selectedRows;
    this.selectedRows=[...selectedRows];
}

handleRowAction(event) {      
    const selectedObj = event.detail.row;
    let recordsToDisplay = this.recordsToDisplay.map(element => ({...element}));
    recordsToDisplay.forEach((objValue, index) => {
        let _obj=objValue;         
        if(_obj.Id==selectedObj.Id){
            recordsToDisplay.splice(index,1);
        }                 
    });
    
    this.recordsToDisplay=[...recordsToDisplay];

    
    this.dispatchEvent(new CustomEvent('deleteaction',{ detail: selectedObj}));        
}

handleBtnClick(event) { 
  
        let btLabel=event.currentTarget.label;           
        if (btLabel === 'Checkout') {   
            this.dispatchEvent(new CustomEvent('btnclick',{ detail: this.records}));
        }else if (btLabel === 'Add to Cart') {   
            if(!this.selectedRows){
                const toastEvent = new ShowToastEvent({
                    title: 'No Product Selected',
                    message: 'Please select any product from Product list for Add to Cart.',
                    variant: 'error',
                });
                this.dispatchEvent(toastEvent);
                return false;
            }
            this.dispatchEvent(new CustomEvent('btnclick',{ detail: this.selectedRows}));                
        }else{                
            this.dispatchEvent(new CustomEvent('btnclick'));
        } 
    }

handleSave(event) {
        const updatedFields = event.detail.draftValues; 

        let recordsToDisplay = this.recordsToDisplay.map(element => ({...element}));
    
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
                const toastEvent = new ShowToastEvent({
                    title: 'Not Allowed',
                    message: 'Units can not be greater than available Product Units.',
                    variant: 'error',
                });
                
                this.dispatchEvent(toastEvent);
                this.draftValues=[];
                return false;
            }

            if(newUnits<=0){
                const toastEvent = new ShowToastEvent({
                    title: 'Not Allowed',
                    message: 'Units value can not be zero or negative.',
                    variant: 'error',
                });
                
                this.dispatchEvent(toastEvent);
                this.draftValues=[];
                return false; 
            }

            _obj.Units__c=newUnits;                     
    });  

    this.records=[...recordsToDisplay]; 
    this.dispatchEvent(new CustomEvent('updateaction',{ detail: updatedFields}));
}

}