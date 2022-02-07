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
    const map: Map<string, string> = new Map();
    this.manageAttributesService.getCodes().subscribe(attributes => {
      attributes.forEach(t => {
        if (map.has(t.tag)) {
          map.set(t.tag, map.get(t.tag) + `, ${t.innerValue}`);
        } else {
          map.set(t.tag, `${t.innerValue}`);
        }
      });
      this.attributes = [];
      map.forEach((value: string, key: string) => {
        this.attributes.push(
          { display: `${key} (${value})`, id: { tag: key, value: value } }
        );
      });
    })
  }

  addCode() {
    this.codes.unshift({
      isRoot: true,
      selected: false
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
    if (!node.attributeTags?.includes(event.tag)) {
      node.attributeTags = !!node.attributeTags ?
        `${node.attributeTags}, ${event.tag}` :
        event.tag
    } else {
      node.attributeTags = node.attributeTags
        .replace(event.tag, '').split(',')
        .filter(value => value?.trim()?.length > 0)
        .map(value => value.trim())
        .reduce((accumulator, currentValue) => {
          if (!accumulator) accumulator = currentValue;
          else accumulator = accumulator + ', ' + currentValue;
          return accumulator;
        }, '');
    }
  }

  addChild(parentNode: CodeModel) {
    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push({} as CodeModel);
    parentNode.selected = true;
  }
}
