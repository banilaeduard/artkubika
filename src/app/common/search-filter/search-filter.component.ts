import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { DialogOverlayService } from 'src/app/core/services/dialog-overlay.service';
import { FilterModel } from 'src/app/models/FilterModel';
import { SearchFilterService } from './search-filter.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.less']
})
export class SearchFilterComponent implements OnInit {
  filters: FilterModel[] = [];

  @ViewChild('searchResults') createUserTemplate!: TemplateRef<FilterModel[]>;
  constructor(
    private searchFilterService: SearchFilterService,
    private dialogOverlayService: DialogOverlayService) { }

  ngOnInit(): void {
    this.searchFilterService.getFilters().subscribe(t => this.filters = t);
  }

  selectItem(event: FilterModel) {
    if (event.selected) {
      this.searchFilterService.query(0, 10, event.query).subscribe(results => {
        this.dialogOverlayService.open(this.createUserTemplate,
          {
            model: results,
            data: { header: `Results ${event.name}` }
          }
          , undefined)
      });
      event.selected = false;
    }
  }
}
