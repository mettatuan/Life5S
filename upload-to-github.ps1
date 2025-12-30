# Script tự động upload code lên GitHub
# Chạy script này trong PowerShell: .\upload-to-github.ps1

Write-Host "=== Upload Life5S lên GitHub ===" -ForegroundColor Cyan

# Kiểm tra Git đã được cài đặt chưa
try {
    $gitVersion = git --version
    Write-Host "✓ Git đã được cài đặt: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng cài đặt Git từ: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Chuyển đến thư mục dự án
$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath
Write-Host "`nĐang làm việc tại: $projectPath" -ForegroundColor Cyan

# Kiểm tra xem đã có .git chưa
if (Test-Path ".git") {
    Write-Host "✓ Git repository đã được khởi tạo" -ForegroundColor Green
} else {
    Write-Host "Đang khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Đã khởi tạo Git repository" -ForegroundColor Green
}

# Kiểm tra remote origin
$remoteUrl = git remote get-url origin 2>$null
if ($remoteUrl) {
    Write-Host "✓ Remote origin đã được cấu hình: $remoteUrl" -ForegroundColor Green
    $changeRemote = Read-Host "Bạn có muốn thay đổi remote URL? (y/n)"
    if ($changeRemote -eq "y") {
        git remote set-url origin https://github.com/mettatuan/Life5S.git
        Write-Host "✓ Đã cập nhật remote URL" -ForegroundColor Green
    }
} else {
    Write-Host "Đang thêm remote origin..." -ForegroundColor Yellow
    git remote add origin https://github.com/mettatuan/Life5S.git
    Write-Host "✓ Đã thêm remote origin" -ForegroundColor Green
}

# Thêm tất cả files
Write-Host "`nĐang thêm files vào staging..." -ForegroundColor Yellow
git add .
Write-Host "✓ Đã thêm files" -ForegroundColor Green

# Kiểm tra có thay đổi để commit không
$status = git status --porcelain
if ($status) {
    Write-Host "`nCác files sẽ được commit:" -ForegroundColor Cyan
    git status --short
    
    $commitMessage = Read-Host "`nNhập commit message (hoặc Enter để dùng mặc định)"
    if ([string]::IsNullOrWhiteSpace($commitMessage)) {
        $commitMessage = "Initial commit: Upload Life5S project"
    }
    
    Write-Host "`nĐang commit..." -ForegroundColor Yellow
    git commit -m $commitMessage
    Write-Host "✓ Đã commit" -ForegroundColor Green
} else {
    Write-Host "`nKhông có thay đổi nào để commit" -ForegroundColor Yellow
}

# Đặt branch chính là main
Write-Host "`nĐang đặt branch chính là main..." -ForegroundColor Yellow
git branch -M main 2>$null
Write-Host "✓ Branch đã được đặt là main" -ForegroundColor Green

# Push lên GitHub
Write-Host "`nĐang push lên GitHub..." -ForegroundColor Yellow
Write-Host "Lưu ý: Bạn có thể cần nhập username và password/token GitHub" -ForegroundColor Cyan

$pushChoice = Read-Host "`nBạn có muốn push ngay bây giờ? (y/n)"
if ($pushChoice -eq "y") {
    try {
        git push -u origin main
        Write-Host "`n✓ Đã push thành công lên GitHub!" -ForegroundColor Green
        Write-Host "Xem repository tại: https://github.com/mettatuan/Life5S" -ForegroundColor Cyan
    } catch {
        Write-Host "`n✗ Có lỗi xảy ra khi push" -ForegroundColor Red
        Write-Host "Có thể repository trên GitHub đã có code. Thử:" -ForegroundColor Yellow
        Write-Host "  git pull origin main --allow-unrelated-histories" -ForegroundColor Yellow
        Write-Host "  Sau đó giải quyết conflict (nếu có) và push lại" -ForegroundColor Yellow
    }
} else {
    Write-Host "`nBạn có thể push sau bằng lệnh:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Yellow
}

Write-Host "`n=== Hoàn thành ===" -ForegroundColor Cyan

