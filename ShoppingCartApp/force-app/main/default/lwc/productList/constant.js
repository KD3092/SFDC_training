import NAME_FIELD from '@salesforce/schema/Product2.Name';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import ProductCode_FIELD from '@salesforce/schema/Product2.ProductCode';
import UNIT_FIELD from '@salesforce/schema/Product2.Units__c';

export const COLUMNS = [
    { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
    { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
    { label: 'Product Code', fieldName: ProductCode_FIELD.fieldApiName, type: 'text' },
    { label: 'Available Units', fieldName: UNIT_FIELD.fieldApiName, type: 'number' }
    ];

export const CART_COLUMNS= [
        { label: 'Name', fieldName: NAME_FIELD.fieldApiName, type: 'text' },
        { label: 'Price', fieldName: PRICE_FIELD.fieldApiName, type: 'currency' },
        { label: 'Product Code', fieldName: ProductCode_FIELD.fieldApiName, type: 'text' },
        { label: 'Units', fieldName: UNIT_FIELD.fieldApiName, type: 'number',editable: true},
        { label: 'Delete', type: 'button-icon',  typeAttributes:  { iconName: 'utility:delete', name: 'delete'  }}
];

export const getLabel=() =>{
    return {
        PRODUCT_CARD_TITLE:'Products',
        PRODUCT_CARD_ICON_NAME:'utility:list',
        PRODUCT_TABLE_BTN_LABEL:'Add to Cart',
        UTILITY_CHECKOUT_ICON_NAME:'utility:checkout',
        PRODUCT_TABLE_TEXT_SEARCH_ON:'Name',
        KEY_FIELD_NAME:'id',
        CART_CARD_TITLE:'Cart',
        CART_TABLE_BTN_LABEL:'Checkout',
        SUB:'Sub',
        ADD:'Add'
    }
}

