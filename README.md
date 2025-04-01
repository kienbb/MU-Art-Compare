# MU Art Compare

So sánh hình ảnh của hai phiên bản game MU Awaken và MU Origin trong một giao diện trực quan và dễ sử dụng.

## Tính năng

- Xem và so sánh hình ảnh từ MU Awaken và MU Origin
- Duyệt các mục theo danh mục (Map, NPC, Monster, Outfit)
- Tìm kiếm mục theo tên hoặc ID
- Giao diện sáng/tối
- Hiển thị tương thích trên nhiều thiết bị

## Demo

Bạn có thể xem demo trực tiếp tại: [https://kienbb.github.io/MU-Art-Compare/](https://kienbb.github.io/MU-Art-Compare/)

## Cấu trúc thư mục

```
├── assets/             # Thư mục chứa các hình ảnh so sánh
│   ├── MU_Awaken/      # Hình ảnh MU Awaken
│   │   ├── Map/        # Các bản đồ của MU Awaken
│   │   ├── Monster/    # Quái vật của MU Awaken
│   │   ├── NPC/        # NPC của MU Awaken
│   │   └── Outfit/     # Trang phục/trang bị của MU Awaken
│   └── MU_Origin/      # Hình ảnh MU Origin (cấu trúc tương tự)
├── public/             # Thư mục public
│   └── data.json       # Dữ liệu được tạo từ scan_assets.js
└── src/
    ├── css/            # CSS cho trang web
    └── js/             # JavaScript cho trang web
```

## Cách sử dụng

### 1. Cài đặt

```bash
# Clone repository
git clone https://github.com/kienbb/MU-Art-Compare.git
cd MU-Art-Compare

# Cài đặt dependencies
npm install
```

### 2. Thêm hình ảnh

Đặt hình ảnh vào thư mục `assets` theo cấu trúc sau:

```
assets/MU_Awaken/Monster/001_spider/spider.jpg
assets/MU_Origin/Monster/001_spider/spider.jpg
```

Trong đó:
- `001` là ID của quái vật
- `spider` là tên
- Đường dẫn thư mục sẽ là `category/ID_name/file.jpg`

### 3. Quét hình ảnh

```bash
npm run scan
```

Lệnh này sẽ tạo tệp `public/data.json` chứa thông tin về tất cả các mục và hình ảnh.

### 4. Chạy máy chủ phát triển

```bash
npm run dev
```

### 5. Build cho production

```bash
npm run build
```

## Giấy phép

MIT 