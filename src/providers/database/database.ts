import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';
import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DatabaseProvider {

  private _DB: any;
  private success: boolean = true;
  private remote: any;

  constructor(public http: HttpClient,
    public alertCtrl: AlertController) {
    this.initialiseDB();
    console.log('Hello DatabaseProvider Provider');
    PouchDB.plugin(PouchFind);
  }


  initialiseDB() {
    this._DB = new PouchDB('comics');
    this.remote = 'http://localhost:5984/comics';
    let options = {
      live: true,
      retry: true,
      continuous: true
    };

    this._DB.sync(this.remote, options);

  }



  addComic(station, traffic, rating, note, image) {
    var timeStamp = new Date().toISOString(),
      base64String = image.substring(23),
      comic = {
        _id: timeStamp,
        station: station,
        traffic: traffic,
        rating: rating,
        note: note,
        _attachments: {
          "character.jpg": {
            content_type: 'image/jpeg',
            data: base64String
          }
        }
      };

    return new Promise(resolve => {
      this._DB.put(comic).catch((err) => {
        this.success = false;
      });

      resolve(true);

    });
  }



  updateComic(id, station, traffic, rating, note, image, revision) {
    var base64String = image.substring(23),
      comic = {
        _id: id,
        _rev: revision,
        station: station,
        traffic: traffic,
        rating: rating,
        note: note,
        _attachments: {
          "character.jpg": {
            content_type: 'image/jpeg',
            data: base64String
          }
        }
      };

    return new Promise(resolve => {
      this._DB.put(comic)
        .catch((err) => {
          this.success = false;
        });

      if (this.success) {
        resolve(true);
      }
    });
  }



  retrieveComic(id) {
    return new Promise(resolve => {
      this._DB.get(id, { attachments: true })
        .then((doc) => {
          var item = [],
            dataURIPrefix = 'data:image/jpeg;base64,',
            attachment;

          if (doc._attachments) {
            attachment = doc._attachments["character.jpg"].data;
          }

          item.push(
            {
              id: id,
              rev: doc._rev,
              traffic: doc.traffic,
              station: doc.station,
              note: doc.note,
              rating: doc.rating,
              image: dataURIPrefix + attachment
            });
          resolve(item);
        })
    });
  }

  retrieveStations() {
    return new Promise(resolve => {
      this._DB.get("strdtsstationnamesa27f3866001ce0").then((doc) => {

        var items = [];
        console.log('station names retrieved', doc.stationlist);
        items.push(doc.stationlist)

        resolve(items);
      });
    });
  }


  retrieveTrafficByStation(stationName, terminated) {
    return new Promise(resolve => {
      this._DB.query(function (doc, emit) {
        emit(doc.station, doc.traffic);
      }, { key: stationName }).then(function (result) {

        let k, items = [],
          row = result.rows

        for (k in row) {
          console.log('station names retrieved inside retrive traffic', row[k]);
          var item = row[k];
          if (item.value) {
            items.push(
              {
                trafficName: item.value,
                station: item.key,
                trafficId: item.id
              });
          }
          resolve(items);
          console.log('inside view traffic names retrieved', items);
        }
      });
    });
  }


  retrieveStationsByHrno(hr_no) {
    return new Promise(resolve => {
      this._DB.query(function (doc, emit) {
        emit(doc.hrno, doc.stations);
      }, { key: hr_no }).then(function (result) {

        let stationNames = [],
          row = result.rows
        console.log('station names retrieved by HR NO', row[0]);
        if (row[0]) {
          var item = row[0];
          if (item.value) {
              stationNames.push(
              {
                stations: item.value,
                stationId: item.id
              });
          }
          console.log('inside view stations names retrieved', stationNames);
          resolve(stationNames);
        }
      });
    });
  }



  retrieveComics() {
    return new Promise(resolve => {
      this._DB.allDocs({ include_docs: true, descending: true, attachments: true }, function (err, doc) {
        let k,
          items = [],
          row = doc.rows;

        for (k in row) {

          console.log('station names retrieved', row[k]);
          if (row[k].doc.traffic) {
            var item = row[k].doc,
              dataURIPrefix = 'data:image/jpeg;base64,',
              attachment;

            if (item._attachments) {
              attachment = dataURIPrefix + item._attachments["character.jpg"].data;
            }

            items.push(
              {
                id: item._id,
                rev: item._rev,
                traffic: item.traffic,
                station: item.station,
                note: item.note,
                rating: item.rating,
                image: attachment
              });
          }
        }
        resolve(items);
      });
    });
  }



  /*  retriveStationlist() {
   
      this._DB.query('_design/bsnl/_views/trafficlist').then(function (result) {
        console.log("inside stationlist function " + result);
        // found docs with name === 'foo'
      })
      .catch((err) => {
        console.log("inside stationlist err function " + err);
      });
    };
   
   
   
    retrieveComics() {
      return new Promise(resolve => {
        this._DB.query(
          function (doc, emit) {
            if (doc.station && doc.traffic) {
              emit(doc._id, { "station": doc.station, "traffic": doc.traffic, "note": doc.note, "_attachemnts": doc._attachments, "rating": doc.rating }
              )
            }
          }
          , function (err, response) {
            console.log("return from DB query is " + response.toISOString + " and err is ");
            let k,
              items = [],
              row = response.rows;
   
            for (k in row) {
              var item = row[k].doc,
                dataURIPrefix = 'data:image/jpeg;base64,',
                attachment;
              console.log("DB query rows " + item);
   
              if (item._attachments) {
                attachment = dataURIPrefix + item._attachments["character.jpg"].data;
              }
   
              items.push(
                {
                  id: item._id,
                  rev: item._rev,
                  traffic: item.traffic,
                  station: item.station,
                  note: item.note,
                  rating: item.rating,
                  image: attachment
                });
   
            }
            resolve(items);
          });
      });
    }
  */

  removeComic(id, rev) {
    return new Promise(resolve => {
      var comic = { _id: id, _rev: rev };

      this._DB.remove(comic)
        .catch((err) => {
          this.success = false;
        });

      if (this.success) {
        resolve(true);
      }
    });
  }



  errorHandler(err) {
    let headsUp = this.alertCtrl.create({
      title: 'Heads Up!',
      subTitle: err,
      buttons: ['Got It!']
    });

    headsUp.present();
  }


}