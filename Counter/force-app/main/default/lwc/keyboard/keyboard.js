import { LightningElement,wire } from 'lwc';
import { publish,MessageContext } from 'lightning/messageService'; 
import DISPLAY_COUNT_CHANNEL from '@salesforce/messageChannel/Display_Count__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const INITIAL_VALUE=0;
export default class Keyboard extends LightningElement {
    @wire(MessageContext)
    messageContext;

   count=INITIAL_VALUE;

    increment(){
        console.log(' increment called ');
        this.count++;
        this.displayCount();
    }

    decrement(){
        console.log(' decrement called ');
        if(this.count>0)
            this.count--;
        else{
            const toastEvent = new ShowToastEvent({
                title: 'Alert',
                message: 'Ooops!! Can not decrement the count more.',
                variant: 'error',
            });
            this.dispatchEvent(toastEvent);
        }

        this.displayCount();  
    }

    displayCount(){
        const paramObj = { 
            count:this.count
          };
        publish(this.messageContext, DISPLAY_COUNT_CHANNEL, paramObj);
    }

}