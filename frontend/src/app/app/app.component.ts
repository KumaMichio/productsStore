import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastComponent } from '../components/toast/toast.component';
import { LanguageService } from '../services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterModule, ToastComponent]
})
export class AppComponent {
  constructor(private languageService: LanguageService) {
    this.languageService.init();
  }
}
