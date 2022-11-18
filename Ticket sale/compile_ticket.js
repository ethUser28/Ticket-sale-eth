
const path = require('path');
const fs = require('fs');
const solc = require('solc');

const contractPath = path.resolve(__dirname, 'contracts', 'TicketSale.sol');
const source = fs.readFileSync(contractPath, 'utf8');

let input = {
    language: "Solidity",
    sources: {
        "TicketSale.sol": {
            content: source,
        },
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["abi", "evm.bytecode"],
            },
        },
    },
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts["TicketSale.sol"];

console.log(output.contracts["TicketSale.sol"].TicketSale);


for (let contractName in contracts) {
    const contract = contracts[contractName];
    module.exports= {"abi":contract.abi,"bytecode":contract.evm.bytecode.object};
}
