public with sharing class PurchaseOrderDomain {
    public static List<PurchaseOrder__c> getAllPurchaseOrder() {
        return [ SELECT Id, Status__c, 	Order_Total__c FROM PurchaseOrder__c ORDER BY Id ];
    }
}
