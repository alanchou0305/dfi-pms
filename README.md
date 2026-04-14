# DFI PMS — 產品管理系統

DFI 內部產品管理系統（Product Management System）的規劃文件庫。

## 文件結構

```
├── docs/
│   ├── requirements-v1.0.pdf   # 需求規格書 v1.0
│   └── database-schema.md      # 資料庫 Schema（42 張表）
├── sitemap/
│   ├── sitemap.csv             # 頁面路由與說明
│   └── sitemap.xml             # FlowMapp Sitemap XML
└── planning/
    └── page-tracking.csv       # 頁面設計 / 開發 / QA 進度追蹤
```

## 模組總覽

| 模組 | 主要頁面 |
|------|---------|
| 系統設定 | 語系管理、系統設定、規格欄位管理、操作記錄 |
| 帳號管理 | 角色管理、帳號管理 |
| 產品管理 | 產品列表、分類編輯、篩選器管理、產品編輯（6 個 Tab）|
| Tag 管理 | Tag 列表、Tag 編輯 |
| 檔案管理 | 檔案列表、檔案分類管理 |

## 技術規格

- 認證：Microsoft SSO（OAuth）
- i18n：主表 + `_i18n` 副表（EN / TW / CN / JP / DE）
- 資料庫：42 張表，依模組分群
