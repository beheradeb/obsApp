public with sharing class OrgUtility {

    // get all the Objects
    @AuraEnabled
    public static Map<String,String> getObjectsList(){
       
    Map<String,String> objectMap = new Map<String,String>();
    for(Schema.SObjectType objTyp : Schema.getGlobalDescribe().Values()){
       String name = objTyp.getDescribe().getName();
       String label = objTyp.getDescribe().getLabel();
       if(!name.containsignorecase('history') && !name.containsignorecase('tag') &&
            !name.containsignorecase('share') && !name.containsignorecase('feed') && 
           	!name.containsignorecase('group') && !name.containsignorecase('public') &&
            !objTyp.getDescribe().isCustomSetting() && objTyp.getDescribe().isCreateable() &&
            objTyp.getDescribe().getRecordTypeInfos().size() > 0){      
            objectMap.put(name,label);
       }
    }

	System.debug(objectMap);

    if(objectMap != null && objectMap.size() > 0){
        return objectMap;
    }    
    else{
         return null;
    }

    }

    // get all the fields of a particular Object
    @AuraEnabled
    public static Map<String,String> getAllfields(String objectName){
        List<String> allFields = new List<String>();

        Map<String, Schema.SObjectType> objectMap = Schema.getGlobalDescribe();
        Map<String,String> fieldMap = new Map<String,String>();

        SObjectType objType = objectMap.get(objectName);
        // Map of fields with api name and Api name as value
        Map<String,Schema.SObjectField> objTypeFields = objType.getDescribe().fields.getMap();
            if(!objTypeFields.isEmpty()){
              for (String fieldName: objTypeFields.keySet()) {
                  //getting labels of the fields
                  String fieldLabel = objTypeFields.get(fieldName).getDescribe().getLabel();
                  String fieldNames = objTypeFields.get(fieldName).getDescribe().getName();
                  allFields.add(fieldLabel);
                  fieldMap.put(fieldLabel,fieldNames);
                }
            }
            System.debug(fieldMap);
            return fieldMap;
        }
        // update custom setting
    @AuraEnabled
    public static void updateCustomSetting(String secKey){
        Key_Setting__c	 cst = [SELECT id,Key__c FROM Key_Setting__c WITH SECURITY_ENFORCED];
        cst.Key__c = secKey;
        update cst;
       System.debug('cst=>'+cst);
    }
}