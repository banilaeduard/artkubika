import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PreviousUrlService } from 'src/app/core/services/previous-url.service';
import { UserContextService } from 'src/app/core/services/user-context.service';
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
  public paging: PaginingModel;
  public isAdmin!: boolean;

  private isIndexResults!: boolean;
  private documentIds!: any[];
  private sub!: Subscription;
  private sub2!: Subscription;

  constructor(
    private complaintService: ComplaintService,
    private previousUrlService: PreviousUrlService,
    private userContextService: UserContextService) {
    this.paging = PaginingModel.getNew();
  }
  ngOnDestroy(): void {
    this.sub && this.sub.unsubscribe();
    this.sub2 && this.sub2.unsubscribe();
  }

  ngOnInit(): void {
    this.sub = this.previousUrlService.previousState$.subscribe(state => {
      this.paging = state?.paging ?? PaginingModel.getNew();
      this.isIndexResults = state?.isIndexResults ?? false;
      this.documentIds = state?.documentIds ?? undefined;
      this.syncTickets();
    });

    this.sub2 = this.userContextService.CurrentUser$.pipe(
      switchMap(_ => this.userContextService.isInRole(['admin']))
    ).subscribe(t => this.isAdmin = t);
  }

  editTicket(complaint: ComplaintModel, ticket: Ticket) {
    ticket.codeLinks = ticket.codeLinks ?? [];
    ticket.toAddAttachment = ticket.toAddAttachment ?? [];
    ticket.toDeleteAttachment = ticket.toDeleteAttachment ?? [];
    ticket.attachments = ticket.attachments ?? [];
    this.previousUrlService.navigateForPrevious(
      '/reclamatie',
      { ticket, complaint },
      {
        paging: this.paging,
        isIndexResults: !!this.isIndexResults,
        documentIds: this.documentIds
      });
  }

  public delete(complaint: ComplaintModel) {
    if (confirm("Are you sure you want to delete the entry?")) {
      this.complaintService
        .delete(complaint)
        .subscribe(_ => this.syncTickets());
    }
  }

  public updateStatusAccepted(complaint: ComplaintModel) {
    this.complaintService
      .updateStatus(complaint, 'ACCEPTED')
      .subscribe(_complaint => Object.assign(complaint, _complaint));
  }

  public updateStatusRejected(complaint: ComplaintModel) {
    this.complaintService
      .updateStatus(complaint, 'REJECTED')
      .subscribe(_complaint => Object.assign(complaint, _complaint));
  }

  public get page() {
    return this.paging.page;
  }

  public set page(page: number) {
    this.paging.page = page;
    if (!this.isIndexResults) {
      this.syncTickets();
    }
  }

  public setIndexResults(results: { count: number, results: any[] }) {
    if (this.isIndexResults != !!results) {
      this.paging.page = 1;
      this.isIndexResults = !!results;
    }

    if (this.isIndexResults) {
      this.paging.collectionSize = results.count;
      this.documentIds = results.results;
    } else {
      this.documentIds = [];
    }

    this.syncTickets();
  }

  public syncTickets() {
    this.complaintService.getAll(this.paging, this.isIndexResults ? this.documentIds : undefined).subscribe(_ => this.complaints = _);
  }
}
