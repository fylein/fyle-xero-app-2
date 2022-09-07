import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { XeroCallbackRoutingModule } from './xero-callback-routing.module';
import { XeroCallbackComponent } from './xero-callback.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    XeroCallbackComponent
  ],
  imports: [
    CommonModule,
    XeroCallbackRoutingModule,
    SharedModule
  ]
})
export class XeroCallbackModule { }
