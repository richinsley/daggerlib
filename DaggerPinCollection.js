'use strict'

const DaggerBase = require('./DaggerBase.js').DaggerBase;
const DaggerSignal = require('./DaggerBase.js').DaggerSignal;

class DaggerPinCollection extends DaggerBase {
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

    get topologySystem() {
        return this._topology_system;
    }

    pin(withName) {
        if(this._pinCollection.hasOwnProperty(withName)) {
            return this._pinCollection[withName];
        }
        return null;
    }

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

    // return the index of the given pin in the collection
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

    get allPins() {
        // return a copy, not the actual array
        return this._orderedCollection.slice();
    }

    get allNonConnectedPins() {
        let retv = [];
        for(let pin of this._orderedCollection) {
            if(!pin.isConnected) {
                retv.push(pin);
            }
        }
        return retv;
    }

    get allConnectedPins() {
        let retv = [];
        for(let pin of this._orderedCollection) {
            if(pin.isConnected) {
                retv.push(pin);
            }
        }
        return retv;
    }

    purgeAll() {

        for(let pin of this._orderedCollection)
        {
            pin.purgeAll();
        }
        this._pinCollection = [];
        this._orderedCollection = [];

        super.purgeAll();
    }
}

module.exports = {
    DaggerPinCollection: DaggerPinCollection
};