import { TestBed } from '@angular/core/testing';

import { LoginGoogleService } from './login-google.service';

describe('LoginGoogleService', () => {
  let service: LoginGoogleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginGoogleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
