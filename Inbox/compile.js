const path = require('path');
const fs = require('fs');
const solidityCompiler= require('solc');
const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

//console.log(solidityCompiler.compile(source, 1));
module.exports = solidityCompiler.compile(source, 1).contracts[':Inbox']; //This gives the bytecode and ABI for our contractn
