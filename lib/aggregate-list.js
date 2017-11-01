module.exports = (client) => {

  const AggregateList = function(id, type) {
    this.aggregate = client.getAggregate(id);
    this.memberIds = [];
    this.members = [];
    this.handlers = {
      add: (id) => {
        this.memberIds.push({id});
        return new Promise((resolve, reject) => {
          var instance = new type(id);
          this.members.push(instance);
          instance.init().then(resolve).catch(reject);
        });
      }
    };
  };

  AggregateList.prototype.init = function(version) {
    return new Promise((resolve, reject) => {
      var handlerReturns = [];
      this.aggregate.init((event) => {
        handlerReturns.push(this.handlers[event.data.type].call(null, ...event.data.args));
      }, version).then(() => {
        Promise.all(handlerReturns).then(resolve).catch(reject);
      }).catch(console.dir);
    });
  };

  AggregateList.prototype.add = function(instance) {
    if(this.memberIds.includes(instance.aggregate.id)) { return; } // cant push duplicates
    this.members.push(instance);
    this.aggregate.dispatch({
      type: 'add',
      args: [instance.aggregate.id]
    });
  };

  AggregateList.prototype.get = function(id) {
    return this.members.filter(instance => instance.aggregate.id === id)[0];
  };

  AggregateList.prototype.toString = function() {
    return `[AggregateList] {
      id: ${this.aggregate.id},
      version: ${this.aggregate.getVersion()},
      members: [
        ${this.members}
      ]
    }`;
  };

  return AggregateList;

};
