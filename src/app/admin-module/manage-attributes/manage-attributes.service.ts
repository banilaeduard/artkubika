import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CodeAttribute } from 'src/app/models/CodeAttribute';

@Injectable({
  providedIn: 'root'
})
export class ManageAttributesService {
  constructor(private httpClient: HttpClient) { }

  public getCodes(): Observable<CodeAttribute[]> {
    return this.httpClient.get<CodeAttribute[]>('codes/attributes');
  }

  public saveCodes(codes: CodeAttribute[]): Observable<CodeAttribute[]> {
    return this.httpClient.post<CodeAttribute[]>('codes/attributes', codes);
  }

  public updateCodes(codes: CodeAttribute[]): Observable<CodeAttribute[]> {
    return this.httpClient.patch<CodeAttribute[]>('codes/attributes', codes);
  }

  public deleteCodes(codes: CodeAttribute[]): Observable<any> {
    return this.httpClient.post('codes/attributes/delete', codes);
  }
}
