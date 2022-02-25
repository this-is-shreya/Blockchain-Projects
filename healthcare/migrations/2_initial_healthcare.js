const healthcare = artifacts.require("healthcare");

module.exports = function (deployer) {
  deployer.deploy(healthcare);
};
