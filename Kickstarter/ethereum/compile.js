const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

//1. First delete the build folder and create an empty build folder
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);
fs.ensureDirSync(buildPath);

//2. Compile the contracts sol to js
const kickStarterPath = path.resolve(__dirname, 'contracts', 'CampaignFactory.sol');
const source = fs.readFileSync(kickStarterPath, 'utf8');
const output = solc.compile(source, 1).contracts;

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}
