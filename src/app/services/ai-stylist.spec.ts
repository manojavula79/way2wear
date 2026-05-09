import { TestBed } from '@angular/core/testing';

import { AiStylist } from './ai-stylist';

describe('AiStylist', () => {
  let service: AiStylist;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiStylist);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
