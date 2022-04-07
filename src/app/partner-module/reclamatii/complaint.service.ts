import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ComplaintModel } from 'src/app/models/ComplaintModel';
import { PaginingModel } from 'src/app/models/PaginingModel';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  constructor(private http: HttpClient) { }

  public getAll(pagingModel: PaginingModel, documentIds?: any[]): Observable<ComplaintModel[]> {
    let params = new HttpParams();
    let ids = documentIds?.map(t => t.complaintid[0])!;
    if (ids) {
      for (let i = 0; i < ids?.length; i++) {
        params = params.append(`documentIds[${i}]`, ids[i]);
      }
    }

    if (documentIds !== undefined && ids?.length < 1) {
      pagingModel.collectionSize = 0;
      return of([]);
    }

    return this.http.get<{ count: number, complaints: ComplaintModel[] }>(`ticket/${pagingModel.page}/${pagingModel.pageSize}`, { params: params })
      .pipe(
        tap(col => {
          if (documentIds === undefined) {
            pagingModel.collectionSize = col.count;
          }
        }),
        map(col => col.complaints)
      );
  }

  public save(complaint: ComplaintModel): Observable<ComplaintModel> {
    return this.http.post<ComplaintModel>('ticket', complaint);
  }

  public delete(complaint: ComplaintModel): Observable<ComplaintModel> {
    return this.http.post<ComplaintModel>('ticket/delete', complaint);
  }

  public updateStatus(complaint: ComplaintModel, status: string): Observable<ComplaintModel> {
    return this.http.post<ComplaintModel>(`ticket/status/${status}`, complaint);
  }
}
