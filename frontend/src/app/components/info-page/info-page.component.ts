import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';

interface InfoSection {
  heading?: string;
  paragraphs: string[];
}

interface InfoPageContent {
  title: string;
  intro: string;
  sections: InfoSection[];
}

const INFO_PAGES: Record<string, InfoPageContent> = {
  about: {
    title: 'Về chúng tôi',
    intro: 'Maison Sand là một xưởng nhỏ tại Lisbon, tuyển chọn những vật dụng hằng ngày bền đẹp từ các nhà làm thủ công độc lập.',
    sections: [
      {
        heading: 'Triết lý',
        paragraphs: [
          'Chúng tôi tin vào việc sở hữu ít hơn nhưng tốt hơn — những món đồ được làm tử tế, dùng được lâu dài và đẹp một cách lặng lẽ.',
          'Mỗi sản phẩm đều được chọn vì chất liệu tự nhiên, tay nghề thủ công và khả năng đồng hành cùng bạn qua nhiều năm tháng.',
        ],
      },
      {
        heading: 'Cam kết',
        paragraphs: [
          'Ưu tiên vật liệu bền vững, đóng gói tối giản và hợp tác trực tiếp với người làm ra sản phẩm.',
        ],
      },
    ],
  },
  blog: {
    title: 'Blog',
    intro: 'Những ghi chép về vật liệu, nghề thủ công và lối sống chậm.',
    sections: [
      {
        paragraphs: [
          'Chuyên mục blog đang được cập nhật. Hãy đăng ký nhận tin ở chân trang để biết khi có bài viết mới.',
        ],
      },
    ],
  },
  stockists: {
    title: 'Đại lý',
    intro: 'Bạn có thể tìm thấy sản phẩm Maison Sand tại các cửa hàng đối tác.',
    sections: [
      {
        heading: 'Việt Nam',
        paragraphs: ['Hà Nội — Concept Store, 12 Nhà Thờ.', 'TP. Hồ Chí Minh — The Studio, 45 Đồng Khởi.'],
      },
      {
        heading: 'Trở thành đại lý',
        paragraphs: ['Liên hệ với chúng tôi qua trang Liên hệ để nhận bảng giá sỉ và điều khoản hợp tác.'],
      },
    ],
  },
  press: {
    title: 'Báo chí',
    intro: 'Maison Sand trên các phương tiện truyền thông.',
    sections: [
      {
        paragraphs: [
          '“Một định nghĩa mới về sự tối giản ấm áp.” — Tạp chí Thiết kế',
          'Mọi yêu cầu báo chí, vui lòng liên hệ qua trang Liên hệ.',
        ],
      },
    ],
  },
  shipping: {
    title: 'Vận chuyển',
    intro: 'Thông tin về giao hàng và thời gian xử lý đơn.',
    sections: [
      {
        heading: 'Thời gian',
        paragraphs: ['Đơn hàng được xử lý trong 1–2 ngày làm việc.', 'Giao nội thành 2–3 ngày, toàn quốc 3–5 ngày.'],
      },
      {
        heading: 'Phí vận chuyển',
        paragraphs: ['Miễn phí giao hàng cho đơn từ 1.000.000₫. Các đơn còn lại tính phí theo khu vực.'],
      },
    ],
  },
  returns: {
    title: 'Đổi trả',
    intro: 'Chính sách đổi trả trong vòng 14 ngày.',
    sections: [
      {
        paragraphs: [
          'Bạn có thể đổi hoặc trả sản phẩm trong vòng 14 ngày kể từ khi nhận hàng, với điều kiện sản phẩm còn nguyên trạng và tem mác.',
          'Để bắt đầu, vui lòng liên hệ với chúng tôi kèm mã đơn hàng.',
        ],
      },
    ],
  },
  care: {
    title: 'Hướng dẫn bảo quản',
    intro: 'Giữ cho sản phẩm bền đẹp theo thời gian.',
    sections: [
      {
        heading: 'Vải lanh & cotton',
        paragraphs: ['Giặt lạnh, phơi trong bóng râm, tránh chất tẩy mạnh.'],
      },
      {
        heading: 'Gỗ & gốm',
        paragraphs: ['Lau bằng khăn ẩm, tránh ngâm nước lâu và nguồn nhiệt trực tiếp.'],
      },
    ],
  },
};

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss'],
})
export class InfoPageComponent implements OnInit {
  content?: InfoPageContent;
  notFound = false;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') ?? '';
      this.content = INFO_PAGES[slug];
      this.notFound = !this.content;
    });
  }
}
