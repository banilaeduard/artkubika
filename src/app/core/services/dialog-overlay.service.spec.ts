import { TestBed } from '@angular/core/testing';

import { DialogOverlayService } from './dialog-overlay.service';

describe('DialogOverlayService', () => {
  let service: DialogOverlayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DialogOverlayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
