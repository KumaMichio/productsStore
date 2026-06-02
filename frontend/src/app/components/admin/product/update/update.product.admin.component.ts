import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Product } from '../../../../models/product';
import { Category } from '../../../../models/category';
import { ProductService } from '../../../../services/product.service';
import { CategoryService } from '../../../../services/category.service';
import { resolveImageUrl } from '../../../../utils/image.util';
import { ProductImage } from '../../../../models/product.image';
import { UpdateProductDTO } from '../../../../dtos/product/update.product.dto';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail.product.admin',
  templateUrl: './update.product.admin.component.html',
  styleUrls: ['./update.product.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class UpdateProductAdminComponent implements OnInit {
  productId: number;
  product: Product;
  updatedProduct: Product;
  categories: Category[] = [];
  currentImageIndex: number = 0;
  images: File[] = [];

  toast: { message: string; type: 'success' | 'error' } | null = null;
  private toastTimer: any = null;

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,    
    private location: Location,
  ) {
    this.productId = 0;
    this.product = {} as Product;
    this.updatedProduct = {} as Product;  
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = Number(params.get('id'));
      this.getProductDetails();
    });
    this.getCategories(1, 100);
  }
  getCategories(page: number, limit: number) {
    this.categoryService.getCategories(page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.categories = apiResponse.data;
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
  getProductDetails(): void {
    this.productService.getDetailProduct(this.productId).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.product = apiResponse.data;
        this.updatedProduct = { ...apiResponse.data };
        this.updatedProduct.product_images.forEach((product_image: ProductImage) => {
          product_image.image_url = resolveImageUrl(product_image.image_url);
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error(error?.error?.message ?? '');
      }
    });
  }
  showToast(message: string, type: 'success' | 'error') {
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toast = { message, type };
    this.toastTimer = setTimeout(() => { this.toast = null; }, 3000);
  }

  private extractErrorMessage(error: HttpErrorResponse, fallback: string): string {
    if (error.error instanceof SyntaxError || typeof error.error === 'string') {
      return fallback;
    }
    return error?.error?.message || fallback;
  }

  updateProduct() {
    const updateProductDTO: UpdateProductDTO = {
      name: this.updatedProduct.name,
      price: this.updatedProduct.price,
      description: this.updatedProduct.description,
      category_id: this.updatedProduct.category_id
    };
    this.productService.updateProduct(this.product.id, updateProductDTO).subscribe({
      next: () => {
        this.showToast('Product updated successfully!', 'success');
        setTimeout(() => this.router.navigate(['/admin/products']), 1500);
      },
      error: (error: HttpErrorResponse) => {
        this.showToast(this.extractErrorMessage(error, 'Update failed. Please try again.'), 'error');
      }
    });
  }
  showImage(index: number): void {
    if (this.product && this.product.product_images &&
        this.product.product_images.length > 0) {
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      this.currentImageIndex = index;
    }
  }
  thumbnailClick(index: number) {
    this.currentImageIndex = index;
  }
  nextImage(): void {
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    this.showImage(this.currentImageIndex - 1);
  }
  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 5) {
      console.error('Please select a maximum of 5 images.');
      return;
    }
    this.images = files;
    this.productService.uploadImages(this.productId, this.images).subscribe({
      next: () => {
        this.images = [];
        this.showToast('Images uploaded successfully!', 'success');
        this.getProductDetails();
      },
      error: (error: HttpErrorResponse) => {
        this.showToast(this.extractErrorMessage(error, 'Image upload failed.'), 'error');
      }
    })
  }
  deleteImage(productImage: ProductImage) {
    if (confirm('Are you sure you want to remove this image?')) {
      this.productService.deleteProductImage(productImage.id).subscribe({
        next: () => {
          this.showToast('Image removed.', 'success');
          this.getProductDetails();
        },
        error: (error: HttpErrorResponse) => {
          this.showToast(this.extractErrorMessage(error, 'Failed to remove image.'), 'error');
        }
      });
    }
  }
}
