import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { CodeModel } from '../../models/CodeModel';
import { ManageAttributesService } from '../manage-attributes/manage-attributes.service';
import { ManageCodesService } from './manage-codes.service';

@Component({
  selector: 'app-manage-codes',
  templateUrl: './manage-codes.component.html',
  styleUrls: ['./manage-codes.component.less']
})
export class ManageCodesComponent implements OnInit {
  public codes: CodeModel[] = [];
  public attributes: { display: string, id: any }[] = []

  constructor(private manageCodesService: ManageCodesService,
    private manageAttributesService: ManageAttributesService) { }

  ngOnInit(): void {
    this.manageCodesService.getCodes().subscribe(codes => this.codes = codes.filter(t => t.isRoot));
    this.manageAttributesService.getCodes().subscribe(attributes =>
      this.attributes = attributes.map(t => {
        return {
          display: `${t.tag} - ${t.innerValue}`, id: { tag: t.tag, value: t.innerValue }
        }
      })
    );
  }

  addCode() {
    this.codes.unshift({
      isRoot: true,
      expanded: false
    } as CodeModel);
  }

  remove(parent: CodeModel, node: CodeModel, root: CodeModel) {
    if (parent) {
      const [toRemove] = (parent.children || []).splice(parent.children?.findIndex(t => t == node) || -1, 1);
      if (toRemove?.id) {
        this.manageCodesService.updateCodes([root]).pipe(
          switchMap(_ => this.manageCodesService.deleteCodes([node]))
        ).subscribe();
      }
    } else {
      const [toRemove] = this.codes.splice(this.codes.findIndex(t => t == node), 1);
      if (toRemove.id) {
        this.manageCodesService.deleteCodes([toRemove]).subscribe();
      }
    }
  }

  save(node: CodeModel) {
    if (node.id) {
      this.manageCodesService.updateCodes([node]).subscribe(model => node.children = model[0].children);
    } else {
      this.manageCodesService.saveCodes([node]).subscribe(model => node.children = model[0].children);
    }
  }

  selectItem(node: CodeModel, event: any) {
    node.attributeTags = event.tag;
  }

  addChild(parentNode: CodeModel) {
    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push({} as CodeModel);
    parentNode.expanded = true;
  }
}
