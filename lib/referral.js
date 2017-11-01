module.exports = (path) => {

  const EventStreamClient = require('rahv-spike-stream-client');
  const client = new EventStreamClient(path);

  const Referral = function(id) {
    this.aggregate = client.getAggregate(id);
    this.data = {};
    this.stage = Referral.stage.OPEN;
    this.handlers = {
      setData: (data) => {
        this.data = data;
      },
      updateStage: (stage) => {
        this.stage = stage;
      }
    };
  };

  Referral.stage = {
    OPEN: 'open',
    ASSIGNED: 'assigned',
    CLOSED: 'closed'
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

  Referral.prototype.updateStage = function(stage) {
    if(!Object.values().includes(stage)) { return; }    // can only update to valid stage
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

  return Referral;

}
