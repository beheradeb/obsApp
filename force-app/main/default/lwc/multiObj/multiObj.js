import { LightningElement, track } from 'lwc';
import fetchMdt from '@salesforce/apex/MetaUtility.fetchMdt';
import updateConfig from '@salesforce/apex/MetaUtility.updateConfig';
export default class MultiObj extends LightningElement {
    @track mdtLsts;
    connectedCallback(){
        fetchMdt().then(res=>{
            console.log(res);
            this.mdtLsts=res;
        }).catch(err=>console.log(err));
    }


    addBtn(){
        console.log('addBtn meta');
        const newEvent = new CustomEvent("progess", {
            detail: "5"
          });
        this.dispatchEvent(newEvent);
    }
    nextBtn(){
        console.log('nextBtn meta');
        const newEvent = new CustomEvent("progess", {
            detail: "3"
          });
        this.dispatchEvent(newEvent);
        updateConfig({fld:'Metadata_config__c',val:true});
        console.log('sucessnxt');
    }
    editBtn(event){
        const dataName=event.target.dataset.name;
        console.log('editBtn',dataName);
        const newEvent = new CustomEvent("progess", {
            detail: "5"
          });
        this.dispatchEvent(newEvent);
    }
    backBtn(){
        console.log('backBtn meta');
        const newEvent = new CustomEvent("progess", {
            detail: "1"
          });
        this.dispatchEvent(newEvent);
    }
}
/**/