import { LightningElement } from "lwc";
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getObjectsList from '@salesforce/apex/OrgUtility.getObjectsList';
import getAllfields from '@salesforce/apex/OrgUtility.getAllfields';
import insertOrUpdateMdt from '@salesforce/apex/MetaUtility.insertOrUpdateMdt'
import generateTextField from "@salesforce/apex/MetaUtility.generateTextField";
export default class ObjSetUp extends LightningElement {
    //arrays for display picklist datas 
    allObjectsOpt=[];
    allFiledsOpt=[];
    fldsToFetchOpt=[];
    //selected values from picklists
    selectedObj;
    selectedTxtFld;
    selectedFldsToFetch;
    //input values for new field creation
    inpLblVal;
    inpApiVal;
    //loading all objects for picklist
    connectedCallback(){
        getObjectsList().then(mapObj=>{
            // console.log( mapObj);
            this.allObjectsOpt=Object.keys(mapObj).map(key=>{
                return {
                    label: mapObj[key], 
                    value: key 
                }
            })
        })
    }
    //getting the selected object and fetch all field from apex
    handleObj(event){
        this.selectedObj=event.detail.value;
        console.log('OBJECT: ',this.selectedObj);
        // console.log('OBJECT LIST: ',JSON.stringify(this.allObjectsOpt));
        getAllfields({objectName:this.selectedObj}).then(flds=>{
            // console.log(flds);
            this.allFiledsOpt=Object.keys(flds).map(key=>{
                return {
                    label: key, 
                    value: flds[key] 
                }
            })
        })
    }
    //getting the selected text field
    handleTxtFld(event){
        this.selectedTxtFld=event.detail.value;
        console.log('FIELDS LIST: ',JSON.stringify(this.allFiledsOpt));
        if(this.allFiledsOpt.some(obj => Object.values(obj).includes(this.selectedTxtFld))){
            this.fldsToFetchOpt = this.allFiledsOpt.filter((obj) => obj.value !== this.selectedTxtFld);
        }
    }
    //getting all fields to fetch
    handleFldsToFetch(event){
        this.selectedFldsToFetch=event.detail.value;
    }
    //getting input label name
    handleLbl(event){
      this.inpLblVal=event.target.value;
      console.log(this.inpLblVal);
    }
    //getting input api name
    handleApi(event){
      this.inpApiVal=event.target.value;
      console.log(this.inpApiVal);
    }
    //button for creating new field
    btnCrNewFld(){
      console.log('btnCrNewFld',this.inpLblVal,this.inpApiVal);
      //validation
      if(!this.selectedObj){
        this.showToast('Error', 'Please select Object', 'error');
        return ;
      }else if(!this.selectedTxtFld){
        this.showToast('Error', 'Please select Text fields', 'error');
        return;
      }else if(this.inpLblVal==='' || this.inpLblVal===undefined){
        this.showToast('Error', 'Please enter field label name', 'error');
        return;
      }else if(this.inpApiVal==='' || this.inpApiVal===undefined){
        this.showToast('Error', 'Please enter field API name', 'error');
        return;
      }
      //calling apex to create new field
      this.inpApiVal = this.inpApiVal.replace(/\s/g, "_");
      generateTextField({objectAPIName: this.selectedObj, fieldAPIName:this.inpApiVal, fieldLabel: this.inpLblVal})
      .then(result => {
        this.response = result;
        console.log(this.response,result);
        if (this.response == '201') {
          this.showToast('Done', 'Field has been created successfully', 'success');
          getAllfields({objectName:this.selectedObj}).then(flds=>{
            console.log(flds);
            const tempArrFls=Object.keys(flds).map(key=>{
                return {
                    label: flds[key], 
                    value: key 
                }
            });
            if (tempArrFls.some(obj => Object.values(obj).includes(this.selectedTxtFld))) {
              this.allFiledsOpt = tempArrFls.filter((obj) => obj.value !== this.selectedTxtFld);
            }
          });
        } else {
          this.showToast('Error', 'This field already exists in the Account object. Please change the name.', 'error');
        }
      });
    }
    //inserting values to metadata
    nextBtn(){
      const fldsStr=this.selectedFldsToFetch.join(',');
      const strArr=[this.selectedObj,this.selectedTxtFld,fldsStr];
      insertOrUpdateMdt({lstStr:strArr});
      
      //back to matadata page
      console.log('back to mdt page');
        const newEvent = new CustomEvent("progess", {
            detail: "2"
          });
        this.dispatchEvent(newEvent);
        window.location.reload();
    }
    //showing toast events method
    showToast(title, message, variant ,duration) {
      const toastEvent = new ShowToastEvent({
          title: title,
          message: message,
          variant: variant,
          duration: duration 
      });
      this.dispatchEvent(toastEvent);
    }
     
}









/*
import { LightningElement,track,wire,api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import LightningPrompt from 'lightning/prompt';

import checkConfiguration from '@salesforce/apex/CheckConfiguration.checkChatGptConfiguration';
import getObj from '@salesforce/apex/ListOfAllObjects.getObjectsList';
import getField from '@salesforce/apex/ListOfAllObjects.getAllfields';
import updatedField from '@salesforce/apex/MetadataUtility.getAllfields';
import creatField from '@salesforce/apex/MetadataUtility.generateTextField';
import saveSelectedLabels from '@salesforce/apex/MyCustomSettingController.saveSelectedLabels';
import saveFieldsInCusttomStng from '@salesforce/apex/MyCustomSettingController.saveFieldsInCusttomStng';
import existingField from '@salesforce/apex/MyCustomSettingController.existingField';


// export default class ObjSetUp extends NavigationMixin(LightningElement) {
  @track selectedValues = [];
//   @track allObjects = [];
  @track filteredArray =[];
   testarray =[];
  @track vall =[] ;
   testarray =[];
  @track allObj = [];
  @track mapData = [];
  @track isModalOpen = false;
  @track validation;
//   allFileds = [];
  showSpinner = false;
 @api progressValue1;
  multiPicklistValue = [];
  @ track data =[];
  @track opt;
  @wire(getObj)
  
    wiredOptions({ error, data }) {
        if (data) {
          for(let key in data){
            if(data[key]){
              this.allObjects = [...this.allObjects,{value:key,label:data[key]}];
            }
          }
        } else if (error) {
            this.error = error;
            console.log('this.error  '+JSON.stringify(this.error));
        }
    }


  handleSinglePicklistChange1(event) {
    this.singlePicklistValue1 = event.detail.value;
    this.allFileds =[];
    this.filteredArray =[];
    console.log('1',this.singlePicklistValue1);
    getField({objectName :this.singlePicklistValue1})
    .then(result =>{

    for(let key in result){
      if(result[key]){
        this.allFileds = [...this.allFileds,{value:result[key],label:key}];
      }
    }
    }) 
    
    }
  

  handleSinglePicklistChange2(event) {
    this.singlePicklistValue2 = event.detail.value;
   
    if(this.allFileds.some(obj => Object.values(obj).includes(this.singlePicklistValue2))){
    this.filteredArray = this.allFileds.filter((obj) => obj.value !== this.singlePicklistValue2);
    
     }
  }

  handleMultiPicklistChange(event) {
    this.multiPicklistValue = event.detail.value;

  }

 handleButtonClick1() {
if( this.multiPicklistValue.length===0){
  this.showToast('Error', 'Please select atleast one fields', 'error');
   
}else{
  saveSelectedLabels({sL:this.multiPicklistValue.join(', '), otherField : 'Other', objectName : this.singlePicklistValue1}).then((res)=>{
    if(res != '201'){
      this.isModalOpen = true;
    }else{
    this.showToast('Done', 'Successful', 'success', 1000);
    
    this.progressValue1='3';
      const selectedEvent = new CustomEvent("progressvaluechange", {
        detail:this.progressValue1
      });
    
      this.dispatchEvent(selectedEvent);
  console.log('ELSEELSEELSE',this.multiPicklistValue.length);
      }
  }).catch((e)=>console.log(e))

  
  
}

}

jh;
fieldValue(e) {
  this.jh=e.target.value;
  console.log('jh       '+this.jh);
 
}
fieldAPI(event){
  this.fieldsAPI = event.target.value;
  console.log('api       '+this.fieldsAPI);
}
   handleButtonClick(){
    this.validation = true;
  if(!this.singlePicklistValue1){
    this.showToast('Error', 'Please select object', 'error');
    this.validation = false;
    return ;
  }
  else if(this.jh==='' || this.jh===undefined){
      this.showToast('Error', 'Please enter field name', 'error');
      this.validation = false;
      return;
    }
  else if(this.fieldsAPI==='' || this.fieldsAPI===undefined){
      this.showToast('Error', 'Please enter field API', 'error');
      this.validation = false;
      return;
    }
     if(this.validation){
    console.log('this.fieldValues   '+this.jh );
    this.fieldsAPI = this.fieldsAPI.replace(/\s/g, "_");
    try{
      creatField({objectAPIName: this.singlePicklistValue1, fieldLabel: this.jh, fieldAPI: this.fieldsAPI})
      .then(result => {
        this.response = result;
        if (this.response == '201') {
          this.showToast('Done', 'Field has been created successfully', 'success');
          
          updatedField({objectName: this.singlePicklistValue1})
            .then(resp => {
              this.filteredArray = [];
              for (let key in resp) {
                if (resp[key]) {
                  this.testarray = [...this.testarray, { value: resp[key], label: key }];
                }
              }
              
              
              if (this.testarray.some(obj => Object.values(obj).includes(this.singlePicklistValue2))) {
                this.filteredArray = this.testarray.filter((obj) => obj.value !== this.singlePicklistValue2);
              }
              
            });
        } else {
          this.showToast('Error', 'This field already exists in the Account object. Please change the name.', 'error');
        }
      });
  }catch(e){
}
}
  }
  //----------------------------------------------
  
// close the modle
  closeModal(){
    this.isModalOpen = false;
  }
// Use existing field with name other
  UseExistingField(){
    existingField({sL:this.multiPicklistValue.join(', '), otherField : 'Other'})
    .then(result =>{
      this.store = result;
      this.isModalOpen = false;
      checkConfiguration({sCode:'201'}).then(result=>{
        console.log(result);
        ///if apex return true
        console.log('3000 ' ,'201');
        // this.progressValue ='201' ;
        const selectedEvent = new CustomEvent("progressvaluechange", {
          detail: '3'
        });
      
        // Dispatches the event.
        this.dispatchEvent(selectedEvent);
      // send val  to parenbt 
      }).catch(error=>{
      
      });
      const selectedEvent = new CustomEvent("progressvaluechange", {
        detail: '201'
      });
    })
  }

  // create  other field in the selected object 
  CreateNewField(){
    LightningPrompt.open({
      message: 'Provide API field',
      label: 'Please Respond', // this is the header text
  }).then((result) => { 
    if( result != null){
      this.isModalOpen = false;
      this.createFields(result);
    }
     
  });

  }

  // change the apiName of other Label 
    createFields(result){
       this.fieldApiName = result.replace(/\s/g, "_");
      saveFieldsInCusttomStng({sL:this.multiPicklistValue.join(', '), otherField : 'Other', objectName : this.singlePicklistValue1, fieldAPIName :this.fieldApiName}).then((res)=>{
        this.storeRetuenValue = res;
        if(res != '201'){
          this.isModalOpen = true;
        }else{
          this.isModalOpen = false;
          this.showToast('Done', 'Field created with new API name', 'success', 1000);
          checkConfiguration({sCode:'201'}).then(result=>{
            console.log(result);
            ///if apex return true
            console.log('3000 ' ,'201');
            // this.progressValue ='201' ;
            const selectedEvent = new CustomEvent("progressvaluechange", {
              detail: '201'
            });
          
            // Dispatches the event.
            this.dispatchEvent(selectedEvent);
          // send val  to parenbt 
          }).catch(error=>{
          
          });
          const selectedEvent = new CustomEvent("progressvaluechange", {
            detail: '201'
          });

        }
        console.log(this.storeRetuenValue);
      })
    }

  showToast(title, message, variant ,duration) {
    this.toastVariant = variant;
    this.toastTitle = title;
    this.toastMessage = message;
    this.duration=duration;
    const toastEvent = new ShowToastEvent({
        title: this.toastTitle,
        message: this.toastMessage,
        variant: this.toastVariant,
        duration: this.duration 
    });
    this.dispatchEvent(toastEvent);
  }
  
}
*/