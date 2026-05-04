import {
	HttpEvent,
	HttpHandler,
	HttpInterceptor,
	HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
	constructor(private authService: AuthService) {}

	intercept(
		req: HttpRequest<unknown>,
		next: HttpHandler,
	): Observable<HttpEvent<unknown>> {
		const token = this.authService.getToken();

		if (token) {
			const headers: Record<string, string> = {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			};

			if (!(req.body instanceof FormData)) {
				headers["Content-Type"] = "application/json";
			}

			req = req.clone({ setHeaders: headers });
		}

		return next.handle(req);
	}
}
