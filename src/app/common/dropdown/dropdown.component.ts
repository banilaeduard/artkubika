import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.less']
})
export class DropdownComponent implements OnInit {
  @Input() items!: { display: string, id: string }[];
  @Input() title!: string;
  @Output() itemClicked: EventEmitter<string> = new EventEmitter<string>();

  searchValue: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  public filterItems = (): { display: string }[] => {
    return this.items?.filter(el => el.display.toLocaleLowerCase().indexOf(this.searchValue.toLocaleLowerCase()) !== -1) || [];
  }

  public clicked = (id: string) => {
    this.itemClicked.emit(id);
  }
}
