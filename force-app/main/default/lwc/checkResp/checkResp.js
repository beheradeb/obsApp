import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import checkStatus from '@salesforce/apex/ChatGPTSearch.checkStatus';
import updateCustomSetting from '@salesforce/apex/OrgUtility.updateCustomSetting';
import updateConfig from '@salesforce/apex/MetaUtility.updateConfig';

export default class CheckResp extends LightningElement {
    skey;
    nextBtnDisable=true;
    testResBtnDisable=false;

    inpTxt(event){
        console.log(event.target.value);
        this.skey=event.target.value;
    }
    testRespBtn(){
        console.log('testRespBtn',this.skey);
        const ele=this.template.querySelector('.input');
        if(this.skey===''||this.skey===undefined||this.skey===' '){
            console.log('empty');
            this.showToast('ENTER CORRECT SECRET KEY FOR TEST!','','warning');
            return;
        }
        checkStatus({secretKey:this.skey}).then(sCode=>{
            console.log('sCode=>',typeof sCode,sCode);
            if(sCode===200){
                ele.value='';
                this.nextBtnDisable=false;
                this.testResBtnDisable=true;
                updateCustomSetting({secKey:this.skey});
                updateConfig({fld:'ChatGPT_config__c',val:true});
                console.log('sucess');
            }
        });        
    }
    nextBtn(){
        console.log('nextBtn',this.skey);
        const newEvent = new CustomEvent("progess", {
            detail: "2"
          });
        this.dispatchEvent(newEvent);
    }
    showToast(title,message,variant) {
        const event = new ShowToastEvent({
            title: title,
            message:message,
            variant:variant
        });
        this.dispatchEvent(event);
    }
}