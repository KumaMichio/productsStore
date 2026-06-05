import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { UserResponse } from '../../responses/user/user.response';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService, LANGUAGES, Lang } from '../../services/language.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, NgbModule, RouterModule, TranslateModule]
})
export class HeaderComponent implements OnInit, OnDestroy {
  userResponse?: UserResponse | null;
  isPopoverOpen = false;
  activeNavItem: number = 0;
  cartCount: number = 0;
  searchOpen: boolean = false;
  searchKeyword: string = '';
  langMenuOpen = false;
  languages = LANGUAGES;
  private cartSub?: Subscription;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private cartService: CartService,
    public languageService: LanguageService,
  ) {}

  get currentLang() {
    return LANGUAGES.find(l => l.code === this.languageService.current) ?? LANGUAGES[0];
  }

  switchLang(code: Lang): void {
    this.languageService.setLang(code);
    this.langMenuOpen = false;
  }
  ngOnInit() {
    this.userResponse = this.userService.getUserResponseFromLocalStorage();
    this.cartSub = this.cartService.cartCount$.subscribe(
      (count) => this.cartCount = count
    );
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
  }

  togglePopover(event: Event): void {
    event.preventDefault();
    this.isPopoverOpen = !this.isPopoverOpen;
  }

  handleItemClick(index: number): void {
    //console.error(`Clicked on "${index}"`);
    if(index === 0) {
      this.router.navigate(['/user-profile']);
    } else if (index === 1) {
      this.router.navigate(['/my-orders']);
    } else if (index === 2) {
      this.userService.removeUserFromLocalStorage();
      this.tokenService.removeToken();
      this.userResponse = this.userService.getUserResponseFromLocalStorage();    
    }
    this.isPopoverOpen = false; // Close the popover after clicking an item    
  }

  
  setActiveNavItem(index: number) {
    this.activeNavItem = index;
    //console.error(this.activeNavItem);
  }

  // Mở/đóng ô tìm kiếm. Nếu đang mở và có từ khoá thì thực hiện tìm.
  toggleSearch(): void {
    if (this.searchOpen) {
      this.submitSearch();
    } else {
      this.searchOpen = true;
    }
  }

  // Điều hướng về trang chủ kèm query param `search` để HomeComponent lọc sản phẩm.
  submitSearch(): void {
    const keyword = this.searchKeyword.trim();
    this.router.navigate(['/'], { queryParams: keyword ? { search: keyword } : {} });
    this.searchOpen = false;
  }
}
