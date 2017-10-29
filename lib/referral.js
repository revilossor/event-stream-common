const EventStreamClient = require('rahv-stream-client');
const client = new EventStreamClient('localhost:3000');

const Referral = function(id) {
  console.log('[Referral::construct] id: ' + id);
  this.aggregate = client.getAggregate(id);
};
Referral.prototype.init = function(version) {
  return this.aggregate.init((event) => {
    console.log('[Referral::handler] handle event ' + JSON.stringify(event));
  }, version).catch(console.dir);
};

// TODO -
// create - adds a load of initial user / visit data ( address, reason for visit, etc )
// setStage - assigns a workflow stage. from an enum?

Referral.prototype.toString = function() {
  return `[Referral] { id: ${this.aggregate.id}, version: ${this.aggregate.getVersion()} }`;
};

module.exports = Referral;
