public with sharing class ProductDomain {
    public static List<Product2> getProductById(Set<Id> idSet){        
        return [SELECT ID, Name, Price__c, ProductCode, Units__c FROM Product2 WHERE ID IN :idSet ORDER BY Name];        
    }
    
    public static List<Product2> getAvailableProducts(){
        return [SELECT ID, Name, Price__c, ProductCode, Units__c FROM Product2 WHERE Units__c>0 AND Price__c >0  ORDER BY Name];
    }
}
