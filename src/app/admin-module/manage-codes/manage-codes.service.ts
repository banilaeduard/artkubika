import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodeModel } from '../../models/CodeModel';

@Injectable({
  providedIn: 'root'
})
export class ManageCodesService {

  constructor(private httpClient: HttpClient) { }

  public getCodes(): Observable<CodeModel[]> {
    return this.httpClient.get<CodeModel[]>('codes');
  }

  public saveCodes(codes: CodeModel[]): Observable<CodeModel[]> {
    return this.httpClient.post<CodeModel[]>('codes', codes);
  }

  public updateCodes(codes: CodeModel[]): Observable<CodeModel[]> {
    return this.httpClient.patch<CodeModel[]>('codes', codes);
  }

  public deleteCodes(codes: CodeModel[]): Observable<any> {
    codes.forEach(code => code.children = []);
    return this.httpClient.post('codes/delete', codes);
  }
}
