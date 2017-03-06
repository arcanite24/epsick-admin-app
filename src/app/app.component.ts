import { Component, ViewChild } from '@angular/core';
import { Platform, ToastController, NavController, MenuController } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { Auth } from '../providers/auth';

declare var io: any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild('content') nav: NavController;
  rootPage = LoginPage;
  mainPage = HomePage;

  socket_endpoint: string = this.auth.api_endpoint;

  loggedUser: any;

  constructor(platform: Platform, public auth: Auth, public toast: ToastController, public menu: MenuController, public http: Http) {
    this.loggedUser = {};
    this.auth.getCurrentUser().then(
      data => {
        let tempData = JSON.parse(data);
        this.loggedUser = tempData.user;
      }
    ).catch(err => console.log(err));

    platform.ready().then(() => {
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  goPage(page) {
    this.menu.close();
    this.nav.push(page);
  }

  logout() {
    this.auth.logout().then(
      data => {
        console.log(data);
        this.toast.create({
          message: 'Sesión cerrada correctamente.',
          duration: 2000
        }).present();
        this.menu.close();
        this.nav.setRoot(LoginPage);
      }
    ).catch(err => console.log(err));
  }

}
