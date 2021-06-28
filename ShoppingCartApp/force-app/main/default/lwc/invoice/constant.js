import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import ProductCode_FIELD from '@salesforce/schema/Product2.ProductCode';
import UNIT_FIELD from '@salesforce/schema/Product2.Units__c';

const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
    { label: 'Product Code', fieldName: ProductCode_FIELD.fieldApiName, type: 'text' },
    { label: 'Units', fieldName: UNIT_FIELD.fieldApiName, type: 'number' },
    { label: 'Total', fieldName: 'Total', type: 'currency' }
  ];

const getLabel=() =>{
    return {
        CARD_TITLE:'Invoice',
        CARD_ICON_NAME:'utility:form',
        TABLE_BTN_LABEL:'Place Order',
        UTILITY_CHECKOUT_ICON_NAME:'utility:checkout',
        KEY_FIELD_NAME:'id',
        SUCCESS_MSG:'Purchase order generated Successfully.',
        SUCCESS:'Success',
        ALERT:'Alert',
        ERROR_MSG:'There is some issue while processing your cart. Please try again or contact to admin.'
    }
}

export {COLUMNS, getLabel}
