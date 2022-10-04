const flightDelay = artifacts.require("./flightDelay.sol");
const expect = require("chai").expect;

contract(flightDelay, async (accounts) => {

    let flightInstance;
    beforeEach(async () => {
        flightInstance = await flightDelay.new();
    });
    
    it("it should add unique airline", async () => {
        const firstUser = accounts[0];
        const airlineData = ["CI", "AI"];

        await flightInstance.createInsurance(firstUser, "CI", "113", "20201001");
        await flightInstance.createInsurance(firstUser, "AI", "456", "20201002");
        await flightInstance.createInsurance(firstUser, "AI", "789", "20201002");

        const airlines = await flightInstance.getAirlines();

        expect(airlines[0]).to.equal(airlineData[0]);
        expect(airlines).to.have.lengthOf(2);
    })

    it("it shoule create a new insurance data", async () => {
        const firstUser = accounts[0];

        await flightInstance.createInsurance(firstUser, "CI", "113", "20201001");
        await flightInstance.createInsurance(firstUser, "AI", "456", "20201002");

        const insuranceIds = await flightInstance.getInsuranceIds(firstUser);

        expect(insuranceIds).to.have.lengthOf(2);
    })

    it("it should get insurance data by user id", async () => {
        const firstUser = accounts[0];
        const airlineData = ["CI", "AI"];

        await flightInstance.createInsurance(firstUser, "CI", "113", "20201001");
        await flightInstance.createInsurance(firstUser, "AI", "456", "20201002");

        const insuranceIds = await flightInstance.getInsuranceIds(firstUser);

        for(let i = 0; i < insuranceIds.length; i ++) {
            const insuranceData = await flightInstance.getInsurance(insuranceIds[i]);
            expect(insuranceData[0]).to.equal(airlineData[i]);
        }
    })
})