module.exports = (path) => {

  const EventStreamClient = require('rahv-spike-stream-client');
  const client = new EventStreamClient(path);

  return {
    Referral: require('./lib/referral')(client),
    ReferralList: require('./lib/referral-list')(client)
  };

};
