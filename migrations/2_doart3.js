const doart3 = artifacts.require('Doart3Token');
const Exchange = artifacts.require('Exchange');
const HTLC = artifacts.require('HashedTimelock');

module.exports = (deployer) => {
  deployer.deploy(doart3,'DRT','doart3 Token');
  deployer.deploy(HTLC);
  deployer.deploy(Exchange);
};
