import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { RequestForm } from "../interfaces";
import { RequestsService } from "../services/requests.service";

@Injectable({ providedIn: 'root' })

export class RequestResolver implements Resolve<RequestForm> {
  constructor(private requestsService: RequestsService) {
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RequestForm> | Promise<RequestForm> | RequestForm {
    return this.requestsService.getJsonDoc(+route.params['id'])
}
}
