import { LightningElement, wire,track } from 'lwc';
import { publish, subscribe, MessageContext } from 'lightning/messageService';
import CHECKOUT_CHANNEL from '@salesforce/messageChannel/Checkout__c';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import ProductCode_FIELD from '@salesforce/schema/Product2.ProductCode';
import UNIT_FIELD from '@salesforce/schema/Product2.Units__c';
import plcaeOrder from '@salesforce/apex/ShopingCartController.plcaeOrder';
import INVOICE_CHANNEL from '@salesforce/messageChannel/Invoice__c';

const COLUMNS = [
  { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
  { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
  { label: 'Product Code', fieldName: ProductCode_FIELD.fieldApiName, type: 'text' },
  { label: 'Units', fieldName: UNIT_FIELD.fieldApiName, type: 'number' },
  { label: 'Total', fieldName: 'Total', type: 'currency' }
];

export default class Invoice extends LightningElement {
  @wire(MessageContext)
  messageContext;

  @track poLineItems;
  columns = COLUMNS;

  @track error;

  subscribeToMessageChannel() {
      this.subscription = subscribe(
        this.messageContext,
        CHECKOUT_CHANNEL,
        (message) => this.handleMessage(message)
      );
    }

    handleMessage(message) {           
          this.poLineItems=message.lineitems;            
    }

    connectedCallback() {
      this.subscribeToMessageChannel();
    }

    placeOrder=function(){ 
      plcaeOrder ({ productStr: JSON.stringify(this.poLineItems) })
      .then(result => {      
      
        let variant;
        let title;
        let message;

        if(result && result=='Success'){
          title= 'Success';
          message= 'There is some issue while processing your cart. Please try again or contact to admin.';
          variant='error';
          publish(this.messageContext, INVOICE_CHANNEL);
          this.poLineItems=undefined;
        }else{
          title= 'Alert';
          message= 'Purchase order generated Successfully.';
          variant='success';
        }
        
        const toastEvent = new ShowToastEvent({
          title: 'No Product Selected',
          message: 'Please select any product from Product list for Add to Cart.',
          variant: 'error',
      });
      this.dispatchEvent(toastEvent);
      })
      .catch(error => {                         
          this.error=error;
      });
  }
}