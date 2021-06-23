import { LightningElement,track,wire } from 'lwc';
import userId from '@salesforce/user/Id';
import getMyOrders from '@salesforce/apex/ShopingCartController.getMyOrders';
import ID_FIELD from '@salesforce/schema/PurchaseOrder__c.Id';
import STATUS_FIELD from '@salesforce/schema/PurchaseOrder__c.Status__c';
import ORDER_TOTAL_FIELD from '@salesforce/schema/PurchaseOrder__c.Order_Total__c';
import { subscribe, MessageContext } from 'lightning/messageService';
import INVOICE_CHANNEL from '@salesforce/messageChannel/Invoice__c';
const COLUMNS = [
    { label: 'PO Id', fieldName: ID_FIELD.fieldApiName, type: 'text' },
    { label: 'Status', fieldName: STATUS_FIELD.fieldApiName, type: 'text' },
    { label: 'Order Total', fieldName: ORDER_TOTAL_FIELD.fieldApiName, type: 'text' }
];
export default class OrderList extends LightningElement {
    @wire(MessageContext)
    messageContext;

    columns = COLUMNS;
    orders;
    @track isDataAvailable=false;
    error;
    defaultSortDirection = 'asc';
    sortDirection = 'asc';
    sortedBy;
    @track showProducts=false;

    subscribeToMessageChannel() {
        this.subscription = subscribe(
          this.messageContext,
          INVOICE_CHANNEL,
          (message) => this.handleMessage(message)
        );
      }
  
      handleMessage(message) {   
        this.showProducts=false;
        let self=this;
        setTimeout(function() {
            self.loadOrders();
        }, 3000);     
      }

    loadOrders=function() {
		getMyOrders()
			.then(result => {
				this.orders = result;
                this.isDataAvailable=true;
            })
			.catch(error => {                
				this.error = error;
			});
	}

    connectedCallback() {
	    this.loadOrders();
        this.subscribeToMessageChannel();
	}    

    onHandleSort(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.orders];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.orders = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }

    showProductList=function(){
        this.showProducts=!this.showProducts;
    }

}