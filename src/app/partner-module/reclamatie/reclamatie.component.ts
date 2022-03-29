import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, tap } from 'rxjs/operators';
import { PreviousUrlService } from 'src/app/core/services/previous-url.service';
import { Attachment } from 'src/app/models/Attachment';
import { CodeModel } from 'src/app/models/CodeModel';
import { ComplaintModel } from 'src/app/models/ComplaintModel';
import { Ticket } from 'src/app/models/Ticket';
import { CodesService } from '../codes.service';
import { ComplaintService } from '../reclamatii/complaint.service';

@Component({
  selector: 'app-reclamatie',
  templateUrl: './reclamatie.component.html',
  styleUrls: ['./reclamatie.component.less']
})
export class ReclamatieComponent implements OnInit {
  item: Ticket;
  jsonTags!: string;
  complaint: ComplaintModel;
  isHtml: boolean;

  codeStack: CodeModel[][];
  codeStackDropdown: CodeModel[][];
  attributeStack!: [];
  private codePaths!: Map<string, string[]>;

  constructor(private codesService: CodesService,
    private complaintService: ComplaintService,
    private router: Router,
    private previousUrl: PreviousUrlService) {
    this.item = {} as Ticket;
    this.codeStackDropdown = [];
    this.codeStack = [];
    this.item = this.router.getCurrentNavigation()?.extras.state?.ticket as Ticket ||
      { codeLinks: [], toAddAttachment: [], toDeleteAttachment: [], attachments: [], id: "0" } as unknown as Ticket;

    this.complaint = this.router.getCurrentNavigation()?.extras.state?.complaint as ComplaintModel || { id: "0" };
    this.isHtml = this.item.codeValue?.indexOf("html") > -1;
    !!this.item.tags && (this.jsonTags = JSON.stringify(this.item.tags, null, " "));
  }

  public ngOnInit(): void {
    this.codeStackDropdown.push([]);
    this.codesService.getCodes().pipe(
      tap(codes => codes.forEach(item => item.isRoot ? this.codeStackDropdown[0].push(item) : "")),
      switchMap(codes => this.codesService.getPaths(codes))
    ).subscribe(paths => {
      this.codePaths = paths;
      this.initDropdownsFromItem();
    });
  }

  public delete(index: number, imageSrc: any) {
    this.item.attachments.splice(index, 1);
    if (imageSrc.id && imageSrc.id != '0')
      this.item.toDeleteAttachment.push(imageSrc);
    else {
      this.item.toAddAttachment.splice(this.item.toAddAttachment.findIndex(t => t.title == imageSrc.title));
    }
  }

  public onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const dataImage = reader.result as string;
          const base64 = dataImage.substring(dataImage.indexOf("base64,") + "base64,".length, dataImage.length);
          this.item.toAddAttachment.push({ data: base64, title: file.name, id: '0', contentType: file.type } as Attachment);
          this.item.attachments.push({ data: reader.result as string, title: file.name, id: '0', contentType: file.type } as Attachment);
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
            node.children?.forEach(child => this.codeStackDropdown[depth + 1].push(child));
          }

          if (this.isSelected(node)) {
            const itemIndex = this.item.codeLinks.findIndex(t => t.codeValue == node.id);
            const parentIndex = this.item.codeLinks.findIndex(t => t.codeValue == node.parent?.id);
            itemIndex < 0 && this.item.codeLinks.push(this.trimCodeModelForLinksSnapshot(node));
            parentIndex > -1 && this.item.codeLinks.splice(parentIndex, 1);
          }
          return !!node?.children;
        }
        , (node, _) => node?.children || [], distance);
    }
  }

  public deleteNode(codeLink: CodeModel, index: number) {
    const entryPath = this.codePaths.get(codeLink.codeValue);
    this.item.codeLinks.splice(this.item.codeLinks.findIndex(code => code.codeValue == codeLink.codeValue), 1);
    if (entryPath) {
      const val = this.codeStack[entryPath.length - 1].find(t => t.id == entryPath[entryPath.length - 1])!;
      this.setSelected(val, false);
      this.selectItem(val, entryPath.length - 1);
    }
  }

  public save() {
    this.complaintService.save({ ...this.complaint, tickets: [{ ...this.item, attachments: [], tags: !!this.jsonTags ? JSON.parse(this.jsonTags) : undefined }] }).pipe(
      tap(item => {
        Object.assign(this.complaint, item);
        Object.assign(this.item, { ...item.tickets[0], toAddImages: [], toDeleteImages: [] });
      })
    ).subscribe(_ => this.previousUrl.navigatePrevious());
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
