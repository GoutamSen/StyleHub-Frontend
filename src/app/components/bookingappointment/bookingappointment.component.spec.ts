import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingappointmentComponent } from './bookingappointment.component';

describe('BookingappointmentComponent', () => {
  let component: BookingappointmentComponent;
  let fixture: ComponentFixture<BookingappointmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingappointmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingappointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
