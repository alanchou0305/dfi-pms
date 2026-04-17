import { initProductList } from './products-list.js';
import { initProductEdit } from './products-edit.js';
import { initCategories, initCategoriesEdit } from './categories.js';
import {
  initFilters, initFiltersEdit,
  initTags, initTagsEdit,
  initSpecs, initSpecsEdit,
  initFiles, initFilesEdit, initFileCategories,
  initUsers, initUsersEdit,
  initRoles, initRolesEdit,
  initLogs,
} from './simple-pages.js';

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
  'languages':             { crumb: ['系統管理', '語系列表'],                    nav: 'nav-languages',           group: 'grp-system' },
  'languages-edit':        { crumb: ['系統管理', '語系列表', '語系編輯'],         nav: 'nav-languages',           group: 'grp-system' },
  'logs':                  { crumb: ['系統管理', '系統日誌'],                    nav: 'nav-logs',                group: 'grp-system' },
};

const AUTH_VIEWS = ['login', '403', '404'];

const VIEW_INITS = {
  'products':             initProductList,
  'products-edit':        initProductEdit,
  'products-lang-edit':   () => navigate('products-edit'),
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

function getHash() {
  return (window.location.hash || '#login').replace('#', '') || 'login';
}

export function navigate(hash) {
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

const VIEW_FILES = [
  'products', 'categories', 'filters',
  'tags', 'specs', 'files', 'users', 'roles', 'system',
];

async function loadViews() {
  const container = document.getElementById('view-container');
  const results = await Promise.all(VIEW_FILES.map(async name => {
    try {
      const res = await fetch('views/' + name + '.html');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return { name, html: await res.text() };
    } catch (e) {
      console.error(`[loadViews] failed to load view "${name}":`, e);
      return null;
    }
  }));
  results.forEach(r => r && container.insertAdjacentHTML('beforeend', r.html));
}

// Expose navigate globally for editDeleteBtns inline onclick
window.navigate = navigate;

document.addEventListener('DOMContentLoaded', async () => {
  initGroupToggles();
  await loadViews();
  initTabs();
  initLangTabs();
  window.addEventListener('hashchange', () => render(getHash()));
  render(getHash());
});

document.addEventListener('click', () => {
  document.querySelectorAll('.more-menu-dropdown.open').forEach(d => d.classList.remove('open'));
});
