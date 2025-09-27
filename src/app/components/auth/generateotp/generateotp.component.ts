import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-generateotp',
  templateUrl: './generateotp.component.html',
  styleUrls: ['./generateotp.component.css']
})
export class GenerateotpComponent implements OnInit, AfterViewInit, OnDestroy {
  otpValues: string[] = Array(6).fill('');
  timer: number = 59;
  interval: any;
  resendDisabled: boolean = true;
  message: string = '';

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.startTimer();
  }

  ngAfterViewInit(): void {
    // focus first input after view init
    setTimeout(() => this.focusInput(0), 0);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  private focusInput(index: number) {
    const arr = this.otpInputs?.toArray();
    if (!arr || !arr[index]) return;
    arr[index].nativeElement.focus();
    arr[index].nativeElement.select();
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    if (!input) return;

    // keep only digits and max 1 char
    const value = (input.value || '').replace(/\D/g, '').slice(0, 1);
    // update model only — ngModel will update the DOM
    this.otpValues[index] = value;

    // move to next when a digit entered
    if (value && index < this.otpValues.length - 1) {
      this.focusInput(index + 1);
    }

    // auto-verify if all filled
    if (this.otpValues.every(v => v !== '')) {
      this.verifyOtp();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const key = event.key;

    if (key === 'Backspace') {
      // if current has a value, clear it and keep focus
      if (this.otpValues[index]) {
        this.otpValues[index] = '';
        event.preventDefault();
        return;
      }

      // if current empty, move to previous
      if (index > 0) {
        this.otpValues[index - 1] = '';
        this.focusInput(index - 1);
        event.preventDefault();
      }
    }

    // allow navigation keys and block other non-digit typing
    const allowed = ['ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
    if (!/^\d$/.test(key) && !allowed.includes(key) && !event.ctrlKey && !event.metaKey && key !== 'Backspace') {
      event.preventDefault();
    }
  }

  handlePaste(event: ClipboardEvent) {
    event.preventDefault();
    const paste = (event.clipboardData?.getData('text') || '').replace(/\D/g, '').slice(0, this.otpValues.length);

    for (let i = 0; i < paste.length; i++) {
      this.otpValues[i] = paste[i];
    }

    // allow Angular to update input values, then focus
    setTimeout(() => {
      const nextEmpty = this.otpValues.findIndex(v => v === '');
      if (nextEmpty === -1) {
        this.verifyOtp();
      } else {
        this.focusInput(nextEmpty);
      }
    }, 0);
  }

  startTimer() {
    this.resendDisabled = true;
    this.timer = 59;
    clearInterval(this.interval);
    this.interval = setInterval(() => {
      this.timer--;
      if (this.timer <= 0) {
        clearInterval(this.interval);
        this.resendDisabled = false;
      }
    }, 1000);
  }

  resendOtp() {
    this.message = 'A new OTP has been sent!';
    this.otpValues = Array(this.otpValues.length).fill('');
    // let Angular clear the inputs via ngModel, then focus
    setTimeout(() => this.focusInput(0), 0);
    this.startTimer();
    // TODO: call backend to actually resend OTP
  }

  verifyOtp() {
    const otp = this.otpValues.join('');
    if (otp.length !== this.otpValues.length) {
      this.message = `Please enter the full ${this.otpValues.length}-digit OTP.`;
      const firstEmpty = this.otpValues.findIndex(v => v === '');
      this.focusInput(firstEmpty === -1 ? 0 : firstEmpty);
      return;
    }

    this.message = 'Verifying...';

    this.http.post<any>('https://stylehub-1-degl.onrender.com/auth/verify-otp', { otp })
      .subscribe({
        next: (res) => {
          this.message = res.message || 'OTP verified successfully! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/resetpassword']);
          }, 1000);
        },
        error: (err) => {
          this.message = err.error?.message || 'Invalid OTP. Please try again.';
        }
      });
  }
}
