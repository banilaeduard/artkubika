import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-edit-roles',
  templateUrl: './edit-roles.component.html',
  styleUrls: ['./edit-roles.component.less']
})
export class EditRolesComponent implements OnChanges {
  @Input() roles!: string[];
  role!: string;
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes.roles) {
      [this.role] = changes?.roles.currentValue;
    }
  }

  ngOnInit(): void {
    [this.role] = this.roles;
  }

  get(): { remove?: string[], add?: string[] } {
    return {
      add: this.role === 'basic' ? ['partener'] : ['basic']
    };
  }
}
