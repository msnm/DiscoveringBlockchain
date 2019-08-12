const assert = require('assert');
const mocha = require('mocha');
const describe = mocha.describe;
const ganache = require('ganache-cli');
const Web3 = require('web3');

const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach( async () => {
    accounts = await web3.eth.getAccounts();

    //We are only deploying the factory contract. The campaign contract is deployed through the factory contract.
    factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
        .deploy( {data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: '1000000'});

    //Creating a campaign
    await factory.methods.createCampaign('100').send({
        from: accounts[0],
        gas: '1000000'
    });

    //Take the first element of the array! Destructering
   [campaignAddress] = await factory.methods.getDeployedCampaigns().call();
   campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
       campaignAddress);

});


describe('Campaings', () => {
    it('Check if the factory and campaign are deployed', () => {
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);

    })
});
