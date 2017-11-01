module.exports = (path) => {

  const EventStreamClient = require('rahv-spike-stream-client');
  const client = new EventStreamClient(path);

  return {
    Referral: require('./lib/referral')(client),
    AggregateList: require('./lib/aggregate-list')(client)
  };

};
