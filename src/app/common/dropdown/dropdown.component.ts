import { Component, DoCheck, EventEmitter, Input, IterableChanges, IterableDiffer, IterableDiffers, OnInit, Output } from '@angular/core';
import { dropdown } from 'src/app/models/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements OnInit, DoCheck {
  @Input() items!: any[];
  @Input() title!: string;
  @Input() mapToDisplay!: (model: any) => dropdown;
  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();

  iterableDiffer: IterableDiffer<any>;
  searchValue: string = '';
  filteredItems: { displayItem: dropdown, visible: boolean, localSelected: boolean }[];

  constructor(iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
    this.mapToDisplay = (item) => {
      if (item.display) return { display: item.display, id: item, groupBy: item.groupBy || '' } as dropdown;
      return { display: Object.toString.apply(item), id: item, groupBy: item.groupBy || '' } as dropdown;
    }
    this.filteredItems = [];
  }

  ngDoCheck(): void {
    const changes: IterableChanges<any> = this.iterableDiffer.diff(this.items)!;
    if (changes) {
      changes.forEachAddedItem(iterableItem => {
        const filterableItem = this.mapToDisplay(iterableItem.item)
        this.filteredItems.push({
          visible: this.match(filterableItem),
          displayItem: filterableItem,
          localSelected: filterableItem.selected
        })
      });
      changes.forEachRemovedItem(iterableItem => {
        const index = this.filteredItems.findIndex(t => t.displayItem.id === iterableItem.item);
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

  public clicked = (item: { displayItem: dropdown, visible: boolean, localSelected: boolean }) => {
    if (!this.title) {
      this.title = this.filteredItems.find(t => t == item)?.displayItem.display;
    }
    // toggle
    item.displayItem.selected = !item.displayItem.selected;
    this.itemClicked.emit(item.displayItem.id);
  }
}
