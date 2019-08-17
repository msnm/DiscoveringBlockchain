import {Inject, Injectable} from '@angular/core';
import {WEB3} from "./token";
import {Web3, Contract } from 'web3';
import {fromPromise} from "rxjs/internal-compatibility";
import {from, Observable, of} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";
import {HospitalizationInfo, Patient, Treatment} from "../shared/model/patient.model";

declare let require: any;
const hospitalABI = require('../../../../ethereum/build/Hospital.json');
const contractDetails = require('../../../../ethereum/result.json');

@Injectable({
  providedIn: 'root'
})
export class EthService {

  /** Create local instance of the contract **/
  contract: Contract;

  /** Address of the logged in nurse **/
  addressNurse: Observable<string | Error>;

   constructor(@Inject(WEB3) private web3: Web3) {
     this.contract = new this.web3.eth.Contract(JSON.parse(hospitalABI.interface), contractDetails.address);
   //  this.test();
   }

   getContract() : Contract {
     this.contract =  new this.web3.eth.Contract(JSON.parse(hospitalABI.interface), contractDetails.address);
     return this.contract;
   }

  async test() {
     try {
       const director = await this.getContract().methods.director().call();
       console.log('This is the director of the hospital', director);
       const patientCount = await this.getContract().methods.getPatientCount().call();
       console.log('The patientCount is', patientCount);
       const patient = await this.getContract().methods.getPatientById(0).call();
     }
     catch(err) {
       console.log('Oeps something went wrong:', err);
     }
  }

  /** Return the list of accounts available */
  public getAccounts(): Observable<string[]> {
    return fromPromise(this.web3.eth.getAccounts());
  }

  /** Get the current account */
  public currentAccount(): Observable<string | Error> {
    if (this.web3.eth.defaultAccount) {
      return of(this.web3.eth.defaultAccount);
    } else {
      return this.getAccounts().pipe(
        tap((accounts: string[]) => {
          if (accounts.length === 0) { throw new Error('No accounts available'); }
        }),
        map((accounts: string[]) => accounts[0]),
        tap((account: string) => this.web3.eth.defaultAccount = account),
        catchError((err: Error) => of(err))
      );
    }
  }

  /** Get the current account */
  currentNurse(): String {
    if (this.web3.eth.defaultAccount) {
      return this.web3.eth.defaultAccount;
    } else {
      this.getAccounts().subscribe(nurse => { return nurse });
    }
  }

  public  getPatientCount(): Observable<number> {
    return from(this.contract.methods.getPatientCount().call());
  }

  public getPatientById(id: number): Observable<Patient> {
    const patient = async () => {
      const patientResult = await this.getContract().methods.getPatientById(id).call({from: contractDetails.owner});
      const hospResult = await this.getContract().methods.getHospitalizationById(id).call();
      const treatmentCount = await this.getContract().methods.getTreatmentCountById(id).call({from: contractDetails.owner});
      let treatments = [];
      for(let i = 0; i < treatmentCount; i++) {
        console.log(i);
        await this.getContract().methods.getTreatmentById(id, i).call({from: contractDetails.owner}).then(result => treatments.push(result));
      }
      return this.resultToPatient(patientResult, hospResult, treatments);
    };
    return from(patient());
  }

  resultToPatient(patientResult, hospResult, treatmentsResults) {
    const patient = new Patient();
    patient.id = patientResult.id;
    patient.firstName = patientResult.firstName;
    patient.lastName = patientResult.lastName;
    patient.food = patientResult.foodPreference;
    patient.birthDate = new Date(+patientResult.birthDate);
    patient.id = patientResult.id;
    const hosp = new HospitalizationInfo();
    hosp.id = 0;
    hosp.admission = new Date(+hospResult.admissionDate);
    hosp.reason = hospResult.reason;
    hosp.plannedResignation =  new Date(+hospResult.plannedResignation);
    patient.hospitalizationInfo = hosp;
    if(treatmentsResults && treatmentsResults.length > 0) {
      patient.treatments = [];
      for (let treatmentResult of treatmentsResults) {
        patient.treatments.push(this.resultToTreatment(treatmentResult));
      }
    }
    console.log('ResultToPatient', JSON.stringify(patient));
    return patient;
  }

  resultToTreatment(treatmentResult) {
    const treatment = new Treatment();
    treatment.id = treatmentResult.id;
    treatment.status = treatmentResult.status;
    treatment.type = treatmentResult.typeOfTreatment;
    treatment.description = treatmentResult.description;
    treatment.dateOfTreatment = new Date(+treatmentResult.date);
    return treatment;
  }

  public addTreatment(patient: Patient) : Observable<Patient> {
    const treatment = patient.treatments[patient.treatments.length - 1];
    return from(this.getContract().methods
      .insertTreatment(patient.id, treatment.type, treatment.description, treatment.dateOfTreatment.getTime(), treatment.status)
      .send({ from: contractDetails.owner, gas: '2000000'})
      .then( result => {
        console.log('AddTreatment result: ', JSON.stringify(result.events.TreatmentEvent.returnValues));
        const count = this.getContract().methods.getTreatmentCountById(patient.id).call();
        console.log('The new TreatmentCount is: ', count);
        patient.treatments[patient.treatments.length - 1].id = count - 1;
        return patient;
      }));
  }

  public updateTreatment(patient, treatmentId: number): Observable<Patient> {
    const treatment = patient.treatments[treatmentId]; //index == treatmentId
    return from(this.getContract().methods
      .updateTreatment(patient.id, treatmentId, treatment.type, treatment.description, treatment.dateOfTreatment.getTime(), treatment.status)
      .send({ from: contractDetails.owner, gas: '2000000'})
      .then( result => {
        console.log('Update result: ', result);
        return patient;
      }));
  }


  //test function to create patients. Not used in UI!
  async insertPatient() {
    const patient = await this.contract.methods.insertPatient('Michael', 'Schoenmaekers', 'CARNIVORE', new Date('1994/02/01').getTime())
      .send({ from: contractDetails.owner, gas: '2000000'});
    console.log(patient);
  }
  async insertHospitalization() {
    const hosp = await this.contract.methods
      .insertHospitalization(0, new Date().getTime(), 'Gebroken been', new Date().getTime())
      .send({ from: contractDetails.owner, gas: '2000000'});

    console.log(hosp);
  }


  /**
   *
   Result {
  '0': 'Michael',
  '1': 'Schoenmaekers',
  '2': 'CARNIVORE',
  '3': '760057200000',
  '4': '0',
  firstName: 'Michael',
  lastName: 'Schoenmaekers',
  foodPreference: 'CARNIVORE',
  birthDate: '760057200000',
  id: '0' }
   */
}


