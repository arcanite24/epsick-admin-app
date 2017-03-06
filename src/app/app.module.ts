import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProductionPage } from '../pages/production/production';
import { ManualOrderPage } from '../pages/manual-order/manual-order';

import { Auth } from '../providers/auth';
import { Back } from '../providers/back';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    ProductionPage,
    ManualOrderPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    ProductionPage,
    ManualOrderPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Auth, Storage, Back]
})
export class AppModule {}
