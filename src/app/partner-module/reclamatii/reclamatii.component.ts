import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DialogOverlayService } from 'src/app/core/services/dialog-overlay.service';
import { ComplaintModel } from 'src/app/models/ComplaintModel';
import { PaginingModel } from 'src/app/models/PaginingModel';
import { Ticket } from 'src/app/models/Ticket';
import { ComplaintService } from './complaint.service';

@Component({
  selector: 'app-reclamatii',
  templateUrl: './reclamatii.component.html',
  styleUrls: ['./reclamatii.component.less']
})
export class ReclamatiiComponent implements OnInit, OnDestroy {
  @ViewChild('reclamatie') addTicketTemplate!: TemplateRef<any>;
  complaints!: ComplaintModel[];
  private _next: Subject<{ model: ComplaintModel, data: { header: string, ticket?: Ticket } }> = new Subject();
  private sub: Subscription;
  public paging: PaginingModel;

  constructor(
    private dialogOverlayService: DialogOverlayService,
    private complaintService: ComplaintService) {
    this.sub = this.next$.subscribe(obj =>
      this.dialogOverlayService.open(
        this.addTicketTemplate,
        { model: obj.model, data: { header: obj.data.header, ticket: obj.data.ticket } },
        undefined
      )
    );

    this.paging = PaginingModel.getNew();
  }

  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.syncTickets();
  }

  addComplaint() {
    this.complaints.unshift({ id: '0', tickets: [] } as ComplaintModel);
  }

  addTicket(complaint: ComplaintModel) {
    this._next.next({ model: complaint, data: { header: 'Reclamatie componenta' } });
  }

  editTicket(complaint: ComplaintModel, ticket: Ticket) {
    if (ticket.hasImages && !ticket.images?.length) {
      this.complaintService.fetchImages(ticket)
        .subscribe(ticket =>
          this._next.next({ model: complaint, data: { header: 'Reclamatie componenta', ticket } }));
    } else
      this._next.next({ model: complaint, data: { header: 'Reclamatie componenta', ticket } });
  }

  save(ticket: Ticket, complaint: ComplaintModel, done: () => boolean) {
    this.complaintService.save({ ...complaint, tickets: [ticket] }).pipe(
      tap(item => Object.assign(complaint, item))
    ).subscribe(done);
  }

  public get page() {
    return this.paging.page;
  }

  public set page(page: number) {
    this.paging.page = page;
    this.syncTickets();
  }

  public syncTickets() {
    this.complaintService.getAll(this.paging).subscribe(_ => this.complaints = _);
  }

  private get next$() {
    return this._next.asObservable();
  }
}
