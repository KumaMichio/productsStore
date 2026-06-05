# download-product-images.ps1
# Tải 5 ảnh mỗi sản phẩm từ picsum.photos (seed cố định = ảnh không đổi khi chạy lại)
# Chạy từ thư mục gốc: .\scripts\download-product-images.ps1

$uploadDir = Join-Path $PSScriptRoot "..\backend\uploads"
if (-not (Test-Path $uploadDir)) { New-Item -ItemType Directory -Path $uploadDir | Out-Null }

$products = @(
    @{ base="ghe-doc-sach-linnen";     seed="reading-chair"     },
    @{ base="ke-sach-walnut";          seed="walnut-shelf"      },
    @{ base="ban-tra-travertine";      seed="stone-table"       },
    @{ base="den-ban-ceramic";         seed="ceramic-lamp"      },
    @{ base="guong-tron-khung-may";    seed="rattan-mirror"     },
    @{ base="ao-len-ribbed-cotton";    seed="ribbed-sweater"    },
    @{ base="quan-linen-wide-leg";     seed="linen-trousers"    },
    @{ base="ao-khoac-wool-blend";     seed="wool-coat"         },
    @{ base="dam-midi-lanh";           seed="linen-dress"       },
    @{ base="set-loungewear-cotton";   seed="cotton-lounge"     },
    @{ base="amber-sandalwood-edp";    seed="amber-perfume"     },
    @{ base="white-tea-cedar-edp";     seed="white-tea-bottle"  },
    @{ base="vetiver-moss-edt";        seed="vetiver-cologne"   },
    @{ base="rose-oud-parfum";         seed="rose-oud-bottle"   },
    @{ base="nen-cedarwood-smoke";     seed="cedar-candle"      },
    @{ base="nen-linen-salt";          seed="sea-salt-candle"   },
    @{ base="nen-bergamot-thyme";      seed="herb-candle"       },
    @{ base="nen-vanilla-bourbon";     seed="vanilla-candle"    },
    @{ base="tinh-dau-rosehip";        seed="rosehip-oil"       },
    @{ base="kem-duong-oat-honey";     seed="oat-cream"         },
    @{ base="tay-te-bao-chet-muoi";    seed="salt-scrub"        },
    @{ base="serum-vitamin-c";         seed="vitamin-serum"     },
    @{ base="tui-tote-linen";          seed="linen-tote"        },
    @{ base="vi-da-bridle";            seed="leather-wallet"    },
    @{ base="vong-tay-brass";          seed="brass-bracelet"    },
    @{ base="kinh-gong-acetate";       seed="acetate-glasses"   },
    @{ base="khan-pocket-square-lanh"; seed="linen-square"      }
)

$success = 0; $skip = 0; $fail = 0

foreach ($p in $products) {
    for ($i = 1; $i -le 5; $i++) {
        $filename = if ($i -eq 1) { "$($p.base).jpg" } else { "$($p.base)-$i.jpg" }
        $seed     = if ($i -eq 1) { $p.seed }         else { "$($p.seed)-alt$i" }
        $outPath  = Join-Path $uploadDir $filename

        if (Test-Path $outPath) {
            Write-Host "[SKIP] $filename" -ForegroundColor DarkGray
            $skip++; continue
        }

        try {
            Write-Host "[GET]  $filename ..." -NoNewline
            Invoke-WebRequest -Uri "https://picsum.photos/seed/$seed/800/800" `
                -OutFile $outPath -UseBasicParsing -TimeoutSec 15
            Write-Host " OK" -ForegroundColor Green
            $success++
        } catch {
            Write-Host " FAILED: $_" -ForegroundColor Red
            $fail++
        }
        Start-Sleep -Milliseconds 100
    }
}

Write-Host ""
Write-Host "Tải xong: $success OK | $skip bỏ qua | $fail lỗi" -ForegroundColor Cyan
