import { Component } from '@angular/core';
import { NavController, IonicPage } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public hasComics: boolean = false;
  public hasStations: boolean = false;
  public stations: any;
  public stationNames = [];
  public comics: any;
 

  constructor(public navCtrl: NavController,
    public DB: DatabaseProvider) {

  }

  ionViewWillEnter() {

    this.displayComics();
    // this.displayStationTraffic('MQ', true);
  }



  displayComics() {
    this.DB.retrieveComics().then((data) => {
      console.log("display comics inside home is " + data)
      let existingData = Object.keys(data).length;
      if (existingData !== 0) {
        this.hasComics = true;
        this.comics = data;
      }
      else {
        console.log("we get nada!");
      }
    });
  }

  displayStationsByHrno(hrno) {
    console.log("1display stations inside home is ")
    this.DB.retrieveStationsByHrno(hrno).then((data) => {
      console.log("2display stations inside home is " + data)
      let existingData = Object.keys(data).length;
      var k;
      if (existingData !== 0) {
        this.hasStations = true;
        var dtsNames = data[0].stations;
        console.log("3we are inside displaystationbyhrno" + dtsNames);

        for (k in dtsNames) {
          console.log("4we are inside for stationbyhrno" + dtsNames[k]);
          this.stationNames.push(
            { name: dtsNames[k] }
          )
        }
      }
      else {
        console.log("we get nada!");
      }
    });
  }


  addCharacter() {
    // this.navCtrl.push('AddPage');

    this.navCtrl.setRoot(HomePage)

  }

  viewCharacter(param) {
    this.navCtrl.push('AddPage', param);
  }

  openPage(pageName, param = {}) {
    this.navCtrl.push(pageName, param);
  }


}
