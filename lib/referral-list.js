const EventStreamClient = require('rahv-stream-client');
const client = new EventStreamClient('localhost:3000');
const Referral = require('./referral');

const ReferralList = function(id) {
  this.aggregate = client.getAggregate(id);
  this.referrals = [];
  this.handlers = {
    push: (id, version) => {
      this.referrals.push({id, version});
    }
  };
};

ReferralList.prototype.init = function(version) {       // TODO meh, this should be in client... have a base class in there?
  return this.aggregate.init((event) => {
    this.handlers[event.data.type].call(null, ...event.data.args);
  }, version).catch(console.dir);
};

ReferralList.prototype.push = function(referral) {
  if(this.referrals.includes(referral.aggregate.id)) { return; } // cant push duplicates
  this.aggregate.dispatch({
    type: 'push',
    args: [referral.aggregate.id, referral.aggregate.getVersion()]
  });
};

ReferralList.prototype.get = function(index) {          // TODO some way to keep them all in mem....
  const referral = new Referral(this.referrals[index].id);
  return new Promise((resolve, reject) => {
    referral.init(this.referrals[index].version)
      .then(() => { resolve(referral); })
      .catch(reject);
  });
};

module.exports = ReferralList;
