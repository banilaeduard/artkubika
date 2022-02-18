import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PreviousUrlService {
  constructor(private router: Router) { }
  private shouldNavigatePrev: boolean = false;
  private previousState: BehaviorSubject<any> = new BehaviorSubject<any>(undefined);
  private previousUrl: BehaviorSubject<string> = new BehaviorSubject<string>('/');
  public previousUrl$: Observable<string> = this.previousUrl.asObservable();
  public previousState$: Observable<any> = this.previousState.asObservable();

  setPreviousUrl(previousUrl: string, prevState: any, shouldNavigatePrev: boolean) {
    this.shouldNavigatePrev = shouldNavigatePrev;
    this.previousState.next(prevState);
    this.previousUrl.next(previousUrl);
  }

  navigatePrevious() {
    this.shouldNavigatePrev && this.router.navigateByUrl(this.previousUrl.value, {
      state: {
        ...this.router.getCurrentNavigation()?.extras?.state,
        previousState: this.previousState.value
      }
    });
  }

  navigateForPrevious(url: string, state: any | undefined, previousState: any | undefined) {
    this.router.navigateByUrl(url, { state: { ...state, previousState: previousState, shouldNavigatePrev: true } });
  }
}
