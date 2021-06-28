import { LightningElement, wire, track } from 'lwc';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import CHECKOUT_CHANNEL from '@salesforce/messageChannel/Checkout__c';

import placeOrder from '@salesforce/apex/ShopingCartController.placeOrder';
import INVOICE_CHANNEL from '@salesforce/messageChannel/Invoice__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { COLUMNS, getLabel } from './constant';

export default class Invoice extends LightningElement {
  @wire(MessageContext)
  messageContext;
  @track state={poLineItems:null,error:null};
  columns = COLUMNS;
  componentLabel=getLabel();

  subscribeToMessageChannel() {
    this.subscription = subscribe(this.messageContext, CHECKOUT_CHANNEL,(message) => this.handleMessage(message));
  }

  handleMessage(message) {           
    this.state.poLineItems=message.lineitems;            
  }

  connectedCallback() {
    this.subscribeToMessageChannel();
  }

  showPurchaseSuccessToast(){
    const toastEvent = new ShowToastEvent({
      title: this.componentLabel.SUCCESS,
      message: this.componentLabel.SUCCESS_MSG,
      variant: this.componentLabel.SUCCESS,
    });

    this.dispatchEvent(toastEvent);
  }

  placeOrder=function(){ 
    placeOrder ({ productStr: JSON.stringify(this.state.poLineItems) })
    .then(result => {
        let self=this;
        setTimeout(function() {
            publish(self.messageContext, INVOICE_CHANNEL);
          }, 3000);  
        
        this.state.poLineItems=undefined;
        this.showPurchaseSuccessToast();
        
      })
      .catch(error => {
          this.state.error=error;
          this.showPurchaseErrorToast();
      });
  }

  showPurchaseErrorToast(){
    const toastEvent = new ShowToastEvent({
      title: this.componentLabel.ALERT,
      message: this.componentLabel.ERROR_MSG,
      variant:  this.componentLabel.SUCCESS,
    });
    this.dispatchEvent(toastEvent); 
  }
}