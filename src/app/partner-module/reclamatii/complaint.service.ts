import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ComplaintModel } from 'src/app/models/ComplaintModel';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<ComplaintModel[]> {
    return this.http.get<ComplaintModel[]>('ticket');
  }

  public save(ticket: ComplaintModel): Observable<ComplaintModel> {
    return this.http.post<ComplaintModel>('ticket', ticket);
  }
}
