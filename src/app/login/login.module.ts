import { CommonModule } from "@angular/common";
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { LoginComponent } from "./components/login/login.component";
import { LoginRoutingModule } from "./login-routing.module";

@NgModule({
	declarations: [LoginComponent],
	imports: [CommonModule, LoginRoutingModule, ReactiveFormsModule],
	schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoginModule {}
