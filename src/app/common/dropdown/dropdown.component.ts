import { ChangeDetectionStrategy, Component, DoCheck, EventEmitter, Input, IterableChanges, IterableDiffer, IterableDiffers, Output } from '@angular/core';
import { dropdown } from 'src/app/models/dropdown';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements DoCheck {
  @Input() items!: dropdown[];
  @Input() title!: string;
  @Input() selected!: dropdown[];
  @Input() multiSelect: boolean = true;
  @Output() itemClicked: EventEmitter<any> = new EventEmitter<any>();

  iterableDiffer: IterableDiffer<dropdown>;
  searchValue: string = '';
  filteredItems: { displayItem: dropdown, visible: boolean, selected: boolean }[];
  readonly DEFAULT_TITLE: string = 'Selectie filtru';

  constructor(
    iterableDiffers: IterableDiffers) {
    this.iterableDiffer = iterableDiffers.find([]).create(undefined);
    this.filteredItems = [];
    this.selected = [];
  }

  ngDoCheck(): void {
    const changes: IterableChanges<dropdown> = this.iterableDiffer.diff(this.items)!;
    if (changes) {
      if (!Array.isArray(this.selected)) {
        if (this.selected) this.selected = [this.selected];
        else this.selected = [];
      }

      changes.forEachAddedItem(iterableItem => {
        const filterableItem = iterableItem.item;
        this.filteredItems.push({
          visible: this.match(filterableItem),
          displayItem: filterableItem,
          selected: !!this.selected?.find(t => t.id == filterableItem.id)
        })
      });
      changes.forEachRemovedItem(iterableItem => {
        const index = this.filteredItems.findIndex(t => t.displayItem.id === iterableItem.item.id);
        if (index > -1) {
          this.filteredItems.splice(index, 1);
        }
      });

      this.filteredItems.sort((a, b) => a.displayItem?.groupBy?.hashCode() - b.displayItem?.groupBy?.hashCode());

      if (!this.title || this.title == this.DEFAULT_TITLE) {
        this.setTitle();
      }
    }
  }

  public filterItems(): void {
    this.filteredItems?.forEach(element =>
      element.visible = this.match(element.displayItem)
    );
  }

  private match(item: dropdown): boolean {
    return item.display.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1
      || item.groupBy?.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1;
  }

  public clicked = (item: { displayItem: dropdown, visible: boolean, selected: boolean }) => {
    item.selected = !item.selected;

    if (!this.multiSelect) {
      this.selected = [];
      this.filteredItems?.forEach(eachItem => {
        if (eachItem.displayItem.id != item.displayItem.id) eachItem.selected = false;
      });
    }

    if (item.selected) {
      this.selected.push(item.displayItem);
    } else {
      let idx = this.selected.findIndex(t => t.id == item.displayItem.id);
      if (idx > -1)
        this.selected.splice(idx, 1);
    }

    this.setTitle();

    if (this.multiSelect) {
      this.itemClicked.emit(this.selected);
    } else if (this.selected.length > 0) {
      this.itemClicked.emit(this.selected[0]);
    } else {
      this.itemClicked.emit(undefined);
    }
  }

  private setTitle = () => {
    if (!Array.isArray(this.selected) && this.selected) {
      this.title = (this.selected as any).display;
    } else {
      this.title = '';
      for (let item of this.selected) {
        this.title += item.display + ",";
      }
      this.title = this.title.substring(0, this.title.length - 1);
    }
  }
}
