import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { switchMap, tap } from 'rxjs/operators';
import { CodeModel } from 'src/app/models/CodeModel';
import { dropdown } from 'src/app/models/dropdown';
import { Ticket } from 'src/app/models/Ticket';
import { CodesService } from '../codes.service';

@Component({
  selector: 'app-reclamatie',
  templateUrl: './reclamatie.component.html',
  styleUrls: ['./reclamatie.component.less']
})
export class ReclamatieComponent implements OnInit, OnChanges, OnDestroy {
  @Input() item: Ticket;

  codeStack: CodeModel[][];
  codeStackDropdown: CodeModel[][];
  attributeStack!: [];
  private codePaths!: Map<string, string[]>;

  constructor(private codesService: CodesService) {
    this.item = {} as Ticket;
    this.codeStackDropdown = [];
    this.codeStack = [];
  }

  ngOnDestroy(): void {
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.item = changes.item.currentValue || {};
      this.item.images = this.item.images ?? [];
      this.item.codeLinks = this.item.codeLinks ?? [];
      this.codePaths && this.item.codeLinks && this.initDropdownsFromItem();
    }
  }

  public ngOnInit(): void {
    this.codeStackDropdown.push([]);
    this.codesService.getCodes().pipe(
      tap(codes => codes.forEach(item => item.isRoot ? this.codeStackDropdown[0].push(item) : "")),
      switchMap(_ => this.codesService.getTrie())
    ).subscribe(trieMap => {
      this.codePaths = trieMap;
      this.initDropdownsFromItem();
    });
  }

  public delete(index: number) {
    this.item.images.splice(index, 1);
  }

  public onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.item.images.push({ data: reader.result as string, title: file.name, id: '0' });
        };
      }
    }
  }

  public selectItem = (triggerCode: CodeModel, distance: number, autoParent: boolean = true): void => {
    this.codeStack[distance] = this.codeStack[distance] || [];
    this.codeStackDropdown[distance + 1] = this.codeStackDropdown[distance + 1] || [];

    if (!this.isSelected(triggerCode))
      this.codesService.processRecursive(
        [triggerCode]
        , triggerCode.parent
        , (node, _, depth) => {
          this.codeStackDropdown[depth + 1] = this.codeStackDropdown[depth + 1]?.filter(t => t.parent?.id != node.id);
          this.codeStack[depth] = this.codeStack[depth]?.filter(t => t.id != node.id);

          const ticketItem = this.item.codeLinks.findIndex(t => t.codeValue == node.id);
          const siblingIndex = this.codeStack[depth].findIndex(t => t.parent?.id == node.parent?.id);
          if (ticketItem > -1) {
            const [removed] = this.item.codeLinks.splice(ticketItem, 1);
            // in caz ca se descompleteaza complet un produs atunci incercam sa selectam parintele
            if (siblingIndex < 0 && depth == distance) {
              this.isSelected(node.parent) && this.item.codeLinks.push(this.trimCodeModelForLinksSnapshot(node.parent!));
            }
          }
          return !!node.children;
        }
        , (node, _) => node.children?.filter(child => this.isSelected(child)) || [], distance
      );
    else {
      this.codesService.processRecursive(
        [triggerCode]
        , triggerCode
        , (node: CodeModel, _: any, depth: number) => {
          this.codeStack[depth] = this.codeStack[depth] || [];
          this.codeStackDropdown[depth + 1] = this.codeStackDropdown[depth + 1] || [];
          if (this.isSelected(node) && this.codeStack[depth].findIndex(it => it.id == node.id) < 0) {
            this.codeStack[depth].push(node);
            node.children?.forEach(child => {
              this.codeStackDropdown[depth + 1].push(child);
              child.parent = node;
              child.groupBy = `${!!node?.groupBy ? (node.groupBy + ', ') : ''}${node.codeDisplay}`
            });
          }

          if (this.isSelected(node)) {
            const itemIndex = this.item.codeLinks.findIndex(t => t.codeValue == node.id);
            const parentIndex = this.item.codeLinks.findIndex(t => t.codeValue == node.parent?.id);
            itemIndex < 0 && this.item.codeLinks.push(this.trimCodeModelForLinksSnapshot(node));
            parentIndex > -1 && this.item.codeLinks.splice(parentIndex, 1);
          }
          return !!node?.children && this.isSelected(node);
        }
        , (node, _) => node?.children || [], distance);
    }
  }

  public get(): Ticket {
    this.item.id = this.item.id ?? '0';
    return this.item;
  }

  public deleteNode(codeLink: CodeModel, index: number) {
    const entryPath = this.codePaths.get(codeLink.codeValue);
    this.item.codeLinks.splice(index, 1);
    if (entryPath) {
      this.setSelected(this.codeStack[entryPath.length - 1].find(t => t.id == entryPath[entryPath.length - 1])!, false);
      this.selectItem(codeLink, entryPath.length - 1);
    }
  }

  public getTitle(distance: number): string {
    return this.codeStack[distance]
      ?.filter(codeModel => this.isSelected(codeModel))
      .map(t => t.codeDisplay).join(', ');
  }

  public hasSelectedChildren(distance: number): boolean {
    return this.codeStack[distance]?.some(codeModel => this.isSelected(codeModel));
  }

  private isSelected = (item: CodeModel | undefined): boolean => {
    return !!item?.selected;
  }

  private setSelected = (item: CodeModel, selected: boolean): void => {
    item.selected = selected;
  }

  private trimCodeModelForLinksSnapshot = (code: CodeModel): CodeModel => {
    return { ...code, children: undefined, parent: undefined, id: '0', codeValue: code.id };
  }

  private initDropdownsFromItem() {
    this.item.codeLinks?.forEach(codeLink => {
      const entryPath = this.codePaths.get(codeLink.codeValue)!;
      // exista si cazul sa nu fie gasit in caz ca se sterge o intrare mai veche care nu mai exista in tabela de coduri
      // vedem cum facem handle la acest caz (display in alta culoare si selectare noului produs cu codul respectiv)
      if (entryPath && entryPath.length > 1) { // daca nu e root node
        for (let i = 0, parent = entryPath[0]; i < entryPath.length; parent = entryPath[i], i++) {
          this.codeStack[i] = this.codeStack[i] ?? [];
          this.codeStackDropdown[i + 1] = this.codeStackDropdown[i + 1] ?? [];
          // we need the actual codes to recreate the dropdowns
          // codeLinks are just snapshots of codes without the hierarchy data
          const parentCode = i > 0 ?
            this.codeStack[i - 1].find(parentCode => parentCode.id == parent)
            : this.codeStackDropdown[0].find(t => t.id == parent); // pentru root cautam in dropdown-ul populat initial
          const currentCode = i > 0 ? parentCode?.children?.find(t => t.id == entryPath[i]) : parentCode;
          const nodeIndex = this.codeStack[i].findIndex(code => code.id == entryPath[i]);
          const nodeDropdownIndex = this.codeStackDropdown[i + 1].findIndex(code => code?.parent?.id == entryPath[i]);
          if (nodeIndex < 0) {
            this.codeStack[i].push(currentCode!);
            this.setSelected(currentCode!, true);
          }

          if (nodeDropdownIndex < 0 && currentCode?.children) {
            this.codeStackDropdown[i + 1] = this.codeStackDropdown[i + 1].concat(currentCode?.children);
          }
        }
      }
    });
  }
}
