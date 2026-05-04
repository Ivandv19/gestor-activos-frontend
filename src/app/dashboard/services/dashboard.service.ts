import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import {
	DashboardAlertasResponse,
	DashboardResumen,
} from "../../models/dashboard.interface";
@Injectable({
	providedIn: "root",
})
export class DashboardService {
	private apiUrl = `${environment.apiUrl}/dashboard`;

	constructor(private http: HttpClient) {}

	getResumen(): Observable<DashboardResumen> {
		return this.http.get<DashboardResumen>(`${this.apiUrl}/resumen`);
	}

	getAlertas(): Observable<DashboardAlertasResponse> {
		return this.http.get<DashboardAlertasResponse>(`${this.apiUrl}/alertas`);
	}
}
