const send = artifacts.require("./send.sol");

module.exports = function(deployer) {
    deployer.deploy(send);
}