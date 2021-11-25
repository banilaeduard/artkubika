import { Injectable } from '@angular/core';
import { Router, CanLoad, Route, UrlSegment, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserContextService } from './core/services/user-context.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanLoad {
    constructor(
        private router: Router,
        private userContextService: UserContextService
    ) { }
    canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (route?.data?.roles) {
            return this.userContextService.isInRole(route.data.roles)
                .pipe(
                    tap(isInRole => isInRole ? true : this.router.navigate(['/']))
                );
        }

        return of(true);
    }
}