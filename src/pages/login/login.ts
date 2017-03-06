import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Auth } from '../../providers/auth';
import { HomePage } from '../home/home';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  loginData: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController, public loading: LoadingController, public auth: Auth) {
    this.loginData = {
      username: '',
      password: ''
    };
    this.auth.getCurrentUser().then(
      data => {
       if(data) {
         let auth_data = JSON.parse(data);
         this.auth.setCurrentUser(auth_data.user, auth_data.token);
         this.navCtrl.setRoot(HomePage);
       } 
      },
      err => console.log('ERROR getCurrentUser: ', err)
    );
  }

  login(username: string, password: string) {
    this.auth.login(username, password).subscribe(
      data => {
        if(data.err) {
          this.toast.create({
            message: data.msg,
            duration: 2000
          }).present();
          return;
        }
        this.toast.create({
          message: 'Sesión iniciada correctamente',
          duration: 2000
        }).present();
        console.log(data);
        this.auth.setCurrentUser(data.user, data.token);
        this.navCtrl.setRoot(HomePage);
      },
      err => console.log(err)
    );
  }

}
