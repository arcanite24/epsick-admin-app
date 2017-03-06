import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Back } from '../../providers/back';
import { Auth } from '../../providers/auth';

@Component({
  selector: 'page-manual-order',
  templateUrl: 'manual-order.html'
})
export class ManualOrderPage {

  ft_name: string;
  ft_id: string;
  cat_list: Array<any>;
  order: Array<any>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public back: Back, public toast: ToastController, public auth: Auth, public loading: LoadingController) {
    this.ft_id = navParams.get('id');
    this.ft_name = navParams.get('name');
    this.cat_list = [];
    this.order = [];
  }

  addProd(id: string, quantity: number, i_list: number, i_prod: number) {
    let found = false;
    let index = 0;
    let current_prod = this.cat_list[i_list].productos[i_prod];
    this.order.forEach((prod, i) => {
      if(prod.id == id) {
        index = i;
        found = true;
        current_prod = prod;
      }
    });
    
    if(quantity > 0) {
      //Agregar      
      if(found) {
        //Producto ya en la lista
        this.order[index].quantity += quantity;        
      } else {
        //Agregar nuevo producto
        this.order.push({
          id: id,
          quantity: quantity,
          price: current_prod.price,
          components: current_prod.components,
          name: current_prod.name
        });
      }
      if(!this.cat_list[i_list].productos[i_prod].quantity) this.cat_list[i_list].productos[i_prod].quantity = 0;
      this.cat_list[i_list].productos[i_prod].quantity += quantity;
    } else if (quantity < 0) {
      if(found) {
        if(this.order[index].quantity <= 1) {
          this.order.splice(index, 1);
          this.cat_list[i_list].productos[i_prod].quantity = 0;
        } else {
          this.order[index].quantity += quantity;
          if(!this.cat_list[i_list].productos[i_prod].quantity) this.cat_list[i_list].productos[i_prod].quantity = 0;
          this.cat_list[i_list].productos[i_prod].quantity += quantity;
        }
      }
    }
    console.log(this.order);
    
  }

  buy() {
    let loader = this.loading.create({content: 'Procesando compra...'});
    loader.present();
    this.back.procesarOrden({productos: this.order}).subscribe(
      data => {
        console.log('RETURN PROCESAR ORDEN', data);
        if(data.err) {
          loader.dismiss();
          this.toast.create({message: data.err, duration: 2000}).present();
          return;
        } else {
          console.log(data.order);
          
          let order_post = {
            order: data.order,
            subtotal: data.subtotal,
            total: data.total,
            foodtruck: this.ft_id,
            made_by_user: this.auth.user_id,
            payment_method: 'pago_draft1',
            number: Math.floor(Math.random()*(99-10+1)+10)
          };
          this.back.confirmarCompra(order_post).subscribe(
            data_compra => {
              console.log('confirmarCompra: ', data_compra);              
              this.toast.create({message: 'Compra concretada correctamente.', duration: 2000}).present();
              //Reload carrito y numeros


              loader.dismiss();
            },
            err => {
              loader.dismiss();
              this.toast.create({message: 'No se pudo completar la orden.', duration: 2000}).present();
            }
          );
        }
      },
      err => {
        console.log(err);
        loader.dismiss();
        this.toast.create({message: 'No se pudo procesar la orden.', duration: 2000}).present();
      }
    );
  }

  ionViewWillLoad() {
    this.back.getActiveMenuCategories(this.ft_id).subscribe(
      categories => {
        console.log(categories);
        this.cat_list = categories;
        categories.forEach((cat, i) => {
          this.back.getProductosCategoria(this.ft_id, cat.id).subscribe(
            prods => {
              this.cat_list[i].productos = prods;
            },
            err => {
              this.toast.create({message: 'Error al obtener categorías.', duration: 2000});
              this.navCtrl.pop();
            }
          );
        });
      },
      err => {
        console.log(err);
        this.toast.create({message: 'Error al obtener categorías.', duration: 2000});
        this.navCtrl.pop();
      }
    );
  }

}
