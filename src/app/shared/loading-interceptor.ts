import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor,
  HttpResponse,
  HttpEventType
} from '@angular/common/http';
import { finalize, tap } from 'rxjs/operators';

import { LoadingService } from '../services/loading.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private totalRequests = 0;

  constructor(private loadingService: LoadingService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    this.loadingService.setLoading(true);

    return next.handle(request).pipe(
      tap(event => {
        if (event.type === HttpEventType.Response) {
          this.loadingService.setLoading(false);
        }
      })
    )

    // this.totalRequests++;

    // return next.handle(request).pipe(
    //   finalize(() => {
    //     this.totalRequests--;
    //     if (this.totalRequests === 0) {
    //       // this.loadingService.setLoading(false);
    //     }
    //   })
    // );
  }
}
