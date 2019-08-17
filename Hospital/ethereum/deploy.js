const HDWalletProvider = require('truffle-hdwallet-provider');
const  Web3 = require('web3');
const compiledPatientLedger = require('./build/Hospital.json');
const fs = require('fs');
const path = require('path');

const provider = new HDWalletProvider(
    'siren sunset host obvious indicate opinion gospel fragile very rain soda ugly',
    'https://rinkeby.infura.io/v3/35a6501a30564b129196b279a6111ce6'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); //The mnemonic specifies n accounts
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(compiledPatientLedger.interface)) //Instantiate the contract from the compiled solidity code. (ABI)
        .deploy({data: '0x' + compiledPatientLedger.bytecode})  //Deploy the contract by inserting the bytecode version of the contract + specifying values for its constructor args.
        .send({from: accounts[0]}); //Specify the sender/creator of the contract by selecting an account and setting the max amount of gas.

    console.log('The contract is deployed on: ', result.options.address);
    const address = {
        address: result.options.address,
        network: 'https://rinkeby.infura.io/v3/35a6501a30564b129196b279a6111ce6',
        owner: accounts[0]
    };

    fs.writeFileSync(path.resolve(__dirname, "result.json"), JSON.stringify(address));
};

deploy();
