import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CodeModel } from 'src/app/models/CodeModel';
import { Ticket } from 'src/app/models/Ticket';
import { CodesService } from '../codes.service';

@Component({
  selector: 'app-reclamatie',
  templateUrl: './reclamatie.component.html',
  styleUrls: ['./reclamatie.component.less']
})
export class ReclamatieComponent implements OnInit, OnChanges {
  rootCodes: CodeModel[];
  codeStack: CodeModel[];
  @Input() item: Ticket;

  selectedItem: CodeModel | undefined;
  constructor(private codesService: CodesService) {
    this.item = {} as Ticket;
    this.rootCodes = [];
    this.codeStack = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.item) {
      this.item = changes.item.currentValue || {};
      if (!this.item.images) this.item.images = [];
    }
  }

  ngOnInit(): void {
    this.codesService.getCodes().subscribe(codes =>
      codes.forEach(item => item.isRoot ? this.rootCodes.push(item) : "")
    );
  }

  selectItem(code: CodeModel, distance: number) {
    this.item.code = { ...code, id: '0', children: undefined } as CodeModel;
    this.item.codeValue = code.codeValue;

    code.expanded = true;
    this.codeStack.splice(distance, this.codeStack.length - distance, code);
  }

  delete(index: number) {
    this.item.images.splice(index, 1);
  }

  onFileChange(event: any) {
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

  get(): Ticket {
    this.item.id = this.item.id ?? '0';
    return this.item;
  }

  public mapToDisplay(item: CodeModel): { display: string, id: CodeModel } {
    return { display: item.codeDisplay!, id: item };
  }
}
