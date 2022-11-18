const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");
const web3 = new Web3(ganache.provider());
const {abi, bytecode} = require('/Users/nobumper/Ticket sale/compile_ticket.js');

let accounts;
let contractAbi;

beforeEach(async () => {
    // Get a list of all accounts
    accounts = await web3.eth.getAccounts();
    contractAbi = await new web3.eth.Contract(abi)
        .deploy({
            data: bytecode,
            arguments: [10, 100000],
        })
        .send({ from: accounts[0], gasPrice: 8000000000, gas: 4700000});
});

describe("Ticket sale contract", () => {
    it("Deploys a contract", () => {
            assert.ok(contractAbi.options.address);
        }
    )

    it("Makes a purchase", async () => {
            await contractAbi.methods.buyTicket(1).send({from: accounts[1], value: 100000, gasPrice: 1500000, gas: 470000});
            const actualOwner = await contractAbi.methods.getTicketOf(accounts[1]).call();
            assert.equal(actualOwner, 1);
        }
    )

    it("Gets proper ticket ID owned by address(s)", async () => {
            await contractAbi.methods.buyTicket(2).send({from: accounts[2], value: 100000, gasPrice: 1500000, gas: 470000});
            const actualOwner = await contractAbi.methods.getTicketOf(accounts[2]).call();
            const nonOwner = await contractAbi.methods.getTicketOf(accounts[3]).call();
            assert.equal(nonOwner, 0)
            assert.equal(actualOwner, 2);
        }
    )

    it("Offers a swap", async () => {
            await contractAbi.methods.buyTicket(1).send({from: accounts[1], value: 100000, gasPrice: 1500000, gas: 470000});
            await contractAbi.methods.buyTicket(2).send({from: accounts[2], value: 100000, gasPrice: 1500000, gas: 470000});
            await contractAbi.methods.offerSwap(accounts[1]).send({from: accounts[2], gas: 100000});
            const swapToIDTest = await contractAbi.methods.getSwapTo().call();
            const offerETest = await contractAbi.methods.getOfferE().call();
            const offerIDTest = await contractAbi.methods.getOffer().call();
            assert.equal(swapToIDTest, 1);
            assert.equal(offerETest, accounts[2]);
            assert.equal(offerIDTest, 2);
        }
    )

    it("Accepts a swap", async () => {
            await contractAbi.methods.buyTicket(1).send({from: accounts[1], value: 100000, gasPrice: 1500000, gas: 470000});
            await contractAbi.methods.buyTicket(2).send({from: accounts[2], value: 100000, gasPrice: 1500000, gas: 470000});
            await contractAbi.methods.offerSwap(accounts[1]).send({from: accounts[2], gas: 100000, gasPrice: 1500000, gas: 470000});
            await contractAbi.methods.acceptSwap().send({from: accounts[1], gas: 100000})
            const newIDAcc1 = await contractAbi.methods.getTicketOf(accounts[1]).call();
            const newIDAcc2 = await contractAbi.methods.getTicketOf(accounts[2]).call();
            assert.equal(newIDAcc1, 2);
            assert.equal(newIDAcc2, 1);
        }
    )
})
;