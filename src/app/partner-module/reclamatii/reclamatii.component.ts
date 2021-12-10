import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { tap } from 'rxjs/operators';
import { DialogOverlayService } from 'src/app/core/services/dialog-overlay.service';
import { ComplaintModel } from 'src/app/models/ComplaintModel';
import { Ticket } from 'src/app/models/Ticket';
import { ComplaintService } from './complaint.service';

@Component({
  selector: 'app-reclamatii',
  templateUrl: './reclamatii.component.html',
  styleUrls: ['./reclamatii.component.less']
})
export class ReclamatiiComponent implements OnInit {
  @ViewChild('reclamatie') addTicketTemplate!: TemplateRef<any>;
  complaints!: ComplaintModel[];

  constructor(
    private dialogOverlayService: DialogOverlayService,
    private complaintService: ComplaintService) {
  }

  ngOnInit(): void {
    this.complaintService.getAll().subscribe(_ => this.complaints = _);
  }

  addTicket(complaint: ComplaintModel) {
    this.dialogOverlayService.open(this.addTicketTemplate, { model: complaint, data: { header: 'Reclamatie componenta' } }, undefined);
  }

  editTicket(complaint: ComplaintModel, ticket: Ticket) {
    this.dialogOverlayService.open(this.addTicketTemplate, { model: complaint, data: { header: 'Reclamatie componenta', ticket: ticket } }, undefined);
  }

  addComplaint() {
    this.complaints.unshift({ id: '0', tickets: [] } as ComplaintModel);
  }

  save(ticket: Ticket, complaint: ComplaintModel, done: () => boolean) {
    if (!parseInt(ticket.id)) {
      complaint.tickets.push(ticket);
    }
    this.complaintService.save(complaint).pipe(
      tap(item => {
        complaint.id = item.id;
        complaint.tickets = item.tickets
      })
    ).subscribe(done);
  }
}
