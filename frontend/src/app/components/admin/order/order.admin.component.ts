import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';

import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../services/order.service';
import { CommonModule, DOCUMENT, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiResponse } from '../../../responses/api.response';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-order-admin',
  templateUrl: './order.admin.component.html',
  styleUrls: ['./order.admin.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitleCasePipe,
  ]
})
export class OrderAdminComponent implements OnInit{  
  orders: OrderResponse[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 12;
  pages: number[] = [];
  totalPages:number = 0;
  keyword:string = "";
  visiblePages: number[] = [];
  localStorage?:Storage;
  activeTab: string = 'all';

  get filteredOrders(): OrderResponse[] {
    if (this.activeTab === 'all') return this.orders;
    return this.orders.filter(o => o.status?.toLowerCase() === this.activeTab);
  }

  setTab(tab: string): void {
    this.activeTab = tab;
  }

  getStatusClass(status: string): string {
    switch ((status ?? '').toLowerCase()) {
      case 'paid':      return 'status-paid';
      case 'fulfilled': return 'status-fulfilled';
      case 'pending':   return 'status-pending';
      case 'refunded':  return 'status-refunded';
      case 'cancelled': return 'status-cancelled';
      default:          return 'status-default';
    }
  }

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.localStorage = document.defaultView?.localStorage;
  }
  ngOnInit(): void {
    this.currentPage = Number(this.localStorage?.getItem('currentOrderAdminPage')) || 0; 
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }
  searchOrders() {
    this.currentPage = 0;
    this.itemsPerPage = 12;
    //Mediocre Iron Wallet
    this.getAllOrders(this.keyword.trim(), this.currentPage, this.itemsPerPage);
  }
  getAllOrders(keyword: string, page: number, limit: number) {
    this.orderService.getAllOrders(keyword, page, limit).subscribe({
      next: (apiResponse: ApiResponse) => {
        this.orders = apiResponse.data.orders;
        this.totalPages = apiResponse.data.totalPages;
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
    this.localStorage?.setItem('currentOrderAdminPage', String(this.currentPage));         
    this.getAllOrders(this.keyword, this.currentPage, this.itemsPerPage);
  }

  generateVisiblePageArray(currentPage: number, totalPages: number): number[] {
    const safeTotal = Math.max(totalPages || 0, 0);
    if (safeTotal === 0) return [];
    const maxVisiblePages = 5;
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, safeTotal);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }

    const length = Math.max(endPage - startPage + 1, 0);
    return new Array(length).fill(0).map((_, index) => startPage + index);
  }

  deleteOrder(id:number) {
    const confirmation = window
      .confirm('Are you sure you want to delete this order?');
    if (confirmation) {
      this.orderService.deleteOrder(id).subscribe({
        next: (response: ApiResponse) => {
          location.reload();          
        },
        complete: () => {
        },
        error: (error: HttpErrorResponse) => {
          console.error(error?.error?.message ?? '');
        }
      });    
    }
  }
  viewDetails(order:OrderResponse) {
    this.router.navigate(['/admin/orders', order.id]);
  }
  
}