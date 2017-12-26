'use strict'

const DaggerBase = require('./DaggerBase.js').DaggerBase;
const DaggerSignal = require('./DaggerBase.js').DaggerSignal;
const DaggerTypes = require('./DaggerTypes.js');

/**
 * The base class for all Dagger Pins - Dagger pins represent points between two nodes that can connected
 * @extends DaggerBase
 */
class DaggerBasePin extends DaggerBase {
    /**
     * DaggerBasePin ctor
     */
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

    /**
     * Get the direction of flow this pin represents
     * @returns {DaggerBasePin.PinDirection}
     */
    get direction() { return DaggerBasePin.PinDirection.Unknown; }

    /**
     * Get the pin's name
     * @returns {string}
     */
    get pinName() { return this._pinName; }

    /**
     * Set the pin's name
     * @param {string} name
     */
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

    /**
     * Get the node this belongs to
     * @returns {DaggerNode}
     */
    get parentNode() { return this._parentNode; }

    /**
     * Set the node this pin belongs to.  This is informational only and does not re-parent the pin.
     * @param {DaggerNode} n
     */
    set parentNode(n) { this._parentNode = n; this.parentNodeChanged.emit(); }

    /**
     * Get if this is an Input pin
     * @returns {boolean}
     */
    get isInputPin() {
        return this.direction === DaggerBasePin.PinDirection.Input;
    }

    /**
     * Get the total number of times the pin was auto cloned.  Used to generate cloned pin names
     * @returns {Number}
     */
    get autoCloneRefCount() {
        return this._autocloneRef;
    }

    /**
     * Get the number of times this pin was auto-cloned
     * @returns {Number}
     */
    get autoCloneCount() {
        return this._autocloneCount;
    }

    /**
     * Get the maximum number of times this pin can be auto-cloned (or -1 for unlimited)
     * @returns {Number}
     */
    get maxAutoClone() {
        return this._maxAutoClone;
    }

    /**
     * Get the template that is used for creating a unique name for cloned pins ie. 'myPin %'
     * @returns {string}
     */
    get autoCloneNameTemplate() {
        return this._autoCloneNameTemplate;
    }

    /**
     * Get the index of this pin within it's pin collection (or -1 if not known)
     * @returns {Number}
     */
    get index() {
        let parentCollection = this.parent;
        return parentCollection.index(this);
    }

    /**
     * Get the pin that this pin will clone from when connected
     * @returns {DaggerBasePin}
     */
    get autoCloneMaster() { return this._autoCloneMaster; }

    /**
     * Get if this pin is an auto-cloned pin.
     * @returns {boolean}
     */
    get isAutoCloned() { return (this._autoCloneMaster && (this._autoCloneMaster != this));  }

    /**
     * Get if this pin can be renamed.  Pin's should rarely be allowed to be renamed as every pin in a DaggerPinCollection
     * MUST have a unique name
     * @returns {boolean}
     */
    get canRename() { return this._canRename; }

    /**
     * Set if the pin can be renamed.
     * @param {boolean} val
     */
    set canRename(val) {
        this._canRename = val;
        if(this._parentNode) {
            this.canRenameChanged.emit();
        }
    }

    /**
     * Get the topology system this pin belongs to.
     * @returns {boolean}
     */
    get topologySystem() { return this.parent.topologySystem; }

    /**
     * Get if this pin has a connection to another pin
     * @returns {boolean}
     */
    get isConnected() { return false; }

    /**
     * Get the original name of pin if the pin was renamed
     * @returns {string}
     */
    get originalName() { return this._originalName; }

    /**
     * Test if this pin can connect to the given pin
     * @param {DaggerBasePin} pin - the pin to test connectability
     * @returns {boolean}
     */
    canConnectToPin(pin) {
        if(this.direction !== pin.direction)
            return true;
        return false;
    }

    /**
     * Get if this pin auto-clones when connected
     * @returns {boolean}
     */
    getAutoClone() {
        return this._autoCloneMaster === this;
    }

    /** Set if this pin auto-clones when connected
     * @param {Number} maxAutoCloneCount - number of times the pin can be cloned (or -1 for unlimited
     * @param {string} autoCloneNameTemplate - template to use for generating a unique name for clned pins
     */
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

    /**
     * called after a pin was cloned. Override to copy needed values from the given pin.  Subclasses MUST always
     * call the super class.
     * @param {DaggerBasePin} fromMaster 
     */
    cloned(fromMaster) {
        this._autoCloneMaster = fromMaster;
        this._autoCloneMaster.incAutoCloneCount();
        this._canRename = fromMaster.canRename;

        // create the new name from the original auto-clonable pin
        this.genClonedNamedFromTemplate();
    }

    /** called from the dagger graph when a pin that is clonable is connected. 
    * we can call new on 'this.constructor' to create a new instance of whatever
    * subclass this is.
    */
    _clone() { return new this.constructor(); }

    /**
     * Called by the pin collection when the pin is removed.  Override to provide cleanup for a pin.
     */
    onRemoved() {}

    // called by a parent node after this pin was cloned from a master
    onCloned() {}

    /**
     * Clean up when object hierarchy is unraveled.  Subclasses should always super.
     */
    purgeAll() {
        super.purgeAll();
    }
}

module.exports = {
    DaggerBasePin: DaggerBasePin
};