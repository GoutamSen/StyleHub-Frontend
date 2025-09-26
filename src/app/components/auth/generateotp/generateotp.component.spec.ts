import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateotpComponent } from './generateotp.component';

describe('GenerateotpComponent', () => {
  let component: GenerateotpComponent;
  let fixture: ComponentFixture<GenerateotpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateotpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateotpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
