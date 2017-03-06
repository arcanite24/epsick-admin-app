import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {

  public api_endpoint: string;
  public user_id: string;
  public user_obj: any;
  public token: string;
  public session_id: string;

  constructor(public http: Http, public storage: Storage) {
    this.api_endpoint = 'http://admin.epsick.com/';
  }

  setCurrentUser(user: any, token: string, ) {
    this.user_id = user.id;
    this.user_obj = user;
    this.token = token;
    this.storage.set('auth_info', JSON.stringify({user: this.user_obj, token: this.token})).then(
      () => console.log('Usuario y Token Guardado'),
      err => console.log(err)
    );
  }

  getCurrentUser() {
    return this.storage.get('auth_info');
  }

  login(username: string, password: string) {
    return this.http.post(this.api_endpoint + 'auth', {username: username, password: password}).map(res => res.json());
  }

  logout() {
    return this.storage.remove('auth_info');
  }

}
