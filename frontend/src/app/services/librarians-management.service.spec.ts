import { TestBed } from '@angular/core/testing';

import { LibrariansManagementService } from './librarians-management.service';

describe('LibrariansManagementService', () => {
  let service: LibrariansManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibrariansManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
