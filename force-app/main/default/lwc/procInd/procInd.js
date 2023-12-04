import { LightningElement ,api} from 'lwc';
import fetchConfig from '@salesforce/apex/MetaUtility.fetchConfig';

export default class ProcInd extends LightningElement {
    @api currstp;
    connectedCallback(){
        // this.currstp="1";
        fetchConfig().then(res=>{
            console.log('config: ',res);
            this.chatCheck=res[0].ChatGPT_config__c;
            this.metaCheck=res[0].Metadata_config__c;
            this.dataCheck=res[0].Data_Process_config__c;
            if(res[0].ChatGPT_config__c&&res[0].Metadata_config__c&&res[0].Data_Process_config__c)this.currstp="4";
            else if(res[0].ChatGPT_config__c&&res[0].Metadata_config__c)this.currstp="3";
            else if(res[0].ChatGPT_config__c)this.currstp="2";
            else this.currstp="1";
        }).then(()=>{
            console.log('curr step: ', this.currstp);
        const newEvent = new CustomEvent("progess", {
            detail: this.currstp
          });
        this.dispatchEvent(newEvent);
        });
        
    }
    handleChange(event){
        const dataId=event.target.dataset.id;
        this.currstp=dataId;
        const newEvent = new CustomEvent("progess", {
            detail: dataId
          });
        this.dispatchEvent(newEvent);
    }
}