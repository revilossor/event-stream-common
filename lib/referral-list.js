const EventStreamClient = require('rahv-spike-stream-client');
const client = new EventStreamClient('localhost:3000');
const Referral = require('./referral');

/*
  this is generic aggregate thing list...
*/

// TODO toString!

const ReferralList = function(id) {
  this.aggregate = client.getAggregate(id);
  this.referralIds = [];
  this.referrals = [];
  this.handlers = {
    add: (id) => {
      this.referralIds.push({id});
      if(this.referrals.some(el => el.aggregate.id === id)) { return; }
      return new Promise((resolve, reject) => {
        var referral = new Referral(id);
        this.referrals.push(referral);
        referral.init().then(resolve).catch(reject);
      });
    }
  };
};

ReferralList.prototype.init = function(version) {
  return new Promise((resolve, reject) => {
    var handlerReturns = [];
    this.aggregate.init((event) => {
      handlerReturns.push(this.handlers[event.data.type].call(null, ...event.data.args));
    }, version).then(() => {
      Promise.all(handlerReturns).then(resolve).catch(reject);
    }).catch(console.dir);
  });
};

ReferralList.prototype.add = function(referral) {
  if(this.referralIds.includes(referral.aggregate.id)) { return; } // cant push duplicates
  this.referrals.push(referal);
  this.aggregate.dispatch({
    type: 'add',
    args: [referral.aggregate.id]
  });
};


module.exports = ReferralList;
