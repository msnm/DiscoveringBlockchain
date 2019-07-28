const assert = require('assert');
const ganache = require('ganache-cli');
const mocha = require('mocha');
const describe = mocha.describe;
const Web3 = require('web3'); // is a constructor
const { interface, bytecode } = require('../compile');

// You need to specify a provider so that Web3 knows to which network it should connect.
// Now we use Ganache (local test network), but this will change depending on which network we are connecting to (Real, ruby-testnet, ...).
const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const INITIAL_STRING = 'Hi there!';
beforeEach( async () => {
    // Get a list of all the unlocked accounts in Ganache (= the local test network).
    // Using the web3 instance and its Etherium module.
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy a contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)) //Instantiate the contract from the compiled solidity code. (ABI)
        .deploy( { data: bytecode, arguments: [INITIAL_STRING]})  //Deploy the contract by inserting the bytecode version of the contract + specifying values for its constructor args.
        .send( { from: accounts[0], gas: '1000000'}); //Specify the sender/creator of the contract by selecting an account and setting the max amount of gas.


});

describe('Inbox', () => {
    it('Deploys a contract', () => {
        console.log(inbox);
        assert.ok(inbox.options.address); // OK check if this is a defined value
    });

    it('Has a default message', async () => {
        // Our contract has a property method that contains all our public functions defined in
        // our contract. We then call the function we wnat.
        const message = await inbox.methods.message().call();
        assert.equal(INITIAL_STRING, message);
    });

    it('Update the message', async() => {
        const newValue = 'By there!';
        await inbox.methods.setMessage(newValue).send( { from: accounts[0]});
        const message = await inbox.methods.message().call();
        assert.equal(newValue, message);

    });
});
