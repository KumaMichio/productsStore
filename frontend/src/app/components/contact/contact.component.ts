import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { ContactService } from '../../services/contact.service';
import { ToastService } from '../../services/toast.service';
import { ApiResponse } from '../../responses/api.response';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HeaderComponent, FooterComponent],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  contactForm: FormGroup;
  submitting = false;

  constructor(
    private fb: FormBuilder,
    private contactService: ContactService,
    private toastService: ToastService,
  ) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      subject: [''],
      message: ['', Validators.required],
    });
  }

  submit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.toastService.error('Vui lòng điền đầy đủ thông tin hợp lệ.');
      return;
    }
    this.submitting = true;
    this.contactService.sendMessage(this.contactForm.value).subscribe({
      next: (_: ApiResponse) => {
        this.toastService.success('Đã gửi liên hệ. Cảm ơn bạn!');
        this.contactForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.toastService.error(error?.error?.message ?? 'Gửi liên hệ thất bại.');
      },
    }).add(() => (this.submitting = false));
  }
}
