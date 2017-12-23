'use strict'

const DaggerBase = require('./DaggerBase.js').DaggerBase;
const DaggerSignal = require('./DaggerBase.js').DaggerSignal;
const DaggerTypes = require('./DaggerTypes.js');
const DaggerBasePin = require('./DaggerBasePin.js').DaggerBasePin;
const DaggerPinCollection = require('./DaggerPinCollection.js').DaggerPinCollection;

class DaggerNode extends DaggerBase {
    constructor() {
        super();

        // the current topology that is being calculated in calculateTopology
        this._currentTSystemEval = -1;; 

        this._name = "DaggerNode";
        
        this._parentGraph = null;

        this._descendents = [];
        this._subgraphAffiliation = [];
        this._ordinal = [];
        this._outputPins = [];
        this._inputPins = [];

        // signals
        this.afterAddedToGraph = new DaggerSignal();
        this.beforeAddedToGraph = new DaggerSignal();
        this.pinCloned = new DaggerSignal();
        this.nameChanged = new DaggerSignal();

        for(let i = 0; i < DaggerTypes.MaxTopologyCount; i++) {
            this._subgraphAffiliation[i] = -1;
            this._ordinal[i] = -1;
            this._inputPins[i] = new DaggerPinCollection(this, DaggerBasePin.PinDirection.Input, i);
            this._outputPins[i] = new DaggerPinCollection(this, DaggerBasePin.PinDirection.Output, i);
        }
    }

    get parentGraph() {
        return this._parentGraph;
    }

    ordinal(topology_system = 0) {
        return this._ordinal[topology_system];
    }

    subgraphAffiliation(topology_system = 0) {
        return this._subgraphAffiliation[topology_system];
    }

    get name() {
        return this._name;
    }
    set name(newName) {
        this._name = newName;
        this.nameChanged.emit(newName);
    }

    inputPins(topology_system = 0) {
        return this._inputPins[topology_system];
    }

    outputPins(topology_system = 0) {
        return this._outputPins[topology_system];
    }

    // return an Array of nodes that I can affect
    descendents(topology_system = 0) {
        return this._descendents[topology_system].slice();
    }

    // return an Array of nodes that can affect me
    ascendents(topology_system = 0) {
        // any node in my subgraph that contains me as a descendent is on of my ascendents
        let retv = [];
        if(this.parentGraph) {
            let mysubgraph = this._subgraphAffiliation[topology_system];
            let sl = this.parentGraph.getSubGraphNodes(mysubgraph, topology_system);
            for(let n of sl) {
                if(this != n && n.descendents(topology_system).includes(this)) {
                    retv.push(n);
                }
            }
        }
        return retv;
    }

    isTopLevel(topology_system = 0) {
        let inpin = null;

        let allpins = this._inputPins[topology_system].allPins;
        for(let ipin of allpins) {
            if(ipin.isConnected) {
                // ignore exported pins
                if(ipin.connectedTo.parentNode !== null) {
                    inpin = ipin;
                    break;
                }
            }
        }
        return inpin == null;
    }

    isBottomLevel(topology_system = 0) {
        let allpins = this._outputPins[topology_system].allPins;
        for(let opin of allpins) {
            if(opin.isConnected) {
                return false;
            }
        }
        return true;
    }

    disconnectAllPins() {
        for(let i = 0; i < DaggerTypes.MaxTopologyCount; i++) {

            // go in reverse order to prevent autocloned pins from throwing off their collection iteration
            let alloutput = this._outputPins[i].allPins;
            for(let u = alloutput.length - 1; u > -1; u--) {
                let opin = alloutput[u];
                if(!opin.disconnectAll(false)) {
                    // this->emitError("Failed to disconnect output pin at disconnectAllPins");
                    return false;
                }
            }
    
            let allinput = this._inputPins[i].allPins;
            for(let u = allinput.length - 1; u > -1; u--) {
                let ipin = allinput[u];
                if(!ipin.disconnectPin(false)) {
                    // this->emitError("Failed to disconnect input pin at disconnectAllPins");
                    return false;
                }
            }
        }
    
        return true;
    }

    getDaggerOutputPin(withName, topology_system = 0) {
        return this._outputPins[topology_system].pin(withName);
    }

    getDaggerInputPin(withName, topology_system = 0) {
        return this._inputPins[topology_system].pin(withName);
    }

    // returns true if node has no input pins
    isTrueSource(topology_system = 0) {
        return this._inputPins[topology_system].allPins.length === 0;
    }

    // returns true if node has no output pins
    isTrueDest(topology_system = 0) {
        return this._outputPins[topology_system].allPins.length === 0;
    }

    // get/set the current topology system that is being evaluated in calculateTopology
    get currentTSystemEval() {
        return this._currentTSystemEval;
    }
    set currentTSystemEval(system) {
        this._currentTSystemEval = system;
    }

    // called by QDaggerGraph after pins are connected to see if a pin should be cloned
    shouldClonePin(pin) {
        if(pin.autoCloneMaster) {
            if(pin.isInputPin) {
                let toMax = pin.autoCloneMaster.maxAutoClone;
                if(toMax != 0) {
                    if(toMax === -1 || (pin.autoCloneMaster.autoCloneCount < toMax)) {
                        return true;
                    }
                }
            } else {
                // ensure there is only one connection if the pin is multiconnect
                if(pin.connectedTo.length === 1) {
                    let toMax = pin.autoCloneMaster.maxAutoClone;
                    if(toMax != 0) {
                        if(toMax == -1 || (pin.autoCloneMaster.autoCloneCount < toMax)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    // should only be used by deserialization - calling directly can result in duplicate pin names.
    forceCloneWithName(pin, pinName) {
        let retv = this.clonePin(pin);
        if(retv) {
            // we need to change the pin name and the name collection map
            let parentCollection = pin.parent;
    
            // if we can't change the name, we need to remove the clone
            if(!parentCollection.setPinName(retv, pinName)) {
                this.removeClonePin(pin);
                retv = null;
            }
    
        }
        return retv;
    }

    // rename pin.  Fails if pin is not flagged with canRename
    renamePin(pin, pinName) {
        if(!pin.canRename) {
            return false;
        }
    
        let parentCollection = pin.parent;
        return parentCollection.setPinName(pin, pinName);
    }

    // called by DaggerGraph after pins are connected to clone a pin
    // if forceAutoCloneMaster is not null, the pin will be cloned from forceAutoCloneMaster instead of
    // it's own autoCloneMaster property
    clonePin(pin, forceAutoCloneMaster = null) {
        if(pin.isInputPin) {
            let input = forceAutoCloneMaster ? forceAutoCloneMaster : pin.autoCloneMaster;
            if(!input) {
                return null;
            }
    
            let clonedInput = input._clone();
            if(clonedInput) {
                clonedInput.cloned(input);
                let parentCollection = pin.parent;
                if(parentCollection.addPin(clonedInput, "")) {
                    this.pinCloned.emit(clonedInput);
                    clonedInput.onCloned();
                    return clonedInput;
                } else {
                    return null;
                }
            }
        } else {
            let output = forceAutoCloneMaster ? forceAutoCloneMaster : pin.autoCloneMaster;
            if(!output) {
                return null;
            }
    
            let clonedOutput = output._clone();
            if(clonedOutput) {
                clonedOutput.cloned(output);
                let parentCollection = pin.parent;
                if(parentCollection.addPin(clonedOutput, "")) {
                    this.pinCloned.emit(clonedOutput);
                    clonedOutput.onCloned();
                    return clonedOutput;
                } else {
                    return null;
                }
            }
        }
    
        return null;
    }

    // called by QDaggerGraph after pins are disconnected to determine if an autocloned pin should be removed
    shouldRemoveClonePin(pin) {
        // does this have an autoclone master?
        if(pin.autoCloneMaster) {
            return !pin.isConnected;
        }
        return false;
    }

    // called by QDaggerGraph to remove a cloned pin (The pin that is removed might not be the one that is requested).
    removeClonePin(pin) {
        let parentCollection = pin.parent;
        if(pin.autoCloneMaster !== pin) {
            // this was a cloned pin
            return parentCollection.removePin(pin);
        } else {
            // the master clone was disconnected, so find the unconnected non-master clone and remove it
            let all = parentCollection.allNonConnectedPins;
            for(let tpin of all) {
                if(tpin !== pin && tpin.autoCloneMaster == pin.autoCloneMaster) {
                    return parentCollection.removePin(tpin);
                }
            }
        }

        return false;
    }

    // override to allow a node to be able to decide if a pin can actually be removed.  Also usefull to detect that a pin is
    // about to be removed.
    canRemovePin(pin) {
        return true;
    }

    // override to add logic for a node to respond to being parented to a graph
    addedToGraph() {}

    purgeAll() {
        super.purgeAll();
        for(let i = 0; i < DaggerTypes.MaxTopologyCount; i++) {
            if(this._inputPins[i]) {
                this._inputPins[i].purgeAll();
            }

            if(this._outputPins[i]) {
                this._outputPins[i].purgeAll();
            }

            this._descendents[i] = [];
        }

        this._outputPins = null;
        this._inputPins = null;
        this._descendents = null;
    }
}

module.exports = {
    DaggerNode: DaggerNode
};