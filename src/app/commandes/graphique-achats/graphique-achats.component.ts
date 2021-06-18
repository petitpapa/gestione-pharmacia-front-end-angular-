import {Component, OnInit} from '@angular/core';
import {StatsService} from "../../core/services/stats.service";

@Component({
  selector: 'app-graphique-achats',
  templateUrl: './graphique-achats.component.html',
  styleUrls: ['./graphique-achats.component.scss']
})
export class GraphiqueAchatsComponent implements OnInit {

  productPurchaseData:any;


  constructor(private statsService: StatsService) {

  }

  async ngOnInit(): Promise<void> {
    const res =   await this.statsService.loadPurchaseProductByMonth().toPromise();
    this.productPurchaseData = res?.results;
  }

}
