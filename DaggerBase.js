'use strict'

if (typeof window === 'object') {
    // HTML javascript implementation of uuid-v4
    uuid = {
        v4: function() {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(cc) {
                var rr = Math.random() * 16 | 0; return (cc === 'x' ? rr : (rr & 0x3 | 0x8)).toString(16);
            })
        }
    }
} else {
    var uuid = require('uuid');
}

class DaggerBase {
    constructor() {
        this._instanceID = uuid.v4();
        this._parent = null;
    }

    get instanceID() {
        return this._instanceID;
    }

    get parent() {
        return this._parent;
    }
    set parent(p) {
        this._parent = p; 
    }

    purgeAll() {}
}

/**
 * This class acts as a simple emulation of the Qt signal/slot pattern.  Objects
 * derived from DaggerBase expose these as properties that can be connected to with callbacks (slots)
 * to respond to certain Dagger events.
 * 
 * @example
 * var nodeAddedSlot = function (nodeID) {
 *   console.log("node added to graph" + nodeID);
 *   // now disconnect the slot
 *   graph.nodeAdded.disconnect(nodeAddedSlot);
 *  }
 * graph.nodeAdded.connect(nodeAddedSlot);
 * 
 * @example
 * var nodeAddedSlot = function (nodeID) {
 *  console.log("slot node added " + nodeID);
 * }
 *
 * // calling connect on the signal will return a reference to
 * // the signal that one can call disconnect on directly when no
 * // longer needed:
 * var mysignal = graph.nodeAdded.connect(nodeAddedSlot);
 *
 * // when not needed, call disconnect on the sig object
 * mysignal.disconnect();
 * 
 */
class DaggerSignal {
    constructor(implementation) {
        this._cb = [];
        if(typeof implementation === 'function') {
            this._cb[0] = implementation;
        }
    }

    connect(slot) {
        this._cb[this._cb.length] = slot;
        return this;
    }

    disconnect(slot) {
        var index = this._cb.indexOf(slot);
        if (index > -1) this._cb.splice(index, 1); 
    }

    disconnectAll() {
        this._cb = [];
    }

    emit() {
        for (var i = 0, len = this._cb.length; i < len; i++)
            this._cb[i].apply(this._cb[i], arguments);
    }
}

module.exports.DaggerBase = DaggerBase;
module.exports.DaggerSignal = DaggerSignal;