# DFI PMS — Database Schema v1.0

> 對應需求規格書 v1.0（2026-04-08）  
> 共 42 張表，依模組分組  
> i18n 策略：主表存全域/結構性欄位，`_i18n` 表存各語系內容（每語系一筆）

---

## 模組總覽

| # | 模組 | 表數 |
|---|------|------|
| 1 | System Management | 4 |
| 2 | Account Management | 3 |
| 3 | Product Category Management | 2 |
| 4 | Product Filter Management | 4 |
| 5 | Product Specification Field Management | 5 |
| 6 | Tag Management | 2 |
| 7 | Product Information Management | 12 |
| 8 | Download File Management | 5 |
| — | Junction / Mapping Tables | 5 |
| **合計** | | **42** |

---

## 一、System Management

### 1. `languages`
語系主檔

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| language_name | VARCHAR(100) | NOT NULL | 語系顯示名稱，如 English |
| language_code | VARCHAR(10) | NOT NULL, UNIQUE | ISO 代碼，如 en-US |
| url_prefix | VARCHAR(20) | NOT NULL | 前台路徑，如 /tw/ |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 1=啟用, 0=停用 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 2. `system_settings`
系統底層設定（SMTP 等）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| setting_group | VARCHAR(50) | NOT NULL | 群組，如 smtp |
| setting_key | VARCHAR(100) | NOT NULL, UNIQUE | 設定鍵名，如 smtp_host |
| setting_value | TEXT | | 設定值 |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 3. `operation_logs`
後台操作記錄

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| account_id | INT | FK → accounts.id | 操作者 |
| action_type | ENUM | NOT NULL | CREATE / UPDATE / DELETE |
| module | VARCHAR(100) | NOT NULL | 操作模組，如 products |
| target_id | INT | | 被操作的記錄 ID |
| description | TEXT | | 操作摘要 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 操作時間 |

---

### 4. `error_logs`
系統錯誤記錄

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| error_code | VARCHAR(50) | | Error Code |
| error_message | TEXT | | 錯誤描述 |
| stack_trace | LONGTEXT | | 完整堆疊資訊 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | 發生時間 |

---

## 二、Account Management

### 5. `roles`
角色定義（Admin / PM / MKT / Designer / FAE）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| role_name | VARCHAR(100) | NOT NULL, UNIQUE | 角色名稱 |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 1=啟用, 0=停用 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 6. `role_permissions`
角色權限矩陣（每個 menu_key 對應一組 R/W）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| role_id | INT | FK → roles.id | |
| menu_key | VARCHAR(100) | NOT NULL | 模組/選單識別碼，如 product_management |
| can_read | TINYINT(1) | NOT NULL, DEFAULT 0 | R 讀取權限 |
| can_write | TINYINT(1) | NOT NULL, DEFAULT 0 | W 寫入權限 |

---

### 7. `accounts`
後台帳號（Microsoft SSO 驗證）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| name | VARCHAR(200) | NOT NULL | 使用者姓名 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | 須與 SSO 帳號一致 |
| company | VARCHAR(200) | | 所屬公司別 |
| department | VARCHAR(200) | | 所屬部門 |
| role_id | INT | FK → roles.id | |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 1=啟用, 0=停用 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

## 三、Product Category Management

### 8. `product_categories`
產品分類主檔（支援大分類 / 次分類兩層）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| parent_id | INT | FK → product_categories.id, NULLABLE | NULL = 大分類 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 拖曳排序 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 9. `product_category_i18n`
產品分類多語系內容

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| category_id | INT | FK → product_categories.id | |
| language_id | INT | FK → languages.id | |
| language_status | TINYINT(1) | NOT NULL, DEFAULT 0 | 該語系啟用/停用 |
| category_name | VARCHAR(255) | | 分類名稱（導覽列 / 麵包屑） |
| slug | VARCHAR(255) | | URL 路徑，若空則以 category_name 為預設 |
| page_title | VARCHAR(255) | | H1 標題 |
| introduction | TEXT | | 頂部引言（純文字） |
| content | LONGTEXT | | 富文字內容（Rich Text HTML） |
| banner_desktop_url | VARCHAR(500) | | Banner - Desktop |
| banner_tablet_url | VARCHAR(500) | | Banner - Tablet |
| banner_mobile_url | VARCHAR(500) | | Banner - Mobile |
| banner_alt_text | VARCHAR(255) | | Banner Alt Text |
| category_image_desktop_url | VARCHAR(500) | | 分類代表圖 - Desktop |
| category_image_tablet_url | VARCHAR(500) | | 分類代表圖 - Tablet |
| category_image_mobile_url | VARCHAR(500) | | 分類代表圖 - Mobile |
| image_alt_text | VARCHAR(255) | | 分類圖 Alt Text |
| meta_title | VARCHAR(255) | | SEO Title |
| meta_description | TEXT | | SEO Description |
| meta_keywords | VARCHAR(500) | | SEO Keywords |
| author | VARCHAR(255) | | SEO Author |
| custom_html | TEXT | | 追蹤碼 / 自訂 HTML |
| UNIQUE | | (category_id, language_id) | 每分類每語系唯一一筆 |

---

## 四、Product Filter Management

### 10. `product_filters`
篩選器群組主檔

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| sort_order | INT | NOT NULL, DEFAULT 0 | 群組顯示排序 |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 停用時前台及後台同步隱藏 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 11. `product_filter_i18n`
篩選器群組多語系名稱

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| filter_id | INT | FK → product_filters.id | |
| language_id | INT | FK → languages.id | |
| filter_name | VARCHAR(255) | | 各語系下的篩選器標題 |
| UNIQUE | | (filter_id, language_id) | |

---

### 12. `product_filter_options`
篩選器選項主檔

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| filter_id | INT | FK → product_filters.id | 所屬篩選器群組 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 選項排序 |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 停用時前台及後台同步隱藏 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 13. `product_filter_option_i18n`
篩選器選項多語系名稱

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| option_id | INT | FK → product_filter_options.id | |
| language_id | INT | FK → languages.id | |
| option_name | VARCHAR(255) | | 各語系選項名稱 |
| UNIQUE | | (option_id, language_id) | |

---

## 五、Product Specification Field Management

### 14. `spec_groups`
規格群組主檔（如：System、I/O Interface）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| sort_order | INT | NOT NULL, DEFAULT 0 | 群組顯示排序 |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 停用時前台及後台同步隱藏 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 15. `spec_group_i18n`
規格群組多語系名稱

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| spec_group_id | INT | FK → spec_groups.id | |
| language_id | INT | FK → languages.id | |
| group_name | VARCHAR(255) | | 各語系群組名稱 |
| UNIQUE | | (spec_group_id, language_id) | |

---

### 16. `spec_fields`
規格欄位主檔（如：CPU、Chipset）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| spec_group_id | INT | FK → spec_groups.id | 所屬規格群組 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 同群組內欄位排序 |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 停用時前台及後台同步隱藏 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 17. `spec_field_i18n`
規格欄位多語系名稱

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| spec_field_id | INT | FK → spec_fields.id | |
| language_id | INT | FK → languages.id | |
| field_name | VARCHAR(255) | | 各語系欄位名稱 |
| UNIQUE | | (spec_field_id, language_id) | |

---

### 18. `spec_group_category_mapping`
規格群組 ↔ 產品大分類（多對多）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| spec_group_id | INT | FK → spec_groups.id | |
| category_id | INT | FK → product_categories.id | 只綁大分類（parent_id IS NULL） |
| UNIQUE | | (spec_group_id, category_id) | |

---

## 六、Tag Management

### 19. `tags`
Tag 主檔

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 20. `tag_i18n`
Tag 多語系內容

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| tag_id | INT | FK → tags.id | |
| language_id | INT | FK → languages.id | |
| language_status | TINYINT(1) | NOT NULL, DEFAULT 0 | 該語系啟用/停用 |
| tag_name | VARCHAR(255) | | 標籤名稱 |
| slug | VARCHAR(255) | | URL 路徑，若空則以 tag_name 為預設 |
| page_title | VARCHAR(255) | | H1 標題 |
| introduction | TEXT | | 頁面頂部引言 |
| content | LONGTEXT | | 富文字內容 |
| banner_desktop_url | VARCHAR(500) | | |
| banner_tablet_url | VARCHAR(500) | | |
| banner_mobile_url | VARCHAR(500) | | |
| banner_alt_text | VARCHAR(255) | | |
| image_desktop_url | VARCHAR(500) | | 代表圖 - Desktop |
| image_tablet_url | VARCHAR(500) | | 代表圖 - Tablet |
| image_mobile_url | VARCHAR(500) | | 代表圖 - Mobile |
| image_alt_text | VARCHAR(255) | | |
| meta_title | VARCHAR(255) | | |
| meta_description | TEXT | | |
| meta_keywords | VARCHAR(500) | | |
| author | VARCHAR(255) | | |
| custom_html | TEXT | | |
| UNIQUE | | (tag_id, language_id) | |

---

## 七、Product Information Management

### 21. `products`
產品主檔（全語系共用基本資訊）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| model_name | VARCHAR(255) | NOT NULL, UNIQUE | 產品型號 |
| lifecycle_stage | ENUM | NOT NULL | Planning / Preliminary / Sample Available / Launched / MOQ Required / EOL |
| primary_category_id | INT | FK → product_categories.id | 主分類（決定規格表與篩選器） |
| origin | VARCHAR(100) | | 產地國家 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 22. `product_secondary_categories`
產品次要分類（多對多，決定前台曝光位置）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| category_id | INT | FK → product_categories.id | |
| UNIQUE | | (product_id, category_id) | |

---

### 23. `product_filter_selections`
產品勾選的篩選器選項（多對多）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| filter_option_id | INT | FK → product_filter_options.id | |
| UNIQUE | | (product_id, filter_option_id) | |

---

### 24. `product_tags`
產品 ↔ Tag（多對多）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| tag_id | INT | FK → tags.id | |
| UNIQUE | | (product_id, tag_id) | |

---

### 25. `product_images`
產品圖片（全語系共用，支援多組 RWD）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| sort_order | INT | NOT NULL, DEFAULT 0 | 拖曳排序 |
| image_desktop_url | VARCHAR(500) | | |
| image_tablet_url | VARCHAR(500) | | |
| image_mobile_url | VARCHAR(500) | | |
| image_alt_text | VARCHAR(255) | | |
| created_at | TIMESTAMP | NOT NULL | |

---

### 26. `product_skus`
產品 SKU 清單（一個 product 可有多個 SKU）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| sku_name | VARCHAR(255) | NOT NULL | 第一筆預設帶入 model_name |
| sort_order | INT | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL | |

---

### 27. `product_spec_values`
產品規格表填值（product × sku × spec_field）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| sku_id | INT | FK → product_skus.id | |
| spec_field_id | INT | FK → spec_fields.id | |
| value | TEXT | | 規格值 |
| UNIQUE | | (sku_id, spec_field_id) | |

---

### 28. `product_documents`
產品技術文件（Datasheet / Block Diagram / Mechanical Drawing）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| document_type | ENUM | NOT NULL | datasheet / block_diagram / mechanical_drawing |
| file_url | VARCHAR(500) | NOT NULL | 檔案儲存路徑 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 29. `product_i18n`
產品多語系 Landing Page 資訊

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| language_id | INT | FK → languages.id | |
| language_status | TINYINT(1) | NOT NULL, DEFAULT 0 | 決定前台該語系顯示與否 |
| product_feature | TEXT | | 產品特色列點（JSON Array 或換行分隔） |
| overview_highlight | LONGTEXT | | 產品特點（Rich Text） |
| slug | VARCHAR(255) | | 若空則以 model_name 為預設 |
| meta_title | VARCHAR(255) | | |
| meta_description | TEXT | | |
| meta_keywords | VARCHAR(500) | | |
| author | VARCHAR(255) | | |
| custom_html | TEXT | | |
| UNIQUE | | (product_id, language_id) | |

---

### 30. `product_icons`
產品 ICON 主檔（圖片全語系共用）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| icon_image_url | VARCHAR(500) | | ICON 圖片 |
| image_alt_text | VARCHAR(255) | | |
| sort_order | INT | NOT NULL, DEFAULT 0 | |

---

### 31. `product_icon_i18n`
產品 ICON 多語系文字（Title / Description 語系獨立）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| icon_id | INT | FK → product_icons.id | |
| language_id | INT | FK → languages.id | |
| title | VARCHAR(255) | | ICON 標題 |
| description | TEXT | | ICON 描述 |
| UNIQUE | | (icon_id, language_id) | |

---

### 32. `ordering_information`
訂購資訊列表（一個 product 多筆料號）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| model_name | VARCHAR(255) | | |
| pn | VARCHAR(255) | | Part Number |
| processor | VARCHAR(255) | | |
| memory | VARCHAR(255) | | |
| thermal | VARCHAR(255) | | |
| operating_temp | VARCHAR(255) | | |
| sort_order | INT | NOT NULL, DEFAULT 0 | |

---

### 33. `ordering_dynamic_ports`
動態 Port 欄位定義（產品層級，如 LAN、USB）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| port_name | VARCHAR(100) | NOT NULL | Port 類型名稱，如 LAN |
| sort_order | INT | NOT NULL, DEFAULT 0 | |
| created_at | TIMESTAMP | NOT NULL | |

---

### 34. `ordering_port_values`
每筆料號的 Port 欄位填值

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| ordering_info_id | INT | FK → ordering_information.id | 對應料號 |
| port_id | INT | FK → ordering_dynamic_ports.id | 對應 Port 欄位 |
| value | VARCHAR(255) | | Port 數量或規格值 |
| UNIQUE | | (ordering_info_id, port_id) | |

---

### 35. `product_relations`
產品關聯（衍生產品 / 配件，多對多）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | 主產品 |
| related_product_id | INT | FK → products.id | 關聯產品 |
| relation_type | ENUM | NOT NULL | derivative（衍生）/ accessory（配件） |
| UNIQUE | | (product_id, related_product_id, relation_type) | |

---

### 36. `product_related_content`
產品相關內容（串接 HubSpot 或外部連結）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| product_id | INT | FK → products.id | |
| language_id | INT | FK → languages.id | 多語系維護 |
| content_type | ENUM | NOT NULL | hubspot_solution / hubspot_blog / hubspot_news / hubspot_case_study / external_link |
| hubspot_content_id | VARCHAR(255) | NULLABLE | HubSpot 內容 ID |
| external_url | VARCHAR(500) | NULLABLE | 外部連結（如 YouTube） |
| sort_order | INT | NOT NULL, DEFAULT 0 | |

---

## 八、Download File Management

### 37. `file_categories`
檔案類別主檔（大分類 / 次分類兩層）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| parent_id | INT | FK → file_categories.id, NULLABLE | NULL = 大分類 |
| sort_order | INT | NOT NULL, DEFAULT 0 | |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | 停用時隱藏該類別及其所有檔案 |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 38. `file_category_i18n`
檔案類別多語系名稱

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| category_id | INT | FK → file_categories.id | |
| language_id | INT | FK → languages.id | |
| category_name | VARCHAR(255) | | 各語系顯示名稱 |
| UNIQUE | | (category_id, language_id) | |

---

### 39. `files`
檔案主檔（全語系共用）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| file_category_id | INT | FK → file_categories.id | 歸屬次分類 |
| file_name | VARCHAR(255) | NOT NULL | 前台顯示名稱 |
| upload_method | ENUM | NOT NULL | file_upload / external_link |
| file_url | VARCHAR(500) | NULLABLE | 上傳檔案路徑（選 file_upload 時） |
| file_size | INT | NULLABLE | 單位 bytes，系統自動抓取 |
| external_link | VARCHAR(500) | NULLABLE | 外部連結（選 external_link 時） |
| file_description | TEXT | | 檔案簡述 |
| partner_zone_only | TINYINT(1) | NOT NULL, DEFAULT 0 | 1=僅 Partner Zone 登入後顯示 |
| status | TINYINT(1) | NOT NULL, DEFAULT 1 | |
| created_at | TIMESTAMP | NOT NULL | |
| updated_at | TIMESTAMP | NOT NULL | |

---

### 40. `file_category_mapping`
檔案 ↔ 產品大/次分類（一個檔案對多個分類）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| file_id | INT | FK → files.id | |
| category_id | INT | FK → product_categories.id | 分類下所有產品頁面顯示此檔案 |
| UNIQUE | | (file_id, category_id) | |

---

### 41. `file_product_mapping`
檔案 ↔ 特定產品型號（精準綁定）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| file_id | INT | FK → files.id | |
| product_id | INT | FK → products.id | |
| UNIQUE | | (file_id, product_id) | |

---

## 九、篩選器分類綁定（補充）

### 42. `filter_category_mapping`
篩選器群組 ↔ 產品大/次分類（多對多）

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PK, AUTO_INCREMENT | |
| filter_id | INT | FK → product_filters.id | |
| category_id | INT | FK → product_categories.id | 支援大分類或次分類 |
| UNIQUE | | (filter_id, category_id) | |

---

## 附錄：ER 關係摘要

```
languages
  └─ (被所有 _i18n 表參照)

accounts → roles → role_permissions

product_categories (self-referencing tree, 2 levels)
  ├─ product_category_i18n
  ├─ filter_category_mapping → product_filters
  │     ├─ product_filter_i18n
  │     └─ product_filter_options → product_filter_option_i18n
  └─ spec_group_category_mapping → spec_groups
        ├─ spec_group_i18n
        └─ spec_fields → spec_field_i18n

tags → tag_i18n

products
  ├─ product_secondary_categories → product_categories
  ├─ product_filter_selections → product_filter_options
  ├─ product_tags → tags
  ├─ product_images
  ├─ product_skus
  │     └─ product_spec_values → spec_fields
  ├─ product_documents
  ├─ product_i18n
  ├─ product_icons → product_icon_i18n
  ├─ ordering_information
  │     └─ ordering_port_values → ordering_dynamic_ports
  ├─ product_relations (self-referencing)
  └─ product_related_content (HubSpot / external)

file_categories (self-referencing tree, 2 levels)
  └─ file_category_i18n
files
  ├─ file_category_mapping → product_categories
  └─ file_product_mapping → products
```

---

*Schema v1.0 — 對應需求規格書 v1.0（2026-04-08）*  
*待確認項目：Origin 國家清單、Partner Zone 登入機制、圖片/檔案大小限制*
