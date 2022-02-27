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
    this.sub = this.previousUrlService.previousState$.subscribe(paging => {
      this.paging = paging ?? PaginingModel.getNew();
      this.syncTickets();
    });

    this.sub2 = this.userContextService.CurrentUser$.pipe(
      switchMap(_ => this.userContextService.isInRole(['admin']))
    ).subscribe(t => this.isAdmin = t);
  }

  editTicket(complaint: ComplaintModel, ticket: Ticket) {
    ticket.codeLinks = ticket.codeLinks ?? [];
    ticket.toAddImages = ticket.toAddImages ?? [];
    ticket.toDeleteImages = ticket.toDeleteImages ?? [];
    ticket.images = ticket.images ?? [];
    this.previousUrlService.navigateForPrevious(
      '/reclamatie',
      { ticket, complaint },
      this.paging);
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
}
