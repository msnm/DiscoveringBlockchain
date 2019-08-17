import {Inject, Injectable} from '@angular/core';
import {WEB3} from "./token";
import Web3 from 'web3';
import {fromPromise} from "rxjs/internal-compatibility";
import {Observable, of} from "rxjs";
import {catchError, map, tap} from "rxjs/operators";

declare let require: any;
const hospitalABI = require('../../../ethereum/build/Hospital.json');
const contractAddresss = '1234';
@Injectable({
  providedIn: 'root'
})
export class EthService {

  constructor(@Inject(WEB3) private web3: Web3) { }
  
  private contract: any; 
  /** Create local instance of the contract **/
  
  private getContract() {
    this.web3.eth.Contract(hospitalABI, contractAddresss);
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

  public getPatient(id: number) {
  }

  public enableProvider() {
    console.log(this.web3.currentProvider);
    this.web3.currentProvider.enable();
  }
}
