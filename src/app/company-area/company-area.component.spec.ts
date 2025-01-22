import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyAreaComponent } from './company-area.component';

describe('CompanyAreaComponent', () => {
  let component: CompanyAreaComponent;
  let fixture: ComponentFixture<CompanyAreaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyAreaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
