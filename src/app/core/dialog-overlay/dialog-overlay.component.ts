import { CdkPortalOutlet, PortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { AfterContentInit, Component, Inject, OnDestroy, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { DialogOverlayRef } from '../services/dialog-overlay.service';

@Component({
  selector: 'app-dialog-overlay',
  templateUrl: './dialog-overlay.component.html',
  styleUrls: ['./dialog-overlay.component.less']
})
export class DialogOverlayComponent<T> implements AfterContentInit, OnDestroy {
  @ViewChild(CdkPortalOutlet, { static: true }) portalOutlet!: PortalOutlet;

  constructor(
    @Inject('template_ref') private templateRef: TemplateRef<T>,
    @Inject('context') public context: { model: T, data: any },
    @Inject('dialogOverlayRef') private dialogRef: DialogOverlayRef,
    private viewContainerRef: ViewContainerRef) { }

  ngOnDestroy(): void {
    this.portalOutlet.detach();
  }

  ngAfterContentInit(): void {
    const templatePortal = new TemplatePortal<any>(this.templateRef, this.viewContainerRef, { $implicit: this.context?.model, data: this.context?.data, done: (x: boolean) => this.close(x) });
    this.portalOutlet.attach(templatePortal);
  }

  public close(x: boolean) {
    this.portalOutlet.detach();
    this.dialogRef.close(x);
  }
}
