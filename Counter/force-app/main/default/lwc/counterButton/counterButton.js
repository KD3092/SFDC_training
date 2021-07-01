import { LightningElement,api } from 'lwc';

export default class CounterButton extends LightningElement {

    @api btnValue;

    btnClickHandler(event){
        this.dispatchEvent(new CustomEvent('btnclick'));
    }

}