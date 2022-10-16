const flightDelay = artifacts.require("./flightDelay.sol");
const expect = require("chai").expect;

contract(flightDelay, async (accounts) => {

    let flightInstance;
    beforeEach(async () => {
        flightInstance = await flightDelay.new();
    });

    xit("it shoule create a new insurance data", async () => {
        const firstUser = accounts[0];

        await flightInstance.createInsurance(firstUser, "CI", "113", "20201001");
        await flightInstance.createInsurance(firstUser, "AI", "456", "20201002");

        const insuranceIds = await flightInstance.getInsuranceIds(firstUser);

        expect(insuranceIds).to.have.lengthOf(2);
    })

    xit("it should get insurance data by user id", async () => {
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

    xit("it should return owner array", async () => {
        const firstUser = accounts[0];
        const secondUser = accounts[1];

        await flightInstance.createInsurance(firstUser, "CI", "113", "20201001");
        await flightInstance.createInsurance(secondUser, "AI", "456", "20201002");

        const owners = await flightInstance.getOwners();

        expect(owners[0]).to.equal(firstUser);
        expect(owners[1]).to.equal(secondUser);
    })

    xit("it should update the insurance data", async () => {
        await flightInstance.createInsurance(accounts[0], "CI", "113", "20201001");
        const [status, payment] = ["daley", "2000"];

        await flightInstance.updateInsurance(0, status, payment);

        const insuranceData = await flightInstance.getInsurance(0);

        expect(insuranceData[3]).to.equal(status);
        expect(insuranceData[4]).to.equal(payment);
    })

    it("it should transfer money", async () => {
        const firstUser = accounts[0];
        const secondUser = accounts[1];

        // const balance1 = await flightInstance.getBalance();
        // console.log(balance1)

        await flightInstance.transfer(secondUser, 1000000000000000);
        
        // const balance2 = await flightInstance.getBalance();
        // console.log(balance2)
    })
})