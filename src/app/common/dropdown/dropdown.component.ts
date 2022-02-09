import { Component, DoCheck, EventEmitter, Input, IterableChanges, IterableDiffer, IterableDiffers, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { dropdown } from 'src/app/models/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements OnInit, DoCheck {
  @Input() items!: dropdown[];
  @Input() title!: string;
  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();

  iterableDiffer: IterableDiffer<any>;
  searchValue: string = '';
  filteredItems: { displayItem: dropdown, visible: boolean }[];

  constructor(iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
    this.filteredItems = [];
  }

  ngDoCheck(): void {
    const changes: IterableChanges<any> = this.iterableDiffer.diff(this.items)!;
    if (changes) {
      changes.forEachAddedItem(iterableItem => {
        const filterableItem = iterableItem.item
        this.filteredItems.push({
          visible: this.match(filterableItem),
          displayItem: filterableItem
        })
      });
      changes.forEachRemovedItem(iterableItem => {
        const index = this.filteredItems.findIndex(t => t.displayItem.id === iterableItem.item.id);
        if (index > -1) {
          this.filteredItems.splice(index, 1);
        }
      });

      this.filteredItems.sort((a, b) => a.displayItem?.groupBy?.hashCode() - b.displayItem?.groupBy?.hashCode());
    }
  }

  ngOnInit(): void {
  }

  public filterItems(): void {
    this.filteredItems?.forEach(element =>
      element.visible = this.match(element.displayItem)
    );
  }

  private match(item: dropdown): boolean {
    return item.display.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1
      || item.groupBy.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1;
  }

  public clicked = (item: { displayItem: dropdown, visible: boolean }) => {
    if (!this.title) {
      this.title = this.filteredItems.find(t => t == item)?.displayItem.display;
    }
    // toggle
    item.displayItem.selected = !item.displayItem.selected;
    this.itemClicked.emit(item.displayItem);
  }
}
