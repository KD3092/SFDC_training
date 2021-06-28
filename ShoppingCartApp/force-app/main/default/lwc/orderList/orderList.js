import { LightningElement,track,wire } from 'lwc';
import getMyOrders from '@salesforce/apex/ShopingCartController.getMyOrders';

import { subscribe, MessageContext } from 'lightning/messageService';
import INVOICE_CHANNEL from '@salesforce/messageChannel/Invoice__c';
import { COLUMNS, getLabel } from './constant';


export default class OrderList extends LightningElement {
    @wire(MessageContext)
    messageContext;
    componentLabel=getLabel();
    columns = COLUMNS;
    @track state={orders:null,error:null,showProducts:false};

    subscribeToMessageChannel() {
        this.subscription = subscribe(this.messageContext,INVOICE_CHANNEL,(message) => this.handleSubscribeMessage(message));
    }
  
    handleSubscribeMessage(message) {   
        this.state.showProducts=false;
        let self=this;
        setTimeout(function() {   self.loadOrders(); }, 3000);     
      }

    loadOrders(){
		getMyOrders()
			.then(result => {
                this.state.orders = result;
            })
			.catch(error => {                
				this.state.error = error;
			});
	}

    connectedCallback() {
	    this.loadOrders();
        this.subscribeToMessageChannel();
	}    

    showProductList(){
        this.state.showProducts=! this.state.showProducts;
    }

}