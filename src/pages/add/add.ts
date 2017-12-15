import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ImageProvider } from '../../providers/image/image';
import { DatabaseProvider } from '../../providers/database/database';
/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {

  public form: FormGroup;
  public trafficName: any;
  public stationName: any;
  public comicRating: any;
  public comicNote: any;
  public comicImage: any;
  public characterImage: any;
  public recordId: any;
  public revisionId: any;
  public isEdited: boolean = false;
  public hideForm: boolean = false;
  public pageTitle: string;
  public stationList: any;

  constructor(public navCtrl: NavController,
    public NP: NavParams,
    public fb: FormBuilder,
    public IMAGE: ImageProvider,
    public DB: DatabaseProvider,
    public toastCtrl: ToastController
  ) {


    this.form = fb.group({
      traffic: ["", Validators.required],
      station: ["", Validators.required],
      "rating": ["", Validators.required],
      "image": ["", Validators.nullValidator],
      "note": ["", Validators.required]
    });



/*

    this.DB.retrieveTraffic('Pattalam').then((doc) => {
      this.trafficName = doc[0];
      console.log('traffic names in db', doc);
      // var r:  any;
      // for(r in  doc){
        // console.log( "value in doc is "+r);
      // }
    });

*/



    this.resetFields();
    let stations: any;
    //  let item : any;
    //  this.items = ["MQ","Pattalam","Wadakkanchery"];
    this.DB.retrieveStations().then((doc) => {
      console.log('station names in db', doc[0]);
      this.stationList = doc[0];
      stations = doc[0];
    });
    //  let stations = this.stationlist.split(",");
    //  let stations = "hai,hello".split(",");
    console.log('station names in add', this.stationList);
    console.log('station names in add', stations);
    //  this.stationList = "hhhhh";

    if (NP.get("key")){ // && NP.get("rev")) {
      this.recordId = NP.get("key");
      this.revisionId = NP.get("rev");
      this.isEdited = true;
      this.selectComic(this.recordId);
      this.pageTitle = 'Modify traffic';
    }
    else {
      this.recordId = '';
      this.revisionId = '';
      this.isEdited = false;
      this.pageTitle = 'Create entry';
    }
  }



  selectComic(id) {
    this.DB.retrieveComic(id)
      .then((doc) => {
        this.trafficName = doc[0].traffic;
        this.stationName = doc[0].station;
        this.comicRating = doc[0].rating;
        this.comicNote = doc[0].note;
        this.comicImage = doc[0].image;
        this.characterImage = doc[0].image;
        this.recordId = doc[0].id;
        this.revisionId = doc[0].rev;
      });
  }



  saveComic() {
    let traffic: string = this.form.controls["traffic"].value,
      station: string = this.form.controls["station"].value,
      rating: number = this.form.controls["rating"].value,
      image: string = this.form.controls["image"].value,
      note: string = this.form.controls["note"].value,
      revision: string = this.revisionId,
      id: any = this.recordId;

    if (this.recordId !== '') {
      this.DB.updateComic(id, station, traffic, rating, note, image, revision)
        .then((data) => {
          this.hideForm = true;
          this.sendNotification(`${traffic} was updated in your Traffic details list`);
        });
    }
    else {
      this.DB.addComic(station, traffic, rating, note, image)
        .then((data) => {
          this.hideForm = true;
          this.resetFields();
          this.sendNotification(`${traffic} was added to your Traffic details list`);
        });
    }
  }



  takePhotograph() {
    this.IMAGE.takePhotograph()
      .then((image) => {
        this.characterImage = image.toString();
        this.comicImage = image.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  }



  selectImage() {
    this.IMAGE.selectPhotograph()
      .then((image) => {
        this.characterImage = image.toString();
        this.comicImage = image.toString();
      })
      .catch((err) => {
        console.log(err);
      });
  }



  deleteComic() {
    let character;

    this.DB.retrieveComic(this.recordId)
      .then((doc) => {
        character = doc[0].traffic;
        return this.DB.removeComic(this.recordId, this.revisionId);
      })
      .then((data) => {
        this.hideForm = true;
        this.sendNotification(`${character} was successfully removed from your comic characters list`);
      })
      .catch((err) => {
        console.log(err);
      });
  }



  resetFields(): void {
    this.stationName = "";
    this.comicRating = "";
    this.trafficName = "";
    this.comicNote = "";
    this.comicImage = "";
    this.characterImage = "";
  }



  sendNotification(message): void {
    let notification = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    notification.present();
  }

}