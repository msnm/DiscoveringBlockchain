#HospitalApp with ethereum intgegration
The app should represent a hospital with its departments and its patients. 
The end-user (a nurse) has an overview of all the rooms with its patients. Each room also has a thumbnail, which 
states the name + which treatment is requirement within n hours. 
For each patient a detailed file (patient-ledger) can be consulted, containing the medical data/history  of the patient. 


## Goal: 
Create a dapp: 
- using ethereum and the Solidity language 
- deploy in on the rinkeby test network
- create a little UI to interact with te smart contract 

In this dapp I reuse a project I have already created with Angular. The goal is to replace the patient-ledger with
an ethereum smart contract. In the original project the medical info of patients is stored in a centralised database.
This data is exposed through a REST API.
 
## Project structure: 
### Ethereum 
In this folder the Ethereum contract written in Solidity is compiled and transformed. I did not use Truffle (there is one truffle dep), but 
created my own compile script. I was inspired by the Udemy course https://www.udemy.com/course/ethereum-and-solidity-the-complete-developers-guide.
If you change the contract in the contracts/patient-ledger, you need to recompile it! After the compilation step
the build folder should contain Hospital.json file. 

The deploy scripts contains code to deploy the contract on the Rinkeby testnetwork. I know my Pneumonic is hardcoded and visible, but
I have no real ether on it! This an improvement to wrap a crypt function around it. 

The result of the deploy is found in the result.json and this is used in the frontend-app as a config file. 

### Backend
A node backend that contains the data of the departments, which is exposed with Rest by using Express. 
Note: the patient are also stored in there, but in this project this api is not used! We use the smart contract as DB!

### Frontend 
Contains the angular application. In this ethereum module the magic between the deployed contract (see result.json)
and the frontend is located. The eth.service.ts class is angular service that is used in the patient.component.ts to
interact with the contract. 
Note that anything at http://localhost:4200/patients/{patientId} you first need to create a patient and hospitalization. 
This needs to be done outside this application, because there is no UI for this. (Lack of time). 
In eth.service.ts uncomment line 26 and then a patient will be inserted. After this is done you should go to
 http://localhost:4200/patients/0 and you can see the patient and add/update treatments (interaction with the smart contract);

### Test
Using ganache the contract is unit tested using Mocha on a local ganache network. Make sure to first compile the contract!

#Run instructions

- npm install in the backend, frontend and main Hospital folder
- node compile.js from the ethereum folder 
- node deploy.js from the ethereum folder
- npm test in the main Hospital folder to see if the unit tests pass
- npm app.js in the backend folder
- ng serve in the frontend folder
- if no patient is visible then eth.service.ts uncomment line 26 refresh and comment it back later because this will fail the second time!




