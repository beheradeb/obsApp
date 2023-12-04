public with sharing class MetaUtility {
    //it is for fetching the metadata records for multiple object
    @AuraEnabled
    public static List<MultiObj_Setting__mdt> fetchMdt(){
        List<MultiObj_Setting__mdt> mdt=[SELECT id,ObjName__c,TextFld__c,FldsToFetch__c FROM MultiObj_Setting__mdt WITH SECURITY_ENFORCED];
        System.debug('List: '+mdt);
        return mdt;
    }
    //it is for fetching the metadata records for config
    @AuraEnabled
    public static List<Config_Setting__mdt> fetchConfig(){
        List<Config_Setting__mdt> mdt=[SELECT ChatGPT_config__c,Data_Process_config__c,	Metadata_config__c,Object_setup_config__c FROM Config_Setting__mdt WITH SECURITY_ENFORCED];
        System.debug('List: '+mdt);
        return mdt;
    }
    //it is for creating the new field on a given object
    @AuraEnabled
    public static String generateTextField(String objectAPIName, String fieldAPIName, String fieldLabel){
        System.debug(objectAPIName+'='+fieldAPIName+'='+fieldLabel);
        if(!fieldAPIName.contains('__c')){
            fieldAPIName +='__c';
           }
        String metadata = '{"Metadata" : {"type" : "Text","label" : "'+fieldLabel+'","length" : 255,"required" : false}, "FullName" : "'+objectAPIName+'.'+fieldAPIName+'"}';
        String responseBody = createField(metadata);
        System.debug('responseBody: '+responseBody);
        return responseBody;
    }
    //this method is for api call, which is called by generateTextField()
    public static String createField(String metadata) {
        string autho = 'Bearer {!$User_Session.OAuthToken}';
        HttpRequest request = new HttpRequest();
        request.setEndpoint('callout:User_Session/services/data/v46.0/tooling/sobjects/CustomField/');
        request.setHeader('Authorization',autho);
        request.setHeader('Content-Type', 'application/json');
        request.setMethod('POST');
        
        request.setBody(metadata);
        
        Http http = new Http();
        HTTPResponse res = http.send(request);
        System.debug(res);
        System.debug(res.getBody());
        System.debug('response1 ==>>'+res.getStatus());
        System.debug('response1 ==>>'+res.getStatusCode());
        
        return String.valueOf(res.getStatusCode());
    }
    //it is for inserting the metadata records
    @AuraEnabled
    public static void insertOrUpdateMdt(List<String> lstStr){
        System.debug('lstStr: '+lstStr);
        String objStr=lstStr[0];
        if(objStr.contains('__c')){
            objStr=objStr.remove('__c');
        }
        System.debug('NEW :'+objStr);
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();  
        Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();
        customMetadata.fullName = 'MultiObj_Setting.'+objStr;
        customMetadata.label = objStr;
    
        Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();
        customField1.field = 'ObjName__c';
        customField1.value = lstStr[0];
        customMetadata.values.add(customField1);
        mdContainer.addMetadata(customMetadata);
        Metadata.CustomMetadataValue customField2 = new Metadata.CustomMetadataValue();
        customField2.field = 'TextFld__c';
        customField2.value = lstStr[1];
        customMetadata.values.add(customField2);
        mdContainer.addMetadata(customMetadata);
    
        Metadata.CustomMetadataValue customField3 = new Metadata.CustomMetadataValue();
        customField3.field = 'FldsToFetch__c';
        customField3.value = lstStr[2];
        customMetadata.values.add(customField3);
        mdContainer.addMetadata(customMetadata);
        Id deployRequestId = Metadata.Operations.enqueueDeployment(mdContainer, null);    
    }
    //update the metadata for configuration
    @AuraEnabled
    public static void updateConfig(String fld,Boolean val){
        System.debug('strJson: '+fld+val);
        Metadata.DeployContainer mdContainer = new Metadata.DeployContainer();  
        Metadata.CustomMetadata customMetadata =  new Metadata.CustomMetadata();
        customMetadata.fullName = 'Config_Setting.'+'ConfigLabel';
        customMetadata.label = 'ConfigLabel';
    
        // Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();
        // customField1.field = 'ChatGPT_config__c';
        // customField1.value = false;
        // customMetadata.values.add(customField1);
        // mdContainer.addMetadata(customMetadata);

        // Metadata.CustomMetadataValue customField2 = new Metadata.CustomMetadataValue();
        // customField2.field = 'Metadata_config__c';
        // customField2.value = false;
        // customMetadata.values.add(customField2);
        // mdContainer.addMetadata(customMetadata);
    
        // Metadata.CustomMetadataValue customField3 = new Metadata.CustomMetadataValue();
        // customField3.field = 'Data_Process_config__c';
        // customField3.value = false;
        // customMetadata.values.add(customField3);
        // mdContainer.addMetadata(customMetadata);
        // String fld='Object_setup_config__c';
        // Boolean val=false;
        Metadata.CustomMetadataValue customField1 = new Metadata.CustomMetadataValue();
        customField1.field = fld;
        customField1.value = val;
        customMetadata.values.add(customField1);
        mdContainer.addMetadata(customMetadata);

        Id deployRequestId = Metadata.Operations.enqueueDeployment(mdContainer, null);
    }
    //fetching the list of sobject which has unprocessed records
    @AuraEnabled
    public static List<Object> unprocessRecords(){
        List<MultiObj_Setting__mdt> mdts=[SELECT id,ObjName__c FROM MultiObj_Setting__mdt WITH SECURITY_ENFORCED];
        List<Object> lstOfMap = new List<Object>();
        for(MultiObj_Setting__mdt mdt:mdts){
            String obj=mdt.ObjName__c;
            String queryString = 'SELECT Id FROM '+obj;
            List<SObject> sObjList = (List<SObject>) Database.query(queryString);
            Map<String, String> newMap = new Map<String, String>();
            newMap.put('objName', obj);
            newMap.put('noOfRec', sObjList.size()+'');
            lstOfMap.add(newMap);
        }
        return lstOfMap;
    }
}

/*
Integer count=0;
    for(sObject sObj : sObjList){
      String jsonInput = JSON.serialize(sObj);
      Map<String, Object> objMap = (Map<String, Object>)JSON.deserializeUntyped(jsonInput);
      Boolean b=(Boolean)objMap.get(enablefld);
      if(b==false){
          count++;
      }
    }
    System.debug('count->'+count);//22
*/
/*
    public static String createField(String metadata) {
        HttpRequest request = new HttpRequest();
        request.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionID());
        request.setHeader('Content-Type', 'application/json');
        request.setEndpoint(URL.getSalesforceBaseUrl().toExternalForm()+'/services/data/v46.0/tooling/sobjects/CustomField');
        request.setMethod('POST');
        request.setBody(metadata);
        
        Http http = new Http();
        HTTPResponse res = http.send(request);
        return String.valueOf(res.getStatusCode());
    }
*/