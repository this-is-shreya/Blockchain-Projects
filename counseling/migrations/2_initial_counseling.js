const counseling = artifacts.require("counseling");

module.exports = function (deployer) {
  deployer.deploy(counseling);
};
