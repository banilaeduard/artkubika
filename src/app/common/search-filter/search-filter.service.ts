import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { dropdown } from 'src/app/models/dropdown';
import { FilterModel } from 'src/app/models/FilterModel';

@Injectable({
  providedIn: 'root'
})
export class SearchFilterService {

  constructor(private httpClient: HttpClient) { }

  public getFilters(): Observable<FilterModel[]> {
    return this.httpClient.get<FilterModel[]>('filters')
      .pipe(
        map(items => items.map(this.mapToDropdown))
      );
  }

  public query(skip: number, take: number, query: string): Observable<any[]> {
    return this.httpClient.get<any>(`solr/${skip}/${take}/${query}`);
  }

  private mapToDropdown(filter: FilterModel): FilterModel {
    var dropdown = filter as dropdown;
    dropdown.display = filter.name;
    dropdown.id = filter.id;
    dropdown.selected = false;
    return filter;
  }
}
