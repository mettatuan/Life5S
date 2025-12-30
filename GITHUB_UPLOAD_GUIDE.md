# Hướng dẫn Upload Code lên GitHub

## Cách 1: Sử dụng Git Command Line

### Bước 1: Cài đặt Git (nếu chưa có)
- Tải Git từ: https://git-scm.com/download/win
- Cài đặt và khởi động lại terminal

### Bước 2: Mở terminal trong thư mục Life5S và chạy các lệnh sau:

```bash
# Khởi tạo git repository (nếu chưa có)
git init

# Thêm remote repository
git remote add origin https://github.com/mettatuan/Life5S.git

# Kiểm tra remote đã được thêm chưa
git remote -v

# Thêm tất cả files vào staging
git add .

# Commit code
git commit -m "Initial commit: Upload Life5S project"

# Push lên GitHub (lần đầu tiên)
git branch -M main
git push -u origin main
```

**Lưu ý:** 
- Nếu repository trên GitHub đã có code, bạn có thể cần pull trước:
  ```bash
  git pull origin main --allow-unrelated-histories
  ```
- Nếu có conflict, giải quyết conflict rồi commit lại

---

## Cách 2: Sử dụng GitHub Desktop (Dễ nhất)

### Bước 1: Tải GitHub Desktop
- Tải từ: https://desktop.github.com/

### Bước 2: Đăng nhập vào GitHub account

### Bước 3: 
1. Click "File" > "Add Local Repository"
2. Chọn thư mục `D:\DU AN\Life5S`
3. Nếu chưa có git, GitHub Desktop sẽ hỏi khởi tạo repository - chọn "Yes"
4. Click "Publish repository" hoặc "Push origin"
5. Chọn repository `mettatuan/Life5S`

---

## Cách 3: Upload trực tiếp qua GitHub Web (Cho file nhỏ)

1. Vào https://github.com/mettatuan/Life5S
2. Click "Add file" > "Upload files"
3. Kéo thả thư mục hoặc chọn files
4. Commit changes

**Lưu ý:** Cách này không khuyến khích cho project lớn vì không giữ được lịch sử commit tốt.

---

## Kiểm tra .gitignore

File `.gitignore` đã được cấu hình để bỏ qua:
- node_modules/
- .expo/
- dist/
- android/ios/
- Các file nhạy cảm (.key, .pem, etc.)

Điều này đảm bảo chỉ code source được upload, không upload dependencies và build files.

