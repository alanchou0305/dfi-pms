import { SAMPLE } from './data.js';
import { langDotsHtml, langPublishBadge, lifecycleBadge, pubStatusBadge, editDeleteBtns } from './helpers.js';

// ── Category edit state ───────────────────────────────────────
let _catCurrentLang        = 'en';
let _catDirtyLangs         = new Set();
let _catPendingDisableLang = null;

const ICON_FOLDER = `<svg class="cat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const ICON_FILE   = `<svg class="cat-icon cat-icon-sub" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

export function buildCatTree(cats) {
  const parents = cats.filter(c => !c.parent).sort((a, b) => a.sort - b.sort);
  return parents.map(p => ({
    ...p,
    children: cats.filter(c => c.parent === p.name).sort((a, b) => a.sort - b.sort)
  }));
}

export function renderCatTree(tree) {
  const container = document.getElementById('cat-tree');
  if (!container) return;
  container.innerHTML = tree.map(parent => {
    const pNameAttr = parent.name.replace(/"/g, '&quot;');
    return `
    <div class="cat-node cat-parent" draggable="true" data-name="${parent.name}">
      <div class="cat-node-row">
        <span class="drag-handle" title="拖曳排序">⋮⋮</span>
        <button class="cat-toggle open" title="折疊">▾</button>
        ${ICON_FOLDER}
        <span class="cat-name">${parent.name}</span>
        <div class="lang-dots">${langDotsHtml(parent.langs)}</div>
        <div class="cat-actions"><div class="col-actions">
          <button class="btn btn-sm btn-secondary"
            data-edit-name="${pNameAttr}" data-edit-type="main" data-edit-parent=""
            onclick="navigateCategoriesEditFromBtn(this)">編輯</button>
          <button class="btn btn-sm btn-danger">刪除</button>
        </div></div>
      </div>
      <div class="cat-children">
        ${parent.children.map(child => {
          const cNameAttr = child.name.replace(/"/g, '&quot;');
          return `
          <div class="cat-node cat-child" draggable="true" data-name="${child.name}" data-parent="${parent.name}">
            <div class="cat-node-row">
              <span class="drag-handle" title="拖曳排序">⋮⋮</span>
              <span class="cat-toggle-spacer"></span>
              ${ICON_FILE}
              <span class="cat-name">${child.name}</span>
              <div class="lang-dots">${langDotsHtml(child.langs)}</div>
              <div class="cat-actions"><div class="col-actions">
                <button class="btn btn-sm btn-secondary"
                  data-edit-name="${cNameAttr}" data-edit-type="sub" data-edit-parent="${pNameAttr}"
                  onclick="navigateCategoriesEditFromBtn(this)">編輯</button>
                <button class="btn btn-sm btn-danger">刪除</button>
              </div></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`;
  }).join('');
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

export function initCategories() {
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

export function navigateCategoriesEdit(name, type, parentName) {
  SAMPLE.categoryEdit.type = type;
  SAMPLE.categoryEdit.parentId = parentName || null;
  SAMPLE.categoryEdit.editingName = name;
  window.navigate('categories-edit');
}

export function navigateCategoriesEditFromBtn(btn) {
  navigateCategoriesEdit(btn.dataset.editName, btn.dataset.editType, btn.dataset.editParent);
}

export function initCategoriesEdit() {
  const ce = SAMPLE.categoryEdit;

  const heading = document.getElementById('cat-edit-heading');
  if (heading) {
    const name = ce.editingName || ce.landings?.en?.name || '';
    heading.textContent = name ? `分類編輯：${name}` : '分類編輯';
  }

  setCatType(ce.type || 'main');
  const typeDisplay = document.getElementById('cat-type-display');
  if (typeDisplay) {
    typeDisplay.textContent = (ce.type || 'main') === 'sub'
      ? '次分類 / Sub-category'
      : '大分類 / Main Category';
  }

  const parentSel = document.getElementById('cat-parent-select');
  if (parentSel) {
    parentSel.innerHTML = '<option value="">— 請選擇 —</option>' +
      SAMPLE.mainCategories.map(c => `<option${c === ce.parentId ? ' selected' : ''}>${c}</option>`).join('');
  }

  _catCurrentLang = 'en';
  _catDirtyLangs  = new Set();

  renderCategoryLangTabs();
  renderCategoryFeaturedProducts();
}

export function setCatType(type) {
  SAMPLE.categoryEdit.type = type;
  const parentGrp  = document.getElementById('cat-parent-group');
  if (parentGrp) parentGrp.style.display = type === 'sub' ? 'block' : 'none';
}

export function renderCategoryLangTabs() {
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

export function switchCatLangTab(code) {
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

export function saveCatLangDraft(code) {
  _catDirtyLangs.delete(code);
  const panel  = document.querySelector(`#cat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#cat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

export function publishCatLang(code) {
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-17'; }
  _catDirtyLangs.delete(code);
  renderCategoryLangTabs();
  switchCatLangTab(code);
}

export function retryCatSync(code) { publishCatLang(code); }

export function enableCatLang(code) {
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _catCurrentLang = code;
  renderCategoryLangTabs();
}

export function openCatLangDisableModal(code) {
  _catPendingDisableLang = code;
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('cat-disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('cat-lang-disable-modal').style.display = 'flex';
}

export function confirmCatLangDisable() {
  const lang = (SAMPLE.categoryEdit.langStatuses || []).find(l => l.code === _catPendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('cat-lang-disable-modal').style.display = 'none';
  _catPendingDisableLang = null;
  const firstEnabled = (SAMPLE.categoryEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _catCurrentLang = firstEnabled.code;
  renderCategoryLangTabs();
}

export function toggleCatLangTabMenu(event, code) {
  event.stopPropagation();
  const dd = document.getElementById(`cat-lang-tab-menu-${code}`);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.more-menu-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

export function closeCatLangTabMenu(code) {
  const dd = document.getElementById(`cat-lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

export function openCatLangCopyModal() {
  _renderCatLangCopyModal(null);
  document.getElementById('cat-lang-copy-modal').style.display = 'flex';
}

export function openCatLangCopyToModal(targetCode) {
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

export function _refreshCatLangCopyTargets(preselectedTarget) {
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

export function confirmCatLangCopy() {
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

export function renderCategoryFeaturedProducts() {
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

export function toggleCatFeatured(model, checked) {
  const set = new Set(SAMPLE.categoryEdit.featuredProducts || []);
  if (checked) set.add(model); else set.delete(model);
  SAMPLE.categoryEdit.featuredProducts = [...set];
  const c1 = document.getElementById('cat-featured-count');
  const c2 = document.getElementById('cat-featured-count-en');
  if (c1) c1.textContent = set.size;
  if (c2) c2.textContent = set.size;
}

Object.assign(window, {
  setCatType, navigateCategoriesEdit, navigateCategoriesEditFromBtn,
  switchCatLangTab, saveCatLangDraft, publishCatLang, retryCatSync,
  enableCatLang, openCatLangDisableModal, confirmCatLangDisable,
  toggleCatLangTabMenu, closeCatLangTabMenu,
  openCatLangCopyModal, openCatLangCopyToModal, _refreshCatLangCopyTargets, confirmCatLangCopy,
  toggleCatFeatured,
});
