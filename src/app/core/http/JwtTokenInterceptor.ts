import { HttpRequest, HttpHandler, HttpInterceptor } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject, Observable, throwError, EMPTY, of } from "rxjs";
import { catchError, filter, switchMap, tap } from "rxjs/operators";
import { AuthentificationService } from "src/app/core/services/authentification.service";

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    constructor(
        @Inject('BASE_API_URL') private baseUrl: string,
        private authService: AuthentificationService,
        private router: Router) {
    }

    refreshTokenInProgress = false;

    tokenRefreshedSource = new Subject<boolean>();
    tokenRefreshed$ = this.tokenRefreshedSource.asObservable();


    addAuthHeader(request: HttpRequest<any>) {
        const authHeader = this.authService.User.jwtToken;
        const apiUrl = request.url.startsWith(this.baseUrl) || request.url.startsWith(location.origin + `/${this.baseUrl}`);
        if (authHeader && apiUrl) {
            return request.clone({
                setHeaders: {
                    "Authorization": 'Bearer ' + authHeader
                }
            });
        }
        return request;
    }

    refreshToken(): Observable<any> {
        if (this.refreshTokenInProgress) {
            return new Observable(observer => {
                this.tokenRefreshed$.subscribe(() => {
                    observer.next();
                    observer.complete();
                });
            });
        } else {
            this.refreshTokenInProgress = true;

            return this.authService.refreshToken().pipe(
                tap(() => {
                    this.refreshTokenInProgress = false;
                    this.tokenRefreshedSource.next(true);
                }),
                catchError((err) => {
                    this.tokenRefreshedSource.next(false);
                    this.refreshTokenInProgress = false;
                    this.logout();
                    return of(err);
                }));
        }
    }

    logout() {
        this.authService.logout();
        this.router.navigate(["login"]);
    }

    private handleResponseError(error: any, request?: HttpRequest<any>, next?: HttpHandler): any {
        // Business error
        if (error.status === 400) {
            // Show message
        }

        // Invalid token error
        else if (error.status === 401) {
            return this.refreshToken().pipe(
                filter(success => success),
                switchMap(() => {
                    request = this.addAuthHeader(request!);
                    return next!.handle(request!);
                }),
                catchError(e => {
                    if (e.status !== 401) {
                        return this.handleResponseError(e, undefined, undefined);
                    } else {
                        this.logout();
                    }
                }));
        }

        // Access denied error
        else if (error.status === 403) {
            // Show message
            // Logout
            this.logout();
        }

        // Server error
        else if (error.status === 500) {
            // Show message
        }

        // Maintenance error
        else if (error.status === 503) {
            // Show message
            // Redirect to the maintenance page
        }

        return throwError(error);
    }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
        this.authService.syncUserWithStorage();
        // Handle request
        request = this.addAuthHeader(request);

        // Handle response
        return next.handle(request).pipe(catchError(error => {
            return this.handleResponseError(error, request, next);
        }));
    }
}