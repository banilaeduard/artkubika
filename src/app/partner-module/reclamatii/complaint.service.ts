import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ComplaintModel } from 'src/app/models/ComplaintModel';
import { PaginingModel } from 'src/app/models/PaginingModel';
import { Ticket } from 'src/app/models/Ticket';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private http: HttpClient) { }

  public getAll(pagingModel: PaginingModel): Observable<ComplaintModel[]> {
    return this.http.get<{ count: number, complaints: ComplaintModel[] }>(`ticket/${pagingModel.page}/${pagingModel.pageSize}`)
      .pipe(
        tap(col => pagingModel.collectionSize = col.count),
        map(col => col.complaints)
      );
  }

  public save(complaint: ComplaintModel): Observable<ComplaintModel> {
    return this.http.post<ComplaintModel>('ticket', complaint);
  }

  public fetchImages(complaint: ComplaintModel): Observable<ComplaintModel> {
    return this.http.post<ComplaintModel>('ticket/images', complaint);
  }
}
