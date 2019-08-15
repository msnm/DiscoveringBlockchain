const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//1. First delete the build folder and create an empty build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

//2. Compile the contracts sol to js. We are only interested in the contracts part of compilers output
const contractPath = path.resolve(__dirname, 'contracts', 'patient-ledger.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const output = solc.compile(source, 1).contracts; // Array of contracts

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}
