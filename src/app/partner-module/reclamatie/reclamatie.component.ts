import { Component, OnInit } from '@angular/core';
import { CodeModel } from 'src/app/models/CodeModel';
import { Ticket } from 'src/app/models/Ticket';
import { CodesService } from '../codes.service';

@Component({
  selector: 'app-reclamatie',
  templateUrl: './reclamatie.component.html',
  styleUrls: ['./reclamatie.component.less']
})
export class ReclamatieComponent implements OnInit {
  items!: CodeModel[];
  selectedItem: CodeModel | undefined;
  description: string | undefined;
  imagesSrc: { data: string, title: string, id: string }[] = [];
  constructor(private codesService: CodesService) { }

  ngOnInit(): void {
    this.codesService.getCodes().subscribe(codes => this.items = codes);
  }

  selectItem(id: string) {
    this.selectedItem = this.items.find(item => item.id === id);
  }

  delete(index: number) {
    this.imagesSrc.splice(index, 1);
  }

  onFileChange(event: any) {
    if (event.target.files && event.target.files.length) {
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.imagesSrc.push({ data: reader.result as string, title: file.name, id: '0' });
        };
      }
    }
  }

  get(): Ticket {
    return {
      code: { ...this.selectedItem!, id: '0' },
      codeValue: this.selectedItem?.value!,
      description: this.description!,
      images: this.imagesSrc!,
      id: '0'
    } as Ticket
  }
}
