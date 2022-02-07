import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
  codeStack: CodeModel[][];
  codeStackDropdown: CodeModel[][];
  map: Map<string, boolean> = new Map();
  attributeStack!: []
  @Input() item: Ticket;

  selectedItem: CodeModel | undefined;
  constructor(private codesService: CodesService) {
    this.item = {} as Ticket;
    this.codeStackDropdown = [];
    this.codeStack = [];
  }
  ngOnDestroy(): void {
    this.codeStackDropdown[0] && this.codeStackDropdown[0].forEach(code =>
      this.isSelected(code) && this.toggleSelected(code)
    );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.item = changes.item.currentValue || {};
      this.item.images = this.item.images ?? [];
      this.item.codeLinks = this.item.codeLinks ?? [];
    }
  }

  public ngOnInit(): void {
    this.codeStackDropdown.push([]);
    this.codesService.getCodes().subscribe(codes => {
      codes.forEach(item => item.isRoot ? this.codeStackDropdown[0].push(item) : "");
    }
    );
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

  public selectItem(code: CodeModel, distance: number) {
    this.toggleSelected(code);
    this.codeStack[distance] = this.codeStack[distance] || [];
    this.codeStackDropdown[distance + 1] = this.codeStackDropdown[distance + 1] || [];

    if (!this.isSelected(code))
      this.processRecursive(
        [code]
        , code.parent
        , (node, _, depth) => {
          this.codeStackDropdown[depth + 1] = this.codeStackDropdown[depth + 1]?.filter(t => t.parent.id != node.id);
          this.codeStack[depth] = this.codeStack[depth]?.filter(t => t.id != node.id);

          const ticketItem = this.item.codeLinks.findIndex(t => t.id == node.id);
          const siblingIndex = this.codeStack[depth].findIndex(t => t.parent?.id == node.parent?.id);
          if (ticketItem > -1) {
            const [removed] = this.item.codeLinks.splice(ticketItem, 1);
            // in caz ca se descompleteaza complet un produs atunci incercam sa selectam parintele
            if (siblingIndex < 0 && depth == distance) {
              this.isSelected(node.parent) && this.item.codeLinks.push(node.parent);
            }
          }
          return !!node.children;
        }
        , (node, _) => node.children?.filter(child => this.isSelected(child)) || [], distance
      );
    else {
      this.processRecursive(
        [code]
        , code
        , (node, _, depth) => {
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
            const itemIndex = this.item.codeLinks.findIndex(t => t.id == node.id);
            const parentIndex = this.item.codeLinks.findIndex(t => t.id == node.parent?.id);
            itemIndex < 0 && this.item.codeLinks.push(node);
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

  public getTitle(distance: number): string {
    return this.codeStack[distance]
      ?.filter(codeModel => this.isSelected(codeModel))
      .map(t => t.codeDisplay).join(', ');
  }

  public hasSelectedChildren(distance: number): boolean {
    return this.codeStack[distance]?.some(codeModel => this.isSelected(codeModel));
  }

  public mapToDisplay = (item: CodeModel): dropdown => {
    return { display: item.codeDisplay!, id: item, groupBy: item.groupBy, selected: this.isSelected(item) };
  }

  private isSelected = (item: CodeModel): boolean => {
    return item && !!this.map.get(item.id);
  }

  private toggleSelected = (item: CodeModel): void => {
    this.map.set(item.id, !(this.map.has(item.id) && this.map.get(item.id)));
  }

  private processRecursive(
    codes: CodeModel[],
    parent: CodeModel,
    callback: (code: CodeModel, parent: CodeModel, depth: number) => boolean,
    next: (code: CodeModel, depth: number) => CodeModel[],
    depth: number = 0
  ): boolean {
    var map: any = {};
    codes.forEach((code) => map[code.id] = callback(code, parent, depth));
    codes?.filter(item => map[item.id]).forEach(code =>
      this.processRecursive(
        next(code, depth + 1) || [],
        code,
        callback,
        next,
        depth + 1)
    );
    return true;
  }
}
