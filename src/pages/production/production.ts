import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';

import { Back } from '../../providers/back';
import { Auth } from '../../providers/auth';

declare var io;

@Component({
  selector: 'page-production',
  templateUrl: 'production.html'
})
export class ProductionPage {

  ft_id: string;
  public listaPreparacion: Array<any> = [];
  listaEntrega: Array<any> = [];
  room_name: string;
  loader: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public back: Back, public toast: ToastController, public auth: Auth, public chRef: ChangeDetectorRef, public zone: NgZone) {
    this.ft_id = navParams.get('id');
    this.listaEntrega = [];
    this.listaPreparacion = [];
    this.room_name = this.ft_id;
    this.loader = false;


    /*Socket Logic
    io.socket.on('prod-add-preparacion', msg => {
      this.listaPreparacion.push(msg);
      this.chRef.detectChanges();
      this.toast.create({message: 'Nueva orden de :' + msg.nameCustomer, duration: 1000});
    });
    */
    this.zone.runOutsideAngular(() => {
      io.socket.on('prod-add-preparacion', msg =>  {
        this.zone.run(() => {
          this.listaPreparacion.push(msg);
          this.toast.create({message: 'Nueva orden de :' + msg.nameCustomer, duration: 1000});
        });
      });
    });

    this.zone.runOutsideAngular(() => {
      io.socket.on('prod-add-entrega', msg =>  {
        this.zone.run(() => {
          this.listaEntrega.push(msg);
          this.toast.create({message: 'Orden lista para entregar de :' + msg.nameCustomer, duration: 1000});
        });
      });
    });

    //Conectar al socket de produccion
    io.socket.post(this.back.api_endpoint + 'api/produccion/joinFoodTruck', {
      idFt: this.ft_id,
      idUser: this.auth.user_id,
      idEmpleado: 1
    }, function(data) {
      console.log(data);
    });

  }

  ionViewWillEnter() {
    let loader = this.load.create({content: 'Cargando ordenes...'});
    loader.present();
    this.back.getOrdenesPreparacion(this.ft_id).subscribe(
      data => {
        console.log(data);
        this.listaPreparacion = data;
        this.back.getOrdenesEntrega(this.ft_id).subscribe(
          data => {
            console.log(data);
            this.listaEntrega = data;
            loader.dismiss();
          },
          err => {
            this.toast.create({message: 'No se pudieron cargar las ordenes listas para entregar.', duration: 2000}).present();
            loader.dismiss();
            this.navCtrl.pop();
          }
        );
      },
      err => {
        this.toast.create({message: 'No se pudieron cargar las ordenes en preparación.', duration: 2000}).present();
        loader.dismiss();
        this.navCtrl.pop();
      }
    );    
  }

  moveToEntrega(id: string, i: number) {
    this.loader = true;
    this.back.moveToEntrega(id).subscribe(
      data => {
        this.loader = false;
        this.listaPreparacion.splice(i, 1);
        this.toast.create({message: 'Orden movida a entrega.', duration: 1000}).present();
      }, err => {
        this.loader = false;
        this.toast.create({message: 'No se pudo mover la orden a entrega.', duration: 1000}).present();
      }
    );
  }

  entregarOrden(id: string, i: number) {
    this.loader = true;
    this.back.entregarOrden(id).subscribe(
      data => {
        this.loader = false;
        this.listaEntrega.splice(i, 1);
        this.toast.create({message: 'Orden entregada.', duration: 1000}).present();
      }, err => {
        this.loader = false;
        this.toast.create({message: 'No se pudo entregar la orden.', duration: 1000}).present();
      }
    )
  }

  removeOrder(type: number, id: string, i: number) {
    switch (type) {
      case 1:
        this.loader = true;
        this.back.cancelOrder(id).subscribe(
          data => {
            this.listaPreparacion.splice(i, 1);
            this.toast.create({message: 'Orden cancelada.', duration: 1000}).present();
            this.loader = false;
          }, err => {
            this.toast.create({message: 'No se pudo cancelar la orden.', duration: 1000}).present();
            this.loader = false;
          }
        );
        break;

      case 2:
        this.loader = true;
        this.back.cancelOrder(id).subscribe(
          data => {
            this.listaEntrega.splice(i, 1);
            this.toast.create({message: 'Orden cancelada.', duration: 1000}).present();
            this.loader = false;
          }, err => {
            this.toast.create({message: 'No se pudo cancelar la orden.', duration: 1000}).present();
            this.loader = false;
          }
        );
        break;
    
      default:
        this.toast.create({message: 'No se pudo cancelar la orden.', duration: 1000}).present();
        break;
    }
  }

}
