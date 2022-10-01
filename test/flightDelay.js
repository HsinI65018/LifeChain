const flightDelay = artifacts.require("./flightDelay.sol");

contract(flightDelay, async (accounts) => {
    
    it("it should create a new insurance data", async () => {
        const flightInstance = await flightDelay.new();

        const firstUser = accounts[0];
        const secondUser = accounts[1];
        const thirdUser = accounts[2];
        const airlineData = ["CI", "AI"];

        await flightInstance.createInsurance(firstUser, "CI", "113", "20201001");
        await flightInstance.createInsurance(secondUser, "AI", "456", "20201002");
        await flightInstance.createInsurance(thirdUser, "AI", "789", "20201002");

        const airlines = await flightInstance.getAirlines();

        const userInsurance = await flightInstance.getInsurance(thirdUser);
        console.log(userInsurance.airline)
        console.log(userInsurance)

        assert.equal(airlines[0], airlineData[0]);
    })
})