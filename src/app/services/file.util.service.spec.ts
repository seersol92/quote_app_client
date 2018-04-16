import { TestBed, inject } from '@angular/core/testing';

import { File.UtilService } from './file.util.service';

describe('File.UtilService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [File.UtilService]
    });
  });

  it('should be created', inject([File.UtilService], (service: File.UtilService) => {
    expect(service).toBeTruthy();
  }));
});
