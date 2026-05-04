import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import "iconify-icon";

platformBrowserDynamic()
	.bootstrapModule(AppModule, {
		ngZoneEventCoalescing: true,
	})
	.catch((err) => console.error(err));
