'use strict'

const DaggerBasePin = require('./DaggerBasePin.js').DaggerBasePin;
const DaggerTypes= require('./DaggerTypes.js');

/**
 * Class that represents a directed input into a DaggerNode
 * @extends DaggerBasePin
 */
class DaggerInputPin extends DaggerBasePin {
    /**
     * DaggerInputPin ctor
     */
    constructor() {
        super();
        this._connectedTo = null;
    }

    /**
     * Get the pin's direction
     * @returns {DaggerBasePin.PinDirection.Input}
     */
    get direction() {
        return DaggerBasePin.PinDirection.Input;
    }

    /**
     * Get the DaggerOutputPin this pin is connected to
     * @returns {DaggerOutputPin}
     */
    get connectedTo() {
        return this._connectedTo;
    }

    /**
     * Get the instance ID of the DaggerOutputPin this pin is connected to.
     * @returns {string}
     */
    get connectedToUUID() {
        if(this.isConnected) {
            return this._connectedTo.instanceUUID;
        }
        // the 'null' uuid
        return "00000000-0000-0000-0000-000000000000";
    }

    /**
     * Get if this pin is connected
     * @returns {boolean}
     */
    get isConnected() {
        return (this._connectedTo !== null) ? true : false;
    }

    /**
     * Returns true if this pin can connect to the given DaggerOutputPin
     * @param {DaggerOutputPin} pin 
     */
    canConnectToPin(pin) {
        let tsystem = this.topologySystem;
        if(tsystem != pin.topologySystem) {
            // pins must belong to the same topology system
            this.emitError("pins must belong to the same topology system");
            return false;
        }
    
        if(!this.parentNode) {
            // this is an exported or non-node pin, so it can connect to any DaggerOutputPin
            return super.canConnectToPin(pin);
        }
    
        if(this.parentNode == pin.parentNode) {
            // big NO-NO!
            this.emitError("pins belong to the same parent node");
            return false;
        }
    
        let retv = false;
        if(this._parentNode.parentGraph.enableTopology) {
            if(!this.parentNode.descendents(tsystem).includes(pin.parentNode)) {
                retv = super.canConnectToPin(pin);
            } else if(pin.parentNode.ordinal(tsystem) <= this.parentNode.ordinal(tsystem)) {
                retv = super.canConnectToPin(pin);
            }
        } else {
            retv = true;
        }
        return retv;
    }

    /**
     * Disconnects this pin.
     * @param {boolean} forceDisconnect - when true, the pin will disconnect regardless if the topology says it shouldn't
     */
    disconnectPin(forceDisconnect = false) {
        if (this._parentNode === null)
            return false;
    
        // is it even connected?
        if (this.isConnected) {
            // call the OutputPin's Disconnect method
            return this.connectedTo.disconnectPin(this, forceDisconnect);
        }
        
        // since we were never connected to this pin, they are technically disconnected
        return true;
    }

    /**
     * Clean up when object hierarchy is unraveled.  Subclasses should always super.
     */
    purgeAll() {
        super.purgeAll();
        this._connectedTo = null;
    }
}

module.exports = {
    DaggerInputPin: DaggerInputPin
};