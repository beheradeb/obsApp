public with sharing class ChatGPTSearch {
    //This method is for status checking
    @AuraEnabled
    public static Integer checkStatus(String secretKey){
        System.debug('secretKey>. '+secretKey);
        String input='Are Robots friendly?';
        HttpRequest request=new HttpRequest();
        request.setEndpoint('https://api.openai.com/v1/moderations');
        request.setMethod('POST');
        request.setHeader('Content-Type','application/json');
        request.setHeader('Authorization', 'Bearer '+secretKey);//length:51
        request.setBody('{"input": "'+input+'"}');
        HttpResponse response=new Http().send(request);
        Integer statusCode=response.getStatusCode();
        System.debug('Body=>'+response.getBody());
        System.debug('StatusCode=>'+statusCode);
        return statusCode;
    }
    //this method is for searching tab
    // @AuraEnabled
    // public static List<Object> chatSearch(String inputData) {
    //    try{ 
    //     //getting data from custom setting
    //     List<OLCalloutData__c> cts=[Select 	NLPDataWhat__c	,ObjectFrom__c From OLCalloutData__c];
    //     String obj=cts[0].ObjectFrom__c;
    //     //String flds=cts[0].NLPDataWhat__c;
    //     String flds='Company__c,Domain__c,Location__c';
    //     //chatGPT api callout code
    //     // String companyDetail='get company candidate working on salesforce technology having experience in health cloud and located in India with 6 years of experience';//from input text
    //     String companyDetail=inputData;
    //     System.debug('companyDetail: '+companyDetail);
    //     String newstr=flds;
    //     System.debug('newstr: '+newstr);
    //     String secretKey='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';
    //     HttpRequest request=new HttpRequest();
    //     request.setEndpoint('https://api.openai.com/v1/completions');
    //     request.setMethod('POST');
    //     request.setHeader('Content-Type','application/json');
    //     request.setHeader('Authorization', 'Bearer '+secretKey);
        
    //     request.setBody('{"model": "text-davinci-003","prompt": "'+companyDetail+' action:extract { intent:, entities: {'+newstr+', Others:{key:value}} json only", "max_tokens": 300,"temperature": 0, "n": 1 }');        
        
    //     HttpResponse response=new Http().send(request);
        
    //     System.debug('STATUS CODE: '+response.getStatusCode());
    //     System.debug('RESPONSE BODY GETTING FROM CHATGPT:\n'+response.getBody());

    //     //getting value list for where condition
    //     String jsonResponse =response.getBody();
    //     Map<String, Object> jsonMap = (Map<String, Object>) JSON.deserializeUntyped(jsonResponse);
    //     String jsonString=((Map<String, Object>)((List<Object>)jsonMap.get('choices'))[0]).get('text').toString();
    //     Map<String, Object> jsonMapText =(Map<String, Object>)JSON.deserializeUntyped(jsonString);
    //     Map<String, Object> jsonMapEntity =(Map<String, Object>)jsonMapText.get('entities');
    //     List<String> keyList=new List<String>(jsonMapEntity.keySet());
    //     List<String> valList=new List<String>();
    //     for(Integer i=0;i<keyList.size();i++){
    //         String value=String.valueOf(jsonMapEntity.get(keyList[i]));
    //         System.debug(value);
    //         if(value!='')
    //         valList.add(value);
    //     }
    //     System.debug(valList);//values from chatGPT of entities object
    //     List<String> custFldC=flds.split(',');//(Company__c, Domain__c, Location__c) 
    
    //     //creating where condition
    //     List<String> allList=valList;
    //     String whereCon='';
    //     for(Integer i=0;i<custFldC.size();i++){
    //        if(i==custFldC.size()-1){
    //             whereCon+=custFldC[i]+' In : allList';
    //        }else{
    //             whereCon+=custFldC[i]+' In : allList OR ';
    //        }           
    //     }
    //     System.debug('whereCon=>'+whereCon);//Company__c In : allList OR Domain__c In : allList OR Location__c In : allList
        
    //     //creating list of api field for search
    //     List<String> lstApi=new List<String>{'Id','Name'};//default fields
    //     lstApi.addAll(custFldC);
    //     System.debug('lstApi=>'+lstApi);
    //     String strApi=String.join(lstApi, ',');
    //     System.debug('strApi=>'+strApi);
    //     String query='SELECT '+strApi+' FROM '+obj+' WHERE '+whereCon;
    //     List<SObject> lstSobj=Database.query(query);
    //     System.debug('lstSobj: '+lstSobj);//working

    //     //creating list of lable for data table
    //     List<String> tempLabel=new List<String>{'Company__c', 'Domain__c', 'Location__c'};
    //     List<String> lstLabel=new List<String>{'Id','Name'};//defaut fields
    //     for(String leb:tempLabel){
    //         String label=(String)Schema.getGlobalDescribe().get(obj).getDescribe().fields.getMap().get(leb).getDescribe().getLabel();
    //         lstLabel.add(label);
    //     }
    //     System.debug('lstLabel=>'+lstLabel);
    //     //creading list of list for data table data
    //     List<List<String>> lstLst = new List<List<String>>();
    //     for(sObject sO:lstSobj){
    //         String serial = JSON.serialize(sO);
    //         Map<String, Object> objMap = (Map<String, Object>)JSON.deserializeUntyped(serial);
    //         List<String> lststr = new List<String>();
    //         for(String fieldName : lstApi){
    //           lststr.add((String)objMap.get(fieldName));  
    //             system.debug('Value: '+(String)objMap.get(fieldName));
    //         }
    //         lstLst.add(lststr);
    //     }
    //     System.debug('lstLst->'+lstLst);
    //     //creating total list for data table
    //     List<Object> lstObj=new List<Object>();
    //     lstObj.add(lstLabel);
    //     lstObj.add(lstLst);
    //     System.debug('=>'+lstObj);
    //     return lstObj;
    // }catch(Exception e){
    //     System.debug('JHAKAS ERROR: '+e.getMessage());
    //     return null;
    // }
    // }
}