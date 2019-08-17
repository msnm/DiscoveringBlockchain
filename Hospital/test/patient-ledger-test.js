const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const mocha = require('mocha');
const describe = mocha.describe;

const web3 = new Web3(ganache.provider());

const compiledPatientLedger = require('../ethereum/build/Hospital.json');
console.log(compiledPatientLedger.interface);
let accounts; //Local ganache accounts
let patientLedger;


beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    patientLedger = await new web3.eth
        .Contract(JSON.parse(compiledPatientLedger.interface))  //Create the contract in web3 (ABI)
        .deploy({ data: compiledPatientLedger.bytecode })       //Deploy the contract by inserting the bytecode version of the contract + specifying values for its constructor args.
        .send({ from: accounts[0], gas: '5000000'});            //Specify the sender/creator of the contract by selecting an account and setting the max amount of gas.
        //console.log(patientLedger);
});

describe('PatientLedger', () => {
    it('Deploy contract', async () => {
        //console.log(patientLedger);
        //console.log('The contract is deployed at address: ', patientLedger.options.address);
        assert.ok(patientLedger.options.address); // Checks if this value is defined
    });

    it('Has a director and nurse', async () => {
        const director = await patientLedger.methods.director().call();
        const isNurse = await patientLedger.methods.nursesMap(accounts[0]).call();
        assert.equal(accounts[0], director);
        assert(isNurse);
    });

    it('Create a patient and update name', async () => {
        await patientLedger.methods
            .insertPatient('Michael', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
            .send({ from: accounts[1], gas: '2000000'});

        const patientCount = await patientLedger.methods.getPatientCount().call();
        const patientMethod1 = await patientLedger.methods.getPatientByAddress(accounts[1]).call();
        assert.equal(patientCount, 1);
        assert.equal('Michael', patientMethod1.firstName);

        await patientLedger.methods
            .updatePatient('Jos', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
            .send({ from: accounts[1], gas: '2000000'});

        const patientMethod2 = await patientLedger.methods.getPatientById(0).call();
        assert.equal('Jos', patientMethod2.firstName);
    });

    it('Create a patient, add hospitalization, add treatment', async () => {
        await patientLedger.methods
            .insertPatient('Michael', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
            .send({ from: accounts[1], gas: '2000000'});

        let reason = 'Broken leg';
        await patientLedger.methods
            .insertHospitalization(0, new Date().getTime(), reason, new Date().getTime())
            .send({ from: accounts[0], gas: '2000000'});

        let hospitalization = await patientLedger.methods.getHospitalizationById(0).call();
        assert.equal(reason, hospitalization.reason);
        reason = 'Broken arm';
        await patientLedger.methods
            .updateHospitalization(0, new Date().getTime(), reason, new Date().getTime())
            .send({ from: accounts[0], gas: '2000000'});

        hospitalization = await patientLedger.methods.getHospitalizationByAddress(accounts[1]).call();
        assert.equal(reason, hospitalization.reason);

        let description = 'wonden verzorgen';
        let status = 'ToDo';
        await patientLedger.methods
            .insertTreatment(0, 'WONDEN', description, new Date().getTime(), status)
            .send({ from: accounts[0], gas: '2000000'});

        let treatment = await patientLedger.methods.getTreatmentById(0, 0).call();
        assert.equal(status, treatment.status);

        status = 'Done';
        await patientLedger.methods
            .updateTreatment(0, 0, 'WONDEN', description, new Date().getTime(), status)
            .send({ from: accounts[0], gas: '2000000'});

        treatment = await patientLedger.methods.getTreatmentByAddress(accounts[1], 0).call();
        assert.equal(status, treatment.status);
    });

    it('Test count of patients and treatments', async () => {
        await patientLedger.methods
            .insertPatient('Michael', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
            .send({ from: accounts[1], gas: '2000000'});

        await patientLedger.methods
            .insertTreatment(0, 'WONDEN', 'ABC', new Date().getTime(), 'ToDo')
            .send({ from: accounts[0], gas: '2000000'});

        await patientLedger.methods
            .insertPatient('Michael', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
            .send({ from: accounts[2], gas: '2000000'});

        await patientLedger.methods
            .insertTreatment(1, 'WONDEN', 'ABC', new Date().getTime(), 'ToDo')
            .send({ from: accounts[0], gas: '2000000'});

        await patientLedger.methods
            .insertPatient('Michael', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
            .send({ from: accounts[3], gas: '2000000'});

        await patientLedger.methods
            .insertTreatment(2, 'WONDEN', 'ABC', new Date().getTime(), 'ToDo')
            .send({ from: accounts[0], gas: '2000000'});

        await patientLedger.methods
            .insertTreatment(2, 'WASSEN', 'ABC', new Date().getTime(), 'ToDo')
            .send({ from: accounts[0], gas: '2000000'});

        const patientCount = await patientLedger.methods.getPatientCount().call();

        const patientTreatmentCount1 = await patientLedger.methods.getTreatmentCountByAddress(accounts[1]).call();
        const patientTreatmentCount2 = await patientLedger.methods.getTreatmentCountByAddress(accounts[2]).call();
        const patientTreatmentCount3 = await patientLedger.methods.getTreatmentCountById(2).call();

        assert.equal(3, patientCount);
        assert.equal(1, patientTreatmentCount1);
        assert.equal(1, patientTreatmentCount2);
        assert.equal(2, patientTreatmentCount3);

    });
});

