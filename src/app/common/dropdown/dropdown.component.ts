import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements OnInit {
  @Input() items!: any[];
  @Input() title!: string;
  @Input() mapToDisplay!: (model: any) => { display: string, id: any };
  @Output() itemClicked: EventEmitter<string> = new EventEmitter<string>();

  searchValue: string = '';

  constructor() {
    this.mapToDisplay = (item) => {
      if (item.display) return { display: item.display, id: item };
      return { display: Object.toString.apply(item), id: item };
    }
  }

  ngOnInit(): void {
  }

  public filterItems = (): { display: string }[] => {
    return this.items?.filter(el => this.mapToDisplay(el).display.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1) || [];
  }

  public clicked = (item: any) => {
    if (!this.title) {
      this.title = this.mapToDisplay(this.items.find(t => t == item)).display;
    }
    this.itemClicked.emit(this.mapToDisplay(item).id);
  }
}
