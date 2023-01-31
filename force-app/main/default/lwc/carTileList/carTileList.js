import { LightningElement, wire } from 'lwc';
import getCarList from '@salesforce/apex/carController.getCarList';
import CARS_FILTERED_LMSCHANNEL from "@salesforce/messageChannel/carsFiltered__c";
import CAR_SELECTED_MESSAGE from "@salesforce/messageChannel/carsSelected__c";
import { publish,subscribe,unsubscribe,createMessageContext,releaseMessageContext,MessageContext } from 'lightning/messageService';

export default class CarTileList extends LightningElement {
    
    carSubscription
    cars = []
    wrapFilterArg={};
    @wire(getCarList,{wrapFilterArg:'$wrapFilterArg'})
    getCarListHandler({data,error})
    {   
        if(data)
        { //console.log('njnasd')
            this.cars = data
            console.log(data)
            console.log('i am car')
            console.log(typeof(cars))
        }
        if(error)
        {   
            console.error(error)
        }

    }
    
    @wire(MessageContext)
    messageContext
    connectedCallback()
    {
        this.subscribehandler()
        
    }

    subscribehandler()
    {
       this.carSubscription= subscribe(this.messageContext,CARS_FILTERED_LMSCHANNEL,(message)=>{this.handleFilterChanges(message)})
    }


    handleFilterChanges(message)
    {
       // console.log(message.filters)
        this.wrapFilterArg = {...message.filters}
    }

    handleCarSelected(event)
    {
        publish(this.messageContext,CAR_SELECTED_MESSAGE,{carId:event.detail})
        console.log(event.detail)
        
    }

    disconnectedCallback()
  {
    unsubscribe(this.carSubscription)
    this.carSelectedSubscription = null
  }
}