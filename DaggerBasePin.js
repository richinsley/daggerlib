'use strict'

const DaggerBase = require('./DaggerBase.js').DaggerBase;
const DaggerSignal = require('./DaggerBase.js').DaggerSignal;
const DaggerTypes = require('./DaggerTypes.js');

class DaggerBasePin extends DaggerBase {
    constructor() {
        super();

        // the current name for the pin
        this._pinName = "";

        // the node that this pin belongs to
        this._parentNode = null;

        // flag to indicate if the pins name has been set
        this._nameset = false;

        // if false, a node can not rename the pin once the name is set
        this._canRename = false;

        // the max number of times the pin can be auto cloned.  0: never auto clone, -1: infinite autoclone, n: max autoclone count
        this._maxAutoClone = 0;

        // for a pin that is autoclone enabled, the current count of pins that have been autocloned
        this._autocloneCount = 0;

        // the total number of times a pin was auto cloned;
        this._autocloneRef = 0;

        // for pins that are auto cloned, the original pin that was used to autoclone
        this._autoCloneMaster = null;

        this._autoCloneNameTemplate = "";

        // the original name of the pin.  This remains unchanged once set, so additional renames
        // will not modify it
        this._originalName = "";

        // signals
        this.parentNodeChanged = new DaggerSignal();    // void parentNodeChanged();
        this.parentGraphChanged = new DaggerSignal();   // void parentGraphChanged();
        this.pinNameChanged = new DaggerSignal();       // void pinNameChanged();
        this.canRenameChanged = new DaggerSignal();     // void canRenameChanged();
        this.pinConnected = new DaggerSignal();         // void pinConnected(QDaggerBasePin * to);
        this.pinDisconnected = new DaggerSignal();      // void pinDisconnected(QDaggerBasePin * from);
    }

    /**
     * Enum PinDirection
     */
    static get PinDirection() {
        return {
            Unknown: "Unknown",
            Input: "Input",
            Output: "Output"
        }
    }

    get direction() { return DaggerBasePin.PinDirection.Unknown; }

    get pinName() { return this._pinName; }
    set pinName(name) {
        this._pinName = name;
        if(!this._nameSet) {
            this._nameSet = true;
            this._originalName = name;
        }
        
        // only emit pin signals if they are already parented
        if(this._parentNode) {
            this.pinNameChanged.emit();
        }
    }

    get parentNode() { return this._parentNode; }
    set parentNode(n) { this._parentNode = n; this.parentNodeChanged.emit(); }

    get isInputPin() {
        return this.direction === DaggerBasePin.PinDirection.Input;
    }

    // return the total number of times the pin was auto cloned.  Used to generate cloned pin names
    get autoCloneRefCount() {
        return this._autocloneRef;
    }

    get autoCloneCount() {
        return this._autocloneCount;
    }

    get maxAutoClone() {
        return this._maxAutoClone;
    }

    get autoCloneNameTemplate() {
        return this._autoCloneNameTemplate;
    }

    // return the index of this pin within it's pin collection (or -1 if not known)
    get index() {
        let parentCollection = this.parent;
        return parentCollection.index(this);
    }

    get autoCloneMaster() { return this._autoCloneMaster; }

    get isAutoCloned() { return (this._autoCloneMaster && (this._autoCloneMaster != this));  }

    get canRename() { return this._canRename; }
    set canRename(val) {
        this._canRename = val;
        if(this._parentNode) {
            this.canRenameChanged.emit();
        }
    }

    get topologySystem() { return this.parent.topologySystem; }

    get isConnected() { return false; }

    get originalName() { return this._originalName; }

    canConnectToPin(pin) {
        if(this.direction !== pin.direction)
            return true;
        return false;
    }

    getAutoClone() {
        return this._autoCloneMaster === this;
    }
    setAutoClone(maxAutoCloneCount, autoCloneNameTemplate) {
        this._maxAutoClone = maxAutoCloneCount;
        this._autoCloneNameTemplate = autoCloneNameTemplate;
        this._autoCloneMaster = this;
        return true;
    }

    incAutoCloneCount() {
        this._autocloneCount++; this._autocloneRef++;
    }

    decAutoCloneCount() {
        this._autocloneCount--;
    }

    genClonedNamedFromTemplate() {
        let rcount = '${this._autoCloneMaster.autoCloneRefCount}';
        let newname = this._autoCloneMaster.autoCloneNameTemplate;
        this.pinName = newname.replace('%', rcount);
    }

    // called after a pin was cloned. Override to copy needed values from the given pin.  Subclasses must always
    // call the super class.
    cloned(fromMaster) {
        this._autoCloneMaster = fromMaster;
        this._autoCloneMaster.incAutoCloneCount();
        this._canRename = fromMaster.canRename;

        // create the new name from the original auto-clonable pin
        this.genClonedNamedFromTemplate();
    }

    // called from the dagger graph when a pin that is clonable is connected. 
    // we can call new on 'this.constructor' to create a new instance of whatever
    // subclass this is.
    _clone() { return new this.constructor(); }

    // called by the pin collection when the pin is removed
    onRemoved() {}

    // called by a parent node after this pin was cloned from a master
    onCloned() {}

    purgeAll() {
        super.purgeAll();
    }
}

module.exports = {
    DaggerBasePin: DaggerBasePin
};