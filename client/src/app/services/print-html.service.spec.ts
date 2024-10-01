import { TestBed } from '@angular/core/testing';

import { PrintHtmlService } from './print-html.service';

describe('PrintHtmlService', () => {
  let service: PrintHtmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrintHtmlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
