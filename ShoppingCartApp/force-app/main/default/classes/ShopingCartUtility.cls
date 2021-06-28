public with sharing class ShopingCartUtility {
    public Static  Map<Id,Integer> getIdUnitMap(String productListJsonStr){         
        Map<Id,Integer> idUnitMap=new Map<Id,Integer>(); 
        
        if(String.isBlank(productListJsonStr))
            return idUnitMap;
        
        List<Object> lstObject = (List<Object>)JSON.deserializeUntyped(productListJsonStr);      
        for(Object jsonObject :lstObject) {           
            Map<String,Object> mpParsed = (Map<String,Object>)jsonObject;
            Id id=(Id)mpParsed.get('Id');
            Integer unit=Integer.valueOf(mpParsed.get('Units__c'));            
            idUnitMap.put(id,unit);
        }
        return idUnitMap;
    }
}
