import { LightningElement, api, wire } from "lwc";
import CAR_OBJECT from "@salesforce/schema/Car__c";
import NAME_FIELD from "@salesforce/schema/Car__c.Name";
import PICTURE_FIELD from "@salesforce/schema/Car__c.PictureUrl__c";
import CATEGORY_FIELD from "@salesforce/schema/Car__c.Category__c";
import MAKE_FIELD from "@salesforce/schema/Car__c.make__c";
import MSRP_FIELD from "@salesforce/schema/Car__c.MSRP__c";
import FUELTYPE_FIELD from "@salesforce/schema/Car__c.Fuel_Type__c";
import SEATS_FIELD from "@salesforce/schema/Car__c.Seats__c";
import CONTROL_FIELD from "@salesforce/schema/Car__c.Control__c";
import CAR__c from "@salesforce/schema/Car__c";
import { getFieldValue } from "lightning/uiRecordApi";
import CAR_SELECTED_MESSAGE from "@salesforce/messageChannel/carsSelected__c";
// navigation
import { NavigationMixin } from "lightning/navigation";

import {
  publish,
  subscribe,
  unsubscribe,
  createMessageContext,
  releaseMessageContext,
  MessageContext
} from "lightning/messageService";

export default class CarCard extends NavigationMixin(LightningElement) {
  @wire(MessageContext)
  messageContext;
  //EXPOSING FIELDS  TO HTML
  nameField = NAME_FIELD;
  pictureField = PICTURE_FIELD;
  categoryField = CATEGORY_FIELD;
  makeField = MAKE_FIELD;
  msrpField = MSRP_FIELD;
  fuelTypeField = FUELTYPE_FIELD;
  seatsField = SEATS_FIELD;
  controlField = CONTROL_FIELD;
  @api objectApiName = CAR__c;

  recordId;
  carName;
  carPictureUrl;
  carSelectedSubscription;
  loadHandler(event) {
    const { records } = event.detail;
    const recordData = records[this.recordId];
    this.carName = getFieldValue(recordData, NAME_FIELD);
    this.carPictureUrl = getFieldValue(recordData, PICTURE_FIELD);
  }

  subscribehandler() {
    this.carSelectedSubscription = subscribe(
      this.messageContext,
      CAR_SELECTED_MESSAGE,
      (message) => {
        this.handleCarSelected(message);
      }
    );
  }
  connectedCallback() {
    this.subscribehandler();
  }

  handleCarSelected(message) {
    this.recordId = message.carId;
    console.log(this.recordId);
  }
  disconnectedCallback() {
    unsubscribe(this.carSelectedSubscription);
    this.carSelectedSubscription = null;
  }
  handlenavigateRecord() {
    this[NavigationMixin.Navigate]({
      type: "standard__recordPage",
      attributes: { recordId: this.recordId, objectApiName: CAR_OBJECT.objectApiName,actionName:'view' }
    });
  }
}
