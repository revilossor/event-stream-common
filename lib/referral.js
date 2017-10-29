const EventStreamClient = require('rahv-stream-client');
const client = new EventStreamClient('localhost:3000');

const Referral = function(id) {
  this.aggregate = client.getAggregate(id);
  this.data = {};
  this.stage = Referral.stages.OPEN;
  this.handlers = {
    setData: (data) => {
      this.data = data;
    },
    updateStage: (stage) => {
      this.stage = stage;
    }
  };
};

Referral.stages = {
  OPEN: 'open',
  ASSIGNED: 'assigned',
  COMPLETE: 'complete'
};

Referral.prototype.init = function(version) {
  return this.aggregate.init((event) => {
    this.handlers[event.data.type].call(null, ...event.data.args);
  }, version).catch(console.dir);
};

Referral.prototype.setData = function(data) {
  this.aggregate.dispatch({
    type: 'setData',
    args: Array.from(arguments)
  });
};

Referral.prototype.updateStage = function(stage) {  // TODO validate stage is from enum?
  this.aggregate.dispatch({
    type: 'updateStage',
    args: Array.from(arguments)
  });
};

Referral.prototype.toString = function() {
  return `[Referral] {
    id: ${this.aggregate.id},
    version: ${this.aggregate.getVersion()},
    data: ${JSON.stringify(this.data)},
    stage: ${this.stage}
  }`;
};

module.exports = Referral;
