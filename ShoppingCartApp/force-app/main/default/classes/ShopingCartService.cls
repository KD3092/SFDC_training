public with sharing class ShopingCartService {
    
    public static Boolean executeOrder(String productListJsonStr){       
        
        if(String.isBlank(productListJsonStr))
            throw new ShopingCartServiceException('JSON String is Blank');
        
        try{
            Map<Id,Integer> idUnitMap=ShopingCartUtility.getIdUnitMap(productListJsonStr);
            
            if(idUnitMap.isEmpty())
                throw new ShopingCartServiceException('Value Map is Blank.');
            
            
            List<Product2> productList=ProductDomain.getProductById(idUnitMap.keySet());   
            
            fflib_SObjectUnitOfWork uowObj = new fflib_SObjectUnitOfWork(
                new List<SObjectType> { 
                    Product2.SObjectType,
                        PurchaseOrder__c.SObjectType,
                        PurchaseOrderLineItems__c.SObjectType});
            
            PurchaseOrder__c purchaseOrderObj= new PurchaseOrder__c(Status__c='Processing');        
            uowObj.registerNew((SObject)purchaseOrderObj);
            
            for(Product2 productObj:productList){
                if(idUnitMap.containsKey(productObj.Id)){
                    productObj.Units__c=productObj.Units__c-idUnitMap.get(productObj.Id);
                } 
                uowObj.registerDirty(productObj);
                PurchaseOrderLineItems__c purchaseOrderLineItemsObj= new PurchaseOrderLineItems__c(Name=productObj.Name,Product__c=productObj.Id);
                
                uowObj.registerNew((SObject)purchaseOrderLineItemsObj,PurchaseOrderLineItems__c.PurchaseOrder__c,(SObject)purchaseOrderObj);
            }
            uowObj.commitWork();
        }catch(Exception ex){
            throw new ShopingCartServiceException(ex.getMessage());
        }
        return true;
    }
    
    public class ShopingCartServiceException extends Exception{}
    
}