/* ============================================================
   DFI PMS Demo — App Router & UI Logic
   ============================================================ */

// ── ROUTES ───────────────────────────────────────────────────
const ROUTES = {
  'login':                 { auth: true },
  '403':                   { auth: true },
  '404':                   { auth: true },
  'products':              { crumb: ['產品管理', '產品列表'],                    nav: 'nav-products',            group: 'grp-products' },
  'products-edit':         { crumb: ['產品管理', '產品列表', '產品編輯'],                   nav: 'nav-products',            group: 'grp-products' },
  'products-lang-edit':    { crumb: ['產品管理', '產品列表', '產品編輯', '網頁內容編輯'],   nav: 'nav-products',            group: 'grp-products' },
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
  'logs':                  { crumb: ['系統管理', '操作記錄'],                    nav: 'nav-logs',                group: 'grp-system' },
};

const AUTH_VIEWS = ['login', '403', '404'];

// ── SAMPLE DATA ──────────────────────────────────────────────
const SAMPLE = {

  mainCategories: [
    'Industrial Motherboards',
    'System-On-Modules',
    'Industrial Computers',
    'Application-Specific Systems',
    'Industrial Panel PCs & Displays',
    'Edge Servers',
    'Peripherals',
    'Software and Service',
  ],

  subCategories: {
    'Industrial Motherboards': [
      '1.8" SBC', '2.5" Pico-ITX', '3.5" SBC', '4" SBC',
      'PICMG 1.3', 'Mini-ITX', 'microATX', 'ATX', 'EATX',
    ],
    'System-On-Modules': [
      'COM Express Mini', 'COM Express Compact', 'COM Express Basic',
      'COM HPC', 'SMARC', 'Qseven', 'Open Standard Module (OSM)',
      'SDM', 'Carrier Boards',
    ],
    'Industrial Computers': [
      'Ultra Compact Fanless PC', 'Embedded Fanless PC',
      'Edge AI Inference Systems', 'Ruggedized Embedded Systems',
      'Mini-ITX / microATX / ATX Systems', 'IPC Chassis Series',
      'Performance Compact PC',
    ],
    'Application-Specific Systems': [
      'Railway Systems', 'In-vehicle Systems',
      'Medical Systems', 'Agile Gaming Systems',
    ],
    'Industrial Panel PCs & Displays': [
      'Fanless Touch Panel PC', 'Expandable Touch Panel PC',
      'Modularized Touch Panel PC', 'Open Frame Panel PC',
      'Industrial Display & Touch Display',
    ],
    'Edge Servers': [
      'Server Boards', 'Server System',
    ],
    'Peripherals': [
      'OOB Management', 'I/O Module', 'Riser Cards', 'Power Converters',
    ],
    'Software and Service': [
      'Ubuntu OS', 'OS Customization Service', 'ODM/OEM Service',
      'BIOS Customization Service', 'Software Customization Service',
      'Design Manufacturing Service', 'Reliable Technical Service', 'Extended Warranty',
    ],
  },

  // filter groups per sub-category (決定主分類選定後自動帶入哪些篩選器群組)
  filterCategoryMap: {
    // Industrial Motherboards
    '1.8" SBC':    ['Form Factor', 'CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    '2.5" Pico-ITX': ['Form Factor', 'CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    '3.5" SBC':    ['Form Factor', 'CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    '4" SBC':      ['Form Factor', 'CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    'PICMG 1.3':   ['CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    'Mini-ITX':    ['Form Factor', 'CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    'microATX':    ['CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    'ATX':         ['CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    'EATX':        ['CPU Platform', 'Memory Type', 'OS Support', 'Expansion', 'Operating Temp'],
    // System-On-Modules
    'COM Express Mini':           ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'COM Express Compact':        ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'COM Express Basic':          ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'COM HPC':                    ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'SMARC':                      ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'Qseven':                     ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'Open Standard Module (OSM)': ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'SDM':                        ['Module Standard', 'CPU Platform', 'Memory Type', 'Operating Temp'],
    'Carrier Boards':             ['CPU Platform', 'Expansion', 'Operating Temp'],
    // Industrial Computers
    'Ultra Compact Fanless PC':          ['CPU Platform', 'OS Support', 'LAN Ports', 'Expansion', 'Operating Temp'],
    'Embedded Fanless PC':               ['CPU Platform', 'OS Support', 'LAN Ports', 'Expansion', 'Operating Temp'],
    'Edge AI Inference Systems':         ['CPU Platform', 'OS Support', 'LAN Ports', 'Operating Temp'],
    'Ruggedized Embedded Systems':       ['CPU Platform', 'OS Support', 'Operating Temp'],
    'Mini-ITX / microATX / ATX Systems': ['CPU Platform', 'OS Support', 'LAN Ports', 'Expansion', 'Operating Temp'],
    'IPC Chassis Series':                ['Operating Temp'],
    'Performance Compact PC':            ['CPU Platform', 'OS Support', 'LAN Ports', 'Operating Temp'],
    // Application-Specific Systems
    'Railway Systems':      ['CPU Platform', 'Application Certification', 'Operating Temp'],
    'In-vehicle Systems':   ['CPU Platform', 'Application Certification', 'Operating Temp'],
    'Medical Systems':      ['CPU Platform', 'Application Certification', 'Operating Temp'],
    'Agile Gaming Systems': ['CPU Platform', 'OS Support', 'Operating Temp'],
    // Industrial Panel PCs & Displays
    'Fanless Touch Panel PC':             ['CPU Platform', 'Screen Size', 'Touch Technology', 'IP Rating', 'OS Support', 'Operating Temp'],
    'Expandable Touch Panel PC':          ['CPU Platform', 'Screen Size', 'Touch Technology', 'IP Rating', 'OS Support', 'Operating Temp'],
    'Modularized Touch Panel PC':         ['CPU Platform', 'Screen Size', 'Touch Technology', 'IP Rating', 'OS Support', 'Operating Temp'],
    'Open Frame Panel PC':                ['CPU Platform', 'Screen Size', 'Touch Technology', 'IP Rating', 'OS Support', 'Operating Temp'],
    'Industrial Display & Touch Display': ['Screen Size', 'Touch Technology', 'IP Rating', 'Operating Temp'],
    // Edge Servers
    'Server Boards': ['CPU Platform', 'Memory Type', 'Expansion', 'Operating Temp'],
    'Server System': ['CPU Platform', 'Memory Type', 'LAN Ports', 'Operating Temp'],
    // Peripherals
    'OOB Management':  ['Operating Temp'],
    'I/O Module':      ['Expansion', 'Operating Temp'],
    'Riser Cards':     ['Expansion', 'Operating Temp'],
    'Power Converters': ['Operating Temp'],
  },

  categories: [
    // Industrial Motherboards
    { name: 'Industrial Motherboards',          parent: null,                       sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: '1.8" SBC',                         parent: 'Industrial Motherboards',  sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false } },
    { name: '2.5" Pico-ITX',                    parent: 'Industrial Motherboards',  sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: '3.5" SBC',                         parent: 'Industrial Motherboards',  sort: 3, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: '4" SBC',                           parent: 'Industrial Motherboards',  sort: 4, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'PICMG 1.3',                        parent: 'Industrial Motherboards',  sort: 5, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'Mini-ITX',                         parent: 'Industrial Motherboards',  sort: 6, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'microATX',                         parent: 'Industrial Motherboards',  sort: 7, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'ATX',                              parent: 'Industrial Motherboards',  sort: 8, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'EATX',                             parent: 'Industrial Motherboards',  sort: 9, langs: { EN:true,  TW:false, CN:false, JP:false, DE:false } },
    // System-On-Modules
    { name: 'System-On-Modules',                parent: null,                       sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'COM Express Mini',                 parent: 'System-On-Modules',        sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false } },
    { name: 'COM Express Compact',              parent: 'System-On-Modules',        sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false } },
    { name: 'COM Express Basic',                parent: 'System-On-Modules',        sort: 3, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'COM HPC',                          parent: 'System-On-Modules',        sort: 4, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'SMARC',                            parent: 'System-On-Modules',        sort: 5, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'Qseven',                           parent: 'System-On-Modules',        sort: 6, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'Open Standard Module (OSM)',       parent: 'System-On-Modules',        sort: 7, langs: { EN:true,  TW:false, CN:false, JP:false, DE:false } },
    { name: 'SDM',                              parent: 'System-On-Modules',        sort: 8, langs: { EN:true,  TW:false, CN:false, JP:false, DE:false } },
    { name: 'Carrier Boards',                   parent: 'System-On-Modules',        sort: 9, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    // Industrial Computers
    { name: 'Industrial Computers',             parent: null,                       sort: 3, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'Ultra Compact Fanless PC',         parent: 'Industrial Computers',     sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:false } },
    { name: 'Embedded Fanless PC',              parent: 'Industrial Computers',     sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'Edge AI Inference Systems',        parent: 'Industrial Computers',     sort: 3, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'Ruggedized Embedded Systems',      parent: 'Industrial Computers',     sort: 4, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'Mini-ITX / microATX / ATX Systems', parent: 'Industrial Computers',   sort: 5, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'IPC Chassis Series',               parent: 'Industrial Computers',     sort: 6, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'Performance Compact PC',           parent: 'Industrial Computers',     sort: 7, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    // Application-Specific Systems
    { name: 'Application-Specific Systems',     parent: null,                       sort: 4, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'Railway Systems',                  parent: 'Application-Specific Systems', sort: 1, langs: { EN:true, TW:true, CN:true, JP:false, DE:true  } },
    { name: 'In-vehicle Systems',               parent: 'Application-Specific Systems', sort: 2, langs: { EN:true, TW:true, CN:true, JP:false, DE:false } },
    { name: 'Medical Systems',                  parent: 'Application-Specific Systems', sort: 3, langs: { EN:true, TW:true, CN:true, JP:false, DE:false } },
    { name: 'Agile Gaming Systems',             parent: 'Application-Specific Systems', sort: 4, langs: { EN:true, TW:false,CN:false,JP:false, DE:false } },
    // Industrial Panel PCs & Displays
    { name: 'Industrial Panel PCs & Displays',  parent: null,                       sort: 5, langs: { EN:true,  TW:true,  CN:true,  JP:true,  DE:true  } },
    { name: 'Fanless Touch Panel PC',           parent: 'Industrial Panel PCs & Displays', sort: 1, langs: { EN:true, TW:true, CN:true, JP:true,  DE:false } },
    { name: 'Expandable Touch Panel PC',        parent: 'Industrial Panel PCs & Displays', sort: 2, langs: { EN:true, TW:true, CN:true, JP:false, DE:false } },
    { name: 'Modularized Touch Panel PC',       parent: 'Industrial Panel PCs & Displays', sort: 3, langs: { EN:true, TW:true, CN:false,JP:false, DE:false } },
    { name: 'Open Frame Panel PC',              parent: 'Industrial Panel PCs & Displays', sort: 4, langs: { EN:true, TW:true, CN:true, JP:false, DE:false } },
    { name: 'Industrial Display & Touch Display', parent: 'Industrial Panel PCs & Displays', sort: 5, langs: { EN:true, TW:true, CN:false,JP:false, DE:false } },
    // Edge Servers
    { name: 'Edge Servers',                     parent: null,                       sort: 6, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'Server Boards',                    parent: 'Edge Servers',             sort: 1, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'Server System',                    parent: 'Edge Servers',             sort: 2, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    // Peripherals
    { name: 'Peripherals',                      parent: null,                       sort: 7, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
    { name: 'OOB Management',                   parent: 'Peripherals',              sort: 1, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'I/O Module',                       parent: 'Peripherals',              sort: 2, langs: { EN:true,  TW:true,  CN:false, JP:false, DE:false } },
    { name: 'Riser Cards',                      parent: 'Peripherals',              sort: 3, langs: { EN:true,  TW:false, CN:false, JP:false, DE:false } },
    { name: 'Power Converters',                 parent: 'Peripherals',              sort: 4, langs: { EN:true,  TW:false, CN:false, JP:false, DE:false } },
    // Software and Service
    { name: 'Software and Service',             parent: null,                       sort: 8, langs: { EN:true,  TW:true,  CN:true,  JP:false, DE:false } },
  ],

  filters: [
    {
      name: 'Form Factor',
      options: ['1.8" SBC', '2.5" Pico-ITX', '3.5" SBC', '4" SBC', 'Mini-ITX', 'microATX', 'ATX', 'EATX', 'PICMG 1.3'],
      sort: 1, status: 'active', langs: { EN:true, TW:true, CN:true, JP:true, DE:true },
    },
    {
      name: 'CPU Platform',
      options: [
        'Intel Core Ultra Series 2 (Arrow Lake)',
        'Intel Core Ultra Series 1 (Meteor Lake)',
        'Intel 14th Gen Core (Raptor Lake-R)',
        'Intel 12th/13th Gen Core (Alder/Raptor Lake)',
        'Intel Atom x6000E (Elkhart Lake)',
        'Intel Celeron J6412 (Elkhart Lake)',
        'AMD Ryzen Embedded V3000',
        'NXP i.MX8M Plus',
      ],
      sort: 2, status: 'active', langs: { EN:true, TW:true, CN:true, JP:true, DE:true },
    },
    {
      name: 'Operating Temp',
      options: ['0~60°C (Standard)', '-20~60°C (Extended)', '-40~85°C (Wide)'],
      sort: 3, status: 'active', langs: { EN:true, TW:true, CN:true, JP:true, DE:true },
    },
    {
      name: 'OS Support',
      options: [
        'Windows 11 IoT Enterprise',
        'Windows 10 IoT Enterprise',
        'Linux Ubuntu 22.04 LTS',
        'Linux Ubuntu 20.04 LTS',
        'Android 13',
        'VxWorks',
        'QNX',
      ],
      sort: 4, status: 'active', langs: { EN:true, TW:true, CN:true, JP:false, DE:false },
    },
    {
      name: 'Memory Type',
      options: ['DDR5', 'DDR4', 'LPDDR5', 'LPDDR4x'],
      sort: 5, status: 'active', langs: { EN:true, TW:true, CN:true, JP:false, DE:false },
    },
    {
      name: 'Expansion',
      options: ['PCIe x16', 'PCIe x4', 'PCIe x1', 'M.2 2280 (NVMe)', 'M.2 2242', 'mPCIe', 'SATA III'],
      sort: 6, status: 'active', langs: { EN:true, TW:true, CN:false, JP:false, DE:false },
    },
    {
      name: 'LAN Ports',
      options: ['2x GbE', '4x GbE', '6x GbE', '1x 2.5GbE + 1x GbE', '2x 10GbE', '4x 10GbE'],
      sort: 7, status: 'active', langs: { EN:true, TW:true, CN:true, JP:false, DE:false },
    },
    {
      name: 'Module Standard',
      options: [
        'COM Express Rev. 3.1 (Mini)', 'COM Express Rev. 3.1 (Compact)', 'COM Express Rev. 3.1 (Basic)',
        'COM HPC Rev. 1.0', 'SMARC 2.1', 'Qseven R2.1', 'OSM Rev. 1.0',
      ],
      sort: 8, status: 'active', langs: { EN:true, TW:true, CN:false, JP:false, DE:false },
    },
    {
      name: 'Application Certification',
      options: ['EN 50155 (Railway)', 'EN 50121-3-2 (EMC Railway)', 'MIL-STD-810G (Military)', 'IEC 60601-1 (Medical)', 'ISO 13849 (Safety)'],
      sort: 9, status: 'active', langs: { EN:true, TW:true, CN:false, JP:false, DE:false },
    },
    {
      name: 'Screen Size',
      options: ['7"', '10.1"', '12.1"', '15.6"', '17.3"', '21.5"', '23.8"'],
      sort: 10, status: 'active', langs: { EN:true, TW:true, CN:true, JP:false, DE:false },
    },
    {
      name: 'Touch Technology',
      options: ['Projected Capacitive (PCAP)', 'Resistive', 'SAW (Surface Acoustic Wave)'],
      sort: 11, status: 'active', langs: { EN:true, TW:true, CN:false, JP:false, DE:false },
    },
    {
      name: 'IP Rating',
      options: ['IP54', 'IP65', 'IP66', 'IP67'],
      sort: 12, status: 'active', langs: { EN:true, TW:true, CN:false, JP:false, DE:false },
    },
  ],

  tags: [
    { name: 'AI Edge',               slug: 'ai-edge',               langs: { EN:true, TW:true, CN:true,  JP:true,  DE:true  } },
    { name: 'IoT Gateway',           slug: 'iot-gateway',           langs: { EN:true, TW:true, CN:true,  JP:false, DE:false } },
    { name: 'In-Vehicle',            slug: 'in-vehicle',            langs: { EN:true, TW:true, CN:false, JP:false, DE:false } },
    { name: 'Industrial Automation', slug: 'industrial-automation', langs: { EN:true, TW:true, CN:true,  JP:true,  DE:false } },
    { name: 'Smart Retail',          slug: 'smart-retail',          langs: { EN:true, TW:false,CN:false, JP:false, DE:false } },
  ],

  specGroups: [
    { name: 'General',            category: 'Industrial Motherboards', sort: 1, fields: 5 },
    { name: 'I/O Interface',      category: 'Industrial Motherboards', sort: 2, fields: 6 },
    { name: 'Power & Mechanical', category: 'Industrial Computers',    sort: 1, fields: 4 },
    { name: 'Expansion',          category: 'Industrial Computers',    sort: 2, fields: 3 },
  ],

  products: [
    { model: 'EC70A-SU', mainCat: 'Industrial Motherboards', subCat: '3.5" SBC', lifecycle: 'Active', status: '待更新', updated: '2026-04-10 14:32',
      langStatuses: [
        { code: 'en', name: 'EN', enabled: true,  status: 'needs_update', lastSynced: '2026-04-10' },
        { code: 'tw', name: 'TW', enabled: true,  status: 'pending',      lastSynced: '2026-04-08' },
        { code: 'cn', name: 'CN', enabled: true,  status: 'synced',       lastSynced: '2026-04-08' },
        { code: 'jp', name: 'JP', enabled: true,  status: 'sync_failed',  lastSynced: '2026-04-05' },
        { code: 'de', name: 'DE', enabled: false, status: null,           lastSynced: null },
      ]},
    { model: 'EC551-CR', mainCat: 'Industrial Motherboards', subCat: '3.5" SBC', lifecycle: 'Active', status: '已發佈', updated: '2026-04-08 09:17',
      langStatuses: [
        { code: 'en', name: 'EN', enabled: true,  status: 'synced', lastSynced: '2026-04-08' },
        { code: 'tw', name: 'TW', enabled: true,  status: 'synced', lastSynced: '2026-04-08' },
        { code: 'cn', name: 'CN', enabled: true,  status: 'synced', lastSynced: '2026-04-08' },
        { code: 'jp', name: 'JP', enabled: false, status: null,     lastSynced: null },
        { code: 'de', name: 'DE', enabled: false, status: null,     lastSynced: null },
      ]},
    { model: 'SD101-D26', mainCat: 'Industrial Computers', subCat: 'Embedded Fanless PC', lifecycle: 'Active', status: '待發佈', updated: '2026-03-25 16:44',
      langStatuses: [
        { code: 'en', name: 'EN', enabled: true,  status: 'pending', lastSynced: null },
        { code: 'tw', name: 'TW', enabled: true,  status: 'draft',   lastSynced: null },
        { code: 'cn', name: 'CN', enabled: false, status: null,      lastSynced: null },
        { code: 'jp', name: 'JP', enabled: false, status: null,      lastSynced: null },
        { code: 'de', name: 'DE', enabled: false, status: null,      lastSynced: null },
      ]},
    { model: 'IPC900-519-FL', mainCat: 'Industrial Computers', subCat: 'Embedded Fanless PC', lifecycle: 'Active', status: '待發佈', updated: '2026-03-18 11:20',
      langStatuses: [
        { code: 'en', name: 'EN', enabled: true,  status: 'pending', lastSynced: null },
        { code: 'tw', name: 'TW', enabled: false, status: null,      lastSynced: null },
        { code: 'cn', name: 'CN', enabled: false, status: null,      lastSynced: null },
        { code: 'jp', name: 'JP', enabled: false, status: null,      lastSynced: null },
        { code: 'de', name: 'DE', enabled: false, status: null,      lastSynced: null },
      ]},
    { model: 'VC972-R10', mainCat: 'Application-Specific Systems', subCat: 'In-vehicle Systems', lifecycle: 'EOL', status: '已發佈', updated: '2025-12-01 08:05',
      langStatuses: [
        { code: 'en', name: 'EN', enabled: true, status: 'synced', lastSynced: '2025-12-01' },
        { code: 'tw', name: 'TW', enabled: true, status: 'synced', lastSynced: '2025-12-01' },
        { code: 'cn', name: 'CN', enabled: true, status: 'synced', lastSynced: '2025-12-01' },
        { code: 'jp', name: 'JP', enabled: true, status: 'synced', lastSynced: '2025-12-01' },
        { code: 'de', name: 'DE', enabled: true, status: 'synced', lastSynced: '2025-12-01' },
      ]},
    { model: 'EC70A-BT', mainCat: 'Industrial Motherboards', subCat: '3.5" SBC', lifecycle: 'Preview', status: '草稿', updated: '2026-04-14 17:00',
      langStatuses: [
        { code: 'en', name: 'EN', enabled: true,  status: 'draft', lastSynced: null },
        { code: 'tw', name: 'TW', enabled: false, status: null,    lastSynced: null },
        { code: 'cn', name: 'CN', enabled: false, status: null,    lastSynced: null },
        { code: 'jp', name: 'JP', enabled: false, status: null,    lastSynced: null },
        { code: 'de', name: 'DE', enabled: false, status: null,    lastSynced: null },
      ]},
  ],

  productEdit: {
    model:    'EC70A-SU',
    lifecycle: 'Active',
    primaryParent: 'Industrial Motherboards',  // 大分類（連動下拉第一層）
    primarySub:    '3.5" SBC',                 // 次分類（連動下拉第二層，決定規格與篩選器）
    secondaryCats: ['Industrial Computers', 'Edge AI Inference Systems'],  // 次要分類：僅前台曝光
    filters:  ['Form Factor: 3.5" SBC', 'CPU Platform: Intel 12th/13th Gen Core (Alder/Raptor Lake)', 'OS Support: Windows 10 IoT Enterprise', 'Operating Temp: -20~60°C (Extended)'],
    tags:     ['AI Edge', 'Industrial Automation'],
    langStatuses: [
      { code: 'en', name: 'EN', status: 'pending',     lastSynced: '2026-04-10' },
      { code: 'tw', name: 'TW', status: 'draft',       lastSynced: null },
      { code: 'cn', name: 'CN', status: 'synced',      lastSynced: '2026-04-08' },
      { code: 'jp', name: 'JP', status: 'sync_failed', lastSynced: '2026-04-05', syncError: 'API timeout (503)' },
      { code: 'de', name: 'DE', status: 'draft',       lastSynced: null, disabled: true },
    ],
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
    ordering: {
      dynamicCols: [
        { key: 'lan', label: 'LAN Port' },
        { key: 'usb', label: 'USB Port' },
      ],
      visibleColKeys: ['modelName', 'pn', 'processor', 'memory', 'thermal', 'operatingTemp', 'lan', 'usb'],
      rows: [
        { modelName: 'EC70A-SU', pn: 'EC70A-SU-0001', processor: 'Intel® Core™ i7-1185G7E', memory: 'DDR4, up to 64GB', thermal: 'Fanless', operatingTemp: '-20°C ~ 60°C', lan: 2, usb: 6 },
        { modelName: 'EC70A-SU', pn: 'EC70A-SU-0002', processor: 'Intel® Core™ i5-1145G7E', memory: 'DDR4, up to 32GB', thermal: 'Fanless', operatingTemp: '-20°C ~ 60°C', lan: 2, usb: 6 },
        { modelName: 'EC70A-SU', pn: 'EC70A-SU-0003', processor: 'Intel® Core™ i3-1115G4E', memory: 'DDR4, up to 16GB', thermal: 'Fanless', operatingTemp: '-20°C ~ 60°C', lan: 2, usb: 4 },
      ],
    },
    skuSpecs: {
      skus: [
        { pn: 'EC70A-SU-0001', desc: 'Core i7-1185G7E' },
        { pn: 'EC70A-SU-0002', desc: 'Core i5-1145G7E' },
        { pn: 'EC70A-SU-0003', desc: 'Core i3-1115G4E' },
      ],
      groups: [
        { group: 'General', fields: [
          { label: 'CPU',        values: ['Intel® Core™ i7-1185G7E, 4C/8T, 4.4GHz', 'Intel® Core™ i5-1145G7E, 4C/8T, 4.1GHz', 'Intel® Core™ i3-1115G4E, 2C/4T, 3.9GHz'] },
          { label: 'Chipset',    values: ['Intel® Tiger Lake-UP4', 'Intel® Tiger Lake-UP4', 'Intel® Tiger Lake-UP4'] },
          { label: 'Memory',     values: ['DDR4-3200, up to 64GB', 'DDR4-3200, up to 32GB', 'DDR4-3200, up to 16GB'] },
          { label: 'Storage',    values: ['M.2 PCIe x4 + SATA III', 'M.2 PCIe x4 + SATA III', 'M.2 PCIe x4 + SATA III'] },
          { label: 'OS Support', values: ['Win 10/11 IoT, Ubuntu 20.04', 'Win 10/11 IoT, Ubuntu 20.04', 'Win 10/11 IoT, Ubuntu 20.04'] },
        ]},
        { group: 'I/O Interface', fields: [
          { label: 'LAN',     values: ['2x Intel GbE', '2x Intel GbE', '2x Intel GbE'] },
          { label: 'USB',     values: ['4x USB 3.2 + 2x USB 2.0', '4x USB 3.2 + 2x USB 2.0', '4x USB 3.2 + 2x USB 2.0'] },
          { label: 'Display', values: ['HDMI 2.0 + DP 1.4', 'HDMI 2.0 + DP 1.4', 'HDMI 2.0 + DP 1.4'] },
          { label: 'Serial',  values: ['2x RS-232/422/485', '2x RS-232/422/485', '2x RS-232/422/485'] },
          { label: 'Audio',   values: ['Line-out + Mic-in', 'Line-out + Mic-in', 'Line-out + Mic-in'] },
          { label: 'GPIO',    values: ['8-bit DIO', '8-bit DIO', '8-bit DIO'] },
        ]},
        { group: 'Power & Mechanical', fields: [
          { label: 'Power Input',    values: ['DC 9~36V, 60W', 'DC 9~36V, 60W', 'DC 9~36V, 60W'] },
          { label: 'Operating Temp', values: ['-20°C ~ 60°C', '-20°C ~ 60°C', '-20°C ~ 60°C'] },
          { label: 'Dimension',      values: ['146 x 101 mm', '146 x 101 mm', '146 x 101 mm'] },
          { label: 'Weight',         values: ['~400g', '~400g', '~400g'] },
        ]},
      ]
    },
    landings: {
      en: {
        features: 'Powered by Intel® 11th Gen Core™ Tiger Lake-E — exceptional performance\nWide-temp operation -20°C ~ 60°C for harsh industrial environments\nDual GbE (Intel i219LM + i210AT) with TSN support\nRich I/O: RS-232/422/485 x2, USB 3.2 x4, 8-bit GPIO\nSupports Windows 10/11 IoT Enterprise and Linux Ubuntu',
        seoTitle: 'EC70A-SU 3.5" SBC | Intel 11th Gen Tiger Lake-E | DFI',
        seoKeywords: 'EC70A-SU, 3.5 SBC, embedded computing, Tiger Lake-E, industrial SBC',
        seoDesc: 'The DFI EC70A-SU is a 3.5" SBC powered by Intel 11th Gen Core i7/i5/i3 Tiger Lake-E, featuring wide-temp support and rich I/O for industrial automation and AIoT applications.',
      },
      tw: {
        features: '搭載 Intel® 第 11 代 Core™ Tiger Lake-E 處理器，效能強勁\n寬溫運行 -20°C ~ 60°C，適應嚴苛工業環境\n雙 GbE 網路（Intel i219LM + i210AT），支援 TSN\n豐富 I/O：RS-232/422/485 x2、USB 3.2 x4、8-bit GPIO\n支援 Windows 10/11 IoT Enterprise 及 Linux Ubuntu',
        seoTitle: 'EC70A-SU 3.5" SBC | Intel 第 11 代 Tiger Lake-E | DFI',
        seoKeywords: 'EC70A-SU, 3.5 SBC, 嵌入式電腦, Tiger Lake-E, 工業用單板電腦',
        seoDesc: 'DFI EC70A-SU 是搭載 Intel 第 11 代 Core i7/i5/i3 Tiger Lake-E 的 3.5" 單板電腦，提供寬溫支援與豐富 I/O，適用於工業自動化與 AIoT 應用。',
      },
      cn: {
        features: '搭载 Intel® 第 11 代 Core™ Tiger Lake-E 处理器，性能卓越\n宽温运行 -20°C ~ 60°C，适应严苛工业环境\n双 GbE 网络（Intel i219LM + i210AT），支持 TSN\n丰富 I/O：RS-232/422/485 x2、USB 3.2 x4、8-bit GPIO\n支持 Windows 10/11 IoT Enterprise 及 Linux Ubuntu',
        seoTitle: 'EC70A-SU 3.5" SBC | 英特尔第 11 代 Tiger Lake-E | DFI',
        seoKeywords: 'EC70A-SU, 3.5 SBC, 嵌入式计算, Tiger Lake-E, 工业单板电脑',
        seoDesc: 'DFI EC70A-SU 是搭载英特尔第 11 代 Core i7/i5/i3 Tiger Lake-E 的 3.5" 单板电脑，提供宽温支持与丰富 I/O，适用于工业自动化与 AIoT 应用。',
      },
      jp: { features: '', seoTitle: '', seoKeywords: '', seoDesc: '' },
      de: { features: '', seoTitle: '', seoKeywords: '', seoDesc: '' },
    },
    relations: {
      derivatives: ['EC70A-BT'],
      accessories: ['EC551-CR'],
    },
  },

  categoryEdit: {
    type: 'sub',
    parentId: 'Industrial Motherboards',
    sort: 3,
    langStatuses: [
      { code: 'en', name: 'EN', status: 'synced',   lastSynced: '2026-04-10' },
      { code: 'tw', name: 'TW', status: 'draft',    lastSynced: null },
      { code: 'cn', name: 'CN', status: 'synced',   lastSynced: '2026-04-08' },
      { code: 'jp', name: 'JP', status: 'draft',    lastSynced: null },
      { code: 'de', name: 'DE', status: 'draft',    lastSynced: null, disabled: true },
    ],
    landings: {
      en: { name: '3.5" SBC', desc: 'Compact 3.5" single board computers for industrial and embedded applications.', image: null, seoSlug: '3-5-sbc', seoTitle: '3.5" SBC | Industrial Single Board Computers | DFI', seoDesc: 'Browse DFI\'s 3.5" SBC series — ruggedized single board computers for industrial automation, AIoT, and embedded computing applications.' },
      tw: { name: '3.5" 單板電腦', desc: '適用於工業與嵌入式應用的緊湊型 3.5" 單板電腦。', image: null, seoSlug: '3-5-sbc', seoTitle: '3.5" 單板電腦 | 工業用單板電腦 | DFI', seoDesc: '瀏覽 DFI 3.5" SBC 系列 — 專為工業自動化、AIoT 及嵌入式運算應用設計的耐用型單板電腦。' },
      cn: { name: '3.5" 单板电脑', desc: '适用于工业与嵌入式应用的紧凑型 3.5" 单板电脑。', image: null, seoSlug: '3-5-sbc', seoTitle: '3.5" 单板电脑 | 工业单板电脑 | DFI', seoDesc: '浏览 DFI 3.5" SBC 系列 — 专为工业自动化、AIoT 及嵌入式计算应用设计的耐用型单板电脑。' },
      jp: { name: '3.5" SBC', desc: '産業用および組み込みアプリケーション向けのコンパクトな 3.5" シングルボードコンピュータ。', image: null, seoSlug: '3-5-sbc', seoTitle: '3.5" SBC | 産業用シングルボードコンピュータ | DFI', seoDesc: '' },
      de: { name: '3,5" SBC', desc: 'Kompakte 3,5"-Einplatinencomputer für industrielle und eingebettete Anwendungen.', image: null, seoSlug: '3-5-sbc', seoTitle: '3,5" SBC | Industrie-Einplatinencomputer | DFI', seoDesc: '' },
    },
    featuredProducts: ['EC70A-SU', 'EC551-CR'],
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
    { user: 'Alan Chen',    module: '產品管理', page: '產品編輯',   action: 'UPDATE', target: 'EC70A-SU',             time: '2026-04-15 10:23' },
    { user: 'Lisa Wang',    module: '產品管理', page: '產品編輯',   action: 'UPDATE', target: 'EC70A-SU',             time: '2026-04-14 17:05' },
    { user: 'Kevin Lee',    module: '產品管理', page: '產品編輯',   action: 'UPDATE', target: 'EC551-CR',             time: '2026-04-14 15:40' },
    { user: 'Tina Huang',   module: '檔案管理', page: '檔案列表',   action: 'CREATE', target: 'EC70A-SU BIOS v1.3.2', time: '2026-04-12 11:18' },
    { user: 'Alan Chen',    module: '產品管理', page: '產品列表',   action: 'CREATE', target: 'EC70A-BT',             time: '2026-04-10 09:32' },
    { user: 'System Admin', module: '帳號管理', page: '使用者管理', action: 'UPDATE', target: 'Tina Huang',           time: '2026-04-08 14:50' },
  ],

  errorLogs: [
    { user: 'System',       module: '產品管理', source: 'Sync Job',    target: 'EC551-CR',            type: 'API 錯誤', msg: 'Failed to sync: upstream timeout (dfi.com /api/products)', time: '2026-04-15 06:01' },
    { user: 'Lisa Wang',    module: '產品管理', source: '產品編輯',    target: 'SD101-D26',           type: '驗證失敗', msg: '必填欄位缺失：Short Description（EN）',                    time: '2026-04-13 15:22' },
    { user: 'Kevin Lee',    module: '檔案管理', source: '檔案列表',    target: 'product-image.jpg',   type: '系統錯誤', msg: 'File upload failed: max size exceeded (52 MB > 50 MB)',    time: '2026-04-12 10:55' },
    { user: 'System',       module: '產品管理', source: 'Sync Job',    target: 'SD101-D26',           type: 'API 錯誤', msg: '官網 API timeout，retry 3 次後放棄',                       time: '2026-04-10 06:00' },
    { user: 'System Admin', module: '帳號管理', source: '使用者管理',  target: 'clin@dfi.com',        type: '驗證失敗', msg: '密碼格式不符規則，登入失敗',                               time: '2026-04-08 09:10' },
  ],
};

// ── HELPERS ──────────────────────────────────────────────────
function lifecycleBadge(lc) {
  if (lc === 'Active')  return `<span class="badge badge-success"><span class="badge-dot"></span>Active</span>`;
  if (lc === 'EOL')     return `<span class="badge badge-danger"><span class="badge-dot"></span>EOL</span>`;
  if (lc === 'Preview') return `<span class="badge badge-warning"><span class="badge-dot"></span>Preview</span>`;
  return `<span class="badge badge-neutral">${lc}</span>`;
}

function pubStatusBadge(s) {
  if (s === '草稿') return `<span class="badge badge-draft">草稿</span>`;
  if (s === '待發佈') return `<span class="badge badge-ready-publish">待發佈</span>`;
  if (s === '已發佈') return `<span class="badge badge-published">已發佈</span>`;
  if (s === '待更新') return `<span class="badge badge-ready-update">待更新</span>`;
  return `<span class="badge badge-neutral">${s}</span>`;
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

function errorTypeBadge(t) {
  if (t === 'API 錯誤')  return `<span class="badge badge-danger">API 錯誤</span>`;
  if (t === '驗證失敗')  return `<span class="badge badge-warning">驗證失敗</span>`;
  if (t === '系統錯誤')  return `<span class="badge badge-neutral">系統錯誤</span>`;
  return `<span class="badge badge-neutral">${t}</span>`;
}

function langDotsHtml(langs) {
  return Object.entries(langs).map(([lang, on]) =>
    `<span class="lang-dot ${on ? 'on' : 'off'}">${lang}</span>`
  ).join('');
}

function productLangStatusDots(langStatuses) {
  return (langStatuses || []).map(l => {
    const label = l.enabled ? '已啟用' : '未啟用';
    const cls   = l.enabled ? 'ldot-on' : 'ldot-off';
    return `<span class="ldot ${cls}" title="${l.name} — ${label}">${l.name}</span>`;
  }).join('');
}

function langPublishBadge(l) {
  if (l.status === 'synced')       return `<span class="badge badge-lang-synced">已發佈</span>`;
  if (l.status === 'sync_failed')  return `<span class="badge badge-lang-error" title="${l.syncError||'同步失敗'}">發佈失敗</span>`;
  if (l.status === 'pending')      return `<span class="badge badge-lang-pending">待發佈</span>`;
  if (l.status === 'needs_update') return `<span class="badge badge-lang-needs-update">待更新</span>`;
  return `<span class="badge badge-lang-draft">草稿</span>`;
}

// ── PRODUCT EDIT STATE ───────────────────────────────────────
let _prodPrimaryParent = '';   // 大分類（連動下拉第一層）
let _prodPrimarySub    = '';   // 次分類（連動下拉第二層，決定規格/篩選器）
let _prodSecondaryCats = [];   // 次要分類（樹狀多選，僅前台曝光）
let _prodFilters       = new Set();
let _prodRelations  = { derivatives: [], accessories: [] };
let _currentLang        = 'en';
let _pendingDisableLang = null;
let _prodReturnSection  = 'info'; // section to restore when navigating back to products-edit
let _dirtyLangs         = new Set(); // lang codes with unsaved changes in current session

// ── CATEGORY EDIT STATE ───────────────────────────────────────
let _catCurrentLang        = 'en';
let _catDirtyLangs         = new Set();
let _catPendingDisableLang = null;

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

function renderProductRows() {
  const tbody = document.querySelector('#view-products .table-wrap tbody');
  const info  = document.querySelector('#view-products .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.products.map(p => `
    <tr data-model="${p.model}">
      <td><strong>${p.model}</strong></td>
      <td>${p.mainCat}</td>
      <td>${p.subCat}</td>
      <td>${lifecycleBadge(p.lifecycle)}</td>
      <td><div class="lang-dots">${productLangStatusDots(p.langStatuses)}</div></td>
      <td>${editDeleteBtns('products-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.products.length} 筆`;
}

function initProductList() {
  renderProductRows();

  // 主分類 filter
  const mainSel = document.getElementById('filter-main-cat');
  const subSel  = document.getElementById('filter-sub-cat');
  if (mainSel && subSel) {
    mainSel.innerHTML = '<option value="">主分類</option>' +
      SAMPLE.mainCategories.map(c => `<option>${c}</option>`).join('');
    mainSel.addEventListener('change', function() {
      const subs = this.value ? (SAMPLE.subCategories[this.value] || []) : [];
      subSel.innerHTML = '<option value="">次分類</option>' +
        subs.map(s => `<option>${s}</option>`).join('');
      subSel.disabled = subs.length === 0;
    });
  }

}

/* ============================================================
   Sync Modal
   ============================================================ */
function openAddCatModal() {
  document.getElementById('add-cat-modal').style.display = 'flex';
}
function closeAddCatModal() {
  document.getElementById('add-cat-modal').style.display = 'none';
}

function openSyncModal() {
  const pending = SAMPLE.products.filter(p =>
    p.status === '待發佈' || p.status === '待更新'
  );

  const body    = document.getElementById('sync-modal-body');
  const countEl = document.getElementById('sync-modal-count');

  const selectAllRow = document.getElementById('sync-select-all-row');
  const selectAllCb  = document.getElementById('sync-select-all');

  if (pending.length === 0) {
    body.innerHTML = `<div class="modal-empty">目前沒有待同步的產品</div>`;
    if (countEl) countEl.textContent = '';
    if (selectAllRow) selectAllRow.style.display = 'none';
  } else {
    if (selectAllRow) selectAllRow.style.display = 'block';
    if (selectAllCb)  selectAllCb.checked = true;

    body.innerHTML = pending.map(p => `
      <label class="sync-row">
        <input type="checkbox" class="sync-check" data-model="${p.model}" checked />
        <span class="sync-row-model">${p.model}</span>
        <span class="sync-row-cat">${p.mainCat} / ${p.subCat}</span>
        ${pubStatusBadge(p.status)}
      </label>`).join('');
    updateSyncCount();

    body.querySelectorAll('.sync-check').forEach(cb => {
      cb.addEventListener('change', () => {
        const all     = body.querySelectorAll('.sync-check');
        const checked = body.querySelectorAll('.sync-check:checked');
        if (selectAllCb) {
          selectAllCb.checked       = checked.length === all.length;
          selectAllCb.indeterminate = checked.length > 0 && checked.length < all.length;
        }
        updateSyncCount();
      });
    });
  }

  document.getElementById('sync-modal').style.display = 'flex';
}

function toggleSyncSelectAll(cb) {
  document.querySelectorAll('#sync-modal-body .sync-check').forEach(c => {
    c.checked = cb.checked;
  });
  updateSyncCount();
}

function updateSyncCount() {
  const countEl = document.getElementById('sync-modal-count');
  const checked = document.querySelectorAll('#sync-modal-body .sync-check:checked');
  const total   = document.querySelectorAll('#sync-modal-body .sync-check');
  if (countEl) countEl.textContent = `已選 ${checked.length} / ${total.length} 筆`;
}

function closeSyncModal() {
  document.getElementById('sync-modal').style.display = 'none';
}

function handleSyncOverlayClick(e) {
  if (e.target === document.getElementById('sync-modal')) closeSyncModal();
}

function confirmSync() {
  const checked = document.querySelectorAll('#sync-modal-body .sync-check:checked');
  if (checked.length === 0) return;

  checked.forEach(cb => {
    const model = cb.dataset.model;
    const product = SAMPLE.products.find(p => p.model === model);
    if (product) product.status = '已發佈';
  });

  closeSyncModal();
  renderProductRows();
}

function initProductEdit() {
  _dirtyLangs = new Set();
  const d = SAMPLE.productEdit;

  // ── Page title: show model number ───────────────────────────
  const titleEl = document.getElementById('prod-edit-model-title');
  if (titleEl) titleEl.textContent = d.model;

  // ── Section switcher ────────────────────────────────────────
  function activateProdSection(sec) {
    document.querySelectorAll('#prod-section-switcher .section-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('#view-products-edit .section-panel').forEach(p => p.classList.remove('active'));
    const btn = document.querySelector(`#prod-section-switcher .section-btn[data-section="${sec}"]`);
    const panel = document.querySelector(`#view-products-edit .section-panel[data-section-panel="${sec}"]`);
    if (btn) btn.classList.add('active');
    if (panel) panel.classList.add('active');
  }
  document.querySelectorAll('#prod-section-switcher .section-btn').forEach(btn => {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = '1';
    btn.addEventListener('click', () => { _prodReturnSection = btn.dataset.section; activateProdSection(btn.dataset.section); });
  });
  activateProdSection(_prodReturnSection);
  _prodReturnSection = 'info'; // reset after use

  // ── Basic fields (型號, 生命週期) ───────────────────────────
  const basicPanel = document.querySelector('[data-tab-panel="prod-edit"][data-tab="basic"]');
  if (basicPanel) {
    const modelInp = basicPanel.querySelector('input.form-input');
    if (modelInp) modelInp.value = d.model;
    const lcSel = basicPanel.querySelector('select.form-input');
    if (lcSel) lcSel.value = d.lifecycle;
  }

  // ── Web content inline lang tabs ────────────────────────────
  renderWebContentTabs();

  // ── Classification: primary (cascading) + secondary (tree) ──
  _prodPrimaryParent = d.primaryParent || '';
  _prodPrimarySub    = d.primarySub    || '';
  _prodSecondaryCats = d.secondaryCats ? [...d.secondaryCats] : [];
  _prodFilters       = new Set(d.filters || []);
  renderPrimaryParentZone();
  renderPrimarySubZone();
  renderSecondaryZone();
  renderFilterZone();

  // ── Tags ────────────────────────────────────────────────────
  const tagsZone = document.getElementById('tags-zone');
  if (tagsZone) {
    tagsZone.innerHTML = d.tags.map(t =>
      `<span class="chip">${t}<em class="chip-remove" onclick="this.parentElement.remove()">×</em></span>`
    ).join('') + ' <button class="chip chip-add">＋ 新增</button>';
  }

  // Specs tab — SKU comparison table
  const specsPanel = document.querySelector('[data-tab-panel="prod-edit"][data-tab="specs"]');
  if (specsPanel) {
    // In-memory working copy of SKU spec data
    const skuData = JSON.parse(JSON.stringify(d.skuSpecs));

    function renderSkuSpecsTable() {
      const skus   = skuData.skus;
      const groups = skuData.groups;
      const canAdd = skus.length < 4;
      const colCount = skus.length + 1; // label col + SKU cols

      // thead: label th + one th per SKU (no add column inside table)
      const skuHeaders = skus.map((sku, si) => `
        <th class="sku-data-col sku-header-cell">
          ${skus.length > 1 ? `<button class="sku-col-delete" onclick="deleteSku(${si})" title="移除此 SKU">×</button>` : ''}
          <input class="sku-header-pn" type="text" value="${sku.pn}"
            oninput="skuData.skus[${si}].pn=this.value" />
        </th>`).join('');

      // tbody: group rows + field rows
      const bodyRows = groups.map((grp, gi) => {
        const groupRow = `<tr class="sku-group-row"><td colspan="${colCount}">${grp.group}</td></tr>`;
        const fieldRows = grp.fields.map((f, fi) => {
          const cells = skus.map((_, si) => {
            const val = (f.values && f.values[si] != null) ? f.values[si] : '';
            return `<td><input class="spec-cell-input" type="text" value="${val.replace(/"/g, '&quot;')}"
              oninput="skuData.groups[${gi}].fields[${fi}].values[${si}]=this.value" /></td>`;
          }).join('');
          return `<tr><td class="sku-label-cell">${f.label}</td>${cells}</tr>`;
        }).join('');
        return groupRow + fieldRows;
      }).join('');

      specsPanel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
          <div style="display:flex;gap:8px">
            <button class="btn btn-secondary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Excel 批次匯入
            </button>
            <button class="btn btn-secondary">技術文件上傳</button>
          </div>
          ${canAdd ? `<button class="btn btn-primary" onclick="addSku()">＋ 新增 SKU</button>` : ''}
        </div>
        <div class="sku-compare-wrap">
          <table class="sku-compare-table">
            <thead>
              <tr>
                <th class="sku-label-col" style="padding:10px 10px;font-size:12px;color:var(--text-2);font-weight:600">規格項目</th>
                ${skuHeaders}
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>`;

      // Re-expose helpers on window so inline onclick can reach them
      window.skuData    = skuData;
      window.addSku     = addSku;
      window.deleteSku  = deleteSku;
    }

    function addSku() {
      if (skuData.skus.length >= 4) return;
      skuData.skus.push({ pn: '', desc: '' });
      skuData.groups.forEach(g => g.fields.forEach(f => {
        if (!f.values) f.values = [];
        f.values.push('');
      }));
      renderSkuSpecsTable();
    }

    function deleteSku(idx) {
      if (skuData.skus.length <= 1) return;
      skuData.skus.splice(idx, 1);
      skuData.groups.forEach(g => g.fields.forEach(f => {
        if (f.values) f.values.splice(idx, 1);
      }));
      renderSkuSpecsTable();
    }

    renderSkuSpecsTable();
  }

  // Ordering tab
  renderOrderingTable();

  // Relations
  _prodRelations = JSON.parse(JSON.stringify(d.relations));
  renderRelations();
}

// ── PRODUCT EDIT HELPERS ─────────────────────────────────────

/* ── Ordering ────────────────────────────────────────────────── */
const BASE_ORDERING_COLS = [
  { key: 'modelName',    label: 'Model Name',    width: '140px' },
  { key: 'pn',          label: 'P/N',            width: '160px' },
  { key: 'processor',   label: 'Processor',      width: '220px' },
  { key: 'memory',      label: 'Memory',         width: '160px' },
  { key: 'thermal',     label: 'Thermal',        width: '100px' },
  { key: 'operatingTemp', label: 'Operating Temp', width: '130px' },
];

// ── Edit Columns panel state ──────────────────────────────────
let _ecWorkingState = null;
let _ecDragKey = null;
const _BASE_KEYS = () => BASE_ORDERING_COLS.map(c => c.key);

function openEditColumnsPanel() {
  const ord = SAMPLE.productEdit.ordering;
  _ecWorkingState = {
    dynamicCols: ord.dynamicCols.map(c => ({ ...c })),
    visibleColKeys: [...(ord.visibleColKeys || [..._BASE_KEYS(), ...ord.dynamicCols.map(c => c.key)])],
  };
  renderEditColumnsPanel();
  document.getElementById('edit-columns-modal').style.display = 'flex';
}

function cancelEditColumns() {
  _ecWorkingState = null;
  document.getElementById('edit-columns-modal').style.display = 'none';
}

function applyEditColumns() {
  const ord = SAMPLE.productEdit.ordering;
  ord.dynamicCols = _ecWorkingState.dynamicCols;
  ord.visibleColKeys = _ecWorkingState.visibleColKeys;
  _ecWorkingState = null;
  document.getElementById('edit-columns-modal').style.display = 'none';
  renderOrderingTable();
}

function renderEditColumnsPanel() {
  if (!_ecWorkingState) return;
  const { dynamicCols, visibleColKeys } = _ecWorkingState;
  const baseKeys = _BASE_KEYS();

  // ── Left panel ────────────────────────────────────────────────
  const leftEl = document.getElementById('ec-available-list');
  if (leftEl) {
    const fixedHtml = `
      <div class="ec-section-label">固定欄位</div>
      ${BASE_ORDERING_COLS.map(c => `
        <div class="ec-col-item ec-col-fixed">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:var(--text-3)"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span class="ec-col-name">${c.label}</span>
        </div>`).join('')}`;

    const portHtml = `
      <div class="ec-section-label" style="margin-top:12px">Port 欄位</div>
      ${dynamicCols.length === 0
        ? `<div class="ec-list-empty">尚無 Port 欄位，點擊「新增 Port 欄位」建立</div>`
        : dynamicCols.map(c => {
            const isVisible = visibleColKeys.includes(c.key);
            return `
              <div class="ec-col-item ec-col-port">
                <span class="ec-col-name">${c.label}</span>
                <div class="ec-col-actions">
                  ${isVisible
                    ? `<span class="ec-col-badge-on">顯示中</span>`
                    : `<button class="ec-col-add-btn" onclick="ecAddPortToVisible('${c.key}')">+ 加入</button>`}
                  <button class="ec-col-del-btn" onclick="ecDeletePortSchema('${c.key}')" title="從 schema 中移除">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                  </button>
                </div>
              </div>`;
          }).join('')}`;

    leftEl.innerHTML = fixedHtml + portHtml;
  }

  // ── Right panel ───────────────────────────────────────────────
  const rightEl = document.getElementById('ec-selected-list');
  if (rightEl) {
    const allColDefs = [...BASE_ORDERING_COLS, ...dynamicCols];
    const visibleCols = visibleColKeys.map(k => allColDefs.find(c => c.key === k)).filter(Boolean);
    rightEl.innerHTML = visibleCols.map(c => {
      const isFixed = baseKeys.includes(c.key);
      return `
        <div class="ec-sel-item${isFixed ? ' ec-sel-fixed' : ''}" draggable="true" data-key="${c.key}">
          <span class="ec-sel-drag">
            <svg width="10" height="14" viewBox="0 0 10 16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="3" cy="3" r=".8" fill="currentColor" stroke="none"/><circle cx="7" cy="3" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="7" cy="8" r=".8" fill="currentColor" stroke="none"/><circle cx="3" cy="13" r=".8" fill="currentColor" stroke="none"/><circle cx="7" cy="13" r=".8" fill="currentColor" stroke="none"/></svg>
          </span>
          <span class="ec-sel-name">${c.label}</span>
          ${isFixed
            ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="ec-sel-lock"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`
            : `<button class="ec-sel-remove" onclick="ecRemovePortFromVisible('${c.key}')" title="從顯示欄移除">×</button>`}
        </div>`;
    }).join('');
    setupEcRightDnD();
  }
}

function setupEcRightDnD() {
  const container = document.getElementById('ec-selected-list');
  if (!container) return;
  container.querySelectorAll('.ec-sel-item').forEach(item => {
    item.addEventListener('dragstart', e => {
      _ecDragKey = item.dataset.key;
      item.classList.add('ec-sel-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      _ecDragKey = null;
      item.classList.remove('ec-sel-dragging');
      container.querySelectorAll('.ec-sel-item').forEach(t => t.classList.remove('ec-sel-drag-over'));
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      container.querySelectorAll('.ec-sel-item').forEach(t => t.classList.remove('ec-sel-drag-over'));
      if (item.dataset.key !== _ecDragKey) item.classList.add('ec-sel-drag-over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('ec-sel-drag-over'));
    item.addEventListener('drop', e => {
      e.preventDefault();
      const targetKey = item.dataset.key;
      if (!_ecDragKey || _ecDragKey === targetKey) return;
      const vk = _ecWorkingState.visibleColKeys;
      const fromIdx = vk.indexOf(_ecDragKey);
      const toIdx = vk.indexOf(targetKey);
      if (fromIdx === -1 || toIdx === -1) return;
      const [moved] = vk.splice(fromIdx, 1);
      vk.splice(toIdx, 0, moved);
      _ecDragKey = null;
      renderEditColumnsPanel();
    });
  });
}

function ecAddPortToVisible(key) {
  if (!_ecWorkingState.visibleColKeys.includes(key)) {
    _ecWorkingState.visibleColKeys.push(key);
    renderEditColumnsPanel();
  }
}

function ecRemovePortFromVisible(key) {
  if (_BASE_KEYS().includes(key)) return;
  _ecWorkingState.visibleColKeys = _ecWorkingState.visibleColKeys.filter(k => k !== key);
  renderEditColumnsPanel();
}

function ecDeletePortSchema(key) {
  if (_BASE_KEYS().includes(key)) return;
  _ecWorkingState.dynamicCols = _ecWorkingState.dynamicCols.filter(c => c.key !== key);
  _ecWorkingState.visibleColKeys = _ecWorkingState.visibleColKeys.filter(k => k !== key);
  renderEditColumnsPanel();
}

// ── Add Port field modal ──────────────────────────────────────
function openAddPortModal() {
  document.getElementById('add-port-name').value = '';
  document.getElementById('add-port-type').value = 'number';
  document.getElementById('add-port-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('add-port-name').focus(), 50);
}

function closeAddPortModal() {
  document.getElementById('add-port-modal').style.display = 'none';
}

function confirmAddPort() {
  const label = document.getElementById('add-port-name').value.trim();
  if (!label) return;
  const key = label.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
  if (!key) return;
  if (_ecWorkingState.dynamicCols.some(c => c.key === key)) return;
  _ecWorkingState.dynamicCols.push({ key, label });
  _ecWorkingState.visibleColKeys.push(key);
  SAMPLE.productEdit.ordering.rows.forEach(r => { r[key] = ''; });
  closeAddPortModal();
  renderEditColumnsPanel();
}

// ── Ordering table render ─────────────────────────────────────
function renderOrderingTable() {
  const tbl = document.getElementById('ordering-table');
  if (!tbl) return;
  const { dynamicCols, visibleColKeys, rows } = SAMPLE.productEdit.ordering;
  const allColDefs = [...BASE_ORDERING_COLS, ...(dynamicCols || [])];
  const keys = visibleColKeys || allColDefs.map(c => c.key);
  const visibleCols = keys.map(k => allColDefs.find(c => c.key === k)).filter(Boolean);
  const baseKeys = _BASE_KEYS();

  tbl.querySelector('thead tr').innerHTML =
    visibleCols.map(c => `<th>${c.label}</th>`).join('') +
    '<th style="width:60px">操作</th>';

  const tbody = tbl.querySelector('tbody');
  const colCount = visibleCols.length + 1;
  if (!rows || rows.length === 0) {
    tbody.innerHTML = `<tr><td colspan="${colCount}">
      <div class="empty-state" style="padding:32px"><div class="empty-state-text">尚無訂購資訊，點擊「新增 P/N」開始建立</div></div>
    </td></tr>`;
    return;
  }
  tbody.innerHTML = rows.map((r, i) =>
    `<tr>
      ${visibleCols.map(c => {
        const isBase = baseKeys.includes(c.key);
        return `<td><input class="form-input" type="text" value="${r[c.key] !== undefined ? r[c.key] : ''}" style="min-width:${c.width || '90px'}${isBase ? '' : ';text-align:center'}" /></td>`;
      }).join('')}
      <td><div class="col-actions"><button class="btn btn-sm btn-danger" onclick="removeOrderingRow(${i})">刪除</button></div></td>
    </tr>`
  ).join('');
}

function addOrderingRow() {
  const ord = SAMPLE.productEdit.ordering;
  const row = { modelName: SAMPLE.productEdit.model, pn: '', processor: '', memory: '', thermal: '', operatingTemp: '' };
  ord.dynamicCols.forEach(c => { row[c.key] = ''; });
  ord.rows.push(row);
  renderOrderingTable();
}

function removeOrderingRow(index) {
  SAMPLE.productEdit.ordering.rows.splice(index, 1);
  renderOrderingTable();
}

/* ── Relations ───────────────────────────────────────────────── */
function renderRelations() {
  const renderList = (containerId, items, type) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    if (items.length === 0) {
      el.innerHTML = `<div class="empty-state" style="padding:24px"><div class="empty-state-text">${type === 'derivatives' ? '尚無衍生產品' : '尚無配件'}</div></div>`;
    } else {
      el.innerHTML = items.map((model, idx) => {
        const prod = SAMPLE.products.find(p => p.model === model);
        const meta = prod ? `<span style="color:var(--text-3);font-size:11px;margin-left:6px">${prod.mainCat} / ${prod.subCat}</span>` : '';
        return `<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border)">
          <strong style="flex:1;font-size:13px">${model}${meta}</strong>
          <button class="btn btn-sm btn-danger" onclick="removeRelation('${type}',${idx})">移除</button>
        </div>`;
      }).join('');
    }
  };
  renderList('rel-derivatives-body', _prodRelations.derivatives, 'derivatives');
  renderList('rel-accessories-body', _prodRelations.accessories, 'accessories');
}

function removeRelation(type, idx) {
  _prodRelations[type].splice(idx, 1);
  renderRelations();
}

function openAddRelationModal(type) {
  const modal  = document.getElementById('add-relation-modal');
  const title  = document.getElementById('add-relation-modal-title');
  const search = document.getElementById('add-relation-modal-search');
  if (!modal) return;
  title.textContent = type === 'derivatives' ? '新增衍生產品' : '新增配件';
  modal.dataset.relType = type;
  search.value = '';
  renderRelationPickerList(type, '');
  search.oninput = () => renderRelationPickerList(type, search.value.trim().toLowerCase());
  modal.style.display = 'flex';
}

function renderRelationPickerList(type, query) {
  const list = document.getElementById('add-relation-modal-list');
  if (!list) return;
  const currentModel = SAMPLE.productEdit.model;
  const already = new Set(_prodRelations[type]);
  const filtered = SAMPLE.products.filter(p => {
    if (p.model === currentModel) return false;
    if (query && !p.model.toLowerCase().includes(query) &&
        !p.mainCat.toLowerCase().includes(query) &&
        !p.subCat.toLowerCase().includes(query)) return false;
    return true;
  });
  if (filtered.length === 0) {
    list.innerHTML = `<div class="modal-empty">沒有符合的產品</div>`;
    return;
  }
  list.innerHTML = filtered.map(p => {
    const added = already.has(p.model);
    return `<div class="rel-picker-row${added ? ' rel-picker-row-added' : ''}">
      <div>
        <div style="font-weight:600;font-size:13px">${p.model}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:2px">${p.mainCat} / ${p.subCat} · ${p.lifecycle}</div>
      </div>
      ${added
        ? `<span style="font-size:12px;color:var(--text-3)">已新增</span>`
        : `<button class="btn btn-sm btn-primary" onclick="confirmAddRelation('${p.model}')">新增</button>`
      }
    </div>`;
  }).join('');
}

function confirmAddRelation(model) {
  const modal = document.getElementById('add-relation-modal');
  const type  = modal.dataset.relType;
  if (!_prodRelations[type].includes(model)) {
    _prodRelations[type].push(model);
    renderRelations();
    const search = document.getElementById('add-relation-modal-search');
    renderRelationPickerList(type, search ? search.value.trim().toLowerCase() : '');
  }
}

function closeAddRelationModal() {
  document.getElementById('add-relation-modal').style.display = 'none';
}

/* Render compact language status pills in the header bar */
/* ── Web content: inline language tabs ─────────────────────── */

function renderWebContentTabs() {
  const langs = SAMPLE.productEdit.langStatuses || [];

  // Ensure _currentLang is a valid enabled lang
  const firstEnabled = langs.find(l => !l.disabled);
  if (firstEnabled && !langs.find(l => l.code === _currentLang && !l.disabled)) {
    _currentLang = firstEnabled.code;
  }

  // Tab bar
  const tabsBar = document.getElementById('lang-tabs-bar');
  if (tabsBar) {
    const btnHtml = langs.map(l => {
      const isActive = l.code === _currentLang && !l.disabled;
      const isOff    = l.disabled === true;
      const isDirty  = _dirtyLangs.has(l.code);
      const dotClass = isOff                   ? 'dot-disabled' :
        l.status === 'synced'                  ? 'dot-synced'   :
        l.status === 'sync_failed'             ? 'dot-error'    :
        (l.status === 'pending' || l.status === 'needs_update')
                                               ? 'dot-pending'  : 'dot-draft';
      return `<button class="tab-btn${isActive?' active':''}${isOff?' tab-btn-lang-off':''}${isDirty?' tab-btn-dirty':''}"
        data-lang="${l.code}" onclick="switchLangTab('${l.code}')"
        ${isOff?'title="此語系已停用"':''}>${l.name}<span class="lang-tab-dot ${dotClass}"></span></button>`;
    }).join('');
    tabsBar.innerHTML = btnHtml +
      `<button class="btn btn-sm btn-secondary lang-tabs-copy-btn" onclick="openLangSyncModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        複製語系內容</button>`;
  }

  // Tab panels
  const panelsEl = document.getElementById('lang-tab-panels');
  if (!panelsEl) return;

  panelsEl.innerHTML = langs.map(l => {
    const isActive = l.code === _currentLang && !l.disabled;
    const isOff    = l.disabled === true;

    if (isOff) {
      return `<div class="tab-panel lang-tab-panel${isActive?' active':''}" data-lang-panel="${l.code}">
        <div class="lang-tab-disabled-state">
          <svg class="lang-tab-disabled-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <div class="lang-tab-disabled-title">${l.name} 語系已停用</div>
          <div class="lang-tab-disabled-desc">停用後此語系頁面不對外顯示。啟用後即可開始編輯內容。</div>
          <button class="btn btn-primary" onclick="enableLang('${l.code}')">啟用語系</button>
        </div>
      </div>`;
    }

    const content  = (SAMPLE.productEdit.landings || {})[l.code] || {};
    const isDirty  = _dirtyLangs.has(l.code);
    const isFailed = l.status === 'sync_failed';

    // 儲存草稿 + 發佈：有異動才 enable；重試發佈永遠 enable
    const saveBtn = `<button class="btn btn-sm btn-secondary lang-dirty-btn"
      onclick="saveLangDraftInline('${l.code}')"${isDirty?'':' disabled'}>儲存草稿</button>`;
    const publishDisabled = !isFailed && l.status === 'synced' && !isDirty;
    const publishBtn = isFailed
      ? `<button class="btn btn-sm btn-primary" style="background:#DC2626;border-color:#DC2626"
          onclick="retrySync('${l.code}')">重試發佈</button>`
      : `<button class="btn btn-sm btn-primary lang-dirty-btn"
          onclick="publishLang('${l.code}')"${publishDisabled?' disabled':''}>發佈</button>`;

    const syncDateTxt   = l.lastSynced ? '最後發佈：' + l.lastSynced : '尚未發佈';
    const syncDateStyle = isFailed ? ' style="color:#DC2626"' : '';
    const syncExtra     = isFailed ? `（${l.syncError || '發佈失敗'}）` : '';

    const iconRowsHtml = (l.code === 'en') ? [
      { title: 'High Performance', desc: 'Powered by latest Intel processors' },
      { title: 'Wide Temperature', desc: '-20°C ~ 60°C operation range' },
    ].map(r => _iconRowHtml(r.title, r.desc)).join('') : '';

    const featuresEsc = (content.features || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

    return `<div class="tab-panel lang-tab-panel${isActive?' active':''}" data-lang-panel="${l.code}">
      <div class="lang-tab-hd">
        <div class="lang-tab-hd-left">
          ${langPublishBadge(l)}
          <span class="lang-tab-sync-date"${syncDateStyle}>${syncDateTxt}${syncExtra}</span>
        </div>
        <div class="lang-tab-hd-right">
          ${saveBtn}
          ${publishBtn}
          <div class="more-menu">
            <button class="btn-icon" onclick="toggleLangTabMenu(event,'${l.code}')" title="更多">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div class="more-menu-dropdown" id="lang-tab-menu-${l.code}">
              <button class="more-menu-item" onclick="openLangCopyToModal('${l.code}');closeLangTabMenu('${l.code}')">複製到此語系</button>
              <button class="more-menu-item danger" onclick="openLangDisableModal('${l.code}');closeLangTabMenu('${l.code}')">停用此語系</button>
            </div>
          </div>
        </div>
      </div>
      <div class="lang-edit-body">
        <div class="form-group" style="margin-bottom:20px">
          <label class="form-label">產品特色（條列）<span class="form-label-hint">每行一條</span></label>
          <textarea class="form-input" rows="5" placeholder="每行一條特色描述...">${featuresEsc}</textarea>
        </div>
        <div class="form-group" style="margin-bottom:0">
          <label class="form-label">Overview 內容</label>
          <div class="richtext-placeholder">富文字編輯器</div>
        </div>
        <div class="divider" style="margin:24px 0"></div>
        <div style="margin-bottom:24px">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
            <span class="form-label" style="margin:0">產品 ICON 群組</span>
            <button class="btn btn-sm btn-primary" onclick="addIconRow(this)">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              新增一組 ICON
            </button>
          </div>
          <div class="icon-table">
            <div class="icon-table-head"><div></div><div>ICON 圖片</div><div>Title</div><div>Description</div><div></div></div>
            <div class="icon-rows">${iconRowsHtml}</div>
          </div>
        </div>
        <div class="divider" style="margin:24px 0"></div>
        <div>
          <div class="form-label" style="margin-bottom:16px">SEO 與自訂代碼</div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Slug <span class="form-label-hint">URL 自定義名稱</span></label>
              <input class="form-input" type="text" placeholder="例：model-xyz" value="${content.seoSlug||''}" />
            </div>
            <div class="form-group">
              <label class="form-label">Author</label>
              <input class="form-input" type="text" placeholder="例：DFI Inc." value="${content.seoAuthor||'DFI Inc.'}" />
            </div>
            <div class="form-group form-full">
              <label class="form-label">Meta Title</label>
              <input class="form-input" type="text" placeholder="例：Model XYZ Industrial Motherboard | DFI" value="${(content.seoTitle||'').replace(/"/g,'&quot;')}" />
            </div>
            <div class="form-group form-full">
              <label class="form-label">Meta Keywords</label>
              <input class="form-input" type="text" placeholder="例：Industrial Motherboard, Mini-ITX, IoT" value="${(content.seoKeywords||'').replace(/"/g,'&quot;')}" />
            </div>
            <div class="form-group form-full">
              <label class="form-label">Meta Description</label>
              <textarea class="form-input" rows="3" placeholder="Discover DFI Model XYZ...">${(content.seoDesc||'').replace(/</g,'&lt;')}</textarea>
            </div>
            <div class="form-group form-full">
              <label class="form-label">Custom HTML / Code <span class="form-label-hint">供嵌入追蹤碼或特殊 HTML 語法</span></label>
              <textarea class="form-input" rows="4" style="font-family:monospace;font-size:12px" placeholder="<!-- 例：Google Tag Manager, HubSpot tracking code -->"></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  // Attach dirty-detection listener once (delegation survives innerHTML replacement)
  if (!panelsEl._dirtyListenerAttached) {
    panelsEl.addEventListener('input', _onLangPanelInput);
    panelsEl._dirtyListenerAttached = true;
  }
}

function _iconRowHtml(title, desc) {
  return `<div class="icon-row">
    <div class="icon-row-drag" title="拖曳排序">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="18" x2="16" y2="18"/></svg>
    </div>
    <div class="icon-row-img">
      <div class="upload-zone" style="padding:12px;min-height:unset;width:80px;height:80px;flex-direction:column;gap:4px">
        <div style="font-size:18px">🔲</div><span style="font-size:10px">上傳</span>
      </div>
    </div>
    <div class="icon-row-fields">
      <input class="form-input" type="text" placeholder="Title" value="${(title||'').replace(/"/g,'&quot;')}" style="margin-bottom:6px" />
      <textarea class="form-input" rows="2" placeholder="Description" style="resize:none">${(desc||'').replace(/</g,'&lt;')}</textarea>
    </div>
    <button class="btn-icon" onclick="this.closest('.icon-row').remove()" title="刪除">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
    </button>
  </div>`;
}

/* Switch active language tab */
function switchLangTab(code) {
  _currentLang = code;
  document.querySelectorAll('#lang-tabs-bar .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.lang-tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.querySelector(`#lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  const panel = document.querySelector(`.lang-tab-panel[data-lang-panel="${code}"]`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

/* Dirty detection: called by event delegation on #lang-tab-panels */
function _onLangPanelInput(e) {
  const panel = e.target.closest('.lang-tab-panel');
  if (!panel || !panel.dataset.langPanel) return;
  _markLangDirty(panel.dataset.langPanel);
}

function _markLangDirty(code) {
  _dirtyLangs.add(code);
  // Enable dirty-aware buttons in this panel without full re-render
  const panel = document.querySelector(`.lang-tab-panel[data-lang-panel="${code}"]`);
  if (panel) panel.querySelectorAll('.lang-dirty-btn').forEach(b => { b.disabled = false; });
  // Add dirty indicator to tab button
  const tabBtn = document.querySelector(`#lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.add('tab-btn-dirty');
}

/* Save draft: clear dirty, disable save, keep publish enabled (status stays draft) */
function saveLangDraftInline(code) {
  _dirtyLangs.delete(code);
  const panel  = document.querySelector(`.lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    // Disable only save; publish stays enabled (there's unsaved draft content)
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

/* Publish: set synced, clear dirty, re-render */
function publishLang(code) {
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-17'; }
  _dirtyLangs.delete(code);
  renderWebContentTabs();
  switchLangTab(code);
}

/* Enable a disabled language → draft */
function enableLang(code) {
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _currentLang = code;
  renderWebContentTabs();
}

/* Open disable confirmation modal */
function openLangDisableModal(code) {
  _pendingDisableLang = code;
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('lang-disable-modal').style.display = 'flex';
}

/* Confirm disable */
function confirmDisableLang() {
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === _pendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('lang-disable-modal').style.display = 'none';
  _pendingDisableLang = null;
  // Switch to first enabled lang before re-render
  const firstEnabled = (SAMPLE.productEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _currentLang = firstEnabled.code;
  renderWebContentTabs();
}

/* Retry a failed sync */
function retrySync(code) { publishLang(code); }

/* More menu for inline lang tabs */
function toggleLangTabMenu(e, code) {
  e.stopPropagation();
  document.querySelectorAll('.lang-tab-panel .more-menu-dropdown').forEach(d => {
    if (d.id !== `lang-tab-menu-${code}`) d.classList.remove('open');
  });
  document.getElementById(`lang-tab-menu-${code}`).classList.toggle('open');
}
function closeLangTabMenu(code) {
  const dd = document.getElementById(`lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

/* Open copy-to modal: select source → targets */
function openLangSyncModal() {
  _renderLangCopyModal(null);
  document.getElementById('lang-copy-modal').style.display = 'flex';
}

/* Open copy-to modal pre-filling the target language */
function openLangCopyToModal(targetCode) {
  _renderLangCopyModal(targetCode);
  document.getElementById('lang-copy-modal').style.display = 'flex';
}

function _renderLangCopyModal(preselectedTarget) {
  const langs = (SAMPLE.productEdit.langStatuses || []).filter(l => !l.disabled);
  const sourceEl = document.getElementById('lang-copy-source');
  const targetEl = document.getElementById('lang-copy-targets');
  if (!sourceEl || !targetEl) return;

  // Source radios — default to first pending/synced lang or _currentLang
  const defaultSrc = langs.find(l => l.code === _currentLang) ? _currentLang :
    (langs.find(l => l.status === 'synced' || l.status === 'pending') || langs[0] || {}).code;
  sourceEl.innerHTML = langs.map(l =>
    `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-bottom:6px">
      <input type="radio" name="lang-copy-src" value="${l.code}" ${l.code === defaultSrc ? 'checked' : ''} onchange="_refreshLangCopyTargets(null)">
      <span class="lang-pill ${l.status==='synced'?'pill-synced':l.status==='pending'?'pill-pending':'pill-draft'}" style="pointer-events:none">${l.name}</span>
    </label>`
  ).join('');

  _refreshLangCopyTargets(preselectedTarget);
}

function _refreshLangCopyTargets(preselectedTarget) {
  const langs    = (SAMPLE.productEdit.langStatuses || []).filter(l => !l.disabled);
  const srcRadio = document.querySelector('input[name="lang-copy-src"]:checked');
  const srcCode  = srcRadio ? srcRadio.value : null;
  const targetEl = document.getElementById('lang-copy-targets');
  if (!targetEl) return;

  const targets = langs.filter(l => l.code !== srcCode);
  targetEl.innerHTML = targets.length === 0
    ? '<span style="color:var(--text-3);font-size:13px">沒有可用的目標語系</span>'
    : targets.map(l =>
        `<label style="display:flex;align-items:center;gap:6px;cursor:pointer;margin-bottom:6px">
          <input type="checkbox" value="${l.code}" ${preselectedTarget === l.code ? 'checked' : ''}>
          <span class="lang-pill ${l.status==='synced'?'pill-synced':l.status==='pending'?'pill-pending':'pill-draft'}" style="pointer-events:none">${l.name}</span>
        </label>`
      ).join('');
}

/* Execute content copy */
function confirmLangCopy() {
  const srcCode = (document.querySelector('input[name="lang-copy-src"]:checked') || {}).value;
  if (!srcCode) return;
  const srcContent = (SAMPLE.productEdit.landings || {})[srcCode] || {};
  const targets = [...document.querySelectorAll('#lang-copy-targets input[type=checkbox]:checked')]
    .map(cb => cb.value);
  targets.forEach(code => {
    SAMPLE.productEdit.landings = SAMPLE.productEdit.landings || {};
    SAMPLE.productEdit.landings[code] = { ...srcContent };
    const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
    if (lang) lang.status = 'pending';
    _dirtyLangs.add(code);
  });
  document.getElementById('lang-copy-modal').style.display = 'none';
  renderWebContentTabs();
}

/* Add a new blank ICON row to the active lang panel */
function addIconRow(triggerBtn) {
  const panel = triggerBtn ? triggerBtn.closest('.lang-tab-panel') : null;
  const container = panel ? panel.querySelector('.icon-rows') : document.querySelector('.lang-tab-panel.active .icon-rows');
  if (!container) return;
  container.insertAdjacentHTML('beforeend', _iconRowHtml('', ''));
}

/* Zone 1: 大分類 dropdown */
function renderPrimaryParentZone() {
  const el = document.getElementById('primary-parent-body');
  if (!el) return;

  const options = SAMPLE.mainCategories.map(c =>
    `<option value="${c.replace(/"/g,'&quot;')}" ${c === _prodPrimaryParent ? 'selected' : ''}>${c}</option>`
  ).join('');

  el.innerHTML = `
    <select class="form-input zone-select" onchange="onPrimaryParentChanged(this.value)">
      <option value="">請選擇大分類</option>
      ${options}
    </select>`;
}

/* Zone 2: 次分類 dropdown（只在大分類選完後啟用） */
function renderPrimarySubZone() {
  const el = document.getElementById('primary-sub-body');
  if (!el) return;

  if (!_prodPrimaryParent) {
    el.innerHTML = `<div class="filter-zone-empty">請先選擇大分類</div>`;
    return;
  }

  const subCats = SAMPLE.subCategories[_prodPrimaryParent] || [];
  const options = subCats.map(c =>
    `<option value="${c.replace(/"/g,'&quot;')}" ${c === _prodPrimarySub ? 'selected' : ''}>${c}</option>`
  ).join('');

  el.innerHTML = `
    <select class="form-input zone-select" onchange="onPrimarySubChanged(this.value)">
      <option value="">請選擇次分類</option>
      ${options}
    </select>`;
}

/* 大分類 changed → reset 次分類 + filters，重新 render 兩個 zone */
function onPrimaryParentChanged(parent) {
  _prodPrimaryParent = parent;
  _prodPrimarySub    = '';
  _prodFilters       = new Set();
  renderPrimaryParentZone();
  renderPrimarySubZone();
  renderFilterZone();
}

/* 次分類 changed → reset filters，重新 render 次分類 zone + filter zone */
function onPrimarySubChanged(sub) {
  _prodPrimarySub = sub;
  _prodFilters    = new Set();
  renderPrimarySubZone();
  renderFilterZone();
}

/* Render secondary categories — tree picker of ALL categories (independent of primary) */
function renderSecondaryZone() {
  const el = document.getElementById('secondary-cat-body');
  if (!el) return;

  const tree = buildCatTree(SAMPLE.categories);

  el.innerHTML = tree.map(parent => {
    const parentChecked = _prodSecondaryCats.includes(parent.name);
    const parentHtml = `<label class="sec-cat-item sec-cat-parent ${parentChecked ? 'checked' : ''}" data-cat="${parent.name.replace(/"/g,'&quot;')}">
      <input type="checkbox" ${parentChecked ? 'checked' : ''} />
      ${parent.name}
    </label>`;
    const childrenHtml = parent.children.map(child => {
      const childChecked = _prodSecondaryCats.includes(child.name);
      return `<label class="sec-cat-item sec-cat-child ${childChecked ? 'checked' : ''}" data-cat="${child.name.replace(/"/g,'&quot;')}">
        <input type="checkbox" ${childChecked ? 'checked' : ''} />
        ${child.name}
      </label>`;
    }).join('');
    return `<div class="sec-cat-parent-node">${parentHtml}${childrenHtml}</div>`;
  }).join('');

  el.querySelectorAll('.sec-cat-item input[type=checkbox]').forEach(cb => {
    const item = cb.closest('.sec-cat-item');
    cb.addEventListener('change', () => onSecondaryToggled(item.dataset.cat, cb.checked));
  });

  // 設定大分類 checkbox 的 indeterminate 狀態（部分子節點被勾選時）
  el.querySelectorAll('.sec-cat-parent input[type=checkbox]').forEach(cb => {
    const item = cb.closest('.sec-cat-item');
    const node = tree.find(p => p.name === item.dataset.cat);
    if (!node || node.children.length === 0) return;
    const checkedCount = node.children.filter(c => _prodSecondaryCats.includes(c.name)).length;
    cb.indeterminate = checkedCount > 0 && checkedCount < node.children.length;
  });
}

/* Handle secondary category toggle — does NOT affect filters or spec forms */
function onSecondaryToggled(cat, checked) {
  const tree = buildCatTree(SAMPLE.categories);
  const parentNode = tree.find(p => p.name === cat);

  if (parentNode) {
    // 勾選/取消大分類 → 連帶所有子節點
    const all = [parentNode.name, ...parentNode.children.map(c => c.name)];
    if (checked) {
      all.forEach(n => { if (!_prodSecondaryCats.includes(n)) _prodSecondaryCats.push(n); });
    } else {
      _prodSecondaryCats = _prodSecondaryCats.filter(s => !all.includes(s));
    }
  } else {
    // 個別子節點獨立切換
    if (checked) {
      if (!_prodSecondaryCats.includes(cat)) _prodSecondaryCats.push(cat);
    } else {
      _prodSecondaryCats = _prodSecondaryCats.filter(s => s !== cat);
    }
  }
  renderSecondaryZone();
}

/* Render filter zone — driven exclusively by 主分類 (primary sub-cat or parent) */
function renderFilterZone() {
  const el = document.getElementById('filter-zone-body');
  if (!el) return;

  // Only the primary category (次分類 if set, else 大分類) drives filters
  const activeCat = _prodPrimarySub || _prodPrimaryParent;
  const applicableGroupNames = activeCat ? (SAMPLE.filterCategoryMap[activeCat] || []) : [];
  const applicableGroups = SAMPLE.filters.filter(f => applicableGroupNames.includes(f.name));

  if (!applicableGroups.length) {
    el.innerHTML = `<div class="filter-zone-empty">請先設定主分類</div>`;
    return;
  }

  el.innerHTML = applicableGroups.map(group => {
    const opts = group.options.map(opt => {
      const key     = `${group.name}: ${opt}`;
      const checked = _prodFilters.has(key);
      return `<label class="filter-option-item" data-key="${key.replace(/"/g,'&quot;')}">
        <input type="checkbox" ${checked ? 'checked' : ''} />
        ${opt}
      </label>`;
    }).join('');
    return `<div class="filter-group-section">
      <div class="filter-group-label">${group.name}</div>
      <div class="filter-options-row">${opts}</div>
    </div>`;
  }).join('');

  el.querySelectorAll('.filter-option-item input[type=checkbox]').forEach(cb => {
    const item = cb.closest('.filter-option-item');
    cb.addEventListener('change', () => onFilterToggled(item.dataset.key, cb.checked));
  });
}

/* Handle filter option toggle */
function onFilterToggled(key, checked) {
  if (checked) _prodFilters.add(key);
  else         _prodFilters.delete(key);
}

/* Render landing page lang tabs dynamically from langStatuses */
function renderLandingLangTabs() {
  const bar = document.getElementById('prod-landing-lang-tabs');
  if (!bar || !SAMPLE.productEdit.langStatuses) return;

  bar.innerHTML = SAMPLE.productEdit.langStatuses
    .filter(l => !l.disabled)
    .map((l, i) => `<button class="lang-tab-btn ${i === 0 ? 'active' : ''}" data-lang="${l.code}">${l.name}</button>`)
    .join('');
  bar.querySelectorAll('.lang-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => onLandingLangClick(btn.dataset.lang));
  });
}

/* Handle landing page language tab click */
function onLandingLangClick(code) {
  _currentLang = code;
  document.querySelectorAll('#prod-landing-lang-tabs .lang-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === code);
  });
  document.querySelectorAll('#lang-dashboard .lang-dashboard-row').forEach(row => {
    row.classList.toggle('row-active', row.dataset.lang === code);
  });
}

// ── CATEGORY TREE ─────────────────────────────────────────────

function buildCatTree(cats) {
  const parents = cats.filter(c => !c.parent).sort((a, b) => a.sort - b.sort);
  return parents.map(p => ({
    ...p,
    children: cats.filter(c => c.parent === p.name).sort((a, b) => a.sort - b.sort)
  }));
}

const ICON_FOLDER = `<svg class="cat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const ICON_FILE   = `<svg class="cat-icon cat-icon-sub" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

function renderCatTree(tree) {
  const container = document.getElementById('cat-tree');
  if (!container) return;
  container.innerHTML = tree.map(parent => `
    <div class="cat-node cat-parent" draggable="true" data-name="${parent.name}">
      <div class="cat-node-row">
        <span class="drag-handle" title="拖曳排序">⋮⋮</span>
        <button class="cat-toggle open" title="折疊">▾</button>
        ${ICON_FOLDER}
        <span class="cat-name">${parent.name}</span>
        <div class="lang-dots">${langDotsHtml(parent.langs)}</div>
        <div class="cat-actions">${editDeleteBtns('categories-edit')}</div>
      </div>
      <div class="cat-children">
        ${parent.children.map(child => `
          <div class="cat-node cat-child" draggable="true" data-name="${child.name}" data-parent="${parent.name}">
            <div class="cat-node-row">
              <span class="drag-handle" title="拖曳排序">⋮⋮</span>
              <span class="cat-toggle-spacer"></span>
              ${ICON_FILE}
              <span class="cat-name">${child.name}</span>
              <div class="lang-dots">${langDotsHtml(child.langs)}</div>
              <div class="cat-actions">${editDeleteBtns('categories-edit')}</div>
            </div>
          </div>`).join('')}
      </div>
    </div>
  `).join('');
  setupCatToggle();
  setupCatDnD();
}

function setupCatToggle() {
  document.querySelectorAll('#cat-tree .cat-toggle').forEach(btn => {
    if (btn.dataset.listenerAttached) return;
    btn.dataset.listenerAttached = '1';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const node = btn.closest('.cat-parent');
      const children = node.querySelector('.cat-children');
      const open = btn.classList.toggle('open');
      btn.textContent = open ? '▾' : '▸';
      children.style.display = open ? '' : 'none';
    });
  });
}

function setupCatDnD() {
  const treeEl = document.getElementById('cat-tree');
  if (!treeEl || treeEl.dataset.dndAttached) return;
  treeEl.dataset.dndAttached = '1';
  let dragSrc = null;

  treeEl.addEventListener('dragstart', e => {
    const child = e.target.closest('.cat-child');
    if (child) {
      dragSrc = child;
      child.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      return;
    }
    const parent = e.target.closest('.cat-parent');
    if (parent) {
      dragSrc = parent;
      parent.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
    }
  });

  treeEl.addEventListener('dragover', e => {
    e.preventDefault();
    if (!dragSrc) return;
    if (dragSrc.classList.contains('cat-parent')) {
      const target = e.target.closest('.cat-parent');
      if (!target || target === dragSrc) return;
      treeEl.querySelectorAll('.cat-parent.drag-over').forEach(n => n.classList.remove('drag-over'));
      target.classList.add('drag-over');
    } else {
      const target = e.target.closest('.cat-child');
      if (!target || target === dragSrc || target.dataset.parent !== dragSrc.dataset.parent) return;
      treeEl.querySelectorAll('.cat-child.drag-over').forEach(n => n.classList.remove('drag-over'));
      target.classList.add('drag-over');
    }
  });

  treeEl.addEventListener('dragleave', e => {
    if (!treeEl.contains(e.relatedTarget)) {
      treeEl.querySelectorAll('.drag-over').forEach(n => n.classList.remove('drag-over'));
    }
  });

  treeEl.addEventListener('drop', e => {
    e.preventDefault();
    if (!dragSrc) return;
    if (dragSrc.classList.contains('cat-parent')) {
      const target = e.target.closest('.cat-parent');
      if (!target || target === dragSrc) return;
      const parents = SAMPLE.categories.filter(c => !c.parent).sort((a, b) => a.sort - b.sort);
      const si = parents.findIndex(c => c.name === dragSrc.dataset.name);
      const di = parents.findIndex(c => c.name === target.dataset.name);
      if (si < 0 || di < 0) return;
      const [moved] = parents.splice(si, 1);
      parents.splice(di, 0, moved);
      parents.forEach((c, i) => { c.sort = i + 1; });
    } else {
      const target = e.target.closest('.cat-child');
      if (!target || target === dragSrc || target.dataset.parent !== dragSrc.dataset.parent) return;
      const pName = dragSrc.dataset.parent;
      const siblings = SAMPLE.categories.filter(c => c.parent === pName).sort((a, b) => a.sort - b.sort);
      const si = siblings.findIndex(c => c.name === dragSrc.dataset.name);
      const di = siblings.findIndex(c => c.name === target.dataset.name);
      if (si < 0 || di < 0) return;
      const [moved] = siblings.splice(si, 1);
      siblings.splice(di, 0, moved);
      siblings.forEach((c, i) => { c.sort = i + 1; });
    }
    dragSrc = null;
    renderCatTree(buildCatTree(SAMPLE.categories));
  });

  treeEl.addEventListener('dragend', () => {
    treeEl.querySelectorAll('.dragging, .drag-over').forEach(n => n.classList.remove('dragging', 'drag-over'));
    dragSrc = null;
  });
}

function initCategories() {
  renderCatTree(buildCatTree(SAMPLE.categories));
  const inp = document.querySelector('#view-categories .search-input input');
  if (!inp) return;
  const fresh = inp.cloneNode(true);
  inp.parentNode.replaceChild(fresh, inp);
  fresh.addEventListener('input', function () {
    const q = this.value.toLowerCase().trim();
    if (!q) { renderCatTree(buildCatTree(SAMPLE.categories)); return; }
    const matched = SAMPLE.categories.filter(c => c.name.toLowerCase().includes(q));
    const parentNames = new Set(matched.filter(c => c.parent).map(c => c.parent));
    const list = SAMPLE.categories.filter(c =>
      matched.includes(c) || (!c.parent && parentNames.has(c.name))
    );
    renderCatTree(buildCatTree(list));
  });
}

function initCategoriesEdit() {
  const ce = SAMPLE.categoryEdit;

  // Category type toggle
  setCatType(ce.type || 'main');

  // Populate parent category select
  const parentSel = document.getElementById('cat-parent-select');
  if (parentSel) {
    parentSel.innerHTML = '<option value="">— 請選擇 —</option>' +
      SAMPLE.mainCategories.map(c => `<option${c === ce.parentId ? ' selected' : ''}>${c}</option>`).join('');
  }

  // Sort order
  const sortInput = document.getElementById('cat-sort-input');
  if (sortInput) sortInput.value = ce.sort || 0;

  // Reset lang state
  _catCurrentLang = 'en';
  _catDirtyLangs  = new Set();

  renderCategoryLangTabs();
  renderCategoryFeaturedProducts();
}

/* ── Category type toggle ─────────────────────────────────── */
function setCatType(type) {
  SAMPLE.categoryEdit.type = type;
  const mainBtn    = document.getElementById('cat-type-main');
  const subBtn     = document.getElementById('cat-type-sub');
  const parentGrp  = document.getElementById('cat-parent-group');
  if (mainBtn)   mainBtn.classList.toggle('active', type === 'main');
  if (subBtn)    subBtn.classList.toggle('active', type === 'sub');
  if (parentGrp) parentGrp.style.display = type === 'sub' ? 'block' : 'none';
}

/* ── Category language tabs render ───────────────────────── */
function renderCategoryLangTabs() {
  const langs = SAMPLE.categoryEdit.langStatuses || [];

  const firstEnabled = langs.find(l => !l.disabled);
  if (firstEnabled && !langs.find(l => l.code === _catCurrentLang && !l.disabled)) {
    _catCurrentLang = firstEnabled.code;
  }

  const tabsBar = document.getElementById('cat-lang-tabs-bar');
  if (tabsBar) {
    const btnHtml = langs.map(l => {
      const isActive = l.code === _catCurrentLang && !l.disabled;
      const isOff    = l.disabled === true;
      const isDirty  = _catDirtyLangs.has(l.code);
      const dotClass = isOff                  ? 'dot-disabled' :
        l.status === 'synced'                 ? 'dot-synced'   :
        l.status === 'sync_failed'            ? 'dot-error'    :
        l.status === 'pending'                ? 'dot-pending'  : 'dot-draft';
      return `<button class="tab-btn${isActive?' active':''}${isOff?' tab-btn-lang-off':''}${isDirty?' tab-btn-dirty':''}"
        data-lang="${l.code}" onclick="switchCatLangTab('${l.code}')"
        ${isOff?'title="此語系已停用"':''}>${l.name}<span class="lang-tab-dot ${dotClass}"></span></button>`;
    }).join('');
    tabsBar.innerHTML = btnHtml +
      `<button class="btn btn-sm btn-secondary lang-tabs-copy-btn" onclick="openCatLangCopyModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        複製語系內容</button>`;
  }

  const panelsEl = document.getElementById('cat-lang-tab-panels');
  if (!panelsEl) return;

  panelsEl.innerHTML = langs.map(l => {
    const isActive = l.code === _catCurrentLang && !l.disabled;
    const isOff    = l.disabled === true;

    if (isOff) {
      return `<div class="tab-panel lang-tab-panel${isActive?' active':''}" data-lang-panel="${l.code}">
        <div class="lang-tab-disabled-state">
          <svg class="lang-tab-disabled-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <div class="lang-tab-disabled-title">${l.name} 語系已停用</div>
          <div class="lang-tab-disabled-desc">停用後此語系分類頁面不對外顯示。啟用後即可開始編輯內容。</div>
          <button class="btn btn-primary" onclick="enableCatLang('${l.code}')">啟用語系</button>
        </div>
      </div>`;
    }

    const content  = (SAMPLE.categoryEdit.landings || {})[l.code] || {};
    const isDirty  = _catDirtyLangs.has(l.code);
    const isFailed = l.status === 'sync_failed';

    const saveBtn = `<button class="btn btn-sm btn-secondary lang-dirty-btn"
      onclick="saveCatLangDraft('${l.code}')"${isDirty?'':' disabled'}>儲存草稿</button>`;
    const publishDisabled = !isFailed && l.status === 'synced' && !isDirty;
    const publishBtn = isFailed
      ? `<button class="btn btn-sm btn-primary" style="background:#DC2626;border-color:#DC2626"
          onclick="retryCatSync('${l.code}')">重試發佈</button>`
      : `<button class="btn btn-sm btn-primary lang-dirty-btn"
          onclick="publishCatLang('${l.code}')"${publishDisabled?' disabled':''}>發佈</button>`;

    const syncDateTxt   = l.lastSynced ? '最後發佈：' + l.lastSynced : '尚未發佈';
    const syncDateStyle = isFailed ? ' style="color:#DC2626"' : '';
    const syncExtra     = isFailed ? `（${l.syncError || '發佈失敗'}）` : '';

    const nameEsc    = (content.name    || '').replace(/"/g, '&quot;');
    const descEsc    = (content.desc    || '').replace(/</g, '&lt;');
    const slugEsc    = (content.seoSlug || '').replace(/"/g, '&quot;');
    const titleEsc   = (content.seoTitle|| '').replace(/"/g, '&quot;');
    const seoDescEsc = (content.seoDesc || '').replace(/</g, '&lt;');

    return `<div class="tab-panel lang-tab-panel${isActive?' active':''}" data-lang-panel="${l.code}">
      <div class="lang-tab-hd">
        <div class="lang-tab-hd-left">
          ${langPublishBadge(l)}
          <span class="lang-tab-sync-date"${syncDateStyle}>${syncDateTxt}${syncExtra}</span>
        </div>
        <div class="lang-tab-hd-right">
          ${saveBtn}
          ${publishBtn}
          <div class="more-menu">
            <button class="btn-icon" onclick="toggleCatLangTabMenu(event,'${l.code}')" title="更多">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div class="more-menu-dropdown" id="cat-lang-tab-menu-${l.code}">
              <button class="more-menu-item" onclick="openCatLangCopyToModal('${l.code}');closeCatLangTabMenu('${l.code}')">複製到此語系</button>
              <button class="more-menu-item danger" onclick="openCatLangDisableModal('${l.code}');closeCatLangTabMenu('${l.code}')">停用此語系</button>
            </div>
          </div>
        </div>
      </div>
      <div class="lang-edit-body">
        <div class="form-grid">
          <div class="form-group form-full">
            <label class="form-label">分類名稱 <span class="form-label-hint">Category Name</span></label>
            <input class="form-input" type="text" placeholder='例：3.5" SBC' value="${nameEsc}" />
            <div style="font-size:12px;color:var(--text-3);margin-top:4px">顯示於前台分類頁面的名稱 / Name displayed on the frontend category page</div>
          </div>
          <div class="form-group form-full">
            <label class="form-label">分類描述 <span class="form-label-hint">Category Description</span></label>
            <textarea class="form-input" rows="3" placeholder="分類簡介，顯示於前台頁面標題下方...">${descEsc}</textarea>
            <div style="font-size:12px;color:var(--text-3);margin-top:4px">分類簡介，顯示於前台頁面標題下方 / Short description shown below the category heading on the frontend</div>
          </div>
        </div>
        <div class="form-group" style="margin-bottom:20px">
          <label class="form-label">代表圖片 <span class="form-label-hint">Category Image</span></label>
          <div class="upload-zone" style="max-width:360px">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <div style="font-size:13px;color:var(--text-2)">點擊或拖曳上傳圖片 / Click or drag to upload</div>
            <div style="font-size:11px;color:var(--text-3);margin-top:2px">建議尺寸 800×600px，JPG / PNG / WebP · 用於分類列表頁縮圖</div>
          </div>
        </div>
        <div class="divider" style="margin:20px 0"></div>
        <div>
          <div class="form-label" style="margin-bottom:16px">SEO 設定 / SEO Settings</div>
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">Slug <span class="form-label-hint">URL 識別名稱 / URL Identifier</span></label>
              <input class="form-input" type="text" placeholder="例：3-5-sbc" value="${slugEsc}" />
              <div style="font-size:12px;color:var(--text-3);margin-top:4px">此分類頁面的網址尾段，請使用英文小寫加連字符</div>
            </div>
            <div class="form-group form-full">
              <label class="form-label">SEO 標題 <span class="form-label-hint">SEO Title (Meta Title)</span></label>
              <input class="form-input" type="text" placeholder='例：3.5" SBC | Industrial Single Board Computers | DFI' value="${titleEsc}" />
              <div style="font-size:12px;color:var(--text-3);margin-top:4px">搜尋引擎顯示的頁面標題，建議 50–60 字元</div>
            </div>
            <div class="form-group form-full">
              <label class="form-label">SEO 描述 <span class="form-label-hint">SEO Description (Meta Description)</span></label>
              <textarea class="form-input" rows="3" placeholder="搜尋引擎摘要，建議 120–160 字元...">${seoDescEsc}</textarea>
              <div style="font-size:12px;color:var(--text-3);margin-top:4px">搜尋引擎顯示的摘要，建議 120–160 字元</div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  if (!panelsEl._catDirtyListenerAttached) {
    panelsEl.addEventListener('input', _onCatLangPanelInput);
    panelsEl._catDirtyListenerAttached = true;
  }
}

function switchCatLangTab(code) {
  _catCurrentLang = code;
  document.querySelectorAll('#cat-lang-tabs-bar .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#cat-lang-tab-panels .lang-tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.querySelector(`#cat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  const panel = document.querySelector(`#cat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function _onCatLangPanelInput(e) {
  const panel = e.target.closest('.lang-tab-panel');
  if (!panel || !panel.dataset.langPanel) return;
  _markCatLangDirty(panel.dataset.langPanel);
}

function _markCatLangDirty(code) {
  _catDirtyLangs.add(code);
  const panel = document.querySelector(`#cat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (panel) panel.querySelectorAll('.lang-dirty-btn').forEach(b => { b.disabled = false; });
  const tabBtn = document.querySelector(`#cat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.add('tab-btn-dirty');
}

function saveCatLangDraft(code) {
  _catDirtyLangs.delete(code);
  const panel  = document.querySelector(`#cat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#cat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

function publishCatLang(code) {
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-17'; }
  _catDirtyLangs.delete(code);
  renderCategoryLangTabs();
  switchCatLangTab(code);
}

function retryCatSync(code) { publishCatLang(code); }

function enableCatLang(code) {
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _catCurrentLang = code;
  renderCategoryLangTabs();
}

function openCatLangDisableModal(code) {
  _catPendingDisableLang = code;
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('cat-disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('cat-lang-disable-modal').style.display = 'flex';
}

function confirmCatLangDisable() {
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === _catPendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('cat-lang-disable-modal').style.display = 'none';
  _catPendingDisableLang = null;
  const firstEnabled = (SAMPLE.categoryEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _catCurrentLang = firstEnabled.code;
  renderCategoryLangTabs();
}

function toggleCatLangTabMenu(event, code) {
  event.stopPropagation();
  const dd = document.getElementById(`cat-lang-tab-menu-${code}`);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.more-menu-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

function closeCatLangTabMenu(code) {
  const dd = document.getElementById(`cat-lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

function openCatLangCopyModal() {
  _renderCatLangCopyModal(null);
  document.getElementById('cat-lang-copy-modal').style.display = 'flex';
}

function openCatLangCopyToModal(targetCode) {
  _renderCatLangCopyModal(targetCode);
  document.getElementById('cat-lang-copy-modal').style.display = 'flex';
}

function _renderCatLangCopyModal(preselectedTarget) {
  const langs = (SAMPLE.categoryEdit.langStatuses || []).filter(l => !l.disabled);
  const sourceEl = document.getElementById('cat-lang-copy-source');
  const targetEl = document.getElementById('cat-lang-copy-targets');
  if (!sourceEl || !targetEl) return;
  sourceEl.innerHTML = langs.map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="radio" name="cat-lang-copy-src" value="${l.code}" ${l.code===_catCurrentLang?'checked':''}
        onchange="_refreshCatLangCopyTargets(null)">
      <span>${l.name}</span>
    </label>`).join('');
  _refreshCatLangCopyTargets(preselectedTarget);
}

function _refreshCatLangCopyTargets(preselectedTarget) {
  const langs   = (SAMPLE.categoryEdit.langStatuses || []).filter(l => !l.disabled);
  const srcCode = (document.querySelector('input[name="cat-lang-copy-src"]:checked') || {}).value;
  const targetEl = document.getElementById('cat-lang-copy-targets');
  if (!targetEl) return;
  targetEl.innerHTML = langs.filter(l => l.code !== srcCode).map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="checkbox" value="${l.code}" ${l.code===preselectedTarget?'checked':''}>
      <span>${l.name}</span>
    </label>`).join('');
}

function confirmCatLangCopy() {
  const srcCode = (document.querySelector('input[name="cat-lang-copy-src"]:checked') || {}).value;
  if (!srcCode) return;
  const srcContent = (SAMPLE.categoryEdit.landings || {})[srcCode] || {};
  const targets = [...document.querySelectorAll('#cat-lang-copy-targets input[type=checkbox]:checked')]
    .map(cb => cb.value);
  targets.forEach(code => {
    SAMPLE.categoryEdit.landings = SAMPLE.categoryEdit.landings || {};
    SAMPLE.categoryEdit.landings[code] = { ...srcContent };
    const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
    if (lang) lang.status = 'pending';
  });
  document.getElementById('cat-lang-copy-modal').style.display = 'none';
  renderCategoryLangTabs();
  switchCatLangTab(_catCurrentLang);
}

/* ── Category featured products ─────────────────────────── */
function renderCategoryFeaturedProducts() {
  const container = document.getElementById('cat-featured-products');
  if (!container) return;

  const catSubCat   = (SAMPLE.categoryEdit.landings?.en?.name) || '';
  const catProducts = SAMPLE.products.filter(p => p.subCat === catSubCat);
  const featured    = new Set(SAMPLE.categoryEdit.featuredProducts || []);

  if (catProducts.length === 0) {
    container.innerHTML = `<div style="text-align:center;padding:32px 0;color:var(--text-3);font-size:13px">
      此分類目前尚無產品 / No products in this category yet</div>`;
    return;
  }

  container.innerHTML = `
    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th style="width:48px;text-align:center">精選<br><span style="font-weight:400;font-size:11px;color:var(--text-3)">Featured</span></th>
            <th>型號 / Model</th>
            <th>生命週期 / Lifecycle</th>
            <th>發佈狀態 / Status</th>
          </tr>
        </thead>
        <tbody>
          ${catProducts.map(p => `
            <tr>
              <td style="text-align:center">
                <input type="checkbox" ${featured.has(p.model)?'checked':''} onchange="toggleCatFeatured('${p.model}',this.checked)" style="width:15px;height:15px;cursor:pointer">
              </td>
              <td><strong>${p.model}</strong></td>
              <td>${lifecycleBadge(p.lifecycle)}</td>
              <td>${pubStatusBadge(p.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>
    <div style="font-size:12px;color:var(--text-3);margin-top:8px">
      共 ${catProducts.length} 件產品，已勾選 <span id="cat-featured-count">${featured.size}</span> 件精選 / ${catProducts.length} products total, <span id="cat-featured-count-en">${featured.size}</span> featured
    </div>`;
}

function toggleCatFeatured(model, checked) {
  const set = new Set(SAMPLE.categoryEdit.featuredProducts || []);
  if (checked) set.add(model); else set.delete(model);
  SAMPLE.categoryEdit.featuredProducts = [...set];
  const c1 = document.getElementById('cat-featured-count');
  const c2 = document.getElementById('cat-featured-count-en');
  if (c1) c1.textContent = set.size;
  if (c2) c2.textContent = set.size;
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
  const auditTbody = document.querySelector('[data-tab-panel="logs"][data-tab="audit"] .table-wrap tbody');
  const errorTbody = document.querySelector('[data-tab-panel="logs"][data-tab="error"] .table-wrap tbody');

  if (auditTbody) {
    auditTbody.innerHTML = SAMPLE.auditLogs.map(l => `
      <tr>
        <td>${l.user}</td>
        <td>${l.module}</td>
        <td style="font-size:12px;color:var(--text-2)">${l.page}</td>
        <td>${actionBadge(l.action)}</td>
        <td style="font-size:12px"><strong>${l.target}</strong></td>
        <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${l.time}</td>
      </tr>`).join('');
  }
  if (errorTbody) {
    errorTbody.innerHTML = SAMPLE.errorLogs.map(l => `
      <tr>
        <td>${l.user}</td>
        <td>${l.module}</td>
        <td style="font-size:12px;color:var(--text-2)">${l.source}</td>
        <td style="font-size:12px"><strong>${l.target}</strong></td>
        <td>${errorTypeBadge(l.type)}</td>
        <td style="font-size:12px;color:var(--text-2)">${l.msg}</td>
        <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${l.time}</td>
      </tr>`).join('');
  }
  ['audit', 'error'].forEach(tab => {
    const modSel = document.querySelectorAll(`[data-tab-panel="logs"][data-tab="${tab}"] select.filter-select`);
    const last = modSel[modSel.length - 1];
    if (last) last.innerHTML = '<option>全部模組</option>' +
      ['產品管理', '檔案管理', '帳號管理', '系統管理'].map(m => `<option>${m}</option>`).join('');
  });
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
  'products':             initProductList,
  'products-edit':        initProductEdit,
  'products-lang-edit':   () => navigate('products-edit'), // removed: now inline tabs
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

// ── VIEW LOADER ───────────────────────────────────────────────
const VIEW_FILES = [
  'products', 'categories', 'filters',
  'tags', 'specs', 'files', 'users', 'roles', 'system',
];

async function loadViews() {
  const container = document.getElementById('view-container');
  for (const name of VIEW_FILES) {
    try {
      const res = await fetch('views/' + name + '.html');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      container.insertAdjacentHTML('beforeend', html);
    } catch (e) {
      console.error(`[loadViews] failed to load view "${name}":`, e);
    }
  }
}

// ── BOOTSTRAP ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
  initGroupToggles();          // sidebar only — safe before views load
  await loadViews();           // fetch & inject all view partials
  initTabs();                  // needs view DOM
  initLangTabs();
  window.addEventListener('hashchange', () => render(getHash()));
  render(getHash());
});

// Close any open more-menu dropdown when clicking outside
document.addEventListener('click', () => {
  document.querySelectorAll('.more-menu-dropdown.open').forEach(d => d.classList.remove('open'));
});
