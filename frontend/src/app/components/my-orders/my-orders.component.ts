import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order.service';
import { TokenService } from '../../services/token.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { OrderResponse } from '../../responses/order/order.response';
import { ApiResponse } from '../../responses/api.response';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss'],
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, TranslateModule],
})
export class MyOrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private tokenService: TokenService,
    private router: Router,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    const userId = this.tokenService.getUserId();
    this.orderService.getOrdersByUserId(userId).subscribe({
      next: (res: ApiResponse) => {
        this.orders = (res.data as OrderResponse[]) ?? [];
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
        this.loading = false;
      },
    });
  }

  viewDetail(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  statusLabel(status: string): string {
    return this.translate.instant('my_orders.status_' + (status?.toLowerCase() ?? '')) || status;
  }

  statusClass(status: string): string {
    const map: Record<string, string> = {
      pending:   'badge--pending',
      processing:'badge--processing',
      shipped:   'badge--shipped',
      delivered: 'badge--delivered',
      cancelled: 'badge--cancelled',
    };
    return map[status?.toLowerCase()] ?? '';
  }
}
