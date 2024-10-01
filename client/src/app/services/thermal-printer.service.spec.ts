import { TestBed } from '@angular/core/testing';

import { ThermalPrinterService } from './thermal-printer.service';

describe('ThermalPrinterService', () => {
  let service: ThermalPrinterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThermalPrinterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
