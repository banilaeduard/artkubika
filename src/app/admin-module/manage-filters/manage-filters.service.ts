import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FilterModel } from 'src/app/models/FilterModel';


@Injectable({
  providedIn: 'root'
})
export class ManageFiltersService {
  constructor(private httpClient: HttpClient) { }

  public getFilters(): Observable<FilterModel[]> {
    return this.httpClient.get<FilterModel[]>('filters');
  }

  public getFilterById(id: string): Observable<FilterModel> {
    return this.httpClient.get<FilterModel>(`filters/${id}`);
  }

  public saveFilter(filterModel: FilterModel): Observable<FilterModel> {
    return this.httpClient.post<FilterModel>('filters', filterModel);
  }

  public updateFilter(filterModel: FilterModel): Observable<FilterModel> {
    return this.httpClient.post<FilterModel>('filters/update', filterModel);
  }

  public deleteFilter(filterModel: FilterModel): Observable<any> {
    return this.httpClient.post('filters/delete', filterModel);
  }
}
