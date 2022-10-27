import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './form.component';
import { FormRoutingModule } from './form-routing.module';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [FormComponent],
  imports: [CommonModule, FormRoutingModule, ReactiveFormsModule],
})
export class FormModule {}
