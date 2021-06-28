import ID_FIELD from '@salesforce/schema/PurchaseOrder__c.Id';
import STATUS_FIELD from '@salesforce/schema/PurchaseOrder__c.Status__c';
import ORDER_TOTAL_FIELD from '@salesforce/schema/PurchaseOrder__c.Order_Total__c';

export const COLUMNS = [
    { label: 'PO Id', fieldName: ID_FIELD.fieldApiName, type: 'text' },
    { label: 'Status', fieldName: STATUS_FIELD.fieldApiName, type: 'text' },
    { label: 'Order Total', fieldName: ORDER_TOTAL_FIELD.fieldApiName, type: 'text' }
];

export const getLabel=() =>{
    return {
        CARD_TITLE:'My Orders',
        CARD_ICON_NAME:'utility:list',
        TABLE_BTN_LABEL:'Add New Purchase Order',
        TABLE_BTN_ICON_NAME:'utility:add',
        KEY_FIELD_NAME:'id'
    }
}

