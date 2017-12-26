'use strict'

const DaggerBasePin = require('./DaggerBasePin.js').DaggerBasePin;
const DaggerInputPin = require('./DaggerInputPin.js').DaggerInputPin;
const DaggerTypes= require('./DaggerTypes.js');

/**
 * Class that represents a directed output out of a DaggerNode
 * @extends DaggerBasePin
 */
class DaggerOutputPin extends DaggerBasePin {
    /**
     * DaggerOutputPin ctor
     */
    constructor() {
        super();
        this._connectedTo = [];

        // by default, we allow all output pins to be multiconnect
        this._allowMultiConnect = true;
    }

    /**
     * Get the pin's direction
     * @returns {DaggerBasePin.PinDirection.Output}
     */
    get direction() {
        return DaggerBasePin.PinDirection.Output;
    }

    /**
     * Get list of all DaggerInputPins this pin is connected to.
     * @returns {array}
     */
    get connectedTo() {
        // make a shallow copy
        return this._connectedTo.slice();
    }

    /**
     * Get if this output pin allows for multiple connections (typically true)
     * @returns {boolean}
     */
    get allowMultiConnect() {
        return this._allowMultiConnect;
    }

    /**
     * Set if this output pin allows for multiple connections.
     */
    set allowMultiConnect(val) {
        this._allowMultiConnect = val;
    }

    /**
     * Get if this pin has any connections.
     * @returns {boolean}
     */
    get isConnected() {
        return this._connectedTo.length !== 0;
    }

    /**
     * Get a list of instance IDs for each DaggerInputPin this pin is connected to.
     * @returns {array}
     */
    get connectedToUUIDs() {
        let retv = [];
        for(let pin of this._connectedTo) {
            retv.push(pin.instanceID);
        }
        return retv;
    }

    /**
     * Connect this pin to the given DaggerInputPin
     * @param {DaggerInputPin} input
     * @returns {boolean} 
     */
    connectToInput(input) {
        if(!input) {
            // emitError("Input pin was null in connectToInput");
            return false;
        }
    
        let outputpincontainer = this._parentNode.parentGraph;
        let inputpincontainer = input.parentNode.parentGraph;
    
        if (outputpincontainer == null) {
            // emitError("Output pin is not associated with a DaggerNode or DaggerGraph");
            return false;
        }
    
        if (inputpincontainer == null) {
            // emitError("Input pin is not associated with a DaggerNode or DaggerGraph");
            return false;
        }
    
        if (inputpincontainer != outputpincontainer) {
            // emitError("Input pin and Output pin are not associated with the same DaggerGraph");
            return false;
        }
    
        if(!input.canConnectToPin(this)) {
            // emitError("Input pin cannot connect to this output pin");
            return false;
        }
    
        if(!this.canConnectToPin(input)) {
            // emitError("Input pin cannot connect to this output pin");
            return false;
        }
    
        if(input.isConnected) {
            if(input.autoCloneMaster) {
                // emitError(("cannot swap connections on cloned pins"));
                return false;
            }
    
            // try to disconnect the input pin from it's previous connection
            if(!input.disconnectPin(false)) {
                // emitError("Input pin is already connected and was not allowed to disconnect");
                return false;
            }
        }
    
        // call the parent container's before connect to see if we are allowed connect them
        if(outputpincontainer.beforePinsConnected(this, input)) {
            // connect the two pins
            this._connectedTo.push(input);
            input._connectedTo = this;
    
            // let the graph know they were connected
            outputpincontainer.onPinsConnected(this, input);
    
            // signal the connected for both pins
            this.pinConnected.emit(input);
            input.pinConnected.emit(this);
    
            outputpincontainer.afterPinsConnected(this, input);
    
            return true;
        }
        
        return false;
    }

    /**
     * Get if this pin can connect to the given DaggerInputPin
     * @param {DaggerInputPin} pin
     * @returns {boolean} 
     */
    canConnectToPin(pin) {
        if(!pin || !(pin instanceof DaggerInputPin))
            return false;

        // pins need to belong to the same topology system
        let mtop = this.topologySystem;
        let ttop = pin.topologySystem;
        if(mtop != ttop) {
            // this->emitInfo("cannt connect to input pin.  Outputpin topology is " + QString::number(topologySystem()) + ", input pin topology is " + QString::number(ttop));
            return false;
        }

        // if the input is already connected, we cannot connect
        if(pin.isConnected)
        {
            return false;
        }

        // if multi-connect is not allowed and we are already connected, then a big whopping NO
        if(!this.allowMultiConnect && this.isConnected) {
            return false;
        }

        if(!pin.parentNode.descendents(mtop).includes(this.parentNode)) {
            return super.canConnectToPin(pin);
        } else if(pin.parentNode.ordinal(mtop) >= this.parentNode().ordinal(mtop)) {
            return super.canConnectToPin(pin);
        }

        return false;
    }

    /**
     * Disconnect this pin from the given DaggerInputPin
     * @param {DaggerInputPin} ipin 
     * @param {boolean} forceDisconnect - when true, the pin will disconnect regardless if the topology says it shouldn't
     * @returns {boolean}
     */
    disconnectPin(ipin, forceDisconnect) {
        // get the parent graph of this pin
        let parentGraph = this.parentNode.parentGraph;
        if(!parentGraph) {
            // emitError("Output pin is not associated with a DaggerGraph");
            return false;
        }
    
        // do we have this input pin?
        if(this._connectedTo.includes(ipin)) {
            // call the before connect event to see if we can disconnect them
            if(forceDisconnect || parentGraph.beforePinsDisconnected(this, ipin)) {
                this._connectedTo.splice(this._connectedTo.indexOf(ipin), 1);
                ipin._connectedTo = null;
    
                // let the container know they are disonnected
                parentGraph.onPinsDisconnected(this, ipin);
    
                // raise the OnPinDisconnected event
                this.pinDisconnected.emit(ipin);
                ipin.pinDisconnected.emit(this);
    
                parentGraph.afterPinsDisconnected(this, ipin);
                return true;
            } else {
                // we failed to disconnect them
                return false;
            }
        } else {
            // since we were never connected to this pin, they are technically disconnected
            return true;
        }
    
        return false;
    }

    /**
     * Disconnect this pin from all DaggerInputPins.
     * @param {boolean} forceDisconnect - when true, the pin will disconnect regardless if the topology says it shouldn't
     * @returns {boolean}
     */
    disconnectAll(forceDisconnect) {
        // walk backwards through the connected list and try to disconnect them
        let ccount = this._connectedTo.length;
        for(let i = ccount - 1; i > -1; i--) {
            let pin = _connectedTo[i];
            if(!pin.disconnectPin(forceDisconnect)) {
                // we failed to disconnect a pin
                return false;
            }
        }
        return true;
    }

    /**
     * Clean up when object hierarchy is unraveled.  Subclasses should always super.
     */
    purgeAll() {
        super.purgeAll();
        this._connectedTo = [];
    }
}

module.exports = {
    DaggerOutputPin: DaggerOutputPin
};