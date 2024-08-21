import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashcardsComponent } from './dashcards.component';

describe('DashcardsComponent', () => {
  let component: DashcardsComponent;
  let fixture: ComponentFixture<DashcardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashcardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashcardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
