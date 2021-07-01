import { LightningElement,wire } from 'lwc';
import { subscribe,MessageContext } from 'lightning/messageService';
import DISPLAY_COUNT_CHANNEL from '@salesforce/messageChannel/Display_Count__c';
export default class Lcd extends LightningElement {
    count=0;
    @wire(MessageContext)
    messageContext;

    subscribeToMessageChannel() {
      this.subscription = subscribe(
        this.messageContext,
        DISPLAY_COUNT_CHANNEL,
        (message) => this.handleMessage(message)
      );
    }

    handleMessage(message) {
        this.count = message.count;
    }
    connectedCallback() {
      this.subscribeToMessageChannel();
    }
}