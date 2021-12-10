import { Component, OnInit } from '@angular/core';
import { CodeModel } from '../../models/CodeModel';
import { ManageCodesService } from './manage-codes.service';

@Component({
  selector: 'app-manage-codes',
  templateUrl: './manage-codes.component.html',
  styleUrls: ['./manage-codes.component.less']
})
export class ManageCodesComponent implements OnInit {
  public codes: CodeModel[] = [];

  constructor(private manageCodesService: ManageCodesService) { }

  ngOnInit(): void {
    this.manageCodesService.getCodes().subscribe(codes => this.codes = codes);
  }

  addCode() {
    this.codes.unshift({
      dirty: true
    } as CodeModel);
  }

  remove(index: number) {
    const item = this.codes.splice(index, 1)[0];
    if (item.id) {
      this.manageCodesService.deleteCodes([item]).subscribe();
    }
  }

  save(index: number) {
    if (this.codes[index].id) {
      this.manageCodesService.updateCodes([this.codes[index]]).subscribe(codes => {
        this.codes[index] = codes[0];
      });
    } else {
      this.manageCodesService.saveCodes([this.codes[index]]).subscribe(codes => {
        this.codes[index] = codes[0];
      });
    }
  }
}
