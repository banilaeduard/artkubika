import { ComponentRef, Injectable } from '@angular/core';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { LoadingComponent } from '../loading/loading.component';

export class LoadingOverlayRef {
    constructor(private decrement: Function) { }

    close = (): void => {
        this.decrement();
    }
}

@Injectable({
    providedIn: "root"
})
export class LoadingService {
    private count: number;
    private overlayRef!: OverlayRef;
    private dialogRef!: LoadingOverlayRef;
    constructor(private overlay: Overlay) {
        this.count = 0;
    }

    open(): LoadingOverlayRef {
        if (this.count <= 0) {
            this.overlayRef = this.createOverlay();
            this.dialogRef = new LoadingOverlayRef(() => {
                this.count--;
                if (this.count <= 0) {
                    this.overlayRef.dispose();
                }
            });
            this.attachDialogContainer(this.overlayRef, this.dialogRef);
        }

        this.count++;

        return this.dialogRef;
    }

    private createOverlay(): OverlayRef {
        const positionStrategy = this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically();
        const overlayConfig = new OverlayConfig({
            hasBackdrop: true,
            scrollStrategy: this.overlay.scrollStrategies.block(),
            positionStrategy
        });

        return this.overlay.create(overlayConfig);
    }

    private attachDialogContainer(overlayRef: OverlayRef, dialogRef: LoadingOverlayRef): LoadingComponent {
        const containerPortal = new ComponentPortal(LoadingComponent, null);
        const containerRef: ComponentRef<LoadingComponent> = overlayRef.attach(containerPortal);

        return containerRef.instance;
    }
}