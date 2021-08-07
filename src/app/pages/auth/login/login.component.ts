import  Swal  from 'sweetalert2';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { BaseFormUser } from '@shared/utils/base-form-user';
import { AuthService } from '@auth/auth.service';
import { Subscription } from 'rxjs';

declare var jQuery: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  hide = true;
  private subscription: Subscription = new Subscription();

  constructor(
    private authSvc: AuthService,
    private router: Router,
    public loginForm: BaseFormUser
  ) { }

  ngOnInit(): void {
    this.loginForm.baseForm.get('role').setValidators(null);
    this.loginForm.baseForm.get('role').updateValueAndValidity();

    (function ($) {
      $(document).ready(function () {
        $('.app-sidebar2').css('display', 'none');
        $('.app-sidebar3').css('display', 'none');
      });
    })(jQuery);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLogin(): void {
    if (this.loginForm.baseForm.invalid) {
      return;
    }
    const formValue = this.loginForm.baseForm.value;
    let timerInterval
    Swal.fire({
      title: 'อยู่ในระหว่างดำเนินการ !',
      // html: 'I will close in <b></b> milliseconds.',
      // timer: 5000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        const b: any = Swal.getHtmlContainer().querySelector('b')
        // timerInterval = setInterval(() => {
        //   b.textContent = Swal.getTimerLeft()
        // }, 100)
      },
      willClose: () => {
        clearInterval(timerInterval)
      }
    })

    this.subscription.add(
      this.authSvc.login(formValue).subscribe((res) => {
        Swal.close();
        if (res) {
          this.router.navigate(['/']);
        }
      })
    );
  }

  checkField(field: string): boolean {
    return this.loginForm.isValidField(field);
  }
}
