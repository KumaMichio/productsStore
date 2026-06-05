SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- category_id: 1=Nội thất, 2=Quần áo, 3=Nước hoa, 4=Nến thơm, 5=Chăm sóc da, 6=Phụ kiện

INSERT INTO products (name, price, thumbnail, description, category_id, created_at, updated_at) VALUES
-- Nội thất (1)
('Ghế Đọc Sách Linnen', 4200000, 'ghe-doc-sach-linnen.jpg', 'Ghế bọc vải lanh tự nhiên, khung gỗ sồi nguyên khối. Thiết kế đơn giản, bền theo thời gian.', 1, NOW(), NOW()),
('Kệ Sách Walnut', 3600000, 'ke-sach-walnut.jpg', 'Kệ sách gỗ óc chó tự nhiên, hoàn thiện bằng dầu tự nhiên. Có thể tùy chỉnh số ngăn.', 1, NOW(), NOW()),
('Bàn Trà Travertine', 6800000, 'ban-tra-travertine.jpg', 'Mặt bàn đá travertine tự nhiên trên chân thép matte. Mỗi tấm đá có vân độc đáo.', 1, NOW(), NOW()),
('Đèn Bàn Ceramic', 1850000, 'den-ban-ceramic.jpg', 'Chân đèn gốm thủ công, chụp đèn vải lanh. Ánh sáng ấm 2700K, tạo cảm giác thư giãn.', 1, NOW(), NOW()),
('Gương Tròn Khung Mây', 1200000, 'guong-tron-khung-may.jpg', 'Gương tròn đường kính 60cm, khung đan mây tự nhiên. Phù hợp phòng khách và phòng ngủ.', 1, NOW(), NOW()),

-- Quần áo (2)
('Áo Len Ribbed Cotton', 1420000, 'ao-len-ribbed-cotton.jpg', '100% cotton hữu cơ dệt ribbed. Form rộng thoải mái, màu undyed tự nhiên.', 2, NOW(), NOW()),
('Quần Linen Wide-leg', 1680000, 'quan-linen-wide-leg.jpg', 'Vải lanh Bỉ cao cấp, cạp thun co giãn. Thoáng mát, phù hợp cả ngày dài.', 2, NOW(), NOW()),
('Áo Khoác Wool Blend', 4500000, 'ao-khoac-wool-blend.jpg', 'Blend 60% len merino và 40% cashmere tái chế. Đường may thủ công, lót vải tự nhiên.', 2, NOW(), NOW()),
('Đầm Midi Lanh', 2100000, 'dam-midi-lanh.jpg', 'Vải lanh wash nhẹ, form A-line. Màu sand tự nhiên, không nhuộm hóa chất.', 2, NOW(), NOW()),
('Set Loungewear Cotton', 1950000, 'set-loungewear-cotton.jpg', 'Bộ mặc nhà gồm áo và quần, cotton 280gsm mềm mại. Wash nhiều lần không phai.', 2, NOW(), NOW()),

-- Nước hoa (3)
('Amber & Sandalwood EDP', 2800000, 'amber-sandalwood-edp.jpg', 'Nước hoa unisex với top note bergamot, heart note hoa hồng Damask, base note đàn hương và hổ phách.', 3, NOW(), NOW()),
('White Tea & Cedar EDP', 2400000, 'white-tea-cedar-edp.jpg', 'Hương trà trắng thanh nhẹ, gỗ tuyết tùng ấm áp. Lưu hương 8-10 tiếng trên da.', 3, NOW(), NOW()),
('Vetiver & Moss EDT', 1900000, 'vetiver-moss-edt.jpg', 'Hương xanh của rêu và đất ẩm, tầng cuối là vetiver và gỗ thông. Lọ thủy tinh tái chế.', 3, NOW(), NOW()),
('Rose & Oud Parfum', 4200000, 'rose-oud-parfum.jpg', 'Nồng độ parfum 25%, hương hoa hồng Thổ Nhĩ Kỳ và oud Ả Rập. Lưu hương 24 giờ.', 3, NOW(), NOW()),

-- Nến thơm (4)
('Nến Soy Cedarwood & Smoke', 680000, 'nen-cedarwood-smoke.jpg', 'Sáp đậu nành tự nhiên, hương gỗ tuyết tùng và khói nhẹ. Cháy đều 50 giờ, không khói.', 4, NOW(), NOW()),
('Nến Linen & Salt', 580000, 'nen-linen-salt.jpg', 'Mùi hương biển và vải lanh sạch. Bấc bông cotton, lọ gốm có thể tái sử dụng.', 4, NOW(), NOW()),
('Nến Bergamot & Thyme', 620000, 'nen-bergamot-thyme.jpg', 'Hương cam bergamot tươi mát kết hợp với thyme thảo mộc. Phù hợp phòng làm việc.', 4, NOW(), NOW()),
('Nến Vanilla & Bourbon', 650000, 'nen-vanilla-bourbon.jpg', 'Hương vanilla ấm ngọt và bourbon gỗ sồi. Tạo cảm giác ấm áp cho không gian buổi tối.', 4, NOW(), NOW()),

-- Chăm sóc da (5)
('Tinh Dầu Rosehip Facial', 460000, 'tinh-dau-rosehip.jpg', 'Dầu hạt tầm xuân ép lạnh 100%. Giàu vitamin C và A, làm mờ thâm và cấp ẩm sâu.', 5, NOW(), NOW()),
('Kem Dưỡng Oat & Honey', 380000, 'kem-duong-oat-honey.jpg', 'Kem dưỡng ẩm với yến mạch keo và mật ong Manuka. Không hương liệu, phù hợp da nhạy cảm.', 5, NOW(), NOW()),
('Tẩy Tế Bào Chết Muối Biển', 320000, 'tay-te-bao-chet-muoi.jpg', 'Muối biển Himalaya nghiền mịn, kết hợp dầu hướng dương và lavender. Dùng cho mặt và body.', 5, NOW(), NOW()),
('Serum Vitamin C 15%', 890000, 'serum-vitamin-c.jpg', '15% L-Ascorbic Acid ổn định, ferulic acid và vitamin E. Bảo vệ da khỏi oxy hóa.', 5, NOW(), NOW()),

-- Phụ kiện (6)
('Túi Tote Linen Everyday', 680000, 'tui-tote-linen.jpg', 'Vải lanh Bỉ 14oz, đáy gia cố, tay cầm khâu tay. Có túi trong nhỏ tiện dụng.', 6, NOW(), NOW()),
('Ví Da Bridle Leather', 890000, 'vi-da-bridle.jpg', 'Da bridle thuộc theo phương pháp truyền thống, đường may thủ công. Đựng 6 thẻ và tiền mặt.', 6, NOW(), NOW()),
('Vòng Tay Brass Hammered', 420000, 'vong-tay-brass.jpg', 'Đồng thau nguyên chất, dát thủ công tạo texture độc đáo. Không gây kích ứng da.', 6, NOW(), NOW()),
('Kính Gọng Acetate', 1800000, 'kinh-gong-acetate.jpg', 'Gọng acetate từ bột cellulose thực vật. Tròng CR-39 chống tia UV400.', 6, NOW(), NOW()),
('Khăn Pocket Square Lanh', 280000, 'khan-pocket-square-lanh.jpg', 'Khăn túi áo vest làm từ lanh Irish tự nhiên. Kích thước 30x30cm, viền cuộn tay.', 6, NOW(), NOW());
