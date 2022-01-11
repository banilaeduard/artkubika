import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount, take } from 'rxjs/operators';
import { CodeModel } from '../models/CodeModel';

@Injectable({
  providedIn: 'root'
})
export class CodesService {
  private sharedRep: Observable<CodeModel[]>

  constructor(private httpClient: HttpClient) {
    this.sharedRep = this.httpClient.get<CodeModel[]>('codes').pipe(
      map(items => items.filter(t => !!t.codeDisplay)),
      publishReplay(1, 5 * 60 * 1000),
      refCount(),
      take(1)
    );
  }

  public getCodes(): Observable<CodeModel[]> {
    return this.sharedRep;
  }
}
