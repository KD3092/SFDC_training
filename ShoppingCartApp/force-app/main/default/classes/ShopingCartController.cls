public with sharing class ShopingCartController {
    
    @AuraEnabled
    public static String plcaeOrder(String productStr) { 
        return ShopingCartService.executeOrder(productStr);
    }
    
    @AuraEnabled
    public static List<PurchaseOrder__c> getMyOrders() {
        return PurchaseOrderDomain.getAllPurchaseOrder();
    }
    
    @AuraEnabled(Cacheable=true)
    public static List<Product2> getAvailableProducts(){
        return ProductDomain.getAvailableProducts();
    }
}