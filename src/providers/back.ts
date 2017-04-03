import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';

@Injectable()
export class Back {
  
  api_endpoint: string;

  constructor(public http: Http, public auth: Auth) {
    this.api_endpoint = this.auth.api_endpoint;
  }

  //General
  getFoodtruckAdmin(id: string) {
    return this.http.get(this.api_endpoint + 'api/foodtruck/myFoodtrucks/' + id).map(res => res.json());
  }

  //Produccion
  getOrdenesPreparacion(id: string) {
    return this.http.get(this.api_endpoint + 'api/foodtruck/getOrdenesPreparacion/' + id).map(res => res.json());
  }

  getOrdenesEntrega(id: string) {
    return this.http.get(this.api_endpoint + 'api/foodtruck/getOrdenesEntrega/' + id).map(res => res.json());
  }

  cancelOrder(id: string) {
    return this.http.get(this.api_endpoint + 'api/user/cancelarOrden/' + id).map(res => res.json());
  }

  moveToEntrega(id: string) {
    return this.http.post(this.api_endpoint + 'api/user/moverAEntrega', {id: id}).map(res => res.json());
  }

  entregarOrden(id: string) {
    return this.http.get(this.api_endpoint + 'api/user/entregarOrden/' + id).map(res => res.json());
  }

  //Orden Manual
  getActiveMenuCategories(id: string) {
    return this.http.get(this.api_endpoint + 'api/foodtruck/getCategoriasMenuActivo/' + id).map(res => res.json());
  }

  getProductosCategoria(ft_id: string, id_cat: string) {
    return this.http.get(this.api_endpoint + 'api/foodtruck/getProductosCategoriaMenuAction/' + ft_id + '/' + id_cat).map(res => res.json());
  }

  procesarOrden(cart: any) {
    return this.http.post(this.api_endpoint + 'api/main/processOrder', {order: cart}).map(res => res.json());
  }

  confirmarCompra(order: any) {
    order.origin = 'app_admin';
    return this.http.post(this.api_endpoint + 'api/main/solicitarPagoCrearRegistro', {order: order}).map(res => res.json());
  }

  changePosition(lat, lng, id: string) {
    return this.http.post(this.api_endpoint + 'api/foodtruck/changePosition', {id: id, lng: lng, lat: lat}).map(res => res.json());
  }

  toggleAbierto(id: string, bool: boolean) {
    return this.http.post(this.api_endpoint + 'api/foodtruck/toggleAbierto', {id: id, abierto: bool}).map(res => res.json());
  }

}
