import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NavbarComponent } from "./navbar/navbar.component";
import { NavigationRoutingModule } from "./navigation-routing.module";
import { CajaNavComponent } from "./caja-nav/caja-nav.component";

@NgModule({
	declarations: [NavbarComponent, CajaNavComponent],
	imports: [CommonModule, NavigationRoutingModule],
	exports: [NavbarComponent],
})
export class NavigationModule {}
