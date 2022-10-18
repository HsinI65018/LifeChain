const receive = artifacts.require("./receive.sol");

module.exports = function(deployer) {
    deployer.deploy(receive);
}