import { LightningElement } from 'lwc';
// import chatGPTSearch from '@salesforce/apex/ChatGPTSearch.chatSearch';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
export default class ChatGPTSearch extends LightningElement {
    columns=[];
    data = [];
    dataFromInput;
    tableCreater(lstOfLst) {
        console.log(lstOfLst);
        const actualData=lstOfLst;
        const colValList=actualData[0];
        const colKeyList=[];
        colValList.forEach(key=>{
            colKeyList.push(key.toLowerCase());
        })
        const columns=[];
        colValList.forEach(col=>{
        columns.push({
            label:col[0].toUpperCase()+col.slice(1),
            fieldName:col[0].toLowerCase()+col.slice(1)
        });
        })
        const data=[];
        const dataValList=actualData[1];
        for(let j=0;j<dataValList.length;j++){
            const dataVal=dataValList[j];
            const obj={};
            for(let i=0;i<colKeyList.length;i++){
                const key=colKeyList[i];
                obj[key]=dataVal[i];
            }
            data.push(obj);
        }
        this.columns=columns;
        this.data = data;
    }
    textInput(e){
        this.dataFromInput=e.target.value;
    }
    btn(){
        console.log('clicked...',this.dataFromInput);
        if(this.dataFromInput===undefined){
            this.showToast('ENTER SOMETHING FOR SEARCH!','Please Enter something!','warning');
            return;
        }
        chatGPTSearch({inputData:this.dataFromInput}).then(res=>{
            if(res===null){
                this.showToast('ERROR IN TEXT FORMAT!','Please Correct your input. And Pass Again','warning');
                return;
            }
            this.tableCreater(res);
        }).catch(err=>console.error(`++${err}--`));
        console.log('click end.....');
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