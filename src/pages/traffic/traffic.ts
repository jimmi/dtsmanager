import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the TrafficPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-traffic',
  templateUrl: 'traffic.html',
})
export class TrafficPage {

 public traffics: any;
  public hasTraffic: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public DB: DatabaseProvider) {
    this.displayStationTraffic(this.navParams.get('station'), true);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TrafficPage'+this.navParams);
  }


  displayStationTraffic(stationName, terminated) {
    this.DB.retrieveTrafficByStation(stationName, terminated).then((doc) => {
      if (Object.keys(doc).length) {
        this.traffics = doc;
        this.hasTraffic = true;
        console.log('traffic names inside home display traffic', doc);
      }
      else {
        console.log('traffics are empty');
      }
      // var r:  any;
      // for(r in  doc){
      // console.log( "value in doc is "+r);
      // }
    });
  }

}
