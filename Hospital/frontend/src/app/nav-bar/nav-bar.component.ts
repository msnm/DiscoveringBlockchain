import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {EthService} from "../ethereum/eth.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent implements OnInit, OnDestroy {

  public ethereumAddress: string;
  public alive = true;
  constructor(private ethService: EthService, private zone : NgZone) { }

  async ngOnInit() {
    await this.ethService.currentAccount().subscribe(
      (address: string) => this.zone.run(() => {this.ethereumAddress = address}),
        err => console.log(err));
  }

  ngOnDestroy(): void {
    this.alive = false;
  }
}
