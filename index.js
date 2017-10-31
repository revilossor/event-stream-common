module.exports = (path) => ({
  Referral: require('./lib/referral')(path),
  ReferralList: require('./lib/referral-list')(path)
});
