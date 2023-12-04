import { LightningElement } from 'lwc';
import fetchConfig from '@salesforce/apex/MetaUtility.fetchConfig';
import updateConfig from '@salesforce/apex/MetaUtility.updateConfig';

export default class ConfigSet extends LightningElement {
    chatCheck=false;
    objCheck=false;
    metaCheck=false;
    dataCheck=false;
    connectedCallback(){
        fetchConfig().then(res=>{
            console.log('config: ',res);
            this.chatCheck=res[0].ChatGPT_config__c;
            this.objCheck=res[0].Object_setup_config__c;
            this.metaCheck=res[0].Metadata_config__c;
            this.dataCheck=res[0].Data_Process_config__c;
        });
    }
    handleChange(event) {
        const dataId=event.target.dataset.id;
        const boolVal=event.target.checked;
        console.log(dataId,boolVal);//Data_Process_config__c,true
        updateConfig({fld:dataId,val:boolVal});
        console.log('sucess');
        window.location.reload();
    }
    backBtn(){
        console.log('backBtn config');
        const newEvent = new CustomEvent("progess", {
            detail: "3"
          });
        this.dispatchEvent(newEvent);
    }
}