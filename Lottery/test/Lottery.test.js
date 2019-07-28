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
let lottery;

beforeEach( async () => {
    // Get a list of all the unlocked accounts in Ganache (= the local test network).
    // Using the web3 instance and its Etherium module.
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy a contract
    lottery = await new web3.eth.Contract(JSON.parse(interface)) //Instantiate the contract from the compiled solidity code. (ABI)
        .deploy( { data: bytecode})  //Deploy the contract by inserting the bytecode version of the contract + specifying values for its constructor args.
        .send( { from: accounts[0], gas: '1000000'}); //Specify the sender/creator of the contract by selecting an account and setting the max amount of gas.


});

describe('Lottery', () => {
    it('Deploys a contract', () => {
        console.log(lottery);
        assert.ok(lottery.options.address); // OK check if this is a defined value
    });

    it('Has a manager', async () => {
        const manager = await lottery.methods.manager().call();
        assert.equal(accounts[0], manager);
    });

    it('Enter the lottery', async() => {
        await lottery.methods.enter().send( { from: accounts[1], value: web3.utils.toWei('0.01', 'ether')});
        const players = await lottery.methods.getPlayers().call({from: accounts[0]});
        assert.equal(accounts[1], players[0]);
        assert.equal(1, players.length);
    });

    it('Enter the lottery with multiple players', async() => {
        await lottery.methods.enter().send( { from: accounts[1], value: web3.utils.toWei('0.01', 'ether')});
        await lottery.methods.enter().send( { from: accounts[2], value: web3.utils.toWei('0.01', 'ether')});
        await lottery.methods.enter().send( { from: accounts[3], value: web3.utils.toWei('0.01', 'ether')});

        const players = await lottery.methods.getPlayers().call({from: accounts[0]});
        assert.equal(accounts[1], players[0]);
        assert.equal(accounts[2], players[1]);
        assert.equal(accounts[3], players[2]);

        assert.equal(3, players.length);
    });

    it('Enter the lottery with not enough money', async() => {
        try {
            await lottery.methods.enter().send({from: accounts[1], value: 0});
            assert(false); //If we come here then no error was thrown and thus the test failed
        }
        catch (err) {
            assert(err);
        }
    });

    it('The manager cannot enter the lottery', async() => {
        try {
            await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei('0.01', 'ether')});
            assert(false); //If we come here then no error was thrown and thus the test failed
        }
        catch (err) {
            assert(err);
        }
    });

    it('Only manager can call pickWinner', async() => {
        try {
            await lottery.methods.pickWinner().send({from: accounts[1]});
            assert(false); //If we come here then no error was thrown and thus the test failed
        }
        catch (err) {
            assert(err);
        }
    });

    it('Sends money to the winner and resets the players array', async() => {

        //Checking the initial amount
        const initBalancePlayer1 = await web3.eth.getBalance(accounts[1]);

        //Enter one player, so we know who is the winner
        await lottery.methods.enter().send( { from: accounts[1], value: web3.utils.toWei('2', 'ether')});

        const afterEnterBalancePlayer1 = await web3.eth.getBalance(accounts[1]);

        //The manager calls the pickWinner method
        await lottery.methods.pickWinner().send({from: accounts[0]});

        // Final balance
        const finalEnterBalancePlayer1 = await web3.eth.getBalance(accounts[1]);

        const difference = finalEnterBalancePlayer1 - initBalancePlayer1;
        assert(difference > web3.utils.toWei('1.8', 'ether'));
        assert(initBalancePlayer1 > afterEnterBalancePlayer1);

        const players = await lottery.methods.getPlayers().call({from: accounts[0]});

        assert.equal(0, players.length);
    });

});
