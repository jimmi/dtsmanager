import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { User } from "../../shared/models/user";
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  user = {} as User;
  constructor(private afAuth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, public app: App) {
  }

  async login(user: User) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result) {
        console.log(result);
        // const root = this.app.getRootNav();
        // root.popToRoot();
        // root.setRoot("LoginPage");
        this.navCtrl.setRoot(HomePage);
      }
    }
    catch (e) {
      console.error(e);
    }
  }

  async register(user: User) {
    // const root = this.app.getRootNav();
    // root.popToRoot();
    // root.setRoot(HomePage)

    // this.navCtrl.setRoot(HomePage)
    //   .then(data => {
    //     console.log(data);
    //   }, (error) => {
    //     console.log(error);
    //   })
    try {
      const result = await this.afAuth.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      if (result) {
        console.log(result);
        this.navCtrl.setRoot('HomePage');
      }
    } catch (e) {
      console.error(e);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

}
