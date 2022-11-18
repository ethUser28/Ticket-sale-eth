const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { abi, bytecode } = require('/Users/nobumper/Ticket sale/compile_ticket.js');
const provider = new HDWalletProvider(

);
const web3 = new Web3(provider);
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);
    inbox = await new web3.eth.Contract(abi)
        .deploy({ data: bytecode, arguments: [100, 100000] })
        .send({ gas: '2300000', from: accounts[0]});
    console.log('Contract deployed to', inbox.options.address);
    provider.engine.stop();
};
deploy();