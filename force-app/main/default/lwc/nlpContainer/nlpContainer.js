import { LightningElement } from 'lwc';

export default class NlpContainer extends LightningElement {
    checkRespFlag=true;
    metaDataFlag;
    dataProcFlag;
    configSetFlag;
    objsetFlag;
    pv="1";
    onProgHandle(event){
        const pageVal = event.detail;
        this.pv=pageVal;
        console.log(+pageVal,'nlpcontainer');
        switch(+pageVal){
            case 1:
                this.checkRespFlag=true;
                this.metaDataFlag=false;
                this.dataProcFlag=false;
                this.configSetFlag=false;
                this.objsetFlag=false;
                console.log(pageVal);
                break;
            case 2:
                this.checkRespFlag=false;
                this.metaDataFlag=true;
                this.dataProcFlag=false;
                this.configSetFlag=false;
                this.objsetFlag=false;
                console.log(pageVal);
                break;
            case 3:
                this.checkRespFlag=false;
                this.metaDataFlag=false;
                this.dataProcFlag=true;
                this.configSetFlag=false;
                this.objsetFlag=false;
                console.log(pageVal);
                break;
            case 4:
                this.checkRespFlag=false;
                this.metaDataFlag=false;
                this.dataProcFlag=false;
                this.configSetFlag=true;
                this.objsetFlag=false;
                console.log(pageVal);
                break;
            default:
                this.checkRespFlag=false;
                this.metaDataFlag=false;
                this.dataProcFlag=false;
                this.configSetFlag=false;
                this.objsetFlag=true;
                this.pv='2';
                console.log(pageVal);
                break;
        }
    }
}