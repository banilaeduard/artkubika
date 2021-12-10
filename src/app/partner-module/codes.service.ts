import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodeModel } from '../models/CodeModel';

@Injectable({
  providedIn: 'root'
})
export class CodesService {

  constructor(private httpClient: HttpClient) { }

  public getCodes(): Observable<CodeModel[]> {
    return this.httpClient.get<CodeModel[]>('codes');
  }
}
