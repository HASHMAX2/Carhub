import { LightningElement, wire } from "lwc";
import { getPicklistValues, getObjectInfo } from "lightning/uiObjectInfoApi";
import CAR__C from "@salesforce/schema/Car__c";
import CATEGORY__C from "@salesforce/schema/Car__c.Category__c";
import MAKE__C from "@salesforce/schema/Car__c.make__c";
// importing lightnig message channel
import CARS_FILTERED_LMSCHANNEL from "@salesforce/messageChannel/carsFiltered__c";
import {
  publish,
  subscribe,
  unsubscribe,
  createMessageContext,
  releaseMessageContext,
  MessageContext
} from "lightning/messageService";

export default class CarFilter extends LightningElement {
  filters = {
    searchKey: "",
    maxPrice: 999999
  };
  timer;

  // fetching LMS context variable
  @wire(MessageContext)
  messageContext;

  /////----------///////// fetching category picklist
  @wire(getObjectInfo, { objectApiName: CAR__C })
  carObjectInfo;

  @wire(getPicklistValues, {
    recordTypeId: "$carObjectInfo.data.defaultRecordTypeId",
    fieldApiName: CATEGORY__C
  })
  categories;

  @wire(getPicklistValues, {
    recordTypeId: "$carObjectInfo.data.defaultRecordTypeId",
    fieldApiName: MAKE__C
  })
  makeType;

  handleSearch(event) {
    this.filters = { ...this.filters, searchKey: event.target.value };
    console.log(event.target.value);
    this.sendDatatoCarList();
  }

  handleSliderChange(event) {
    this.filters = { ...this.filters, maxPrice: event.target.value };
    console.log(event.target.value);
    this.sendDatatoCarList();
  }

  handleCheckBox(event) {
    if (!this.filters.categories) {
      const categories = this.categories.data.values.map((item) => item.value);
      const makeType = this.makeType.data.values.map((item) => item.value);
      this.filters = {
        ...this.filters,
        categories: categories,
        makeType: makeType
      };
    }
    const { name, value } = event.target.dataset;
    console.log(name);
    console.log(value);
    if (event.target.checked) {
      if (!this.filters[name].includes(value)) {
        this.filters[name] = [...this.filters[name], value];
        console.log(this.filters[name]);
      }
    } else {
      this.filters[name] = this.filters[name].filter((item) => item !== value);
      console.log(this.filters[name]);
    }

    this.sendDatatoCarList();
  }
  sendDatatoCarList() {
    window.clearTimeout(this);
    this.timer = window.setTimeout(() => {
      publish(this.messageContext, CARS_FILTERED_LMSCHANNEL, {
        filters: this.filters
      });
    }, 400);
  }
}
