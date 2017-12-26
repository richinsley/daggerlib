## Classes

<dl>
<dt><a href="#DaggerBase">DaggerBase</a></dt>
<dd><p>Base class for all Dagger objects.</p>
</dd>
<dt><a href="#DaggerSignal">DaggerSignal</a></dt>
<dd><p>This class acts as a simple emulation of the Qt signal/slot pattern.  Objects
derived from DaggerBase expose these as properties that can be connected to with callbacks (slots)
to respond to certain Dagger events.</p>
</dd>
<dt><a href="#DaggerBasePin">DaggerBasePin</a> ⇐ <code><a href="#DaggerBase">DaggerBase</a></code></dt>
<dd><p>The base class for all Dagger Pins - Dagger pins represent points between two nodes that can connected</p>
</dd>
<dt><a href="#DaggerGraph">DaggerGraph</a> ⇐ <code><a href="#DaggerBase">DaggerBase</a></code></dt>
<dd><p>Class that represents a collection of DaggerNodes interconnected via DaggerBasePins</p>
</dd>
<dt><a href="#DaggerInputPin">DaggerInputPin</a> ⇐ <code><a href="#DaggerBasePin">DaggerBasePin</a></code></dt>
<dd><p>Class that represents a directed input into a DaggerNode</p>
</dd>
<dt><a href="#DaggerNode">DaggerNode</a> ⇐ <code><a href="#DaggerBase">DaggerBase</a></code></dt>
<dd><p>Class that represents a node (or vertex) which is the fundamental unit of which DaggerGraphs are formed.  A DaggerNode
can be shared with multiple topologies with each topology having two DaggerPinCollections per node (one for each direction).</p>
</dd>
<dt><a href="#DaggerOutputPin">DaggerOutputPin</a> ⇐ <code><a href="#DaggerBasePin">DaggerBasePin</a></code></dt>
<dd><p>Class that represents a directed output out of a DaggerNode</p>
</dd>
<dt><a href="#DaggerPinCollection">DaggerPinCollection</a> ⇐ <code><a href="#DaggerBase">DaggerBase</a></code></dt>
<dd><p>Class that acts as a container for pins of one particular direction.</p>
</dd>
</dl>

<a name="DaggerBase"></a>

## DaggerBase
Base class for all Dagger objects.

**Kind**: global class  

* [DaggerBase](#DaggerBase)
    * [new DaggerBase()](#new_DaggerBase_new)
    * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
    * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
    * [.parent](#DaggerBase+parent)

<a name="new_DaggerBase_new"></a>

### new DaggerBase()
DaggerBase ctor

<a name="DaggerBase+instanceID"></a>

### daggerBase.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerBase</code>](#DaggerBase)  
<a name="DaggerBase+parent"></a>

### daggerBase.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerBase</code>](#DaggerBase)  
<a name="DaggerBase+parent"></a>

### daggerBase.parent
Set the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerBase</code>](#DaggerBase)  

| Param | Type |
| --- | --- |
| p | [<code>DaggerBase</code>](#DaggerBase) | 

<a name="DaggerSignal"></a>

## DaggerSignal
This class acts as a simple emulation of the Qt signal/slot pattern.  Objects
derived from DaggerBase expose these as properties that can be connected to with callbacks (slots)
to respond to certain Dagger events.

**Kind**: global class  

* [DaggerSignal](#DaggerSignal)
    * [new DaggerSignal(implementation)](#new_DaggerSignal_new)
    * [.connect(slot)](#DaggerSignal+connect)
    * [.disconnect(slot)](#DaggerSignal+disconnect)
    * [.disconnectAll()](#DaggerSignal+disconnectAll)
    * [.emit()](#DaggerSignal+emit)

<a name="new_DaggerSignal_new"></a>

### new DaggerSignal(implementation)
DaggerSignal ctor


| Param | Type |
| --- | --- |
| implementation | <code>\*</code> | 

**Example**  
```js
var nodeAddedSlot = function (nodeID) {
  console.log("node added to graph" + nodeID);
  // now disconnect the slot
  graph.nodeAdded.disconnect(nodeAddedSlot);
 }
graph.nodeAdded.connect(nodeAddedSlot);
```
**Example**  
```js
var nodeAddedSlot = function (nodeID) {
 console.log("slot node added " + nodeID);
}

// calling connect on the signal will return a reference to
// the signal that one can call disconnect on directly when no
// longer needed:
var mysignal = graph.nodeAdded.connect(nodeAddedSlot);

// when not needed, call disconnect on the sig object
mysignal.disconnect();
```
<a name="DaggerSignal+connect"></a>

### daggerSignal.connect(slot)
Add a connection callback

**Kind**: instance method of [<code>DaggerSignal</code>](#DaggerSignal)  

| Param | Type |
| --- | --- |
| slot | <code>function</code> | 

<a name="DaggerSignal+disconnect"></a>

### daggerSignal.disconnect(slot)
Remove a connection callback

**Kind**: instance method of [<code>DaggerSignal</code>](#DaggerSignal)  

| Param | Type |
| --- | --- |
| slot | <code>function</code> | 

<a name="DaggerSignal+disconnectAll"></a>

### daggerSignal.disconnectAll()
Remova all connection callbacks

**Kind**: instance method of [<code>DaggerSignal</code>](#DaggerSignal)  
<a name="DaggerSignal+emit"></a>

### daggerSignal.emit()
Signal all connected callbacks

**Kind**: instance method of [<code>DaggerSignal</code>](#DaggerSignal)  
<a name="DaggerBasePin"></a>

## DaggerBasePin ⇐ [<code>DaggerBase</code>](#DaggerBase)
The base class for all Dagger Pins - Dagger pins represent points between two nodes that can connected

**Kind**: global class  
**Extends**: [<code>DaggerBase</code>](#DaggerBase)  

* [DaggerBasePin](#DaggerBasePin) ⇐ [<code>DaggerBase</code>](#DaggerBase)
    * [new DaggerBasePin()](#new_DaggerBasePin_new)
    * _instance_
        * [.direction](#DaggerBasePin+direction) ⇒ [<code>PinDirection</code>](#DaggerBasePin.PinDirection)
        * [.pinName](#DaggerBasePin+pinName) ⇒ <code>string</code>
        * [.pinName](#DaggerBasePin+pinName)
        * [.parentNode](#DaggerBasePin+parentNode) ⇒ [<code>DaggerNode</code>](#DaggerNode)
        * [.parentNode](#DaggerBasePin+parentNode)
        * [.isInputPin](#DaggerBasePin+isInputPin) ⇒ <code>boolean</code>
        * [.autoCloneRefCount](#DaggerBasePin+autoCloneRefCount) ⇒ <code>Number</code>
        * [.autoCloneCount](#DaggerBasePin+autoCloneCount) ⇒ <code>Number</code>
        * [.maxAutoClone](#DaggerBasePin+maxAutoClone) ⇒ <code>Number</code>
        * [.autoCloneNameTemplate](#DaggerBasePin+autoCloneNameTemplate) ⇒ <code>string</code>
        * [.index](#DaggerBasePin+index) ⇒ <code>Number</code>
        * [.autoCloneMaster](#DaggerBasePin+autoCloneMaster) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
        * [.isAutoCloned](#DaggerBasePin+isAutoCloned) ⇒ <code>boolean</code>
        * [.canRename](#DaggerBasePin+canRename) ⇒ <code>boolean</code>
        * [.canRename](#DaggerBasePin+canRename)
        * [.topologySystem](#DaggerBasePin+topologySystem) ⇒ <code>boolean</code>
        * [.isConnected](#DaggerBasePin+isConnected) ⇒ <code>boolean</code>
        * [.originalName](#DaggerBasePin+originalName) ⇒ <code>string</code>
        * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
        * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
        * [.canConnectToPin(pin)](#DaggerBasePin+canConnectToPin) ⇒ <code>boolean</code>
        * [.getAutoClone()](#DaggerBasePin+getAutoClone) ⇒ <code>boolean</code>
        * [.setAutoClone(maxAutoCloneCount, autoCloneNameTemplate)](#DaggerBasePin+setAutoClone)
        * [.cloned(fromMaster)](#DaggerBasePin+cloned)
        * [._clone()](#DaggerBasePin+_clone)
        * [.onRemoved()](#DaggerBasePin+onRemoved)
        * [.purgeAll()](#DaggerBasePin+purgeAll)
    * _static_
        * [.PinDirection](#DaggerBasePin.PinDirection)

<a name="new_DaggerBasePin_new"></a>

### new DaggerBasePin()
DaggerBasePin ctor

<a name="DaggerBasePin+direction"></a>

### daggerBasePin.direction ⇒ [<code>PinDirection</code>](#DaggerBasePin.PinDirection)
Get the direction of flow this pin represents

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+pinName"></a>

### daggerBasePin.pinName ⇒ <code>string</code>
Get the pin's name

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+pinName"></a>

### daggerBasePin.pinName
Set the pin's name

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="DaggerBasePin+parentNode"></a>

### daggerBasePin.parentNode ⇒ [<code>DaggerNode</code>](#DaggerNode)
Get the node this belongs to

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+parentNode"></a>

### daggerBasePin.parentNode
Set the node this pin belongs to.  This is informational only and does not re-parent the pin.

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  

| Param | Type |
| --- | --- |
| n | [<code>DaggerNode</code>](#DaggerNode) | 

<a name="DaggerBasePin+isInputPin"></a>

### daggerBasePin.isInputPin ⇒ <code>boolean</code>
Get if this is an Input pin

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+autoCloneRefCount"></a>

### daggerBasePin.autoCloneRefCount ⇒ <code>Number</code>
Get the total number of times the pin was auto cloned.  Used to generate cloned pin names

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+autoCloneCount"></a>

### daggerBasePin.autoCloneCount ⇒ <code>Number</code>
Get the number of times this pin was auto-cloned

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+maxAutoClone"></a>

### daggerBasePin.maxAutoClone ⇒ <code>Number</code>
Get the maximum number of times this pin can be auto-cloned (or -1 for unlimited)

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+autoCloneNameTemplate"></a>

### daggerBasePin.autoCloneNameTemplate ⇒ <code>string</code>
Get the template that is used for creating a unique name for cloned pins ie. 'myPin %'

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+index"></a>

### daggerBasePin.index ⇒ <code>Number</code>
Get the index of this pin within it's pin collection (or -1 if not known)

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+autoCloneMaster"></a>

### daggerBasePin.autoCloneMaster ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
Get the pin that this pin will clone from when connected

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+isAutoCloned"></a>

### daggerBasePin.isAutoCloned ⇒ <code>boolean</code>
Get if this pin is an auto-cloned pin.

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+canRename"></a>

### daggerBasePin.canRename ⇒ <code>boolean</code>
Get if this pin can be renamed.  Pin's should rarely be allowed to be renamed as every pin in a DaggerPinCollection
MUST have a unique name

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+canRename"></a>

### daggerBasePin.canRename
Set if the pin can be renamed.

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  

| Param | Type |
| --- | --- |
| val | <code>boolean</code> | 

<a name="DaggerBasePin+topologySystem"></a>

### daggerBasePin.topologySystem ⇒ <code>boolean</code>
Get the topology system this pin belongs to.

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+isConnected"></a>

### daggerBasePin.isConnected ⇒ <code>boolean</code>
Get if this pin has a connection to another pin

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+originalName"></a>

### daggerBasePin.originalName ⇒ <code>string</code>
Get the original name of pin if the pin was renamed

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBase+instanceID"></a>

### daggerBasePin.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBase+parent"></a>

### daggerBasePin.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
**Overrides**: [<code>parent</code>](#DaggerBase+parent)  
<a name="DaggerBasePin+canConnectToPin"></a>

### daggerBasePin.canConnectToPin(pin) ⇒ <code>boolean</code>
Test if this pin can connect to the given pin

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  

| Param | Type | Description |
| --- | --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | the pin to test connectability |

<a name="DaggerBasePin+getAutoClone"></a>

### daggerBasePin.getAutoClone() ⇒ <code>boolean</code>
Get if this pin auto-clones when connected

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+setAutoClone"></a>

### daggerBasePin.setAutoClone(maxAutoCloneCount, autoCloneNameTemplate)
Set if this pin auto-clones when connected

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  

| Param | Type | Description |
| --- | --- | --- |
| maxAutoCloneCount | <code>Number</code> | number of times the pin can be cloned (or -1 for unlimited |
| autoCloneNameTemplate | <code>string</code> | template to use for generating a unique name for clned pins |

<a name="DaggerBasePin+cloned"></a>

### daggerBasePin.cloned(fromMaster)
called after a pin was cloned. Override to copy needed values from the given pin.  Subclasses MUST always
call the super class.

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  

| Param | Type |
| --- | --- |
| fromMaster | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerBasePin+_clone"></a>

### daggerBasePin._clone()
called from the dagger graph when a pin that is clonable is connected. 
we can call new on 'this.constructor' to create a new instance of whatever
subclass this is.

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+onRemoved"></a>

### daggerBasePin.onRemoved()
Called by the pin collection when the pin is removed.  Override to provide cleanup for a pin.

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin+purgeAll"></a>

### daggerBasePin.purgeAll()
Clean up when object hierarchy is unraveled.  Subclasses should always super.

**Kind**: instance method of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerBasePin.PinDirection"></a>

### DaggerBasePin.PinDirection
Enum PinDirection

**Kind**: static property of [<code>DaggerBasePin</code>](#DaggerBasePin)  
<a name="DaggerGraph"></a>

## DaggerGraph ⇐ [<code>DaggerBase</code>](#DaggerBase)
Class that represents a collection of DaggerNodes interconnected via DaggerBasePins

**Kind**: global class  
**Extends**: [<code>DaggerBase</code>](#DaggerBase)  

* [DaggerGraph](#DaggerGraph) ⇐ [<code>DaggerBase</code>](#DaggerBase)
    * [new DaggerGraph()](#new_DaggerGraph_new)
    * [.nodes](#DaggerGraph+nodes) ⇒ <code>array</code>
    * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
    * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
    * [.topLevelNodes(topology_system)](#DaggerGraph+topLevelNodes)
    * [.calculateTopology()](#DaggerGraph+calculateTopology)
    * [.maxOrdinal(topology_system)](#DaggerGraph+maxOrdinal) ⇒ <code>Number</code>
    * [.subGraphCount(topology_system)](#DaggerGraph+subGraphCount) ⇒ <code>Number</code>
    * [.beforePinsConnected(connectFrom, connectTo)](#DaggerGraph+beforePinsConnected) ⇒ <code>boolean</code>
    * [.afterPinsConnected(connectFrom, connectTo)](#DaggerGraph+afterPinsConnected)
    * [.topLevelNodes(topology_system)](#DaggerGraph+topLevelNodes) ⇒ <code>array</code>
    * [.bottomLevelNodes(topology_system)](#DaggerGraph+bottomLevelNodes) ⇒ <code>array</code>
    * [.getSubGraphNodes(index, topology_system)](#DaggerGraph+getSubGraphNodes) ⇒ <code>array</code>
    * [.getSubGraphs(topology_system)](#DaggerGraph+getSubGraphs) ⇒ <code>array</code>
    * [.getNodesWithName(name)](#DaggerGraph+getNodesWithName) ⇒ <code>array</code>
    * [.getPinWithInstanceID(pinInstanceID)](#DaggerGraph+getPinWithInstanceID) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [.getNodeWithInstanceID(nodeInstanceID)](#DaggerGraph+getNodeWithInstanceID) ⇒ [<code>DaggerNode</code>](#DaggerNode)
    * [.allConnections(topology_system)](#DaggerGraph+allConnections) ⇒ <code>array</code>
    * [.removeNode(node)](#DaggerGraph+removeNode) ⇒ <code>boolean</code>
    * [.addNode(node)](#DaggerGraph+addNode) ⇒ <code>boolean</code>

<a name="new_DaggerGraph_new"></a>

### new DaggerGraph()
DaggerGraph ctor

<a name="DaggerGraph+nodes"></a>

### daggerGraph.nodes ⇒ <code>array</code>
Get all the nodes in the graph

**Kind**: instance property of [<code>DaggerGraph</code>](#DaggerGraph)  
<a name="DaggerBase+instanceID"></a>

### daggerGraph.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerGraph</code>](#DaggerGraph)  
<a name="DaggerBase+parent"></a>

### daggerGraph.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerGraph</code>](#DaggerGraph)  
**Overrides**: [<code>parent</code>](#DaggerBase+parent)  
<a name="DaggerGraph+topLevelNodes"></a>

### daggerGraph.topLevelNodes(topology_system)
Get list of all nodes that have no connected input pins with the given topology

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+calculateTopology"></a>

### daggerGraph.calculateTopology()
Called internally every time an action alters the topology of the graph.

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  
<a name="DaggerGraph+maxOrdinal"></a>

### daggerGraph.maxOrdinal(topology_system) ⇒ <code>Number</code>
Get the highest ordinal for the given topology system

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+subGraphCount"></a>

### daggerGraph.subGraphCount(topology_system) ⇒ <code>Number</code>
Get the number of subgraphs in the DaggerGraph

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+beforePinsConnected"></a>

### daggerGraph.beforePinsConnected(connectFrom, connectTo) ⇒ <code>boolean</code>
Called before two pins are disconnected to test if they are currently allowed to disconnect.  Override to
provide logic for cases when pins are not allowed to disconnect (ie, data is being processed).  If the method
returns false, the pins will fail to disconnect.

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| connectFrom | [<code>DaggerBasePin</code>](#DaggerBasePin) | 
| connectTo | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerGraph+afterPinsConnected"></a>

### daggerGraph.afterPinsConnected(connectFrom, connectTo)
Called after two pins are connected to test if either needs to be cloned.

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| connectFrom | [<code>DaggerBasePin</code>](#DaggerBasePin) | 
| connectTo | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerGraph+topLevelNodes"></a>

### daggerGraph.topLevelNodes(topology_system) ⇒ <code>array</code>
Get list of all nodes that have no connected input pins

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+bottomLevelNodes"></a>

### daggerGraph.bottomLevelNodes(topology_system) ⇒ <code>array</code>
Get list of all nodes that have no connected output pins

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+getSubGraphNodes"></a>

### daggerGraph.getSubGraphNodes(index, topology_system) ⇒ <code>array</code>
Returns a list of nodes in a certain subgraph with the given topology system

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| index | <code>Number</code> |  | 
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+getSubGraphs"></a>

### daggerGraph.getSubGraphs(topology_system) ⇒ <code>array</code>
Return an array containing arrays of nodes for each subgraph in the graph

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>Number</code> | <code>0</code> | 

<a name="DaggerGraph+getNodesWithName"></a>

### daggerGraph.getNodesWithName(name) ⇒ <code>array</code>
Get a list of all nodes with the given name.

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| name | <code>string</code> | 

<a name="DaggerGraph+getPinWithInstanceID"></a>

### daggerGraph.getPinWithInstanceID(pinInstanceID) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
Find and return a pin that has the given instanceID

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| pinInstanceID | <code>string</code> | 

<a name="DaggerGraph+getNodeWithInstanceID"></a>

### daggerGraph.getNodeWithInstanceID(nodeInstanceID) ⇒ [<code>DaggerNode</code>](#DaggerNode)
Find and return a node with the given instanceID

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| nodeInstanceID | <code>string</code> | 

<a name="DaggerGraph+allConnections"></a>

### daggerGraph.allConnections(topology_system) ⇒ <code>array</code>
Get an array of all DaggerInputPins that are connected

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerGraph+removeNode"></a>

### daggerGraph.removeNode(node) ⇒ <code>boolean</code>
Remove a node from the graph.  If the node has any connections, they are disconnected first

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| node | [<code>DaggerNode</code>](#DaggerNode) | 

<a name="DaggerGraph+addNode"></a>

### daggerGraph.addNode(node) ⇒ <code>boolean</code>
Add a node to the graph

**Kind**: instance method of [<code>DaggerGraph</code>](#DaggerGraph)  

| Param | Type |
| --- | --- |
| node | [<code>DaggerNode</code>](#DaggerNode) | 

<a name="DaggerInputPin"></a>

## DaggerInputPin ⇐ [<code>DaggerBasePin</code>](#DaggerBasePin)
Class that represents a directed input into a DaggerNode

**Kind**: global class  
**Extends**: [<code>DaggerBasePin</code>](#DaggerBasePin)  

* [DaggerInputPin](#DaggerInputPin) ⇐ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [new DaggerInputPin()](#new_DaggerInputPin_new)
    * [.direction](#DaggerInputPin+direction) ⇒ <code>DaggerBasePin.PinDirection.Input</code>
    * [.connectedTo](#DaggerInputPin+connectedTo) ⇒ [<code>DaggerOutputPin</code>](#DaggerOutputPin)
    * [.connectedToUUID](#DaggerInputPin+connectedToUUID) ⇒ <code>string</code>
    * [.isConnected](#DaggerInputPin+isConnected) ⇒ <code>boolean</code>
    * [.pinName](#DaggerBasePin+pinName) ⇒ <code>string</code>
    * [.parentNode](#DaggerBasePin+parentNode) ⇒ [<code>DaggerNode</code>](#DaggerNode)
    * [.isInputPin](#DaggerBasePin+isInputPin) ⇒ <code>boolean</code>
    * [.autoCloneRefCount](#DaggerBasePin+autoCloneRefCount) ⇒ <code>Number</code>
    * [.autoCloneCount](#DaggerBasePin+autoCloneCount) ⇒ <code>Number</code>
    * [.maxAutoClone](#DaggerBasePin+maxAutoClone) ⇒ <code>Number</code>
    * [.autoCloneNameTemplate](#DaggerBasePin+autoCloneNameTemplate) ⇒ <code>string</code>
    * [.index](#DaggerBasePin+index) ⇒ <code>Number</code>
    * [.autoCloneMaster](#DaggerBasePin+autoCloneMaster) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [.isAutoCloned](#DaggerBasePin+isAutoCloned) ⇒ <code>boolean</code>
    * [.canRename](#DaggerBasePin+canRename) ⇒ <code>boolean</code>
    * [.topologySystem](#DaggerBasePin+topologySystem) ⇒ <code>boolean</code>
    * [.originalName](#DaggerBasePin+originalName) ⇒ <code>string</code>
    * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
    * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
    * [.canConnectToPin(pin)](#DaggerInputPin+canConnectToPin)
    * [.disconnectPin(forceDisconnect)](#DaggerInputPin+disconnectPin)
    * [.purgeAll()](#DaggerInputPin+purgeAll)
    * [.getAutoClone()](#DaggerBasePin+getAutoClone) ⇒ <code>boolean</code>
    * [.setAutoClone(maxAutoCloneCount, autoCloneNameTemplate)](#DaggerBasePin+setAutoClone)
    * [.cloned(fromMaster)](#DaggerBasePin+cloned)
    * [._clone()](#DaggerBasePin+_clone)
    * [.onRemoved()](#DaggerBasePin+onRemoved)

<a name="new_DaggerInputPin_new"></a>

### new DaggerInputPin()
DaggerInputPin ctor

<a name="DaggerInputPin+direction"></a>

### daggerInputPin.direction ⇒ <code>DaggerBasePin.PinDirection.Input</code>
Get the pin's direction

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>direction</code>](#DaggerBasePin+direction)  
<a name="DaggerInputPin+connectedTo"></a>

### daggerInputPin.connectedTo ⇒ [<code>DaggerOutputPin</code>](#DaggerOutputPin)
Get the DaggerOutputPin this pin is connected to

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerInputPin+connectedToUUID"></a>

### daggerInputPin.connectedToUUID ⇒ <code>string</code>
Get the instance ID of the DaggerOutputPin this pin is connected to.

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerInputPin+isConnected"></a>

### daggerInputPin.isConnected ⇒ <code>boolean</code>
Get if this pin is connected

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>isConnected</code>](#DaggerBasePin+isConnected)  
<a name="DaggerBasePin+pinName"></a>

### daggerInputPin.pinName ⇒ <code>string</code>
Get the pin's name

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>pinName</code>](#DaggerBasePin+pinName)  
<a name="DaggerBasePin+parentNode"></a>

### daggerInputPin.parentNode ⇒ [<code>DaggerNode</code>](#DaggerNode)
Get the node this belongs to

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>parentNode</code>](#DaggerBasePin+parentNode)  
<a name="DaggerBasePin+isInputPin"></a>

### daggerInputPin.isInputPin ⇒ <code>boolean</code>
Get if this is an Input pin

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+autoCloneRefCount"></a>

### daggerInputPin.autoCloneRefCount ⇒ <code>Number</code>
Get the total number of times the pin was auto cloned.  Used to generate cloned pin names

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+autoCloneCount"></a>

### daggerInputPin.autoCloneCount ⇒ <code>Number</code>
Get the number of times this pin was auto-cloned

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+maxAutoClone"></a>

### daggerInputPin.maxAutoClone ⇒ <code>Number</code>
Get the maximum number of times this pin can be auto-cloned (or -1 for unlimited)

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+autoCloneNameTemplate"></a>

### daggerInputPin.autoCloneNameTemplate ⇒ <code>string</code>
Get the template that is used for creating a unique name for cloned pins ie. 'myPin %'

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+index"></a>

### daggerInputPin.index ⇒ <code>Number</code>
Get the index of this pin within it's pin collection (or -1 if not known)

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+autoCloneMaster"></a>

### daggerInputPin.autoCloneMaster ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
Get the pin that this pin will clone from when connected

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+isAutoCloned"></a>

### daggerInputPin.isAutoCloned ⇒ <code>boolean</code>
Get if this pin is an auto-cloned pin.

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+canRename"></a>

### daggerInputPin.canRename ⇒ <code>boolean</code>
Get if this pin can be renamed.  Pin's should rarely be allowed to be renamed as every pin in a DaggerPinCollection
MUST have a unique name

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>canRename</code>](#DaggerBasePin+canRename)  
<a name="DaggerBasePin+topologySystem"></a>

### daggerInputPin.topologySystem ⇒ <code>boolean</code>
Get the topology system this pin belongs to.

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+originalName"></a>

### daggerInputPin.originalName ⇒ <code>string</code>
Get the original name of pin if the pin was renamed

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBase+instanceID"></a>

### daggerInputPin.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBase+parent"></a>

### daggerInputPin.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerInputPin+canConnectToPin"></a>

### daggerInputPin.canConnectToPin(pin)
Returns true if this pin can connect to the given DaggerOutputPin

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>canConnectToPin</code>](#DaggerBasePin+canConnectToPin)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerOutputPin</code>](#DaggerOutputPin) | 

<a name="DaggerInputPin+disconnectPin"></a>

### daggerInputPin.disconnectPin(forceDisconnect)
Disconnects this pin.

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| forceDisconnect | <code>boolean</code> | <code>false</code> | when true, the pin will disconnect regardless if the topology says it shouldn't |

<a name="DaggerInputPin+purgeAll"></a>

### daggerInputPin.purgeAll()
Clean up when object hierarchy is unraveled.  Subclasses should always super.

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  
**Overrides**: [<code>purgeAll</code>](#DaggerBasePin+purgeAll)  
<a name="DaggerBasePin+getAutoClone"></a>

### daggerInputPin.getAutoClone() ⇒ <code>boolean</code>
Get if this pin auto-clones when connected

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+setAutoClone"></a>

### daggerInputPin.setAutoClone(maxAutoCloneCount, autoCloneNameTemplate)
Set if this pin auto-clones when connected

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  

| Param | Type | Description |
| --- | --- | --- |
| maxAutoCloneCount | <code>Number</code> | number of times the pin can be cloned (or -1 for unlimited |
| autoCloneNameTemplate | <code>string</code> | template to use for generating a unique name for clned pins |

<a name="DaggerBasePin+cloned"></a>

### daggerInputPin.cloned(fromMaster)
called after a pin was cloned. Override to copy needed values from the given pin.  Subclasses MUST always
call the super class.

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  

| Param | Type |
| --- | --- |
| fromMaster | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerBasePin+_clone"></a>

### daggerInputPin._clone()
called from the dagger graph when a pin that is clonable is connected. 
we can call new on 'this.constructor' to create a new instance of whatever
subclass this is.

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerBasePin+onRemoved"></a>

### daggerInputPin.onRemoved()
Called by the pin collection when the pin is removed.  Override to provide cleanup for a pin.

**Kind**: instance method of [<code>DaggerInputPin</code>](#DaggerInputPin)  
<a name="DaggerNode"></a>

## DaggerNode ⇐ [<code>DaggerBase</code>](#DaggerBase)
Class that represents a node (or vertex) which is the fundamental unit of which DaggerGraphs are formed.  A DaggerNode
can be shared with multiple topologies with each topology having two DaggerPinCollections per node (one for each direction).

**Kind**: global class  
**Extends**: [<code>DaggerBase</code>](#DaggerBase)  

* [DaggerNode](#DaggerNode) ⇐ [<code>DaggerBase</code>](#DaggerBase)
    * [new DaggerNode()](#new_DaggerNode_new)
    * [.parentGraph](#DaggerNode+parentGraph) ⇒ [<code>DaggerGraph</code>](#DaggerGraph)
    * [.name](#DaggerNode+name)
    * [.name](#DaggerNode+name)
    * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
    * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
    * [.ordinal(topology_system)](#DaggerNode+ordinal) ⇒ <code>number</code>
    * [.subgraphAffiliation(topology_system)](#DaggerNode+subgraphAffiliation) ⇒ <code>number</code>
    * [.inputPins(topology_system)](#DaggerNode+inputPins) ⇒ [<code>DaggerPinCollection</code>](#DaggerPinCollection)
    * [.outputPins(topology_system)](#DaggerNode+outputPins) ⇒ [<code>DaggerPinCollection</code>](#DaggerPinCollection)
    * [.descendents(topology_system)](#DaggerNode+descendents) ⇒ <code>array</code>
    * [.ascendents(topology_system)](#DaggerNode+ascendents) ⇒ <code>array</code>
    * [.isTopLevel(topology_system)](#DaggerNode+isTopLevel) ⇒ <code>boolean</code>
    * [.isBottomLevel(topology_system)](#DaggerNode+isBottomLevel) ⇒ <code>boolean</code>
    * [.disconnectAllPins()](#DaggerNode+disconnectAllPins)
    * [.getDaggerOutputPin(withName, topology_system)](#DaggerNode+getDaggerOutputPin) ⇒ [<code>DaggerOutputPin</code>](#DaggerOutputPin)
    * [.getDaggerInputPin(withName, topology_system)](#DaggerNode+getDaggerInputPin) ⇒ [<code>DaggerOutputPin</code>](#DaggerOutputPin)
    * [.isTrueSource(topology_system)](#DaggerNode+isTrueSource)
    * [.isTrueDest(topology_system)](#DaggerNode+isTrueDest)
    * [.shouldClonePin(pin)](#DaggerNode+shouldClonePin) ⇒ <code>boolean</code>
    * [.renamePin(pin, pinName)](#DaggerNode+renamePin) ⇒ <code>boolean</code>
    * [.clonePin(pin, forceAutoCloneMaster)](#DaggerNode+clonePin) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [.shouldRemoveClonePin(pin)](#DaggerNode+shouldRemoveClonePin) ⇒ <code>boolean</code>
    * [.removeClonePin(pin)](#DaggerNode+removeClonePin) ⇒ <code>boolean</code>
    * [.canRemovePin(pin)](#DaggerNode+canRemovePin) ⇒ <code>boolean</code>
    * [.addedToGraph()](#DaggerNode+addedToGraph)
    * [.purgeAll()](#DaggerNode+purgeAll)

<a name="new_DaggerNode_new"></a>

### new DaggerNode()
DaggerNode ctor

<a name="DaggerNode+parentGraph"></a>

### daggerNode.parentGraph ⇒ [<code>DaggerGraph</code>](#DaggerGraph)
Get the graph this node belongs to

**Kind**: instance property of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerNode+name"></a>

### daggerNode.name
Get the name for this node.

**Kind**: instance property of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerNode+name"></a>

### daggerNode.name
Set the name for this node.

**Kind**: instance property of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerBase+instanceID"></a>

### daggerNode.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerBase+parent"></a>

### daggerNode.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerNode</code>](#DaggerNode)  
**Overrides**: [<code>parent</code>](#DaggerBase+parent)  
<a name="DaggerNode+ordinal"></a>

### daggerNode.ordinal(topology_system) ⇒ <code>number</code>
Get the order of causality for the given topology that this node represents.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+subgraphAffiliation"></a>

### daggerNode.subgraphAffiliation(topology_system) ⇒ <code>number</code>
Get the index of the subgraph this node belongs to.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+inputPins"></a>

### daggerNode.inputPins(topology_system) ⇒ [<code>DaggerPinCollection</code>](#DaggerPinCollection)
Get the DaggerPinCollection for the input pins of the given topology.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+outputPins"></a>

### daggerNode.outputPins(topology_system) ⇒ [<code>DaggerPinCollection</code>](#DaggerPinCollection)
Get the DaggerPinCollection for the output pins of the given topology.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+descendents"></a>

### daggerNode.descendents(topology_system) ⇒ <code>array</code>
Get the list of nodes that the 'cause' of this node will 'effect'

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+ascendents"></a>

### daggerNode.ascendents(topology_system) ⇒ <code>array</code>
Get the list of nodes that 'cause' this node.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+isTopLevel"></a>

### daggerNode.isTopLevel(topology_system) ⇒ <code>boolean</code>
Get if this node has no connected input pins for the given topology.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+isBottomLevel"></a>

### daggerNode.isBottomLevel(topology_system) ⇒ <code>boolean</code>
Get if this node has no connected output pins for the given topology.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+disconnectAllPins"></a>

### daggerNode.disconnectAllPins()
Disconnect all this node's pins on all of it's topologies.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerNode+getDaggerOutputPin"></a>

### daggerNode.getDaggerOutputPin(withName, topology_system) ⇒ [<code>DaggerOutputPin</code>](#DaggerOutputPin)
Find and return the DaggerOutputPin with the given name.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| withName | <code>string</code> |  | 
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+getDaggerInputPin"></a>

### daggerNode.getDaggerInputPin(withName, topology_system) ⇒ [<code>DaggerOutputPin</code>](#DaggerOutputPin)
Find and return the DaggerInput with the given name.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| withName | <code>string</code> |  | 
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+isTrueSource"></a>

### daggerNode.isTrueSource(topology_system)
Returns true if this node has no input pins.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+isTrueDest"></a>

### daggerNode.isTrueDest(topology_system)
Returns true if this node has no output pins.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| topology_system | <code>number</code> | <code>0</code> | 

<a name="DaggerNode+shouldClonePin"></a>

### daggerNode.shouldClonePin(pin) ⇒ <code>boolean</code>
Called by DaggerGraph after pins are connected to see if a pin should be cloned.  When subclassing DaggerNode
the subclass SHOULD call super.shouldClonePin.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerNode+renamePin"></a>

### daggerNode.renamePin(pin, pinName) ⇒ <code>boolean</code>
rename a given pin.  Fails if pin is not flagged with canRename.  Rarely should a pin be renamed.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 
| pinName | <code>string</code> | 

<a name="DaggerNode+clonePin"></a>

### daggerNode.clonePin(pin, forceAutoCloneMaster) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
called by DaggerGraph after pins are connected to clone a pin
if forceAutoCloneMaster is not null, the pin will be cloned from forceAutoCloneMaster instead of
it's own autoCloneMaster property.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type | Default |
| --- | --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) |  | 
| forceAutoCloneMaster | [<code>DaggerBasePin</code>](#DaggerBasePin) | <code></code> | 

<a name="DaggerNode+shouldRemoveClonePin"></a>

### daggerNode.shouldRemoveClonePin(pin) ⇒ <code>boolean</code>
Called by DaggerGraph after pins are disconnected to determine if an autocloned pin should be removed

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerNode+removeClonePin"></a>

### daggerNode.removeClonePin(pin) ⇒ <code>boolean</code>
Called by DaggerGraph to remove a cloned pin (The pin that is removed might not be the one that is requested).

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerNode+canRemovePin"></a>

### daggerNode.canRemovePin(pin) ⇒ <code>boolean</code>
Override to allow a node to be able to decide if a pin can actually be removed.  Also usefull to detect that a pin is
about to be removed.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerNode+addedToGraph"></a>

### daggerNode.addedToGraph()
Override to add logic for a node to respond to being parented to a graph

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerNode+purgeAll"></a>

### daggerNode.purgeAll()
Clean up when object hierarchy is unraveled.  Subclasses should always super.

**Kind**: instance method of [<code>DaggerNode</code>](#DaggerNode)  
<a name="DaggerOutputPin"></a>

## DaggerOutputPin ⇐ [<code>DaggerBasePin</code>](#DaggerBasePin)
Class that represents a directed output out of a DaggerNode

**Kind**: global class  
**Extends**: [<code>DaggerBasePin</code>](#DaggerBasePin)  

* [DaggerOutputPin](#DaggerOutputPin) ⇐ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [new DaggerOutputPin()](#new_DaggerOutputPin_new)
    * [.direction](#DaggerOutputPin+direction) ⇒ <code>DaggerBasePin.PinDirection.Output</code>
    * [.connectedTo](#DaggerOutputPin+connectedTo) ⇒ <code>array</code>
    * [.allowMultiConnect](#DaggerOutputPin+allowMultiConnect) ⇒ <code>boolean</code>
    * [.allowMultiConnect](#DaggerOutputPin+allowMultiConnect)
    * [.isConnected](#DaggerOutputPin+isConnected) ⇒ <code>boolean</code>
    * [.connectedToUUIDs](#DaggerOutputPin+connectedToUUIDs) ⇒ <code>array</code>
    * [.pinName](#DaggerBasePin+pinName) ⇒ <code>string</code>
    * [.parentNode](#DaggerBasePin+parentNode) ⇒ [<code>DaggerNode</code>](#DaggerNode)
    * [.isInputPin](#DaggerBasePin+isInputPin) ⇒ <code>boolean</code>
    * [.autoCloneRefCount](#DaggerBasePin+autoCloneRefCount) ⇒ <code>Number</code>
    * [.autoCloneCount](#DaggerBasePin+autoCloneCount) ⇒ <code>Number</code>
    * [.maxAutoClone](#DaggerBasePin+maxAutoClone) ⇒ <code>Number</code>
    * [.autoCloneNameTemplate](#DaggerBasePin+autoCloneNameTemplate) ⇒ <code>string</code>
    * [.index](#DaggerBasePin+index) ⇒ <code>Number</code>
    * [.autoCloneMaster](#DaggerBasePin+autoCloneMaster) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [.isAutoCloned](#DaggerBasePin+isAutoCloned) ⇒ <code>boolean</code>
    * [.canRename](#DaggerBasePin+canRename) ⇒ <code>boolean</code>
    * [.topologySystem](#DaggerBasePin+topologySystem) ⇒ <code>boolean</code>
    * [.originalName](#DaggerBasePin+originalName) ⇒ <code>string</code>
    * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
    * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
    * [.connectToInput(input)](#DaggerOutputPin+connectToInput) ⇒ <code>boolean</code>
    * [.canConnectToPin(pin)](#DaggerOutputPin+canConnectToPin) ⇒ <code>boolean</code>
    * [.disconnectPin(ipin, forceDisconnect)](#DaggerOutputPin+disconnectPin) ⇒ <code>boolean</code>
    * [.disconnectAll(forceDisconnect)](#DaggerOutputPin+disconnectAll) ⇒ <code>boolean</code>
    * [.purgeAll()](#DaggerOutputPin+purgeAll)
    * [.getAutoClone()](#DaggerBasePin+getAutoClone) ⇒ <code>boolean</code>
    * [.setAutoClone(maxAutoCloneCount, autoCloneNameTemplate)](#DaggerBasePin+setAutoClone)
    * [.cloned(fromMaster)](#DaggerBasePin+cloned)
    * [._clone()](#DaggerBasePin+_clone)
    * [.onRemoved()](#DaggerBasePin+onRemoved)

<a name="new_DaggerOutputPin_new"></a>

### new DaggerOutputPin()
DaggerOutputPin ctor

<a name="DaggerOutputPin+direction"></a>

### daggerOutputPin.direction ⇒ <code>DaggerBasePin.PinDirection.Output</code>
Get the pin's direction

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>direction</code>](#DaggerBasePin+direction)  
<a name="DaggerOutputPin+connectedTo"></a>

### daggerOutputPin.connectedTo ⇒ <code>array</code>
Get list of all DaggerInputPins this pin is connected to.

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerOutputPin+allowMultiConnect"></a>

### daggerOutputPin.allowMultiConnect ⇒ <code>boolean</code>
Get if this output pin allows for multiple connections (typically true)

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerOutputPin+allowMultiConnect"></a>

### daggerOutputPin.allowMultiConnect
Set if this output pin allows for multiple connections.

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerOutputPin+isConnected"></a>

### daggerOutputPin.isConnected ⇒ <code>boolean</code>
Get if this pin has any connections.

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>isConnected</code>](#DaggerBasePin+isConnected)  
<a name="DaggerOutputPin+connectedToUUIDs"></a>

### daggerOutputPin.connectedToUUIDs ⇒ <code>array</code>
Get a list of instance IDs for each DaggerInputPin this pin is connected to.

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+pinName"></a>

### daggerOutputPin.pinName ⇒ <code>string</code>
Get the pin's name

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>pinName</code>](#DaggerBasePin+pinName)  
<a name="DaggerBasePin+parentNode"></a>

### daggerOutputPin.parentNode ⇒ [<code>DaggerNode</code>](#DaggerNode)
Get the node this belongs to

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>parentNode</code>](#DaggerBasePin+parentNode)  
<a name="DaggerBasePin+isInputPin"></a>

### daggerOutputPin.isInputPin ⇒ <code>boolean</code>
Get if this is an Input pin

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+autoCloneRefCount"></a>

### daggerOutputPin.autoCloneRefCount ⇒ <code>Number</code>
Get the total number of times the pin was auto cloned.  Used to generate cloned pin names

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+autoCloneCount"></a>

### daggerOutputPin.autoCloneCount ⇒ <code>Number</code>
Get the number of times this pin was auto-cloned

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+maxAutoClone"></a>

### daggerOutputPin.maxAutoClone ⇒ <code>Number</code>
Get the maximum number of times this pin can be auto-cloned (or -1 for unlimited)

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+autoCloneNameTemplate"></a>

### daggerOutputPin.autoCloneNameTemplate ⇒ <code>string</code>
Get the template that is used for creating a unique name for cloned pins ie. 'myPin %'

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+index"></a>

### daggerOutputPin.index ⇒ <code>Number</code>
Get the index of this pin within it's pin collection (or -1 if not known)

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+autoCloneMaster"></a>

### daggerOutputPin.autoCloneMaster ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
Get the pin that this pin will clone from when connected

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+isAutoCloned"></a>

### daggerOutputPin.isAutoCloned ⇒ <code>boolean</code>
Get if this pin is an auto-cloned pin.

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+canRename"></a>

### daggerOutputPin.canRename ⇒ <code>boolean</code>
Get if this pin can be renamed.  Pin's should rarely be allowed to be renamed as every pin in a DaggerPinCollection
MUST have a unique name

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>canRename</code>](#DaggerBasePin+canRename)  
<a name="DaggerBasePin+topologySystem"></a>

### daggerOutputPin.topologySystem ⇒ <code>boolean</code>
Get the topology system this pin belongs to.

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+originalName"></a>

### daggerOutputPin.originalName ⇒ <code>string</code>
Get the original name of pin if the pin was renamed

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBase+instanceID"></a>

### daggerOutputPin.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBase+parent"></a>

### daggerOutputPin.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerOutputPin+connectToInput"></a>

### daggerOutputPin.connectToInput(input) ⇒ <code>boolean</code>
Connect this pin to the given DaggerInputPin

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  

| Param | Type |
| --- | --- |
| input | [<code>DaggerInputPin</code>](#DaggerInputPin) | 

<a name="DaggerOutputPin+canConnectToPin"></a>

### daggerOutputPin.canConnectToPin(pin) ⇒ <code>boolean</code>
Get if this pin can connect to the given DaggerInputPin

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>canConnectToPin</code>](#DaggerBasePin+canConnectToPin)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerInputPin</code>](#DaggerInputPin) | 

<a name="DaggerOutputPin+disconnectPin"></a>

### daggerOutputPin.disconnectPin(ipin, forceDisconnect) ⇒ <code>boolean</code>
Disconnect this pin from the given DaggerInputPin

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  

| Param | Type | Description |
| --- | --- | --- |
| ipin | [<code>DaggerInputPin</code>](#DaggerInputPin) |  |
| forceDisconnect | <code>boolean</code> | when true, the pin will disconnect regardless if the topology says it shouldn't |

<a name="DaggerOutputPin+disconnectAll"></a>

### daggerOutputPin.disconnectAll(forceDisconnect) ⇒ <code>boolean</code>
Disconnect this pin from all DaggerInputPins.

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  

| Param | Type | Description |
| --- | --- | --- |
| forceDisconnect | <code>boolean</code> | when true, the pin will disconnect regardless if the topology says it shouldn't |

<a name="DaggerOutputPin+purgeAll"></a>

### daggerOutputPin.purgeAll()
Clean up when object hierarchy is unraveled.  Subclasses should always super.

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
**Overrides**: [<code>purgeAll</code>](#DaggerBasePin+purgeAll)  
<a name="DaggerBasePin+getAutoClone"></a>

### daggerOutputPin.getAutoClone() ⇒ <code>boolean</code>
Get if this pin auto-clones when connected

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+setAutoClone"></a>

### daggerOutputPin.setAutoClone(maxAutoCloneCount, autoCloneNameTemplate)
Set if this pin auto-clones when connected

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  

| Param | Type | Description |
| --- | --- | --- |
| maxAutoCloneCount | <code>Number</code> | number of times the pin can be cloned (or -1 for unlimited |
| autoCloneNameTemplate | <code>string</code> | template to use for generating a unique name for clned pins |

<a name="DaggerBasePin+cloned"></a>

### daggerOutputPin.cloned(fromMaster)
called after a pin was cloned. Override to copy needed values from the given pin.  Subclasses MUST always
call the super class.

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  

| Param | Type |
| --- | --- |
| fromMaster | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerBasePin+_clone"></a>

### daggerOutputPin._clone()
called from the dagger graph when a pin that is clonable is connected. 
we can call new on 'this.constructor' to create a new instance of whatever
subclass this is.

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerBasePin+onRemoved"></a>

### daggerOutputPin.onRemoved()
Called by the pin collection when the pin is removed.  Override to provide cleanup for a pin.

**Kind**: instance method of [<code>DaggerOutputPin</code>](#DaggerOutputPin)  
<a name="DaggerPinCollection"></a>

## DaggerPinCollection ⇐ [<code>DaggerBase</code>](#DaggerBase)
Class that acts as a container for pins of one particular direction.

**Kind**: global class  
**Extends**: [<code>DaggerBase</code>](#DaggerBase)  

* [DaggerPinCollection](#DaggerPinCollection) ⇐ [<code>DaggerBase</code>](#DaggerBase)
    * [new DaggerPinCollection(parentNode, direction, topology_system)](#new_DaggerPinCollection_new)
    * [.topologySystem](#DaggerPinCollection+topologySystem) ⇒ <code>number</code>
    * [.parentNode](#DaggerPinCollection+parentNode)
    * [.pinDirection](#DaggerPinCollection+pinDirection)
    * [.allPins](#DaggerPinCollection+allPins) ⇒ <code>array</code>
    * [.allNonConnectedPins](#DaggerPinCollection+allNonConnectedPins) ⇒ <code>array</code>
    * [.allConnectedPins](#DaggerPinCollection+allConnectedPins) ⇒ <code>array</code>
    * [.firstUnconnectedPin](#DaggerPinCollection+firstUnconnectedPin) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [.instanceID](#DaggerBase+instanceID) ⇒ <code>string</code>
    * [.parent](#DaggerBase+parent) ⇒ [<code>DaggerBase</code>](#DaggerBase)
    * [.pin(withName)](#DaggerPinCollection+pin) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
    * [.addPin(pin, name)](#DaggerPinCollection+addPin) ⇒ <code>boolean</code>
    * [.setPinName(pin, name)](#DaggerPinCollection+setPinName) ⇒ <code>boolean</code>
    * [.removePin(pin)](#DaggerPinCollection+removePin)
    * [.index(pin)](#DaggerPinCollection+index) ⇒ <code>number</code>
    * [.purgeAll()](#DaggerPinCollection+purgeAll)

<a name="new_DaggerPinCollection_new"></a>

### new DaggerPinCollection(parentNode, direction, topology_system)
DaggerPinCollection ctor


| Param | Type |
| --- | --- |
| parentNode | [<code>DaggerNode</code>](#DaggerNode) | 
| direction | [<code>PinDirection</code>](#DaggerBasePin.PinDirection) | 
| topology_system | <code>number</code> | 

<a name="DaggerPinCollection+topologySystem"></a>

### daggerPinCollection.topologySystem ⇒ <code>number</code>
Get the topology system this pin collection belongs to.

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerPinCollection+parentNode"></a>

### daggerPinCollection.parentNode
get the parent node (same result as DaggerBase.parent)

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerPinCollection+pinDirection"></a>

### daggerPinCollection.pinDirection
get the direction of pins in this collection

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerPinCollection+allPins"></a>

### daggerPinCollection.allPins ⇒ <code>array</code>
Get list of all the pins in the collection

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerPinCollection+allNonConnectedPins"></a>

### daggerPinCollection.allNonConnectedPins ⇒ <code>array</code>
Get list of all pins in the collection that are not connected.

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerPinCollection+allConnectedPins"></a>

### daggerPinCollection.allConnectedPins ⇒ <code>array</code>
Get list of all pins in the collection that are connected.

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerPinCollection+firstUnconnectedPin"></a>

### daggerPinCollection.firstUnconnectedPin ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
Find the first unconnected pin or null if no pins are unconnected.

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerBase+instanceID"></a>

### daggerPinCollection.instanceID ⇒ <code>string</code>
Get the unique id for this instance

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
<a name="DaggerBase+parent"></a>

### daggerPinCollection.parent ⇒ [<code>DaggerBase</code>](#DaggerBase)
Get the parent DaggerBase object this object belongs to

**Kind**: instance property of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
**Overrides**: [<code>parent</code>](#DaggerBase+parent)  
<a name="DaggerPinCollection+pin"></a>

### daggerPinCollection.pin(withName) ⇒ [<code>DaggerBasePin</code>](#DaggerBasePin)
Find and return a pin with the given name.

**Kind**: instance method of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  

| Param | Type |
| --- | --- |
| withName | <code>string</code> | 

<a name="DaggerPinCollection+addPin"></a>

### daggerPinCollection.addPin(pin, name) ⇒ <code>boolean</code>
Add a given pin to this collection.

**Kind**: instance method of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 
| name | <code>string</code> | 

<a name="DaggerPinCollection+setPinName"></a>

### daggerPinCollection.setPinName(pin, name) ⇒ <code>boolean</code>
Set the name for a given pin.  If the pin's name has already been set, and the pin isn't allowed to be renamed, 
this will return 'false'

**Kind**: instance method of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 
| name | <code>string</code> | 

<a name="DaggerPinCollection+removePin"></a>

### daggerPinCollection.removePin(pin)
Remove a given pin from this collection.

**Kind**: instance method of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerPinCollection+index"></a>

### daggerPinCollection.index(pin) ⇒ <code>number</code>
Get the index of the given pin in the collection

**Kind**: instance method of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  

| Param | Type |
| --- | --- |
| pin | [<code>DaggerBasePin</code>](#DaggerBasePin) | 

<a name="DaggerPinCollection+purgeAll"></a>

### daggerPinCollection.purgeAll()
Clean up when object hierarchy is unraveled.  Subclasses should always super.

**Kind**: instance method of [<code>DaggerPinCollection</code>](#DaggerPinCollection)  
