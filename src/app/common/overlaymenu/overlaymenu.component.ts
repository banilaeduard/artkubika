import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { skip, take } from 'rxjs/operators';

@Component({
  selector: 'app-overlaymenu',
  template: '',
  styleUrls: []
})
export class OverlaymenuComponent implements OnDestroy {
  @Input() template!: TemplateRef<any>;
  @Input() overridePosition!: { x: number, y: number };

  private sub!: Subscription;
  private overlayRef!: OverlayRef | null;

  constructor(
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef
  ) { }

  ngOnDestroy(): void {
    this.close();
  }

  public openFromTarget(target: HTMLElement, context?: any) {
    const targetPos = target.getBoundingClientRect();
    this.open(targetPos.x + targetPos.width, targetPos.y + targetPos.height, context);
    this.sub = fromEvent<MouseEvent>(document, 'click').pipe(skip(1), take(1)).subscribe(t => this.close());
  }

  public open(x: number, y: number, context?: any) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({
        x: this.overridePosition?.x || x,
        y: this.overridePosition?.y || y
      })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef, { $implicit: context }));
  }

  public close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
