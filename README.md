# Daggerlib.js

Daggerlib.js achieves a Coffman-Graham style directed acycled graph via a resursive set reduction algorithm.  This allows for grouping the topological ordering of nodes into layers of ordinals instead of discrete ordinals.  With layered ordinals, you can perform optimized parallel scheduling of tasks, render Sugiyama-style layered graphs, etc.  

```javascript
'use strict'
const Dagger = require('daggerlib');

// We'll create a node that has one input pin and one output pin
class MyNode extends Dagger.DaggerNode {
    constructor() {
        super();
        // Create an input pin.  We want it to be autoclone.  DaggerInputPins can only have a single
        // connection.  When an input pin is connected, and it is marked as autoclone, it will automatically 
        // generate and add a new pin to it's input pin collection.  We'll allow the pin to have a max of 4 clones.
        let inputPin = new Dagger.DaggerInputPin();
        inputPin.setAutoClone(4, "input");
        this.inputPins().addPin(inputPin, "input");

        // Create an output pin.  We want it to allow multiple connections.  A DaggerOutputPin can have unlimited
        // connections to input pins.
        let outputPin = new Dagger.DaggerOutputPin();
        outputPin.allowMultiConnect = true;
        this.outputPins().addPin(outputPin, "output");
    }
}

// create a DaggerGraph and add 4 nodes to it
let graph = new Dagger.DaggerGraph();
let n1 = new MyNode(); n1.name = "node 1"; graph.addNode(n1);
let n2 = new MyNode(); n2.name = "node 2"; graph.addNode(n2);
let n3 = new MyNode(); n3.name = "node 3"; graph.addNode(n3);
let n4 = new MyNode(); n4.name = "node 4"; graph.addNode(n4);

// connect output pin 0 of node 1 to first unconnected input put of node 2
n1.outputPins().allPins[0].connectToInput(n2.inputPins().firstUnconnectedPin);

// connect output pin 0 of node 2 to first unconnected input put of node 4
n2.outputPins().allPins[0].connectToInput(n4.inputPins().firstUnconnectedPin);

// connect output pin 0 of node 1 to first unconnected input put of node 3
n1.outputPins().allPins[0].connectToInput(n3.inputPins().firstUnconnectedPin);

// connect output pin 0 of node 3 to first unconnected input put of node 4
n3.outputPins().allPins[0].connectToInput(n4.inputPins().firstUnconnectedPin);

console.log('The graph has ' + (graph.maxOrdinal() + 1) + ' ordinals');
```

![step1](/media/step1.jpg)

![step2](/media/step2.jpg)

![step3](/media/step3.jpg)

![step4](/media/step4.jpg)

![step5](/media/step5.jpg)

[API Reference](./docs/api.md)