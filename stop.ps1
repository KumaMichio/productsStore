# ShopApp - Dung toan bo he thong

Write-Host "=== Dung application stack ===" -ForegroundColor Cyan
docker-compose -f deployment.yaml down

Write-Host ""
Write-Host "=== Dung Kafka + Zookeeper ===" -ForegroundColor Cyan
docker-compose -f kafka-deployment.yaml down

Write-Host ""
Write-Host "=== Da dung toan bo he thong ===" -ForegroundColor Green
