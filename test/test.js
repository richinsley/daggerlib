'use strict'

const Dagger = require('../index.js');
const expect = require('chai').expect

/**
 * we want an output pin that does not allow multiconnect
 */
class DaggerTestOutputPin extends Dagger.DaggerOutputPin {
  constructor() {
    super();
  }

  // alternatively, we could just call 'this.allowMultiConnect = false'
  get allowMultiConnect() {
    return false;
  }
}

class DaggerTestNode extends Dagger.DaggerNode {
  constructor() {
    super();
    // the second output pin of each topology will not allow multiconnect
    // Topology 0 pins 
    this.inputPins(0).addPin(new Dagger.DaggerInputPin(), 'ip1');
    this.inputPins(0).addPin(new Dagger.DaggerInputPin(), 'ip2');
    this.outputPins(0).addPin(new Dagger.DaggerOutputPin(), 'op1');
    this.outputPins(0).addPin(new DaggerTestOutputPin(), 'op2');

    // Topology 1 pins
    this.inputPins(1).addPin(new Dagger.DaggerInputPin(), 'ip1');
    this.inputPins(1).addPin(new Dagger.DaggerInputPin(), 'ip2');
    this.outputPins(1).addPin(new Dagger.DaggerOutputPin(), 'op1');
    this.outputPins(1).addPin(new DaggerTestOutputPin(), 'op2');
  }
}

describe('Daggerlib', function () {

  describe('DaggerBase', () => {
    it('should create a DaggerBase object and have an instanceID', () => {
        const item = new Dagger.DaggerBase();
        expect(item).to.have.property('instanceID');
        expect(item.instanceID).to.be.a('string');
    });
  })
  
  describe('DaggerBasePin', () => {
    const pin = new Dagger.DaggerBasePin();
    it('should have an unknown direction', () => {
        expect(pin).to.have.property('direction');
        expect(pin.direction).to.equal(Dagger.DaggerBasePin.PinDirection.Unknown);
    });
  });

  describe('DaggerOutputPin', () => {
    const pin = new Dagger.DaggerOutputPin();
    it('should have an output direction', () => {
        expect(pin).to.have.property('direction');
        expect(pin.direction).to.equal(Dagger.DaggerBasePin.PinDirection.Output);
    });
  });

  describe('DaggerInputPin', () => {
    const pin = new Dagger.DaggerInputPin();
    it('should have an input direction', () => {
        expect(pin).to.have.property('direction');
        expect(pin.direction).to.equal(Dagger.DaggerBasePin.PinDirection.Input);
    });
  });

  describe('DaggerInputPin', () => {
    const pin = new Dagger.DaggerInputPin();
    it('should have an input direction', () => {
        expect(pin).to.have.property('direction');
        expect(pin.direction).to.equal(Dagger.DaggerBasePin.PinDirection.Input);
    });
  });

  describe('DaggerNode', () => {
    const node = new DaggerTestNode();
    it('should have a Input and Output Collection for Topology 0', () => {
        expect(node.inputPins(0)).to.not.equal(null);
        expect(node.outputPins(0)).to.not.equal(null);
    });
    it('should have a Input and Output Collection for Topology 1', () => {
        expect(node.inputPins(1)).to.not.equal(null);
        expect(node.outputPins(1)).to.not.equal(null);
    });
  });

  describe('Simple Topology Test', () => {
    let graph = new Dagger.DaggerGraph();

    let node1 = graph.addNode(new DaggerTestNode());
    let node2 = graph.addNode(new DaggerTestNode());
    let node3 = graph.addNode(new DaggerTestNode());
    let node4 = graph.addNode(new DaggerTestNode());

    it('should have a subgraph count of 4', () => {
      expect(graph.subGraphCount(0)).to.equal(4);
    });

    it('should allow pins to connect' ,() => {
      let op1 = node1.getDaggerOutputPin("op1", 0);
      let ip1 = node2.getDaggerInputPin("ip1", 0);
      let res = op1.connectToInput(ip1);
      expect(op1).to.not.equal(null);
      expect(ip1).to.not.equal(null);
      expect(res).to.equal(true);
    });

    it('should have a subgraph count of 3', () => {
      expect(graph.subGraphCount(0)).to.equal(3);
    });

    it('should have a subgraph count of 2', () => {
      let op1 = node1.getDaggerOutputPin("op1", 0);
      let ip1 = node3.getDaggerInputPin("ip1", 0);
      let res = op1.connectToInput(ip1);
      expect(op1).to.not.equal(null);
      expect(ip1).to.not.equal(null);
      expect(res).to.equal(true);
      expect(graph.subGraphCount(0)).to.equal(2);
    });

    it('should not allow node 2 to connect to node 1', () => {
      let res = node2.getDaggerOutputPin("op1", 0).connectToInput(node1.getDaggerInputPin("ip1", 0));
      expect(res).to.equal(false);
    });

    it('should allow node 1 to disconnect from node 2', () => {
      let res = node1.getDaggerOutputPin("op1", 0).disconnectPin(node2.getDaggerInputPin("ip1", 0), false);
      expect(res).to.equal(true);
      expect(graph.subGraphCount(0)).to.equal(3);
    });

    it('it should fail to multi-connect', () => {
      node1.getDaggerOutputPin("op2", 0).connectToInput(node4.getDaggerInputPin("ip1", 0));
      let res = node1.getDaggerOutputPin("op2", 0).connectToInput(node4.getDaggerInputPin("ip2", 0));
      expect(res).to.equal(false);
    });

    it('should allow a node to be removed', () => {
      let res = graph.removeNode(node4);
      expect(graph.nodes.length).to.equal(3);
      expect(graph.subGraphCount(0)).to.equal(2);
    });
  });

  describe(`Create a graph with two topology systems
            +-------+    +-------+
            |       |--->|       |
            |1      |    |2      |
            +-------+    +-------+
                            |
                            V
                        +-------+
                        |       |
                        |3      |
                        +-------+
                            |
                            V
                        +-------+
                        |       |
                        |4      |
                        +-------+
               `, () => {
    let graph = new Dagger.DaggerGraph(2);
    let node1 = graph.addNode(new DaggerTestNode());
    let node2 = graph.addNode(new DaggerTestNode());
    let node3 = graph.addNode(new DaggerTestNode());
    let node4 = graph.addNode(new DaggerTestNode());
    it('should connect node 1 to node 2 via topology system 0', () => {
      expect(node1.getDaggerOutputPin("op1", 0).connectToInput(node2.getDaggerInputPin("ip1", 0))).to.be.true;
    });

    it('should connect node 2 to node 3 via topology system 1', () => {
      expect(node2.getDaggerOutputPin("op1", 1).connectToInput(node3.getDaggerInputPin("ip1", 1))).to.be.true;
    });

    it('should connect node 3 to node 4 via topology system 1', () => {
      expect(node3.getDaggerOutputPin("op1", 1).connectToInput(node4.getDaggerInputPin("ip1", 1))).to.be.true;
      expect(graph.subGraphCount(0)).to.equal(3);
      expect(graph.subGraphCount(1)).to.equal(2);
      expect(node1.ordinal(0)).to.equal(0);
      expect(node1.ordinal(1)).to.equal(0);
      expect(node2.ordinal(0)).to.equal(1);
      expect(node2.ordinal(1)).to.equal(0);
      expect(node3.ordinal(0)).to.equal(0);
      expect(node3.ordinal(1)).to.equal(1);
      expect(node4.ordinal(0)).to.equal(0);
      expect(node4.ordinal(1)).to.equal(2);
    });

    it('node 4 should NOT be able to connect to node 2 on topology system 1 (acyclic failure)', () => {
      expect(node4.getDaggerOutputPin("op1", 1).connectToInput(node2.getDaggerInputPin("ip1", 1))).to.be.false;
    });

    it('node 4 should be able to connect to node 1 on topology system 1', () => {
      expect(node4.getDaggerOutputPin("op1", 1).connectToInput(node1.getDaggerInputPin("ip1", 1))).to.be.true;
      expect(node1.ordinal(1)).to.equal(3);  
      expect(graph.subGraphCount(1)).to.equal(1);
    });

    it('should disconnect node 3 from node 4', () => {
      expect(node3.getDaggerOutputPin("op1", 1).disconnectPin(node4.getDaggerInputPin("ip1", 1), false)).to.be.true;
      expect(node4.ordinal(1)).to.equal(0);
      expect(graph.subGraphCount(1)).to.equal(2);
    });
  });

  describe('Autoclone', () => {
    let graph = new Dagger.DaggerGraph();
    let node1 = graph.addNode(new DaggerTestNode());
    let node2 = graph.addNode(new DaggerTestNode());
    let aclonepin = new Dagger.DaggerInputPin();
    it('should add an autoclone pin to node2', () => {
      aclonepin.setAutoClone(-1, "pin%");
      node2.inputPins(0).addPin(aclonepin, "pin%");
      expect(node2.inputPins(0).allPins.length).to.equal(3);
    });

    it('should clone a pin when the auto-clone pin is connected', () => {
      let p1 = node1.getDaggerOutputPin("op1", 0);
      let p2 = node2.getDaggerInputPin("pin%", 0);
      expect(p1.connectToInput(p2)).to.be.true;
      expect(node2.inputPins(0).allPins.length).to.equal(4);
    });

    it('should remove the cloned pin when disconnected', () => {
      let p2 = node2.getDaggerInputPin("pin%", 0);
      expect(p2.disconnectPin()).to.be.true;
      expect(node2.inputPins(0).allPins.length).to.equal(3);
    });
  });
});