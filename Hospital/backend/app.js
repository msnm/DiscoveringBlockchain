const fs = require('fs');
const express = require("express");
const cors = require('cors')
const logger = require("morgan");
const departmentsRouter = require('./routes/departmentsRouter');
const patientsRouter = require('./routes/patientsRouter');

// 1. Setting up express Server on port 3000
const port = 3000;
const app = express();
app.listen(port);
app.use(cors());

// 2 Adding a logger MiddleWare with "use".
app.use(logger("dev"));

// 3. Importing routers
app.use("/api/departments", departmentsRouter);
app.use("/api/patients", patientsRouter);

// 4. All the other requested uris are not knownç
app.all("*", (req, res) => {
    res.status = 404;
});

function createPatientsDataFromBackUp() {
    const patientsData = './data/original/patients.json';

    let patientsList = JSON.parse(fs.readFileSync(patientsData));
    let newPatientsList = [];

    for(let i = 1; i <= 6; i++) {
        patientsList.forEach(patient =>  {
            let nPatient = JSON.parse(JSON.stringify(patient));
            nPatient.id = nPatient.id + 1000 * i;
            newPatientsList.push(JSON.parse(JSON.stringify(nPatient)));
        });
    }
    fs.writeFileSync('./data/patients.json', JSON.stringify(newPatientsList));
}


