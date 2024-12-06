import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarenkorbComponent } from './warenkorb.component';

describe('WarenkorbComponent', () => {
  let component: WarenkorbComponent;
  let fixture: ComponentFixture<WarenkorbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarenkorbComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WarenkorbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
