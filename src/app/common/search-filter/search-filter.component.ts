import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { filter } from 'rxjs/operators';
import { FilterModel } from 'src/app/models/FilterModel';
import { SearchFilterService } from './search-filter.service';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.less']
})
export class SearchFilterComponent implements OnInit, OnChanges {
  @Input() skip: number;
  @Input() take: number;
  @Input() tag: string;
  @Input() filter: FilterModel | undefined;
  @Output() results: EventEmitter<{ count: number, results: any[], filter: FilterModel }> = new EventEmitter();

  filters: FilterModel[] = [];

  constructor(
    private searchFilterService: SearchFilterService
  ) {
    this.skip = 0;
    this.take = 10;
    this.tag = "";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.skip) {
      this.skip = changes.skip.currentValue;
      this.searchValues();
    } else if (changes.take) {
      this.take = changes.take.currentValue;
      this.searchValues();
    }
  }

  ngOnInit(): void {
    this.searchFilterService.getFilters()
      .pipe(
        filter(t => !this.tag.length ?? t.filter(filter => filter.tags.includes(this.tag)))
      )
      .subscribe(t => this.filters = t);
  }

  selectItem(event: FilterModel) {
    this.filter = event;
    this.searchValues();
  }

  searchValues() {
    if (this.filter) {
      this.searchFilterService.query(this.skip, this.take, this.filter.query).subscribe(results => {
        this.results.emit({ ...results, filter: this.filter! });
      });
    } else this.results.emit(undefined);
  }
}
