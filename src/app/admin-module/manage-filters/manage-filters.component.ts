import { Component, OnInit } from '@angular/core';
import { FilterModel } from 'src/app/models/FilterModel';
import { ManageFiltersService } from './manage-filters.service';

@Component({
  selector: 'app-manage-filters',
  templateUrl: './manage-filters.component.html',
  styleUrls: ['./manage-filters.component.less']
})
export class ManageFiltersComponent implements OnInit {
  filters: FilterModel[] = [];
  constructor(private manageFiltersService: ManageFiltersService) { }

  ngOnInit(): void {
    this.manageFiltersService.getFilters().subscribe(filters => this.filters = filters);
  }

  add() {
    this.filters.unshift({
      dirty: true
    } as FilterModel);
  }

  remove(index: number) {
    const item = this.filters.splice(index, 1)[0];
    if (item.id)
      this.manageFiltersService.deleteFilter(item).subscribe();
  }

  save(index: number) {
    if (this.filters[index].id) {
      this.manageFiltersService.updateFilter(this.filters[index]).subscribe(filter => {
        this.filters[index] = filter;
      });
    } else {
      this.manageFiltersService.saveFilter(this.filters[index]).subscribe(filter => {
        this.filters[index] = filter;
      });
    }
  }
}
