/* ============================================================
   DFI PMS Demo — App Router & UI Logic
   ============================================================ */

// ── ROUTES ───────────────────────────────────────────────────
const ROUTES = {
  'login':                 { auth: true },
  '403':                   { auth: true },
  '404':                   { auth: true },
  'dashboard':             { crumb: ['Dashboard'],                              nav: 'nav-dashboard' },
  'products':              { crumb: ['產品管理', '產品列表'],                    nav: 'nav-products',            group: 'grp-products' },
  'products-edit':         { crumb: ['產品管理', '產品列表', '產品編輯'],         nav: 'nav-products',            group: 'grp-products' },
  'categories':            { crumb: ['產品管理', '產品分類'],                    nav: 'nav-categories',          group: 'grp-products' },
  'categories-edit':       { crumb: ['產品管理', '產品分類', '分類編輯'],         nav: 'nav-categories',          group: 'grp-products' },
  'filters':               { crumb: ['產品管理', '篩選器'],                      nav: 'nav-filters',             group: 'grp-products' },
  'filters-edit':          { crumb: ['產品管理', '篩選器', '篩選器編輯'],         nav: 'nav-filters',             group: 'grp-products' },
  'tags':                  { crumb: ['產品管理', 'Tags'],                        nav: 'nav-tags',                group: 'grp-products' },
  'tags-edit':             { crumb: ['產品管理', 'Tags', 'Tag 編輯'],            nav: 'nav-tags',                group: 'grp-products' },
  'specs':                 { crumb: ['產品管理', '規格欄位'],                    nav: 'nav-specs',               group: 'grp-products' },
  'specs-edit':            { crumb: ['產品管理', '規格欄位', '規格欄位編輯'],     nav: 'nav-specs',               group: 'grp-products' },
  'files':                 { crumb: ['檔案管理', '檔案列表'],                    nav: 'nav-files',               group: 'grp-files' },
  'files-edit':            { crumb: ['檔案管理', '檔案列表', '檔案編輯'],         nav: 'nav-files',               group: 'grp-files' },
  'file-categories':       { crumb: ['檔案管理', '檔案分類'],                    nav: 'nav-file-categories',     group: 'grp-files' },
  'file-categories-edit':  { crumb: ['檔案管理', '檔案分類', '分類編輯'],         nav: 'nav-file-categories',     group: 'grp-files' },
  'users':                 { crumb: ['帳號管理', '使用者'],                      nav: 'nav-users',               group: 'grp-accounts' },
  'users-edit':            { crumb: ['帳號管理', '使用者', '使用者編輯'],         nav: 'nav-users',               group: 'grp-accounts' },
  'roles':                 { crumb: ['帳號管理', '角色權限'],                    nav: 'nav-roles',               group: 'grp-accounts' },
  'roles-edit':            { crumb: ['帳號管理', '角色權限', '角色編輯'],         nav: 'nav-roles',               group: 'grp-accounts' },
  'languages':             { crumb: ['系統管理', '語系'],                        nav: 'nav-languages',           group: 'grp-system' },
  'languages-edit':        { crumb: ['系統管理', '語系', '語系編輯'],             nav: 'nav-languages',           group: 'grp-system' },
  'smtp':                  { crumb: ['系統管理', 'SMTP'],                        nav: 'nav-smtp',                group: 'grp-system' },
  'smtp-edit':             { crumb: ['系統管理', 'SMTP', 'SMTP 編輯'],           nav: 'nav-smtp',                group: 'grp-system' },
  'logs':                  { crumb: ['系統管理', '操作記錄'],                    nav: 'nav-logs',                group: 'grp-system' },
};

const AUTH_VIEWS = ['login', '403', '404'];

// ── SAMPLE DATA ──────────────────────────────────────────────
const SAMPLE = {

  mainCategories: ['Industrial PC', 'Embedded Computing', 'Network & Communication'],
  subCategories: {
    'Industrial PC':            ['Fanless Embedded PC', 'DIN-rail PC'],
    'Embedded Computing':       ['3.5" SBC', 'Pico-ITX'],
    'Network & Communication':  ['Network Appliance'],
  },

  categories: [
    { name: 'Industrial PC',            parent: null,                      sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'Embedded Computing',       parent: null,                      sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false } },
    { name: 'Network & Communication',  parent: null,                      sort: 3, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'Fanless Embedded PC',      parent: 'Industrial PC',           sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'DIN-rail PC',              parent: 'Industrial PC',           sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: '3.5" SBC',                 parent: 'Embedded Computing',      sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false } },
    { name: 'Pico-ITX',                 parent: 'Embedded Computing',      sort: 2, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'Network Appliance',        parent: 'Network & Communication', sort: 1, langs: { EN:true,  TW:false, CN:false, JP:false, DE:false } },
  ],

  filters: [
    { name: 'Form Factor',    options: ['3.5" SBC', 'Pico-ITX', 'Mini-ITX', 'DIN-rail', 'Box PC'],                                                  sort: 1, status: 'active',   langs: { EN:true, TW:true, CN:true,  JP:true,  DE:true  } },
    { name: 'CPU Platform',   options: ['Intel Core i7', 'Intel Core i5', 'Intel Core i3', 'Intel Atom x6000E', 'Intel Celeron J6412'],              sort: 2, status: 'active',   langs: { EN:true, TW:true, CN:true,  JP:false, DE:false } },
    { name: 'OS Support',     options: ['Windows 10 IoT Enterprise', 'Windows 11 IoT Enterprise', 'Linux Ubuntu', 'Android'],                        sort: 3, status: 'active',   langs: { EN:true, TW:true, CN:false, JP:false, DE:false } },
    { name: 'Operating Temp', options: ['-20~60°C (Extended)', '0~60°C (Standard)', '-40~85°C (Wide)'],                                              sort: 4, status: 'inactive', langs: { EN:true, TW:false,CN:false, JP:false, DE:false } },
  ],

  tags: [
    { name: 'AI Edge',               slug: 'ai-edge',               langs: { EN:true, TW:true, CN:true,  JP:true,  DE:true  } },
    { name: 'IoT Gateway',           slug: 'iot-gateway',           langs: { EN:true, TW:true, CN:true,  JP:false, DE:false } },
    { name: 'In-Vehicle',            slug: 'in-vehicle',            langs: { EN:true, TW:true, CN:false, JP:false, DE:false } },
    { name: 'Industrial Automation', slug: 'industrial-automation', langs: { EN:true, TW:true, CN:true,  JP:true,  DE:false } },
    { name: 'Smart Retail',          slug: 'smart-retail',          langs: { EN:true, TW:false,CN:false, JP:false, DE:false } },
  ],

  specGroups: [
    { name: 'General',            category: 'Embedded Computing', sort: 1, fields: 5 },
    { name: 'I/O Interface',      category: 'Embedded Computing', sort: 2, fields: 6 },
    { name: 'Power & Mechanical', category: 'Industrial PC',      sort: 1, fields: 4 },
    { name: 'Expansion',          category: 'Industrial PC',      sort: 2, fields: 3 },
  ],

  products: [
    { model: 'EC70A-SU',      mainCat: 'Embedded Computing', subCat: '3.5" SBC',            lifecycle: 'Active',  langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false }, updated: '2026-04-10 14:32' },
    { model: 'EC551-CR',      mainCat: 'Embedded Computing', subCat: '3.5" SBC',            lifecycle: 'Active',  langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false }, updated: '2026-04-08 09:17' },
    { model: 'SD101-D26',     mainCat: 'Industrial PC',      subCat: 'DIN-rail PC',         lifecycle: 'Active',  langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false }, updated: '2026-03-25 16:44' },
    { model: 'IPC900-519-FL', mainCat: 'Industrial PC',      subCat: 'Fanless Embedded PC', lifecycle: 'Active',  langs: { EN:true,  TW:false, CN:false, JP:false, DE:false }, updated: '2026-03-18 11:20' },
    { model: 'VC972-R10',     mainCat: 'Industrial PC',      subCat: 'Fanless Embedded PC', lifecycle: 'EOL',     langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  }, updated: '2025-12-01 08:05' },
    { model: 'EC70A-BT',      mainCat: 'Embedded Computing', subCat: '3.5" SBC',            lifecycle: 'Preview', langs: { EN:true,  TW:false, CN:false, JP:false, DE:false }, updated: '2026-04-14 17:00' },
  ],

  productEdit: {
    model:    'EC70A-SU',
    lifecycle: 'Active',
    mainCat:  'Embedded Computing',
    subCat:   '3.5" SBC',
    filters:  ['Form Factor: 3.5" SBC', 'CPU Platform: Intel Core i7', 'OS Support: Windows 10 IoT Enterprise'],
    tags:     ['AI Edge', 'Industrial Automation'],
    specs: [
      { group: 'General', fields: [
        { label: 'CPU',        value: 'Intel® Core™ i7-1185G7E, 4C/8T, up to 4.4GHz (Tiger Lake-UP4)' },
        { label: 'Chipset',    value: 'Intel® Tiger Lake-UP4 Platform' },
        { label: 'Memory',     value: 'DDR4-3200, 2x SODIMM, up to 64GB' },
        { label: 'Storage',    value: '1x M.2 2280 PCIe Gen 3 x4 (NVMe), 1x SATA III 6Gb/s' },
        { label: 'OS Support', value: 'Windows 10/11 IoT Enterprise, Linux Ubuntu 20.04 LTS' },
      ]},
      { group: 'I/O Interface', fields: [
        { label: 'LAN',     value: '2x Intel GbE (i219LM + i210AT), supports WoL' },
        { label: 'USB',     value: '4x USB 3.2 Gen 1 (5Gbps), 2x USB 2.0' },
        { label: 'Display', value: '1x HDMI 2.0 (4K@60Hz), 1x DisplayPort 1.4 (4K@60Hz)' },
        { label: 'Serial',  value: '2x RS-232/422/485 (software selectable, isolated)' },
        { label: 'Audio',   value: '1x Line-out, 1x Mic-in (Realtek ALC662)' },
        { label: 'GPIO',    value: '8-bit Digital I/O (4-in / 4-out)' },
      ]},
      { group: 'Power & Mechanical', fields: [
        { label: 'Power Input',    value: 'DC-in 12V/24V (9~36V), 60W max' },
        { label: 'Operating Temp', value: '-20°C to 60°C (with extended temp CPU)' },
        { label: 'Dimension',      value: '146 x 101 mm (3.5" SBC form factor)' },
        { label: 'Weight',         value: '~400g (board only)' },
      ]},
    ],
    ordering: [
      { pn: 'EC70A-SU-0001', desc: 'Core i7-1185G7E, w/o RAM, w/o Storage', lan: 2, usb: 6 },
      { pn: 'EC70A-SU-0002', desc: 'Core i5-1145G7E, w/o RAM, w/o Storage', lan: 2, usb: 6 },
      { pn: 'EC70A-SU-0003', desc: 'Core i3-1115G4E, w/o RAM, w/o Storage', lan: 2, usb: 4 },
    ],
    landing: {
      features: '支援第 11 代 Intel® Core™ Tiger Lake-E 處理器，效能強勁\n寬溫運行 -20°C ~ 60°C，適應嚴苛工業環境\n雙 GbE 網路（Intel i219LM + i210AT），支援 TSN\n豐富 I/O：RS-232/422/485 x2、USB 3.2 x4、8-bit GPIO\n支援 Windows 10/11 IoT Enterprise 及 Linux Ubuntu',
      seoTitle: 'EC70A-SU 3.5" SBC | Intel 11th Gen Tiger Lake-E | DFI',
      seoKeywords: 'EC70A-SU, 3.5 SBC, embedded computing, Tiger Lake-E, industrial SBC',
      seoDesc: 'DFI EC70A-SU 是搭載 Intel 第 11 代 Core i7/i5/i3 Tiger Lake-E 的 3.5" 單板電腦，提供寬溫支援與豐富 I/O，適用於工業自動化與 AIoT 應用。',
    },
    relations: {
      derivatives: ['EC70A-BT'],
      accessories: ['PWR-ADAPTER-24V (24V/3A DIN-rail Power Adapter)', 'CBL-SATA-300 (SATA Data Cable 30cm)'],
    },
  },

  files: [
    { name: 'EC70A-SU Datasheet v1.2',       category: 'Datasheet',         type: 'PDF', product: 'EC70A-SU',      partner: false, updated: '2026-04-01' },
    { name: 'EC551-CR Quick Start Guide',     category: 'Quick Start Guide', type: 'PDF', product: 'EC551-CR',      partner: false, updated: '2026-03-15' },
    { name: 'IPC900-519-FL User Manual',      category: 'User Manual',       type: 'PDF', product: 'IPC900-519-FL', partner: false, updated: '2026-02-20' },
    { name: 'EC70A-SU BIOS v1.3.2',           category: 'BIOS / Driver',     type: 'ZIP', product: 'EC70A-SU',      partner: true,  updated: '2026-04-12' },
    { name: 'DFI Embedded Product Catalog Q2 2026', category: 'Brochure',   type: 'PDF', product: '—',             partner: false, updated: '2026-03-01' },
  ],

  fileCategories: [
    { name: 'Datasheet',         parent: '—' },
    { name: 'Quick Start Guide', parent: '—' },
    { name: 'User Manual',       parent: '—' },
    { name: 'BIOS / Driver',     parent: '—' },
    { name: 'Brochure',          parent: '—' },
  ],

  users: [
    { name: 'System Admin', email: 'admin@dfi.com',       company: 'DFI', dept: 'IT',                 role: 'Admin',    status: 'active'   },
    { name: 'Alan Chen',    email: 'alan.chen@dfi.com',   company: 'DFI', dept: 'Product Management', role: 'PM',       status: 'active'   },
    { name: 'Lisa Wang',    email: 'lisa.wang@dfi.com',   company: 'DFI', dept: 'Marketing',          role: 'MKT',      status: 'active'   },
    { name: 'Kevin Lee',    email: 'kevin.lee@dfi.com',   company: 'DFI', dept: 'Design',             role: 'Designer', status: 'active'   },
    { name: 'Tina Huang',   email: 'tina.huang@dfi.com',  company: 'DFI', dept: 'FAE',                role: 'FAE',      status: 'active'   },
    { name: 'Mark Lin',     email: 'mark.lin@dfi.com',    company: 'DFI', dept: 'Sales',              role: 'MKT',      status: 'inactive' },
  ],

  roles: [
    { name: 'Admin',    desc: '系統管理員，擁有全部功能的讀寫權限',          status: 'active' },
    { name: 'PM',       desc: '產品經理，可管理產品資訊、規格與分類',         status: 'active' },
    { name: 'MKT',      desc: '行銷人員，可管理 Landing Page 與 SEO 內容',  status: 'active' },
    { name: 'Designer', desc: '設計師，可上傳與管理產品圖片及視覺資源',       status: 'active' },
    { name: 'FAE',      desc: '技術支援工程師，可管理下載檔案',              status: 'active' },
  ],

  auditLogs: [
    { user: 'Alan Chen',    module: '產品管理', action: 'UPDATE', desc: '更新 EC70A-SU 規格資訊（I/O Interface）',          time: '2026-04-15 10:23' },
    { user: 'Lisa Wang',    module: '產品管理', action: 'UPDATE', desc: '更新 EC70A-SU Landing Page 特色條列（EN）',         time: '2026-04-14 17:05' },
    { user: 'Kevin Lee',    module: '產品管理', action: 'UPDATE', desc: '上傳 EC551-CR 產品圖片（Desktop / Tablet）',        time: '2026-04-14 15:40' },
    { user: 'Tina Huang',   module: '檔案管理', action: 'CREATE', desc: '新增下載檔案：EC70A-SU BIOS v1.3.2',               time: '2026-04-12 11:18' },
    { user: 'Alan Chen',    module: '產品管理', action: 'CREATE', desc: '新增產品 EC70A-BT（生命週期：Preview）',            time: '2026-04-10 09:32' },
    { user: 'System Admin', module: '帳號管理', action: 'UPDATE', desc: '更新使用者 Tina Huang 角色為 FAE',                 time: '2026-04-08 14:50' },
  ],

  syncLogs: [
    { type: 'Product Sync', target: 'EC70A-SU → dfi.com',           status: 'success', msg: '同步完成（5 個語系）',          time: '2026-04-15 06:00' },
    { type: 'Product Sync', target: 'EC551-CR → dfi.com',           status: 'success', msg: '同步完成（3 個語系）',          time: '2026-04-15 06:00' },
    { type: 'Product Sync', target: 'SD101-D26 → dfi.com',          status: 'fail',    msg: 'Missing TW translation',      time: '2026-04-14 06:01' },
    { type: 'File Sync',    target: 'EC70A-SU BIOS v1.3.2',         status: 'success', msg: '同步完成',                     time: '2026-04-12 08:30' },
    { type: 'File Sync',    target: 'IPC900-519-FL User Manual',     status: 'success', msg: '同步完成',                     time: '2026-04-10 09:15' },
  ],
};

// ── HELPERS ──────────────────────────────────────────────────
function lifecycleBadge(lc) {
  if (lc === 'Active')  return `<span class="badge badge-success"><span class="badge-dot"></span>Active</span>`;
  if (lc === 'EOL')     return `<span class="badge badge-danger"><span class="badge-dot"></span>EOL</span>`;
  if (lc === 'Preview') return `<span class="badge badge-warning"><span class="badge-dot"></span>Preview</span>`;
  return `<span class="badge badge-neutral">${lc}</span>`;
}

function statusBadge(active) {
  return active
    ? `<span class="badge badge-success"><span class="badge-dot"></span>啟用</span>`
    : `<span class="badge badge-neutral"><span class="badge-dot"></span>停用</span>`;
}

function typeBadge(t) {
  return `<span class="badge badge-neutral">${t}</span>`;
}

function actionBadge(a) {
  if (a === 'CREATE') return `<span class="badge badge-success">CREATE</span>`;
  if (a === 'UPDATE') return `<span class="badge badge-warning">UPDATE</span>`;
  if (a === 'DELETE') return `<span class="badge badge-danger">DELETE</span>`;
  return `<span class="badge badge-neutral">${a}</span>`;
}

function syncStatusBadge(s) {
  return s === 'success'
    ? `<span class="badge badge-success"><span class="badge-dot"></span>成功</span>`
    : `<span class="badge badge-danger"><span class="badge-dot"></span>失敗</span>`;
}

function langDotsHtml(langs) {
  return Object.entries(langs).map(([lang, on]) =>
    `<span class="lang-dot ${on ? 'on' : 'off'}">${lang}</span>`
  ).join('');
}

function roleBadge(role) {
  const map = { Admin: 'badge-danger', PM: 'badge-warning', MKT: 'badge-success', Designer: 'badge-neutral', FAE: 'badge-neutral' };
  return `<span class="badge ${map[role] || 'badge-neutral'}">${role}</span>`;
}

function editDeleteBtns(editHash) {
  return `<div class="col-actions">
    <button class="btn btn-sm btn-secondary" onclick="navigate('${editHash}')">編輯</button>
    <button class="btn btn-sm btn-danger">刪除</button>
  </div>`;
}

// ── VIEW INITS ───────────────────────────────────────────────

function initDashboard() {
  const stats = document.querySelectorAll('#view-dashboard .stat-value');
  if (stats[0]) stats[0].textContent = SAMPLE.products.length;
  if (stats[1]) stats[1].textContent = SAMPLE.categories.length;
  if (stats[2]) stats[2].textContent = SAMPLE.files.length;
  if (stats[3]) stats[3].textContent = SAMPLE.users.filter(u => u.status === 'active').length;

  const card = document.querySelector('#view-dashboard .card');
  if (!card) return;
  const empty = card.querySelector('.empty-state');
  if (empty) {
    empty.outerHTML = `<div class="table-wrap">
      <table>
        <thead><tr><th>操作者</th><th>模組</th><th>動作</th><th>描述</th><th>時間</th></tr></thead>
        <tbody>
          ${SAMPLE.auditLogs.slice(0, 5).map(l => `
          <tr>
            <td>${l.user}</td>
            <td>${l.module}</td>
            <td>${actionBadge(l.action)}</td>
            <td style="font-size:12px">${l.desc}</td>
            <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${l.time}</td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
  }
}

function initProductList() {
  const tbody = document.querySelector('#view-products .table-wrap tbody');
  const info  = document.querySelector('#view-products .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.products.map(p => `
    <tr>
      <td><input type="checkbox" /></td>
      <td><strong>${p.model}</strong></td>
      <td>${p.mainCat}</td>
      <td>${p.subCat}</td>
      <td>${lifecycleBadge(p.lifecycle)}</td>
      <td><div class="lang-dots">${langDotsHtml(p.langs)}</div></td>
      <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${p.updated}</td>
      <td>${editDeleteBtns('products-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.products.length} 筆`;

  const catSelect = document.querySelector('#view-products select.filter-select');
  if (catSelect) {
    catSelect.innerHTML = '<option value="">所有分類</option>' +
      SAMPLE.mainCategories.map(c => `<option>${c}</option>`).join('');
  }
}

function initProductEdit() {
  const d = SAMPLE.productEdit;

  // Basic info — use label text to find the right field
  document.querySelectorAll('#view-products-edit .tab-panel[data-tab="basic"] .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    const sel  = grp.querySelector('select');
    const zone = grp.querySelector('div[style]');

    if (text === '型號 *'   && inp)  inp.value = d.model;
    if (text === '生命週期' && sel)  sel.value = d.lifecycle;
    if (text === '主分類'   && sel) {
      sel.innerHTML = '<option value="">請選擇</option>' +
        SAMPLE.mainCategories.map(c => `<option${c === d.mainCat ? ' selected' : ''}>${c}</option>`).join('');
    }
    if (text === '次分類' && sel) {
      sel.innerHTML = '<option value="">請選擇</option>' +
        (SAMPLE.subCategories[d.mainCat] || []).map(c => `<option${c === d.subCat ? ' selected' : ''}>${c}</option>`).join('');
    }
    if (text === '篩選器' && zone) {
      zone.innerHTML = d.filters.map(f =>
        `<span class="chip">${f}<em class="chip-remove" onclick="this.parentElement.remove()">×</em></span>`
      ).join('') + ' <button class="chip chip-add">＋ 新增</button>';
    }
    if (text === 'Tags' && zone) {
      zone.innerHTML = d.tags.map(t =>
        `<span class="chip">${t}<em class="chip-remove" onclick="this.parentElement.remove()">×</em></span>`
      ).join('') + ' <button class="chip chip-add">＋ 新增</button>';
    }
  });

  // Specs tab — replace entire panel content
  const specsPanel = document.querySelector('[data-tab-panel="prod-edit"][data-tab="specs"]');
  if (specsPanel) {
    specsPanel.innerHTML =
      `<div style="display:flex;justify-content:flex-end;gap:8px;margin-bottom:16px">
        <button class="btn btn-secondary">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Excel 批次匯入
        </button>
        <button class="btn btn-secondary">技術文件上傳</button>
      </div>` +
      d.specs.map(grp => `
      <div style="margin-bottom:20px">
        <div style="font-weight:600;font-size:13px;padding:8px 12px;background:var(--sidebar-bg);border:1px solid var(--border);border-radius:var(--radius) var(--radius) 0 0">${grp.group}</div>
        <div class="table-wrap" style="border:1px solid var(--border);border-top:none;border-radius:0 0 var(--radius) var(--radius);overflow:hidden">
          <table>
            <thead><tr><th style="width:200px">規格項目</th><th>規格值</th></tr></thead>
            <tbody>
              ${grp.fields.map(f => `
              <tr>
                <td style="color:var(--text-2);font-size:12px;font-weight:500">${f.label}</td>
                <td><input class="spec-cell-input" type="text" value="${f.value}" /></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
      </div>`).join('');
  }

  // Ordering tab — replace tbody rows
  const orderTbody = document.querySelector('[data-tab-panel="prod-edit"][data-tab="ordering"] .table-wrap tbody');
  if (orderTbody) {
    orderTbody.innerHTML = d.ordering.map(o => `
      <tr>
        <td><input class="form-input" type="text" value="${o.pn}" style="min-width:160px" /></td>
        <td><input class="form-input" type="text" value="${o.desc}" style="min-width:220px" /></td>
        <td><input class="form-input" type="number" value="${o.lan}" style="width:64px;text-align:center" /></td>
        <td><input class="form-input" type="number" value="${o.usb}" style="width:64px;text-align:center" /></td>
        <td><div class="col-actions"><button class="btn btn-sm btn-danger">刪除</button></div></td>
      </tr>`).join('');
  }

  // Landing page — EN tab (label-based)
  document.querySelectorAll('[data-tab-panel="prod-edit"][data-tab="landing"] .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    const ta   = grp.querySelector('textarea');
    if (text === '產品特色（條列）' && ta) ta.value = d.landing.features;
    if (text === 'SEO Title'        && inp) inp.value = d.landing.seoTitle;
    if (text === 'SEO Keywords'     && inp) inp.value = d.landing.seoKeywords;
    if (text === 'SEO Description'  && ta)  ta.value  = d.landing.seoDesc;
  });

  // Relations tab
  const relSections = document.querySelectorAll('[data-tab-panel="prod-edit"][data-tab="relations"] .form-section');
  if (relSections[0]) {
    const empty = relSections[0].querySelector('.empty-state');
    if (empty) {
      const html = d.relations.derivatives.map(m => `
        <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border)">
          <strong style="flex:1;font-size:13px">${m}</strong>
          <button class="btn btn-sm btn-danger">移除</button>
        </div>`).join('');
      empty.outerHTML = html;
    }
  }
  if (relSections[1]) {
    const empty = relSections[1].querySelector('.empty-state');
    if (empty) {
      const html = d.relations.accessories.map(a => `
        <div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border)">
          <strong style="flex:1;font-size:13px">${a}</strong>
          <button class="btn btn-sm btn-danger">移除</button>
        </div>`).join('');
      empty.outerHTML = html;
    }
  }
}

function initCategories() {
  const tbody = document.querySelector('#view-categories .table-wrap tbody');
  const info  = document.querySelector('#view-categories .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.categories.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.parent ? c.parent : '<span class="text-muted">（大分類）</span>'}</td>
      <td><div class="lang-dots">${langDotsHtml(c.langs)}</div></td>
      <td>${c.sort}</td>
      <td>${editDeleteBtns('categories-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.categories.length} 筆`;
}

function initCategoriesEdit() {
  const parentSel = document.querySelector('#view-categories-edit select.form-input');
  if (parentSel) {
    parentSel.innerHTML = '<option value="">（大分類，無父層）</option>' +
      SAMPLE.mainCategories.map(c => `<option>${c}</option>`).join('');
  }
}

function initFilters() {
  const tbody = document.querySelector('#view-filters .table-wrap tbody');
  const info  = document.querySelector('#view-filters .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.filters.map(f => `
    <tr>
      <td><strong>${f.name}</strong></td>
      <td>${f.options.length}</td>
      <td><div class="lang-dots">${langDotsHtml(f.langs)}</div></td>
      <td>${f.sort}</td>
      <td>${statusBadge(f.status === 'active')}</td>
      <td>${editDeleteBtns('filters-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.filters.length} 筆`;
}

function initFiltersEdit() {
  const f = SAMPLE.filters[0];
  document.querySelectorAll('#view-filters-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (label && label.textContent.trim() === '篩選器名稱') {
      const inp = grp.querySelector('input');
      if (inp) inp.value = f.name;
    }
  });
  const optBody = document.querySelector('#view-filters-edit .form-section:last-child .form-section-body');
  if (optBody) {
    optBody.innerHTML = f.options.map((opt, i) => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-3);font-size:12px;width:20px;flex-shrink:0">${i + 1}</span>
        <input class="form-input" type="text" value="${opt}" style="flex:1" />
        <button class="btn btn-sm btn-danger">刪除</button>
      </div>`).join('');
  }
}

function initTags() {
  const tbody = document.querySelector('#view-tags .table-wrap tbody');
  const info  = document.querySelector('#view-tags .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.tags.map(t => `
    <tr>
      <td><strong>${t.name}</strong></td>
      <td><div class="lang-dots">${langDotsHtml(t.langs)}</div></td>
      <td>${editDeleteBtns('tags-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.tags.length} 筆`;
}

function initTagsEdit() {
  const t = SAMPLE.tags[0];
  document.querySelectorAll('#view-tags-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    if (text === 'URL Slug'  && inp) inp.value = t.slug;
    if (text === 'Tag 名稱'  && inp) inp.value = t.name;
    if (text === 'H1 標題'   && inp) inp.value = t.name;
  });
}

function initSpecs() {
  const tbody = document.querySelector('#view-specs .table-wrap tbody');
  const info  = document.querySelector('#view-specs .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.specGroups.map(g => `
    <tr>
      <td><strong>${g.name}</strong></td>
      <td>${g.fields}</td>
      <td>${g.category}</td>
      <td>${g.sort}</td>
      <td>${editDeleteBtns('specs-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.specGroups.length} 筆`;

  const catSel = document.querySelector('#view-specs select.filter-select');
  if (catSel) {
    catSel.innerHTML = '<option value="">全部分類</option>' +
      SAMPLE.mainCategories.map(c => `<option>${c}</option>`).join('');
  }
}

function initSpecsEdit() {
  const g = SAMPLE.specGroups[0];
  document.querySelectorAll('#view-specs-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    const sel  = grp.querySelector('select');
    if (text === '群組名稱（識別用）' && inp) inp.value = g.name;
    if (text === '綁定大分類' && sel) {
      sel.innerHTML = '<option value="">請選擇</option>' +
        SAMPLE.mainCategories.map(c => `<option${c === g.category ? ' selected' : ''}>${c}</option>`).join('');
    }
  });
  const fieldsBody = document.querySelector('#view-specs-edit .form-section:last-child .form-section-body');
  if (fieldsBody) {
    const sampleFields = SAMPLE.productEdit.specs[0].fields;
    fieldsBody.innerHTML = sampleFields.map((f, i) => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border)">
        <span style="color:var(--text-3);font-size:12px;width:20px;flex-shrink:0">${i + 1}</span>
        <input class="form-input" type="text" value="${f.label}" placeholder="欄位名稱" style="width:160px;flex-shrink:0" />
        <select class="form-input" style="width:100px;flex-shrink:0">
          <option>文字</option><option>數字</option><option>是/否</option>
        </select>
        <button class="btn btn-sm btn-danger">刪除</button>
      </div>`).join('');
  }
}

function initFiles() {
  const tbody = document.querySelector('#view-files .table-wrap tbody');
  const info  = document.querySelector('#view-files .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.files.map(f => `
    <tr>
      <td><strong>${f.name}</strong></td>
      <td>${f.category}</td>
      <td>${typeBadge(f.type)}</td>
      <td style="font-size:12px">${f.product}</td>
      <td>${f.partner ? '<span class="badge badge-warning">是</span>' : '<span class="badge badge-neutral">否</span>'}</td>
      <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${f.updated}</td>
      <td>${editDeleteBtns('files-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.files.length} 筆`;

  const catSel = document.querySelectorAll('#view-files select.filter-select')[0];
  if (catSel) {
    catSel.innerHTML = '<option value="">全部分類</option>' +
      SAMPLE.fileCategories.map(c => `<option>${c.name}</option>`).join('');
  }
}

function initFilesEdit() {
  const f = SAMPLE.files[0];
  document.querySelectorAll('#view-files-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    const sel  = grp.querySelector('select');
    if (text === '檔案名稱' && inp) inp.value = f.name;
    if (text === '分類' && sel) {
      sel.innerHTML = '<option value="">請選擇</option>' +
        SAMPLE.fileCategories.map(c => `<option${c.name === f.category ? ' selected' : ''}>${c.name}</option>`).join('');
    }
    if (text === '綁定產品' && inp) inp.value = f.product;
  });
}

function initFileCategories() {
  const tbody = document.querySelector('#view-file-categories .table-wrap tbody');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.fileCategories.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td><span class="text-muted">${c.parent}</span></td>
      <td>${editDeleteBtns('file-categories-edit')}</td>
    </tr>`).join('');
}

function initUsers() {
  const tbody = document.querySelector('#view-users .table-wrap tbody');
  const info  = document.querySelector('#view-users .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.users.map(u => `
    <tr>
      <td><strong>${u.name}</strong></td>
      <td style="font-size:12px;color:var(--text-2)">${u.email}</td>
      <td>${u.company}</td>
      <td>${u.dept}</td>
      <td>${roleBadge(u.role)}</td>
      <td>${statusBadge(u.status === 'active')}</td>
      <td>${editDeleteBtns('users-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.users.length} 筆`;
}

function initUsersEdit() {
  const u = SAMPLE.users[1]; // Alan Chen as example
  document.querySelectorAll('#view-users-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    const sel  = grp.querySelector('select');
    if (text === '姓名 *'           && inp) inp.value = u.name;
    if (text === 'Microsoft 信箱 *' && inp) inp.value = u.email;
    if (text === '公司'             && inp) inp.value = u.company;
    if (text === '部門'             && inp) inp.value = u.dept;
    if (text === '角色 *'           && sel) sel.value = u.role;
    if (text === '狀態'             && sel) sel.value = '啟用';
  });
}

function initRoles() {
  const tbody = document.querySelector('#view-roles .table-wrap tbody');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.roles.map(r => `
    <tr>
      <td>${roleBadge(r.name)}</td>
      <td style="font-size:13px">${r.desc}</td>
      <td>${statusBadge(r.status === 'active')}</td>
      <td>${editDeleteBtns('roles-edit')}</td>
    </tr>`).join('');
}

function initRolesEdit() {
  // Permission matrix defaults: Admin=all, PM=product R+W, MKT=product R only, etc.
  const permMap = {
    'Dashboard':   [1,1, 1,0, 1,0, 1,0, 1,0],
    '產品管理':    [1,1, 1,1, 1,1, 1,0, 1,0],
    '產品分類':    [1,1, 1,1, 1,0, 1,0, 1,0],
    '篩選器管理':  [1,1, 1,1, 1,0, 0,0, 0,0],
    'Tag 管理':    [1,1, 1,1, 1,0, 0,0, 0,0],
    '規格欄位':    [1,1, 1,1, 0,0, 0,0, 1,0],
    '檔案管理':    [1,1, 1,0, 1,0, 0,0, 1,1],
    '帳號管理':    [1,1, 0,0, 0,0, 0,0, 0,0],
    '系統管理':    [1,1, 0,0, 0,0, 0,0, 0,0],
    '操作記錄':    [1,1, 1,0, 1,0, 0,0, 0,0],
  };
  document.querySelectorAll('#view-roles-edit tbody tr').forEach(row => {
    const label = row.querySelector('td:first-child').textContent.trim();
    const vals  = permMap[label];
    if (!vals) return;
    row.querySelectorAll('input[type=checkbox]').forEach((cb, i) => {
      cb.checked = !!vals[i];
    });
  });
}

function initLogs() {
  const syncTbody  = document.querySelector('[data-tab-panel="logs"][data-tab="sync"] .table-wrap tbody');
  const auditTbody = document.querySelector('[data-tab-panel="logs"][data-tab="audit"] .table-wrap tbody');

  if (syncTbody) {
    syncTbody.innerHTML = SAMPLE.syncLogs.map(l => `
      <tr>
        <td>${l.type}</td>
        <td style="font-size:12px">${l.target}</td>
        <td>${syncStatusBadge(l.status)}</td>
        <td style="font-size:12px;color:var(--text-2)">${l.msg}</td>
        <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${l.time}</td>
      </tr>`).join('');
  }
  if (auditTbody) {
    auditTbody.innerHTML = SAMPLE.auditLogs.map(l => `
      <tr>
        <td>${l.user}</td>
        <td>${l.module}</td>
        <td>${actionBadge(l.action)}</td>
        <td style="font-size:12px">${l.desc}</td>
        <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${l.time}</td>
      </tr>`).join('');
  }
  const modSel = document.querySelectorAll('[data-tab-panel="logs"][data-tab="audit"] select.filter-select')[1];
  if (modSel) {
    modSel.innerHTML = '<option value="">全部模組</option>' +
      ['產品管理', '檔案管理', '帳號管理', '系統管理'].map(m => `<option>${m}</option>`).join('');
  }
}

function initSmtp() {
  const vals = ['smtp.office365.com', '587', 'noreply@dfi.com', '••••••••', 'noreply@dfi.com'];
  document.querySelectorAll('#view-smtp tbody tr').forEach((row, i) => {
    const td = row.querySelectorAll('td')[1];
    if (td && vals[i] !== undefined) td.textContent = vals[i];
  });
  // Update timestamp cells
  const ts = '2026-04-01 09:00';
  document.querySelectorAll('#view-smtp tbody tr').forEach(row => {
    const td = row.querySelectorAll('td')[2];
    if (td) { td.textContent = ts; td.style.cssText = 'color:var(--text-3);font-size:12px'; }
  });
}

function initSmtpEdit() {
  document.querySelectorAll('#view-smtp-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    if (text === 'SMTP Host'  && inp) inp.value = 'smtp.office365.com';
    if (text === 'SMTP Port'  && inp) inp.value = '587';
    if (text === '帳號'       && inp) inp.value = 'noreply@dfi.com';
    if (text === '寄件人信箱' && inp) inp.value = 'noreply@dfi.com';
  });
  const encSel = document.querySelector('#view-smtp-edit select.form-input');
  if (encSel) encSel.value = 'TLS';
}

// ── VIEW INIT MAP ────────────────────────────────────────────
const VIEW_INITS = {
  'dashboard':            initDashboard,
  'products':             initProductList,
  'products-edit':        initProductEdit,
  'categories':           initCategories,
  'categories-edit':      initCategoriesEdit,
  'filters':              initFilters,
  'filters-edit':         initFiltersEdit,
  'tags':                 initTags,
  'tags-edit':            initTagsEdit,
  'specs':                initSpecs,
  'specs-edit':           initSpecsEdit,
  'files':                initFiles,
  'files-edit':           initFilesEdit,
  'file-categories':      initFileCategories,
  'users':                initUsers,
  'users-edit':           initUsersEdit,
  'roles':                initRoles,
  'roles-edit':           initRolesEdit,
  'logs':                 initLogs,
  'smtp':                 initSmtp,
  'smtp-edit':            initSmtpEdit,
};

// ── ROUTER ───────────────────────────────────────────────────
function getHash() {
  return (window.location.hash || '#login').replace('#', '') || 'login';
}

function navigate(hash) {
  window.location.hash = hash;
}

function render(hash) {
  const route = ROUTES[hash] || ROUTES['404'];
  const isAuth = AUTH_VIEWS.includes(hash);

  document.getElementById('app-layout').classList.toggle('active', !isAuth);
  document.querySelectorAll('.auth-page').forEach(el => el.classList.remove('active'));

  if (isAuth) {
    const el = document.getElementById('view-' + hash);
    if (el) el.classList.add('active');
    return;
  }

  document.querySelectorAll('.view').forEach(el => el.classList.remove('active'));
  const viewEl = document.getElementById('view-' + hash);
  if (viewEl) viewEl.classList.add('active');

  updateBreadcrumb(route.crumb || []);

  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  if (route.nav) {
    const navEl = document.getElementById(route.nav);
    if (navEl) navEl.classList.add('active');
  }

  document.querySelectorAll('.nav-group-children').forEach(el => el.classList.remove('open'));
  document.querySelectorAll('.nav-group-toggle').forEach(el => el.classList.remove('open'));
  if (route.group) {
    const grp    = document.getElementById(route.group);
    const toggle = document.getElementById(route.group + '-toggle');
    if (grp)    grp.classList.add('open');
    if (toggle) toggle.classList.add('open');
  }

  if (VIEW_INITS[hash]) VIEW_INITS[hash]();
}

function updateBreadcrumb(crumbs) {
  const bc = document.getElementById('breadcrumb');
  if (!bc) return;
  if (!crumbs || crumbs.length === 0) { bc.innerHTML = ''; return; }
  bc.innerHTML = crumbs.map((c, i) => {
    if (i === crumbs.length - 1) return `<span class="breadcrumb-current">${c}</span>`;
    return `<span>${c}</span><span class="breadcrumb-sep">/</span>`;
  }).join('');
}

// ── SIDEBAR GROUP TOGGLE ─────────────────────────────────────
function initGroupToggles() {
  document.querySelectorAll('.nav-group-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const groupId = toggle.id.replace('-toggle', '');
      const children = document.getElementById(groupId);
      if (!children) return;
      const isOpen = children.classList.contains('open');
      document.querySelectorAll('.nav-group-children').forEach(el => el.classList.remove('open'));
      document.querySelectorAll('.nav-group-toggle').forEach(el => el.classList.remove('open'));
      if (!isOpen) {
        children.classList.add('open');
        toggle.classList.add('open');
      }
    });
  });
}

// ── TAB SWITCHING ────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('[data-tab-group]').forEach(bar => {
    const group = bar.dataset.tabGroup;
    bar.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        document.querySelectorAll(`[data-tab-group="${group}"] .tab-btn`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`[data-tab-panel="${group}"]`).forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll(`[data-tab-panel="${group}"][data-tab="${target}"]`).forEach(p => p.classList.add('active'));
      });
    });
  });
}

// ── LANGUAGE TABS ────────────────────────────────────────────
function initLangTabs() {
  document.querySelectorAll('[data-lang-group]').forEach(bar => {
    const group = bar.dataset.langGroup;
    bar.querySelectorAll('.lang-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.lang;
        document.querySelectorAll(`[data-lang-group="${group}"] .lang-tab-btn`).forEach(b => b.classList.remove('active'));
        document.querySelectorAll(`[data-lang-panel="${group}"]`).forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll(`[data-lang-panel="${group}"][data-lang="${target}"]`).forEach(p => p.classList.add('active'));
      });
    });
  });
}

// ── BOOTSTRAP ────────────────────────────────────────────────
window.addEventListener('hashchange', () => render(getHash()));

document.addEventListener('DOMContentLoaded', () => {
  initGroupToggles();
  initTabs();
  initLangTabs();
  render(getHash());
});
