import { Component } from '@angular/core';
import { Geolocation } from 'ionic-native';
import { NavController, ToastController, LoadingController, AlertController } from 'ionic-angular';

import { Auth } from '../../providers/auth';
import { Back } from '../../providers/back';
import { ProductionPage } from '../production/production';
import { ManualOrderPage } from '../manual-order/manual-order';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  ftList: Array<any>;
  productionPage = ProductionPage;

  constructor(public navCtrl: NavController, 
  public auth: Auth, public back: Back, 
  public load: LoadingController, 
  public toast: ToastController, 
  public alert: AlertController) {
    
  }

  navigate(page) {
    this.navCtrl.push(page);
  }

  goManualOrder(id: string, name: string) {
    this.navCtrl.push(ManualOrderPage, {id: id, name: name});
  }

  enterProduction(page, id) {
    this.navCtrl.push(page, {id: id});
  }

  toggleAbierto(id: string, bool: boolean, i) {
    let loader = this.load.create({content: 'Cambiando status...'});
    loader.present();
    this.back.toggleAbierto(id, bool).subscribe(
      data => {
        this.ftList[i].abierto = bool;
        loader.dismiss();
      },
      err => loader.dismiss()
    );
  }

  openChangePosition(id: string) {
    let alert = this.alert.create({
      title: '¿Estás seguro?',
      message: 'Se cambiará la posición de tu Food Truck a tu posición actual',
      buttons: [
        {
          text: 'Cambiar',
          handler: data => {
            let loader = this.load.create({content: 'Cambiando posición...'});
            loader.present();
            Geolocation.getCurrentPosition().then(
              data => {
                this.back.changePosition(data.coords.latitude, data.coords.longitude, id).subscribe(
                  dataUpdate => {
                    loader.dismiss();
                    this.toast.create({message: 'Posición actualizada correctamente', duration: 2000}).present();
                  },
                  errUpdate => {
                    loader.dismiss();
                    this.toast.create({message: 'No se pudo actualizar la posición', duration: 2000}).present();
                  }
                );
              }
            ).catch(err => {
              console.log(err);
              this.toast.create({message: 'Error, no se pudo obtener la posicion actual', duration: 2000});
              loader.dismiss();
            });
          }
        },
        {
          text: 'Cancelar',
          handler: data => {

          }
        }
      ]
    });
    alert.present();
  }

  ionViewWillEnter() {
    let loader = this.load.create({content: 'Cargando foodtrucks...'});
    loader.present();
    this.back.getFoodtruckAdmin(this.auth.user_id).subscribe(
      data => {
        this.ftList = data;
        this.ftList.map(ft => {
          if(!ft.abierto) ft.abierto = false;
          return ft;
        });
        loader.dismiss();
      },
      err => {
        console.log(err);
        loader.dismiss();
      }
    );
  }

}
