import { LightningElement,api } from 'lwc';
import CAR_HUB_LOGO from  '@salesforce/resourceUrl/carHubLogo';
export default class PlaceHolder extends LightningElement {
    @api message
    palceHolder = CAR_HUB_LOGO;
}