module.exports = (client) => {

  const Referral = function(id) {
    this.aggregate = client.getAggregate(id);
    this.data = {};
    this.stage = Referral.stage.OPEN;
    this.timestamp = new Date();

    this.handlers = {
      setData: (data) => {
        this.data = data;
      },
      setStage: (stage) => {
        this.stage = stage;
      },
      setTimestamp: (timestamp) => {
        this.timestamp = new Date(timestamp);
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

  Referral.prototype.setStage = function(stage) {
    if(!Object.values(Referral.stage).includes(stage)) { console.log('eee'); return; }    // can only update to valid stage
    this.aggregate.dispatch({
      type: 'setStage',
      args: Array.from(arguments)
    });
    this.aggregate.dispatch({     // updating stage also updates timestamp...
      type: 'setTimestamp',
      args: [ Date.now() ]
    });
  };

  Referral.prototype.setTimestamp = function(timestamp) {
    this.aggregate.dispatch({
      type: 'setTimestamp',
      args: [timestamp || Date.now()]
    });
  };

  Referral.prototype.toString = function() {
    return `[Referral] {
      id: ${this.aggregate.id},
      version: ${this.aggregate.getVersion()},
      data: ${JSON.stringify(this.data)},
      stage: ${this.stage},
      timestamp: ${this.timestamp}
    }`;
  };

  return Referral;

}
