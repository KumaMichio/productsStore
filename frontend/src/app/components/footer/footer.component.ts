import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { ApiResponse } from '../../responses/api.response';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, TranslateModule],
})
export class FooterComponent implements OnInit {
  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.categoryService.getCategories(0, 100).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = (apiResponse.data ?? []).slice(0, 4);
      },
      error: () => {},
    });
  }
}
