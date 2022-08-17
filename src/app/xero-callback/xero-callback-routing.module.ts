import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { XeroCallbackComponent } from './xero-callback.component';


const routes: Routes = [
  {
    path: '',
    component: XeroCallbackComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XeroCallbackRoutingModule { }
