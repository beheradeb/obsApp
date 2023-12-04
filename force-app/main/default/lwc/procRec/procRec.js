import { LightningElement } from 'lwc';
import unprocessRecords from '@salesforce/apex/MetaUtility.unprocessRecords';
// import executingBatch from '@salesforce/apex/IntegrateChatGPT.executingBatch';
import updateConfig from '@salesforce/apex/MetaUtility.updateConfig';
export default class ProcRec extends LightningElement {
    showUnprocessRecords;
    disableProcessRecord=false;
    disableCheckAgain=false;
    disableCompBtn=true;
    disableCheckAllBtn=false;
    spinner=false;
    recLsts=[];
    connectedCallback(){
      unprocessRecords().then(res=>{
         this.recLsts=res;
         console.log(res,'cc');
      })
    }
    processRecords(event) {
      const nam=event.target.dataset.nam;
      const num=event.target.dataset.num;
       console.log('processRecords button clicked',nam,num);
       console.log('START BATCH EXECUTION');
    //    executingBatch(nam);
       console.log('FINISH BATCH EXECUTION');
       this.viewPage=false;
       this.spinner=true;
       setTimeout(()=>{
        this.viewPage=true;
        this.spinner=false;
        this.disableProcessRecord=true;
        this.disableCheckAgain=false;
       },10000)
    }
    
    checkAgain(event){
      const nam=event.target.dataset.nam;
      const num=event.target.dataset.num;
       console.log('check Again button clicked',nam,num);
       
      //getting the unprocess records 
    //   unprocessRecords().then(res=>{
    //     console.log('result: ',res);
    //     if(res===0){
    //         this.disableProcessRecord=true;
    //         this.disableCheckAgain=true;
    //         this.spinner=true;
    //     }else{
    //         this.disableProcessRecord=false;
    //         this.disableCheckAgain=true;
    //     }
    //    }).catch(err=>console.error(`ERROR FROM UNPROCESS RECORD AND IT IS ${err}`));
    }
    CheckAllBtn(){
      console.log('CheckAllBtn clicked');
      const arrLst=[{objName:'D',noOfRec:0}];
      const zVal=arrLst.map(obj=>obj.noOfRec);
      if(zVal.every(e=>e===0)){
        this.disableCompBtn=false;
        this.disableCheckAllBtn=true;
      }
      console.log('zVal=>',JSON.stringify(zVal));
    }
    compBtn(){
      const newEvent = new CustomEvent("progess", {
         detail: "4"
       });
       this.dispatchEvent(newEvent);
       updateConfig({fld:'Data_Process_config__c',val:true});
       window.location.reload();
    }
    backBtn(){
      console.log('backBtn meta');
      const newEvent = new CustomEvent("progess", {
          detail: "2"
        });
      this.dispatchEvent(newEvent);
  }
}