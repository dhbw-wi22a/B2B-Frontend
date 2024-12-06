import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FirmenprofilComponent } from './firmenprofil.component';

describe('FirmenprofilComponent', () => {
  let component: FirmenprofilComponent;
  let fixture: ComponentFixture<FirmenprofilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FirmenprofilComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FirmenprofilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
