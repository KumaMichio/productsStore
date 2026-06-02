import { Component, OnInit, Inject } from '@angular/core';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { TokenService } from '../../services/token.service';
import { NewsletterService } from '../../services/newsletter.service';
import { ToastService } from '../../services/toast.service';
import { ApiResponse } from '../../responses/api.response';

import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { resolveImageUrl } from '../../utils/image.util';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    CommonModule,
    FormsModule,
    RouterModule
  ]
})
export class HomeComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  selectedCategoryId: number = 0;
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages: number = 0;
  visiblePages: number[] = [];
  keyword: string = "";
  newsletterEmail: string = "";
  localStorage?: Storage;
  apiBaseUrl = environment.apiBaseUrl;

  getProductByCategory(categoryId: number): Product | undefined {
    return this.products.find(p => p.category_id === categoryId);
  }

  filterByCategory(categoryId: number): void {
    this.selectedCategoryId = categoryId;
    this.currentPage = 0;
    this.keyword = '';
    this.getProducts('', categoryId, 0, this.itemsPerPage);
  }

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private tokenService: TokenService,
    private newsletterService: NewsletterService,
    private toastService: ToastService,
    @Inject(DOCUMENT) private document: Document
    ) {
      this.localStorage = document.defaultView?.localStorage;
    }

    subscribeNewsletter(): void {
      const email = this.newsletterEmail.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(email)) {
        this.toastService.error('Vui lòng nhập email hợp lệ.');
        return;
      }
      this.newsletterService.subscribe(email).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.toastService.success(apiResponse?.message ?? 'Đăng ký nhận tin thành công');
          this.newsletterEmail = '';
        },
        error: (error: HttpErrorResponse) => {
          this.toastService.error(error?.error?.message ?? 'Đăng ký thất bại.');
        },
      });
    }

    ngOnInit() {
      this.getCategories(0, 100);
      // Lắng nghe query param `search` (header) và `category` (footer SHOP) để lọc sản phẩm.
      this.activatedRoute.queryParamMap.subscribe((params) => {
        this.keyword = params.get('search') ?? '';
        this.selectedCategoryId = Number(params.get('category')) || 0;
        const hasFilter = !!this.keyword || this.selectedCategoryId > 0;
        this.currentPage = hasFilter
          ? 0
          : (Number(this.localStorage?.getItem('currentProductPage')) || 0);
        this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
      });
    }
    
    getCategories(page: number, limit: number) {
      this.categoryService.getCategories(page, limit).subscribe({
        next: (apiResponse: ApiResponse) => {
          this.categories = apiResponse.data;
        },
        complete: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        } 
      });
    }
    
    searchProducts() {
      this.currentPage = 0;
      this.itemsPerPage = 12;
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    
    getProducts(keyword: string, selectedCategoryId: number, page: number, limit: number) {
      this.productService.getProducts(keyword, selectedCategoryId, page, limit).subscribe({
        next: (apiresponse: ApiResponse) => {
          const response = apiresponse.data;
          response.products.forEach((product: Product) => {
            product.url = resolveImageUrl(product.thumbnail);
          });
          this.products = response.products;
          this.totalPages = response.totalPages;
          this.visiblePages = this.generateVisiblePageArray(this.currentPage, this.totalPages);
        },
        complete: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        }
      });    
    }
    
    onPageChange(page: number) {
      this.currentPage = page < 0 ? 0 : page;
      this.localStorage?.setItem('currentProductPage', String(this.currentPage)); 
      this.getProducts(this.keyword, this.selectedCategoryId, this.currentPage, this.itemsPerPage);
    }
    
    generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
      const maxVisiblePages = 5;
      const halfVisiblePages = Math.floor(maxVisiblePages / 2);
    
      let startPage = Math.max(currentPage - halfVisiblePages, 1);
      let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);
    
      if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(endPage - maxVisiblePages + 1, 1);
      }
    
      return new Array(endPage - startPage + 1).fill(0)
        .map((_, index) => startPage + index);
    }
    
    // Hàm xử lý sự kiện khi sản phẩm được bấm vào
    onProductClick(productId: number) {
      // Điều hướng đến trang detail-product với productId là tham số
      this.router.navigate(['/products', productId]);
    }
}
