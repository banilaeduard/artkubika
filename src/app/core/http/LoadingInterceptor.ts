import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse
} from '@angular/common/http';
import { LoadingOverlayRef, LoadingService } from '../services/loading.service';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
    constructor(private loadingService: LoadingService) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let loadingRef: LoadingOverlayRef;

        loadingRef = this.loadingService.open();

        return next.handle(req).pipe(tap((event: any) => {
            if (event instanceof HttpResponse && loadingRef) {
                setTimeout(loadingRef.close);
            }
        }), catchError((error: any) => {
            if (loadingRef) {
                setTimeout(loadingRef.close);
            }
            return throwError(error);
        }));
    }
}
