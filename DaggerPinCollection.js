'use strict'

const DaggerBase = require('./DaggerBase.js').DaggerBase;
const DaggerSignal = require('./DaggerBase.js').DaggerSignal;

/**
 * Class that acts as a container for pins of one particular direction.
 * @extends DaggerBase
 */
class DaggerPinCollection extends DaggerBase {
    /**
     * DaggerPinCollection ctor
     * @param {DaggerNode} parentNode 
     * @param {DaggerBasePin.PinDirection} direction 
     * @param {number} topology_system 
     */
    constructor(parentNode, direction, topology_system) {
        super();
        this._direction = direction;
        this._parentNode = parentNode;
        this._topology_system = topology_system;
        this._pinCollection = {};
        this._orderedCollection = [];

        // signals
        this.pinRemoved = new DaggerSignal();   // void pinRemoved(QUuid pinID);
        this.pinAdded = new DaggerSignal();     // void pinAdded(QDaggerBasePin * pin);
    }

    /**
     * Get the topology system this pin collection belongs to.
     * @returns {number}
     */
    get topologySystem() {
        return this._topology_system;
    }

    /**
     * Find and return a pin with the given name.
     * @param {string} withName
     * @returns {DaggerBasePin} 
     */
    pin(withName) {
        if(this._pinCollection.hasOwnProperty(withName)) {
            return this._pinCollection[withName];
        }
        return null;
    }

    /**
     * Add a given pin to this collection.
     * @param {DaggerBasePin} pin 
     * @param {string} name
     * @returns {boolean} 
     */
    addPin(pin, name) {
        if(!pin)
            return false;

        // set me as the pin's parent
        pin.parent = this;

        if(name != "") {
            pin.pinName = name;
        } else if(pin.pinName != "") {
            // the MUST have a name
            pin.pinName = pin.instanceID;
        }

        if(this._pinCollection.hasOwnProperty(pin.pinName)) {
            // remove all numerals and try to find a pin name that doesn't exist
            let nn = pin.pinName.replace(/[0123456789]/g, '');
            let cc = 0;
            while(1) {
                let an = nn + cc;
                if(!this._pinCollection.hasOwnProprty(an))
                    break;
                cc++;
            }
            pin.pinName = an = nn + cc;;
        }

        pin.parentNode = this._parentNode;

        // just stick it at the end
        this._pinCollection[pin.pinName] = pin;
        this._orderedCollection.push(pin);

        // signal that we added a pin
        this.pinAdded.emit(pin);

        return true;
    }

    /**
     * Set the name for a given pin.  If the pin's name has already been set, and the pin isn't allowed to be renamed, 
     * this will return 'false'
     * @param {DaggerBasePin} pin 
     * @param {string} name 
     * @returns {boolean}
     */
    setPinName(pin, name) {
        if(pin.name == name)
            return true;

        if(this.pin(name) != null) {
            // we already have a pin with this name
            return false;
        }
        
        // change the pin name in the collection map first
        delete this._pinCollection[pin.pinName];
        this._pinCollection[name] = pin;

        // change the pin's name
        pin.pinName = name;

        return true;
    }

    /**
     * Remove a given pin from this collection.
     * @param {DaggerBasePin} pin 
     */
    removePin(pin) {
        if(this._orderedCollection.includes(pin) && !pin.isConnected) {
            // ask my parent node if I can be removed first
            if(this._parentNode && !this._parentNode.canRemovePin(pin)) {
                return false;
            }

            let pinid = pin.instanceID;
            delete this._pinCollection[pinid];
            let index = this._orderedCollection.indexOf(pin);
            if(index > -1) {
                this._orderedCollection.splice(index, 1);
            }
        }
        return false;
    }

    /**
     * Get the index of the given pin in the collection
     * @param {DaggerBasePin} pin 
     * @returns {number}
     */
    index(pin) {
        return this._orderedCollection.indexOf(pin);
    }

    /**
     * get the parent node (same result as DaggerBase.parent)
     */
    get parentNode() {
        return this.parent;
    }

    /**
     * get the direction of pins in this collection
     */
    get pinDirection() {
        return this._direction;
    }

    /**
     * Get list of all the pins in the collection
     * @returns {array}
     */
    get allPins() {
        // return a copy, not the actual array
        return this._orderedCollection.slice();
    }

    /**
     * Get list of all pins in the collection that are not connected.
     * @returns {array}
     */
    get allNonConnectedPins() {
        let retv = [];
        for(let pin of this._orderedCollection) {
            if(!pin.isConnected) {
                retv.push(pin);
            }
        }
        return retv;
    }


    /**
     * Get list of all pins in the collection that are connected.
     * @returns {array}
     */
    get allConnectedPins() {
        let retv = [];
        for(let pin of this._orderedCollection) {
            if(pin.isConnected) {
                retv.push(pin);
            }
        }
        return retv;
    }

    /**
     * Clean up when object hierarchy is unraveled.  Subclasses should always super.
     */
    purgeAll() {
        for(let pin of this._orderedCollection)
        {
            pin.purgeAll();
        }
        this._pinCollection = [];
        this._orderedCollection = [];

        super.purgeAll();
    }

    /**
     * Find the first unconnected pin or null if no pins are unconnected.
     * @returns {DaggerBasePin}
     */
    get firstUnconnectedPin() {
        for(let p of this._orderedCollection) {
            if(!p.isConnected)
                return p;
        }
        return null;
    }
}

module.exports = {
    DaggerPinCollection: DaggerPinCollection
};