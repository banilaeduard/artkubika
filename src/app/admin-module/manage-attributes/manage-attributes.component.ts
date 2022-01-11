import { Component, OnInit } from '@angular/core';
import { CodeAttribute } from 'src/app/models/CodeAttribute';
import { ManageAttributesService } from './manage-attributes.service';

@Component({
  selector: 'app-manage-attributes',
  templateUrl: './manage-attributes.component.html',
  styleUrls: ['./manage-attributes.component.less']
})
export class ManageAttributesComponent implements OnInit {
  public codes: CodeAttribute[] = [];

  constructor(private manageAttributeService: ManageAttributesService) { }

  ngOnInit(): void {
    this.manageAttributeService.getCodes().subscribe(codes => this.codes = codes);
  }

  add() {
    this.codes.unshift({
      dirty: true
    } as CodeAttribute);
  }

  remove(index: number) {
    const item = this.codes.splice(index, 1)[0];
    this.manageAttributeService.deleteCodes([item]).subscribe();
  }

  save(index: number) {
    if (this.codes[index].id) {
      this.manageAttributeService.updateCodes([this.codes[index]]).subscribe(codes => {
        this.codes[index] = codes[0];
      });
    } else {
      this.manageAttributeService.saveCodes([this.codes[index]]).subscribe(codes => {
        this.codes[index] = codes[0];
      });
    }
  }
}
