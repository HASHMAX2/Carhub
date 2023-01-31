import { LightningElement, api, wire } from "lwc";
import getSimilarCars from "@salesforce/apex/carController.getSimilarCars";
import { getRecord } from "lightning/uiRecordApi";
import MAKE_FIELD from "@salesforce/schema/Car__c.Make__c";
import {NavigationMixin} from 'lightning/navigation'


export default class SimilarCarsComponent extends NavigationMixin( LightningElement) {
  @api recordId;
  @api objectApiName
  @wire(getRecord, { recordId: "$recordId", fields: [MAKE_FIELD] })
  car;
similarCars 
fetchSimilarCars() {
    getSimilarCars({
      carId: this.recordId,
      makeType: this.car.data.fields.make__c.value
    }).then(result=>{
        console.log(result)
        this.similarCars =result }).catch((error)=>console.error(error))
  }

  handleClickDetails(event)
  {
this[NavigationMixin.Navigate]({
    type:'standard__recordPage', attributes:{
        recordId : event.target.dataSet.id, objectApiName: this.objectApiName,actionName:'view'
    }
})
  }
}
