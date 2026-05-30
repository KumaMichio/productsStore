# ShopApp - Khoi dong toan bo he thong

Write-Host "=== [1/3] Khoi dong Kafka + Zookeeper ===" -ForegroundColor Cyan
docker-compose -f kafka-deployment.yaml up -d
if (-not $?) { Write-Host "Loi khi khoi dong Kafka!" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=== [2/3] Cho Kafka san sang (20s) ===" -ForegroundColor Cyan
Start-Sleep -Seconds 20

Write-Host ""
Write-Host "=== [3/3] Khoi dong MySQL, Redis, phpMyAdmin, Backend ===" -ForegroundColor Cyan
docker-compose -f deployment.yaml up -d --build
if (-not $?) { Write-Host "Loi khi khoi dong application stack!" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "=== Tat ca da chay! ===" -ForegroundColor Green
Write-Host "  Backend API  : http://localhost:8099" -ForegroundColor Yellow
Write-Host "  Swagger UI   : http://localhost:8099/swagger-ui.html" -ForegroundColor Yellow
Write-Host "  phpMyAdmin   : http://localhost:8100" -ForegroundColor Yellow
Write-Host ""
Write-Host "Chay Frontend (terminal rieng):" -ForegroundColor Cyan
Write-Host "  cd frontend && npm run start:dev" -ForegroundColor White
