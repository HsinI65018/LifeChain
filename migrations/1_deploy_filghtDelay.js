const flightDelay = artifacts.require("./flightDelay.sol");

module.exports = function(deployer) {
    deployer.deploy(flightDelay);
}