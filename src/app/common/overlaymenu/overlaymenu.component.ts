import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-overlaymenu',
  templateUrl: './overlaymenu.component.html',
  styleUrls: []
})
export class OverlaymenuComponent implements OnInit, OnDestroy {
  @Input() template!: TemplateRef<any>;
  @Input() closeCondition!: Observable<any>;

  private sub!: Subscription;
  private overlayRef!: OverlayRef | null;
  private isOpened!: boolean;

  constructor(public overlay: Overlay,
    public viewContainerRef: ViewContainerRef) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.close();
  }

  public open(x: number, y: number) {
    this.close();

    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({
        x: x,
        y: y
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

    this.overlayRef.attach(new TemplatePortal(this.template, this.viewContainerRef, {}));
    this.sub = this.closeCondition && this.closeCondition.subscribe(t => this.close());
    this.isOpened = true;
  }

  public containsElement(element: HTMLElement) {
    return !!this.overlayRef && this.overlayRef.overlayElement.contains(element);
  }

  public get IsOpened(): boolean {
    return this.isOpened;
  }

  public close() {
    this.isOpened = false;
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
