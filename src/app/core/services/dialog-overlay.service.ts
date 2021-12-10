import { Injectable, Injector, TemplateRef } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DialogOverlayComponent } from '../dialog-overlay/dialog-overlay.component';
import { Observable, Subject } from 'rxjs';

export class DialogOverlayRef {
  private closed$: Subject<boolean> = new Subject();
  constructor(
    private overlay: OverlayRef
  ) { }
  $closed = (): Observable<boolean> => {
    return this.closed$.asObservable();
  }
  close = (success: boolean): void => {
    this.closed$.next(success);
    this.overlay.dispose();
  }
}

@Injectable({
  providedIn: 'root'
})
export class DialogOverlayService {
  constructor(
    private overlay: Overlay) {
  }

  open<T>(templateRef: TemplateRef<T>,
    context: { model?: T, data?: any } | undefined,
    overlayConfig: OverlayConfig | undefined): DialogOverlayRef {
    const overlayRef = this.createOverlay(overlayConfig);
    const dialogRef = new DialogOverlayRef(overlayRef);
    this.attachDialogContainer(overlayRef, templateRef, context, dialogRef);

    return dialogRef;
  }

  private createOverlay(overlayConfig: OverlayConfig | undefined): OverlayRef {
    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();
    const overlayConfig2 = new OverlayConfig({
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy
    });

    return this.overlay.create({ ...overlayConfig2, ...overlayConfig });
  }

  private attachDialogContainer<T>(
    overlayRef: OverlayRef,
    templateRef: TemplateRef<T>,
    context: { model?: T, data?: any } | undefined,
    dialogOverlayRef: DialogOverlayRef): DialogOverlayComponent<T> {
    const containerPortal = new ComponentPortal<DialogOverlayComponent<T>>(DialogOverlayComponent, null, Injector.create({
      providers: [
        { provide: 'template_ref', useValue: templateRef },
        { provide: 'context', useValue: context },
        { provide: 'dialogOverlayRef', useValue: dialogOverlayRef }
      ]
    }));
    return overlayRef.attach(containerPortal).instance;
  }
}
