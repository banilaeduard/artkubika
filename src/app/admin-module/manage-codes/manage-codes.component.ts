import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { dropdown } from 'src/app/models/dropdown';
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
  public attributes: dropdown[] = [];
  public selectedAttributeCodes: Map<number, dropdown[]> = new Map();
  public codesWithAttributes: CodeModel[] = [];

  constructor(private manageCodesService: ManageCodesService,
    private manageAttributesService: ManageAttributesService) { }

  ngOnInit(): void {
    var sub1 = this.manageCodesService.getCodes()
      .pipe(
        tap(codes => this.codes = codes.filter(t => t.isRoot)),
      );

    var sub2 = this.manageAttributesService.getCodes()
      .pipe(
        tap(attributes => {
          const map: Map<string, string> = new Map();
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
              { display: `${key} (${value})`, id: { tag: key, value: value }, groupBy: "" }
            );
          });
        }));

    forkJoin([sub1, sub2]).subscribe(([codes, _]) => {
      for (let code of codes) {
        if (!!code.attributeTags) {
          this.initforNode(code);
        }
      }
    });
  }

  addCode() {
    const code = {
      isRoot: true,
      selected: false,
    } as CodeModel;
    this.codes.unshift(code);

    this.setSelectedAttributes(code, []);
  }

  remove(parent: CodeModel, node: CodeModel, root: CodeModel) {
    if (root || confirm(`Stergeti intrarea ${node.codeDisplay}?`)) {
      if (parent) {
        const [toRemove] = (parent.children || []).splice(parent.children?.findIndex(t => t == node) || -1, 1);
        if (toRemove?.id) {
          this.manageCodesService.updateCodes([root]).pipe(
            switchMap(_ => this.manageCodesService.deleteCodes([node]))
          ).subscribe();
        }
      } else {
        let [toRemove] = this.codes.splice(this.codes.findIndex(t => t == node), 1);
        if (toRemove.id) {
          this.manageCodesService.deleteCodes([toRemove]).subscribe();
        }
      }
    }
  }

  save(node: CodeModel) {
    if (node.id) {
      this.manageCodesService.updateCodes([node])
        .pipe(
          tap(
            model => model[0].children?.forEach(this.initRecurseForNode)
          )
        )
        .subscribe(model => node.children = model[0].children);
    } else {
      this.manageCodesService.saveCodes([node])
        .pipe(
          tap(
            model => model[0].children?.forEach(this.initRecurseForNode)
          )
        )
        .subscribe(model => node.children = model[0].children);
    }
  }

  selectItem(node: CodeModel, selected: dropdown[]) {
    this.setSelectedAttributes(node, selected);
    node.attributeTags = selected.map(t => t.id.tag).join(',');
  }

  addChild(parentNode: CodeModel) {
    const code = {} as CodeModel;
    this.setSelectedAttributes(code, []);
    if (!parentNode.children) parentNode.children = [];
    parentNode.children.push(code);
    parentNode.selected = true;
  }

  initRecurseForNode = (node: CodeModel) => {
    !!node && this.initforNode(node);
    if (node?.children) {
      for (const child of node.children)
        !!child && this.initRecurseForNode(child);
    }
  }

  initforNode = (node: CodeModel) => {
    this.setSelectedAttributes(node, this.attributes.filter(attr => node.attributeTags?.includes(attr.id.tag)));
  }

  getSelectedAttributes = (node: CodeModel): dropdown[] => {
    var index = this.codesWithAttributes.findIndex(t => t.id == node.id);
    if (index < 0) return [];

    return this.selectedAttributeCodes.get(index) || [];
  }

  setSelectedAttributes = (node: CodeModel, attributes: dropdown[]) => {
    let index = this.codesWithAttributes.findIndex(t => t === node);
    if (index < 0) {
      this.codesWithAttributes.push(node);
      index = this.codesWithAttributes.findIndex(t => t === node);
    }
    this.selectedAttributeCodes.set(index, attributes || []);
  }
}
