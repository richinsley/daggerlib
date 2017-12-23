'use strict'

const DaggerBasePin = require('./DaggerBasePin.js').DaggerBasePin;
const DaggerTypes= require('./DaggerTypes.js');

class DaggerInputPin extends DaggerBasePin {
    constructor() {
        super();
        this._connectedTo = null;
    }

    get direction() {
        return DaggerBasePin.PinDirection.Input;
    }

    get connectedTo() {
        return this._connectedTo;
    }

    get connectedToUUID() {
        if(this.isConnected) {
            return this._connectedTo.instanceUUID;
        }
        // the 'null' uuid
        return "00000000-0000-0000-0000-000000000000";
    }

    get isConnected() {
        return (this._connectedTo !== null) ? true : false;
    }

    canConnectToPin(pin) {
        let tsystem = this.topologySystem;
        if(tsystem != pin.topologySystem) {
            // pins must belong to the same topology system
            return false;
        }
    
        if(!this.parentNode) {
            // this is an exported or non-node pin, so it can connect to any DaggerOutputPin
            return super.canConnectToPin(pin);
        }
    
        if(this.parentNode == pin.parentNode) {
            // big NO-NO!
            return false;
        }
    
        let retv = false;
        if(!this.parentNode.descendents(tsystem).includes(pin.parentNode)) {
            retv = super.canConnectToPin(pin);
        } else if(pin.parentNode.ordinal(tsystem) <= this.parentNode.ordinal(tsystem)) {
            retv = super.canConnectToPin(pin);
        }
    
        return retv;
    }

    disconnectPin(forceDisconnect = true) {
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

    // because DaggerOutputPin actually performs all the work of connecting/disconnecting, we need these internal methods
    // to let DaggerOutputPin raise the connection Notification events on DaggerInput
    _invokeConnectPin(to) {
        this.pinConnected.emit(to);
    }
    _invokeDisconnectPin(from) {
        this.pinDisconnected.emit(from);
    }

    purgeAll() {
        super.purgeAll();
        this._connectedTo = null;
    }
}

module.exports = {
    DaggerInputPin: DaggerInputPin
};