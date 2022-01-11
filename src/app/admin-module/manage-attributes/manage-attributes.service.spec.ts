import { TestBed } from '@angular/core/testing';

import { ManageAttributesService } from './manage-attributes.service';

describe('ManageAttributesService', () => {
  let service: ManageAttributesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageAttributesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
