'use strict'

const DaggerBase = require('./DaggerBase.js').DaggerBase;
const DaggerSignal = require('./DaggerBase.js').DaggerSignal;
const DaggerTypes = require('./DaggerTypes.js');

var _nodeComparer = function(n1, n2) {
    if(n1._ordinal[n1.currentTSystemEval] < n2._ordinal[n2.currentTSystemEval])
        return -1;

        if(n1._ordinal[n1.currentTSystemEval] > n2._ordinal[n2.currentTSystemEval])
        return 1;

        return 0;
}

let _recurseCalculateTopology = function(Me, level, node, touchedSet, topology_system) {
    let retv = new Set();
    if(node == null) {
        // this was from an exported output pin, so return an empty set
        return retv;
    }

    // set our precedence if level is larger than current value
    node._ordinal[topology_system] = Math.max(level, node.ordinal(topology_system));
    Me._maxOrdinal[topology_system] = Math.max(Me._maxOrdinal[topology_system], node._ordinal[topology_system]);

    // recurse through all our output pins
    let allOutPins = node.outputPins(topology_system).allPins;
    for(let output of allOutPins) {
        let ipins = output.connectedTo;
        for(let p2 of ipins) {
            // recurse through all it's connected pins
            retv = new Set([...retv, ...(_recurseCalculateTopology(Me, level + 1, p2.parentNode, touchedSet, topology_system))]);
        }
    }

    // add this node to the touched Set (we don't want to be included in our own _descendents Set)
    touchedSet.add(node);

    // recreate our _descendents List from the new set
    for(let snode of retv) {
        if(!node._descendents[topology_system].includes(snode)) {
            node._descendents[topology_system].push(snode);
        }
    }

    // sort the _descendents List by the Ordinal number.  We need to set the current eval so the
    // qsort knows which topology system we're computing
    for(let tn of node._descendents[topology_system]) {
        tn._currentTSystemEval = topology_system;
    }
    node._descendents[topology_system].sort(_nodeComparer);

    // now add this node to the newset.
    // We do this here because we don't want to include ourself in the _descendents List
    retv.add(node);

    return retv;
}

/**
 * Class that represents a collection of DaggerNodes interconnected via DaggerBasePins
 * @extends DaggerBase
 */
class DaggerGraph extends DaggerBase {
    /**
     * DaggerGraph ctor
     */
    constructor() {
        super();
        this._nodes = [];
        this._subGraphCount = [];
        this._maxOrdinal = [];

        for(let i = 0; i < DaggerTypes.MaxTopologyCount; i++) {
            this._subGraphCount[i] = 0;
            this._maxOrdinal[i] = 0;
        }

        // signals
        this.pinsDisconnected = new DaggerSignal();
        this.pinsConnected = new DaggerSignal();
        this.nodeRemoved = new DaggerSignal();
        this.nodeAdded = new DaggerSignal();
        this.topologyChanged = new DaggerSignal();

        // init topology
        this.calculateTopology();
    }

    /**
     * Get list of all nodes that have no connected input pins with the given topology
     * @param {Number} topology_system 
     */
    topLevelNodes(topology_system = 0) {
        let retv = [];
        for(let node of this._nodes) {
            if(node.isTopLevel(topology_system))
            {
                retv.push(node);
            }
        }
        return retv;
    }

    /**
     * Called internally every time an action alters the topology of the graph.
     */
    calculateTopology() {
        for(let t = 0; t < DaggerTypes.MaxTopologyCount; t++) {
            this._maxOrdinal[t] = 0;

            // reset all presidence values and subgraph affiliations to -1
            for(let i = 0; i < this._nodes.length; i++) {
                let node = this._nodes[i];
                node._ordinal[t] = -1;
                node._subgraphAffiliation[t] = -1;
                node._descendents[t] = [];
            }

            // get the top level nodes
            let tnodes = this.topLevelNodes(t);

            // Create a List of Sets. Each Set will hold a List of all Nodes that a top level Node touches on it's way to bottom level Nodes.
            // We'll in turn use these Sets to calculate subgraph affiliations.
            let touchedSetList = [];

            for(let i = 0; i < tnodes.length; i++) {
                let node = tnodes[i];

                // top level nodes always have an Ordinal of 0
                node._ordinal[t] = 0;

                // create a "touched" Set
                let touchedSet = new Set();

                let allOutPins = node.outputPins(t).allPins;
                for(let output of allOutPins) {
                    let connectedToPins = output.connectedTo;

                    for(let inpin of connectedToPins) {
                        // recurse through all it's connected pins
                        let newset = _recurseCalculateTopology(this, 1, inpin.parentNode, touchedSet, t);

                        // recreate our _descendents List from the newset
                        for(let setnode of newset) {
                            if(!node._descendents[t].includes(setnode)) {
                                node._descendents[t].push(setnode);
                            }
                        }

                        // sort the _descendents List by the Ordinal number
                        for(let tn of node._descendents[t]) {
                            tn._currentTSystemEval = t;
                        }
                        node._descendents[t].sort(_nodeComparer);
                    }
                }

                // all top level nodes touch themselves <Let's keep it professional here>
                touchedSet.add(node);

                // since we always have at least one subgraph, just add the first touched set to the list of sets
                if(i == 0) {
                    touchedSetList.push(touchedSet);
                } else {
                    // if not the first Set, see if we can merge this Set with an existing touched Set
                    let merged = false;
                    for(let u = 0; u < touchedSetList.length; u++) {
                        // get the intersection of touchedSet and touchedSetList[u]
                        let intersection = new Set([...touchedSet].filter(x => touchedSetList[u].has(x)));

                        // if the Cardinalty of the intersected Set is NOT zero, then these two Sets share the same subgraph
                        if(intersection.length > 0) {
                            // merge the new Set with the stored one
                            touchedSetList[u] = new Set([...touchedSetList[u], ...touchedSet]);
                            merged = true;
                            break;
                        }
                    }

                    if(!merged) {
                        // we didn't find a Stored Set to merge with, so store this Set
                        touchedSetList.push(touchedSet);
                    }
                }
            }

            // scrub through all the sets and mark the Subgraph tag of each node
            for(let i = 0; i < touchedSetList.length; i++) {
                for(let node of touchedSetList[i]) {
                    node._subgraphAffiliation[t] = i;
                }
            }

            // let the graph know how many subgraphs it has
            this._subGraphCount[t] = touchedSetList.length;
        }

        // anounce the topology has changed
        this.graphTopologyChanged();
        this.topologyChanged.emit();
    }

    /**
     * Get all the nodes in the graph
     * @returns {array}
     */
    get nodes() {
        return this._nodes.slice();
    }

    /**
     * Get the highest ordinal for the given topology system
     * @param {Number} topology_system 
     * @returns {Number}
     */
    maxOrdinal(topology_system = 0) {
        return this._maxOrdinal[topology_system];
    }

    /**
     * Get the number of subgraphs in the DaggerGraph
     * @param {Number} topology_system 
     * @returns {Number}
     */
    subGraphCount(topology_system = 0) {
        return  this._subGraphCount[topology_system]
    }

    /**
     * Called before two pins are disconnected to test if they are currently allowed to disconnect.  Override to
     * provide logic for cases when pins are not allowed to disconnect (ie, data is being processed).  If the method
     * returns false, the pins will fail to disconnect.
     * @param {DaggerBasePin} connectFrom 
     * @param {DaggerBasePin} connectTo 
     * @returns {boolean}
     */
    beforePinsConnected(connectFrom, connectTo) {
        return true;
    }
    
    /**
     * Called after two pins are connected to test if either needs to be cloned.
     * @param {DaggerBasePin} connectFrom 
     * @param {DaggerBasePin} connectTo 
     */
    afterPinsConnected(connectFrom, connectTo) {
        // see if we should clone the output pin
        if(connectFrom.parentNode.shouldClonePin(connectFrom)) {
            if(!connectFrom.parentNode.clonePin(connectFrom)) {
                // emitError("failed to autoclone pin");
            }
        }
    
        // see if we should clone the input pin
        if(connectTo.parentNode.shouldClonePin(connectTo)) {
            if(!connectTo.parentNode.clonePin(connectTo)) {
                // emitError("failed to autoclone pin");
            }
        }
    }
    
    /**
     * Get list of all nodes that have no connected input pins
     * @param {Number} topology_system
     * @returns {array}
     */
    topLevelNodes(topology_system = 0) {
        let retv = [];
        for(let node of this._nodes) {
            if(node.isTopLevel(topology_system)) {
                retv.push(node);
            }
        }
        return retv;
    }
    
    /**
     * Get list of all nodes that have no connected output pins
     * @param {Number} topology_system
     * @returns {array}
     */
    bottomLevelNodes(topology_system = 0)
    {
        let retv = [];
        for(let node of this._nodes) {
            if(node.isBottomLevel(topology_system)) {
                retv.push(node);
            }
        }
        return retv;
    }
    
    /**
     * Returns a list of nodes in a certain subgraph with the given topology system
     * @param {Number} index 
     * @param {Number} topology_system
     * @returns {array} 
     */
    getSubGraphNodes(index, topology_system = 0) {
        let retv = [];
        if(index > this._subGraphCount[topology_system] - 1) {
            // emitError("Subgraph index out of range");
            return retv;
        }
    
        for(let node of this._nodes) {
            if(index == node.subgraphAffiliation(topology_system)) {
                retv.push(node);
            }
        }
        return retv;
    }
    
    /**
     * Return an array containing arrays of nodes for each subgraph in the graph
     * @param {Number} topology_system
     * @returns {array} 
     */
    getSubGraphs(topology_system = 0) {
        let retv = [];
        for(let i = 0; i < this._subGraphCount[topology_system]; i++) {
            retv.push(getSubGraphNodes(i, topology_system));
        }
        return retv;
    }
    
    /**
     * Get a list of all nodes with the given name.
     * @param {string} name
     * @returns {array} 
     */
    getNodesWithName(name) {
        let retv = [];
        for(let node of this._nodes) {
            if(node.name == name) {
                retv.push(node);
            }
        }
        return retv;
    }
    
    /**
     * Find and return a pin that has the given instanceID
     * @param {string} pinInstanceID 
     * @returns {DaggerBasePin}
     */
    getPinWithInstanceID(pinInstanceID) {
        for(let node of this._nodes) {
            for(let i = 0; i < DaggerTypes.MaxTopologyCount; i++) {
                // look in the input pins
                let retv = node.inputPins(i).getPinWithInstanceID(pinInstanceID);
                if(retv) {
                    return retv;
                }
    
                // look in the output pins
                retv = node.outputPins(i).getPinWithInstanceID(pinInstanceID);
                if(retv) {
                    return retv;
                }
            }
        }
        return null;
    }
    
    /**
     * Find and return a node with the given instanceID
     * @param {string} nodeInstanceID 
     * @returns {DaggerNode}
     */
    getNodeWithInstanceID(nodeInstanceID) {
        for(let node of this._nodes) {
            if(node.instanceID == nodeInstanceID)
                return node;
        }
        return null;
    }
    
    /**
     * Get an array of all DaggerInputPins that are connected
     * @param {number} topology_system 
     * @returns {array}
     */
    allConnections(topology_system = 0) {
        let retv = [];
        for(let node of this._nodes) {
            let pins = node.inputPins(topology_system).allPins;
            for(let pin of pins) {
                if(pin && pin.isConnected) {
                    retv.push(ipin);
                }
            }
        }
        return retv;
    }
    
    /**
     * Remove a node from the graph.  If the node has any connections, they are disconnected first
     * @param {DaggerNode} node 
     * @returns {boolean}
     */
    removeNode(node) {
        if(!node) {
            return false;
        }
    
        if(this.beforeNodeRemoved(node)) {
            // try to disconnect all pins
            if(!node.disconnectAllPins()) {
                // emitError("failed to remove node");
                return false;
            }
    
            // remove and destroy the node
            this._nodes.splice(this._nodes.indexOf(node), 1);;
            node.purgeAll();
    
            this.nodeRemoved.emit(node.instanceUUID);
    
            // mark node as delete later so the signal can be processed with a live pointer to it
            node._parentGraph = null; // this node is no longer ours
    
            // recalc topology
            this.calculateTopology();
    
            return true;
        }
        return false;
    }
    
    /**
     * Add a node to the graph
     * @param {DaggerNode} node
     * @returns {boolean} 
     */
    addNode(node) {
        if(node.parentGraph != null) {
            // emitError("QDaggerNode is already associated with a QDaggerGraph");
            return null;
        }
    
        node.beforeAddedToGraph.emit(); // tell the node to signal that the node is about to be added to a graph
        node._parentGraph = this;
        this._nodes.push(node);
        this.calculateTopology();
        this.nodeAdded.emit(node);
        node.addedToGraph(); // tell the node to signal that it was added to a graph
        node.afterAddedToGraph.emit();
        return node;
    }
    
    beforeNodeRemoved(node) {
        return true;
    }
    
    beforePinsDisconnected(connectFrom, connectTo) {
        return true;
    }
    
    afterPinsDisconnected(connectFrom, connectTo) {
        // see if we should clone the output pin
        if(connectFrom.parentNode.shouldRemoveClonePin(connectFrom)) {
            if(!connectFrom.parentNode.removeClonePin(connectFrom)) {
                // emitError("failed to remove autocloned pin");
            }
        }
    
        // see if we should clone the input pin
        if(connectTo.parentNode.shouldRemoveClonePin(connectTo)){
            if(!connectTo.parentNode.removeClonePin(connectTo)) {
                // emitError("failed to remove autocloned pin");
            }
        }
    }
    
    onPinsDisconnected(disconnectOutput, disconnectInput) {
        this.calculateTopology();
        this.pinsDisconnected.emit(disconnectOutput.instanceID, disconnectInput.instanceID);
    }
    
    onPinsConnected(connectFrom, connectTo) {
        this.calculateTopology();
        this.pinsConnected.emit(connectFrom, connectTo);
    }

    // called when topology has changed.
    graphTopologyChanged() {}
}

module.exports = {
    DaggerGraph: DaggerGraph
};