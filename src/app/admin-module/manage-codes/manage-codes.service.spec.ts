import { TestBed } from '@angular/core/testing';

import { ManageCodesService } from './manage-codes.service';

describe('ManageCodesService', () => {
  let service: ManageCodesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageCodesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
