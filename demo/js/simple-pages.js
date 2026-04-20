import { SAMPLE } from './data.js';
import { langDotsHtml, langPublishBadge, statusBadge, typeBadge, actionBadge, errorTypeBadge, roleBadge, editDeleteBtns } from './helpers.js';
import { buildCatTree } from './categories.js';

// ── File edit state ────────────────────────────────────────────
let _fileEditSelectedCats = [];
let _fileEditSelectedProds = [];

export function initFilters() {
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

export function initFiltersEdit() {
  _filterCurrentLang = 'en';
  _filterDirtyLangs  = new Set();
  renderFilterLangTabs();

  const f = SAMPLE.filters[0];
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

export function initTags() {
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

export function initTagsEdit() {
  _tagCurrentLang = 'en';
  _tagDirtyLangs  = new Set();
  renderTagLangTabs();
}

export function initSpecs() {
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

export function initSpecsEdit() {
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

export function initFiles() {
  const tbody = document.querySelector('#view-files .table-wrap tbody');
  const info  = document.querySelector('#view-files .pagination-info');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.files.map(f => `
    <tr>
      <td><strong>${f.name}</strong></td>
      <td style="font-size:12px">${f.mainCategory}</td>
      <td style="font-size:12px">${f.subCategory}</td>
      <td>${typeBadge(f.type)}</td>
      <td><label class="status-capsule"><input type="checkbox" ${f.status === '啟用' ? 'checked' : ''}><span class="status-capsule-pill"></span></label></td>
      <td style="color:var(--text-3);font-size:12px;white-space:nowrap">${f.updated}</td>
      <td>${editDeleteBtns('files-edit')}</td>
    </tr>`).join('');
  if (info) info.textContent = `共 ${SAMPLE.files.length} 筆`;

  const mainCats = [...new Set(SAMPLE.files.map(f => f.mainCategory))];
  const subCats  = [...new Set(SAMPLE.files.map(f => f.subCategory))];
  const mainSel = document.querySelector('#view-files #filter-main-cat');
  const subSel  = document.querySelector('#view-files #filter-sub-cat');
  if (mainSel) mainSel.innerHTML = '<option value="">大分類</option>' + mainCats.map(c => `<option>${c}</option>`).join('');
  if (subSel)  subSel.innerHTML  = '<option value="">次分類</option>' + subCats.map(c => `<option>${c}</option>`).join('');

  document.querySelectorAll('#view-files .filter-select').forEach(sel => {
    sel.addEventListener('change', () => sel.classList.toggle('active', sel.value !== ''));
  });
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function initFilesEdit() {
  const f = SAMPLE.files[0];

  // Sub-category dropdown with optgroups by parent
  const catSel = document.getElementById('files-edit-category');
  if (catSel) {
    const parents = SAMPLE.fileCategories.filter(c => !c.parent);
    catSel.innerHTML = '<option value="">請選擇</option>' + parents.map(p => {
      const children = SAMPLE.fileCategories.filter(c => c.parent === p.name);
      if (!children.length) return '';
      return `<optgroup label="${p.name}">${children.map(c =>
        `<option value="${c.name}"${c.name === f.subCategory ? ' selected' : ''}>${c.name}</option>`
      ).join('')}</optgroup>`;
    }).join('');
  }

  const nameInp = document.getElementById('files-edit-name');
  if (nameInp) nameInp.value = f.name;

  // Upload method toggle
  const radios      = document.querySelectorAll('input[name="files-upload-method"]');
  const uploadWrap  = document.getElementById('files-edit-upload-wrap');
  const linkWrap    = document.getElementById('files-edit-link-wrap');
  const cardUpload  = document.getElementById('files-edit-method-upload');
  const cardLink    = document.getElementById('files-edit-method-link');

  function applyMethod(val) {
    if (uploadWrap) uploadWrap.style.display = val === 'upload' ? '' : 'none';
    if (linkWrap)   linkWrap.style.display   = val === 'link'   ? '' : 'none';
    if (cardUpload) cardUpload.classList.toggle('selected', val === 'upload');
    if (cardLink)   cardLink.classList.toggle('selected',   val === 'link');
  }
  radios.forEach(r => r.addEventListener('change', () => applyMethod(r.value)));
  applyMethod('upload');

  // File zone click → trigger hidden input
  const uploadZone  = document.getElementById('files-edit-upload-zone');
  const fileInput   = document.getElementById('files-edit-file-input');
  const fileInfo    = document.getElementById('files-edit-file-info');
  const fileNameEl  = document.getElementById('files-edit-file-name');
  const fileSizeEl  = document.getElementById('files-edit-file-size');
  const removeBtn   = document.getElementById('files-edit-file-remove');

  if (uploadZone && fileInput) {
    uploadZone.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => {
      const file = fileInput.files[0];
      if (!file) return;
      fileNameEl.textContent = file.name;
      fileSizeEl.textContent = formatFileSize(file.size);
      uploadZone.style.display = 'none';
      fileInfo.style.display = '';
    });
  }
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      if (fileInput) fileInput.value = '';
      if (fileInfo)  fileInfo.style.display  = 'none';
      if (uploadZone) uploadZone.style.display = '';
    });
  }

  // ── 關聯產品分類 (sec-cat style) ──
  _fileEditSelectedCats = [];
  renderFilesEditSecCats();

  // ── 關聯產品型號 (relation style) ──
  _fileEditSelectedProds = [];
  renderFilesEditProds();
}

function renderFilesEditSecCats() {
  const el = document.getElementById('files-edit-sec-cat-body');
  if (!el) return;
  const tree = buildCatTree(SAMPLE.categories);
  el.innerHTML = tree.map(parent => {
    const parentChecked = _fileEditSelectedCats.includes(parent.name);
    const parentHtml = `<label class="sec-cat-item sec-cat-parent ${parentChecked ? 'checked' : ''}" data-cat="${parent.name.replace(/"/g, '&quot;')}">
      <input type="checkbox" ${parentChecked ? 'checked' : ''} />
      ${parent.name}
    </label>`;
    const childrenHtml = parent.children.map(child => {
      const childChecked = _fileEditSelectedCats.includes(child.name);
      return `<label class="sec-cat-item sec-cat-child ${childChecked ? 'checked' : ''}" data-cat="${child.name.replace(/"/g, '&quot;')}">
        <input type="checkbox" ${childChecked ? 'checked' : ''} />
        ${child.name}
      </label>`;
    }).join('');
    return `<div class="sec-cat-parent-node">${parentHtml}${childrenHtml}</div>`;
  }).join('');

  el.querySelectorAll('.sec-cat-item input[type=checkbox]').forEach(cb => {
    const item = cb.closest('.sec-cat-item');
    cb.addEventListener('change', () => onFilesEditSecCatToggled(item.dataset.cat, cb.checked));
  });

  el.querySelectorAll('.sec-cat-parent input[type=checkbox]').forEach(cb => {
    const item = cb.closest('.sec-cat-item');
    const node = tree.find(p => p.name === item.dataset.cat);
    if (!node || node.children.length === 0) return;
    const checkedCount = node.children.filter(c => _fileEditSelectedCats.includes(c.name)).length;
    cb.indeterminate = checkedCount > 0 && checkedCount < node.children.length;
  });
}

function onFilesEditSecCatToggled(cat, checked) {
  const tree = buildCatTree(SAMPLE.categories);
  const parentNode = tree.find(p => p.name === cat);
  if (parentNode) {
    const all = [parentNode.name, ...parentNode.children.map(c => c.name)];
    if (checked) {
      all.forEach(n => { if (!_fileEditSelectedCats.includes(n)) _fileEditSelectedCats.push(n); });
    } else {
      _fileEditSelectedCats = _fileEditSelectedCats.filter(s => !all.includes(s));
    }
  } else {
    if (checked) { if (!_fileEditSelectedCats.includes(cat)) _fileEditSelectedCats.push(cat); }
    else          { _fileEditSelectedCats = _fileEditSelectedCats.filter(s => s !== cat); }
  }
  renderFilesEditSecCats();
}

function renderFilesEditProds() {
  const el = document.getElementById('files-edit-prod-body');
  if (!el) return;
  if (_fileEditSelectedProds.length === 0) {
    el.innerHTML = `<div class="empty-state" style="padding:24px"><div class="empty-state-text">尚無關聯產品</div></div>`;
    return;
  }
  el.innerHTML = _fileEditSelectedProds.map((model, idx) => {
    const prod = SAMPLE.products.find(p => p.model === model);
    const meta = prod ? `<span style="color:var(--text-3);font-size:11px;margin-left:6px">${prod.mainCat} / ${prod.subCat}</span>` : '';
    return `<div style="display:flex;align-items:center;gap:8px;padding:10px 0;border-bottom:1px solid var(--border)">
      <strong style="flex:1;font-size:13px">${model}${meta}</strong>
      <button class="btn btn-sm btn-danger" onclick="removeFilesEditProd(${idx})">移除</button>
    </div>`;
  }).join('');
}

export function removeFilesEditProd(idx) {
  _fileEditSelectedProds.splice(idx, 1);
  renderFilesEditProds();
}

export function openFilesEditProdModal() {
  const modal  = document.getElementById('files-edit-prod-modal');
  const search = document.getElementById('files-edit-prod-modal-search');
  if (!modal) return;
  search.value = '';
  renderFilesEditProdModalList('');
  search.oninput = () => renderFilesEditProdModalList(search.value.trim().toLowerCase());
  modal.style.display = 'flex';
}

function renderFilesEditProdModalList(query) {
  const list = document.getElementById('files-edit-prod-modal-list');
  if (!list) return;
  const already = new Set(_fileEditSelectedProds);
  const filtered = SAMPLE.products.filter(p => {
    if (query && !p.model.toLowerCase().includes(query) &&
        !p.mainCat.toLowerCase().includes(query) &&
        !p.subCat.toLowerCase().includes(query)) return false;
    return true;
  });
  if (!filtered.length) {
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
        : `<button class="btn btn-sm btn-primary" onclick="confirmFilesEditProd('${p.model}')">新增</button>`
      }
    </div>`;
  }).join('');
}

export function confirmFilesEditProd(model) {
  if (!_fileEditSelectedProds.includes(model)) {
    _fileEditSelectedProds.push(model);
    renderFilesEditProds();
    const search = document.getElementById('files-edit-prod-modal-search');
    renderFilesEditProdModalList(search ? search.value.trim().toLowerCase() : '');
  }
}

export function closeFilesEditProdModal() {
  const modal = document.getElementById('files-edit-prod-modal');
  if (modal) modal.style.display = 'none';
}

const FC_ICON_FOLDER = `<svg class="cat-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>`;
const FC_ICON_FILE   = `<svg class="cat-icon cat-icon-sub" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`;

function _fileCatToggleHtml(name, enabled) {
  return `<label class="status-capsule" onclick="event.stopPropagation()">
    <input type="checkbox" data-filecat-toggle="${name}" ${enabled ? 'checked' : ''}
      onchange="toggleFileCatEnabled('${name.replace(/'/g,"\\''")}',this.checked)">
    <span class="status-capsule-pill"></span>
  </label>`;
}

export function initFileCategories() {
  const tree = document.getElementById('file-cat-tree');
  if (!tree) return;
  const parents = SAMPLE.fileCategories.filter(c => !c.parent);
  tree.innerHTML = parents.map(p => {
    const children = SAMPLE.fileCategories.filter(c => c.parent === p.name);
    return `
      <div class="cat-node cat-parent" draggable="true" data-name="${p.name}">
        <div class="cat-node-row">
          <span class="drag-handle" title="拖曳排序">⋮⋮</span>
          <button class="cat-toggle open" title="折疊">▾</button>
          ${FC_ICON_FOLDER}
          <span class="cat-name${p.enabled === false ? ' cat-name-off' : ''}">${p.name}</span>
          ${_fileCatToggleHtml(p.name, p.enabled !== false)}
          <div class="cat-actions">${editDeleteBtns('file-categories-edit')}</div>
        </div>
        <div class="cat-children">
          ${children.map(c => `
            <div class="cat-node cat-child" draggable="true" data-name="${c.name}" data-parent="${p.name}">
              <div class="cat-node-row">
                <span class="drag-handle" title="拖曳排序">⋮⋮</span>
                <span class="cat-toggle-spacer"></span>
                ${FC_ICON_FILE}
                <span class="cat-name${c.enabled === false ? ' cat-name-off' : ''}">${c.name}</span>
                ${_fileCatToggleHtml(c.name, c.enabled !== false)}
                <div class="cat-actions">${editDeleteBtns('file-categories-edit')}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  }).join('');

  tree.querySelectorAll('.cat-toggle').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const node = btn.closest('.cat-parent');
      const children = node.querySelector('.cat-children');
      const open = btn.classList.toggle('open');
      btn.textContent = open ? '▾' : '▸';
      children.style.display = open ? '' : 'none';
    });
  });

  setupFileCatDnD(tree);
}

function setupFileCatDnD(treeEl) {
  if (treeEl.dataset.dndAttached) return;
  treeEl.dataset.dndAttached = '1';
  let dragSrc = null;

  treeEl.addEventListener('dragstart', e => {
    const child = e.target.closest('.cat-child');
    if (child) { dragSrc = child; child.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; return; }
    const parent = e.target.closest('.cat-parent');
    if (parent) { dragSrc = parent; parent.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; }
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
      const parents = SAMPLE.fileCategories.filter(c => !c.parent);
      const si = parents.findIndex(c => c.name === dragSrc.dataset.name);
      const di = parents.findIndex(c => c.name === target.dataset.name);
      if (si < 0 || di < 0) return;
      const [moved] = parents.splice(si, 1);
      parents.splice(di, 0, moved);
      // rebuild fileCategories preserving children order under each parent
      const children = SAMPLE.fileCategories.filter(c => c.parent);
      SAMPLE.fileCategories = [
        ...parents,
        ...parents.flatMap(p => children.filter(c => c.parent === p.name)),
      ];
    } else {
      const target = e.target.closest('.cat-child');
      if (!target || target === dragSrc || target.dataset.parent !== dragSrc.dataset.parent) return;
      const pName = dragSrc.dataset.parent;
      const siblings = SAMPLE.fileCategories.filter(c => c.parent === pName);
      const si = siblings.findIndex(c => c.name === dragSrc.dataset.name);
      const di = siblings.findIndex(c => c.name === target.dataset.name);
      if (si < 0 || di < 0) return;
      const [moved] = siblings.splice(si, 1);
      siblings.splice(di, 0, moved);
      SAMPLE.fileCategories = [
        ...SAMPLE.fileCategories.filter(c => !c.parent),
        ...SAMPLE.fileCategories.filter(c => c.parent).map(c => c.parent === pName ? siblings.shift() || c : c),
      ];
    }
    dragSrc = null;
    initFileCategories();
  });

  treeEl.addEventListener('dragend', () => {
    treeEl.querySelectorAll('.dragging, .drag-over').forEach(n => n.classList.remove('dragging', 'drag-over'));
    dragSrc = null;
  });
}

export function toggleFileCatEnabled(name, enabled) {
  const cat = SAMPLE.fileCategories.find(c => c.name === name);
  if (cat) cat.enabled = enabled;
  const nameEl = document.querySelector(`.cat-node[data-name="${name}"] > .cat-node-row .cat-name`);
  if (nameEl) nameEl.classList.toggle('cat-name-off', !enabled);
}

export function initUsers() {
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

export function initUsersEdit() {
  const u = SAMPLE.users[1];
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

export function initRoles() {
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

export function initRolesEdit() {
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

export function initLogs() {
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

export function initSmtp() {
  const vals = ['smtp.office365.com', '587', 'noreply@dfi.com', '••••••••', 'noreply@dfi.com'];
  document.querySelectorAll('#view-smtp tbody tr').forEach((row, i) => {
    const td = row.querySelectorAll('td')[1];
    if (td && vals[i] !== undefined) td.textContent = vals[i];
  });
  const ts = '2026-04-01 09:00';
  document.querySelectorAll('#view-smtp tbody tr').forEach(row => {
    const td = row.querySelectorAll('td')[2];
    if (td) { td.textContent = ts; td.style.cssText = 'color:var(--text-3);font-size:12px'; }
  });
}

export function initSmtpEdit() {
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

export function initFileCategoriesEdit() {
  _fileCatCurrentLang = 'en';
  _fileCatDirtyLangs  = new Set();

  const cb = document.getElementById('filecat-status-checkbox');
  if (cb) { cb.checked = SAMPLE.fileCategoryEdit.enabled !== false; onFileCatStatusChange(cb.checked); }

  renderFileCategoryLangTabs();
}

export function onFileCatStatusChange(enabled) {
  const warning = document.getElementById('filecat-status-warning');
  if (warning) warning.style.display = enabled ? 'none' : 'flex';
  SAMPLE.fileCategoryEdit.enabled = enabled;
}

// ── File-category language tab state ─────────────────────────
let _fileCatCurrentLang        = 'en';
let _fileCatDirtyLangs         = new Set();
let _fileCatPendingDisableLang = null;

export function renderFileCategoryLangTabs() {
  const langs = SAMPLE.fileCategoryEdit.langStatuses || [];

  if (!langs.find(l => l.code === _fileCatCurrentLang)) {
    _fileCatCurrentLang = langs[0]?.code || 'en';
  }

  const tabsBar = document.getElementById('filecat-lang-tabs-bar');
  if (tabsBar) {
    tabsBar.innerHTML = langs.map(l => {
      const isActive = l.code === _fileCatCurrentLang;
      return `<button class="tab-btn${isActive ? ' active' : ''}"
        data-lang="${l.code}" onclick="switchFileCatLangTab('${l.code}')">${l.name}</button>`;
    }).join('') +
      `<button class="btn btn-sm btn-secondary lang-tabs-copy-btn" onclick="openFileCatLangCopyModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        複製語系內容</button>`;
  }

  const panelsEl = document.getElementById('filecat-lang-tab-panels');
  if (!panelsEl) return;

  panelsEl.innerHTML = langs.map(l => {
    const isActive = l.code === _fileCatCurrentLang;
    const name     = (SAMPLE.fileCategoryEdit.names || {})[l.code] || '';
    return `<div class="tab-panel lang-tab-panel${isActive ? ' active' : ''}" data-lang-panel="${l.code}">
      <div class="lang-edit-body">
        <div class="form-group">
          <label class="form-label">分類名稱</label>
          <input class="form-input" type="text" value="${name.replace(/"/g, '&quot;')}" />
        </div>
      </div>
    </div>`;
  }).join('');
}

export function switchFileCatLangTab(code) {
  _fileCatCurrentLang = code;
  document.querySelectorAll('#filecat-lang-tabs-bar .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#filecat-lang-tab-panels .lang-tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.querySelector(`#filecat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  const panel = document.querySelector(`#filecat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function _onFileCatLangPanelInput(e) {
  const panel = e.target.closest('.lang-tab-panel');
  if (!panel || !panel.dataset.langPanel) return;
  _markFileCatLangDirty(panel.dataset.langPanel);
}

function _markFileCatLangDirty(code) {
  _fileCatDirtyLangs.add(code);
  const panel = document.querySelector(`#filecat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (panel) panel.querySelectorAll('.lang-dirty-btn').forEach(b => { b.disabled = false; });
  const tabBtn = document.querySelector(`#filecat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.add('tab-btn-dirty');
}

export function saveFileCatLangDraft(code) {
  _fileCatDirtyLangs.delete(code);
  const panel  = document.querySelector(`#filecat-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#filecat-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

export function publishFileCatLang(code) {
  const lang = (SAMPLE.fileCategoryEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-20'; }
  _fileCatDirtyLangs.delete(code);
  renderFileCategoryLangTabs();
  switchFileCatLangTab(code);
}

export function retryFileCatSync(code) { publishFileCatLang(code); }

export function enableFileCatLang(code) {
  const lang = (SAMPLE.fileCategoryEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _fileCatCurrentLang = code;
  renderFileCategoryLangTabs();
}

export function openFileCatLangDisableModal(code) {
  _fileCatPendingDisableLang = code;
  const lang = (SAMPLE.fileCategoryEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('filecat-disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('filecat-lang-disable-modal').style.display = 'flex';
}

export function confirmFileCatLangDisable() {
  const lang = (SAMPLE.fileCategoryEdit.langStatuses || []).find(l => l.code === _fileCatPendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('filecat-lang-disable-modal').style.display = 'none';
  _fileCatPendingDisableLang = null;
  const firstEnabled = (SAMPLE.fileCategoryEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _fileCatCurrentLang = firstEnabled.code;
  renderFileCategoryLangTabs();
}

export function toggleFileCatLangTabMenu(event, code) {
  event.stopPropagation();
  const dd = document.getElementById(`filecat-lang-tab-menu-${code}`);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.more-menu-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

export function closeFileCatLangTabMenu(code) {
  const dd = document.getElementById(`filecat-lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

export function openFileCatLangCopyModal() {
  const langs = (SAMPLE.fileCategoryEdit.langStatuses || []).filter(l => !l.disabled);
  const sourceEl = document.getElementById('filecat-lang-copy-source');
  const targetEl = document.getElementById('filecat-lang-copy-targets');
  if (!sourceEl || !targetEl) return;
  sourceEl.innerHTML = langs.map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="radio" name="filecat-lang-copy-src" value="${l.code}" ${l.code===_fileCatCurrentLang?'checked':''}
        onchange="refreshFileCatLangCopyTargets()">
      <span>${l.name}</span>
    </label>`).join('');
  refreshFileCatLangCopyTargets();
  document.getElementById('filecat-lang-copy-modal').style.display = 'flex';
}

export function refreshFileCatLangCopyTargets() {
  const langs   = (SAMPLE.fileCategoryEdit.langStatuses || []).filter(l => !l.disabled);
  const srcCode = (document.querySelector('input[name="filecat-lang-copy-src"]:checked') || {}).value;
  const targetEl = document.getElementById('filecat-lang-copy-targets');
  if (!targetEl) return;
  targetEl.innerHTML = langs.filter(l => l.code !== srcCode).map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="checkbox" value="${l.code}">
      <span>${l.name}</span>
    </label>`).join('');
}

export function confirmFileCatLangCopy() {
  const srcCode = (document.querySelector('input[name="filecat-lang-copy-src"]:checked') || {}).value;
  if (!srcCode) return;
  const srcName = (SAMPLE.fileCategoryEdit.names || {})[srcCode] || '';
  const targets = [...document.querySelectorAll('#filecat-lang-copy-targets input[type=checkbox]:checked')]
    .map(cb => cb.value);
  targets.forEach(code => {
    SAMPLE.fileCategoryEdit.names = SAMPLE.fileCategoryEdit.names || {};
    SAMPLE.fileCategoryEdit.names[code] = srcName;
    const lang = (SAMPLE.fileCategoryEdit.langStatuses || []).find(l => l.code === code);
    if (lang) lang.status = 'pending';
  });
  document.getElementById('filecat-lang-copy-modal').style.display = 'none';
  renderFileCategoryLangTabs();
  switchFileCatLangTab(_fileCatCurrentLang);
}

// ── Filter language tab state ─────────────────────────────────
let _filterCurrentLang        = 'en';
let _filterDirtyLangs         = new Set();
let _filterPendingDisableLang = null;

export function renderFilterLangTabs() {
  const langs = SAMPLE.filterEdit.langStatuses || [];

  const firstEnabled = langs.find(l => !l.disabled);
  if (firstEnabled && !langs.find(l => l.code === _filterCurrentLang && !l.disabled)) {
    _filterCurrentLang = firstEnabled.code;
  }

  const tabsBar = document.getElementById('filter-lang-tabs-bar');
  if (tabsBar) {
    const btnHtml = langs.map(l => {
      const isActive = l.code === _filterCurrentLang && !l.disabled;
      const isOff    = l.disabled === true;
      const isDirty  = _filterDirtyLangs.has(l.code);
      const dotClass = isOff                  ? 'dot-disabled' :
        l.status === 'synced'                 ? 'dot-synced'   :
        l.status === 'sync_failed'            ? 'dot-error'    :
        l.status === 'pending'                ? 'dot-pending'  : 'dot-draft';
      return `<button class="tab-btn${isActive?' active':''}${isOff?' tab-btn-lang-off':''}${isDirty?' tab-btn-dirty':''}"
        data-lang="${l.code}" onclick="switchFilterLangTab('${l.code}')"
        ${isOff?'title="此語系已停用"':''}>${l.name}<span class="lang-tab-dot ${dotClass}"></span></button>`;
    }).join('');
    tabsBar.innerHTML = btnHtml +
      `<button class="btn btn-sm btn-secondary lang-tabs-copy-btn" onclick="openFilterLangCopyModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        複製語系內容</button>`;
  }

  const panelsEl = document.getElementById('filter-lang-tab-panels');
  if (!panelsEl) return;

  panelsEl.innerHTML = langs.map(l => {
    const isActive = l.code === _filterCurrentLang && !l.disabled;
    const isOff    = l.disabled === true;

    if (isOff) {
      return `<div class="tab-panel lang-tab-panel${isActive?' active':''}" data-lang-panel="${l.code}">
        <div class="lang-tab-disabled-state">
          <svg class="lang-tab-disabled-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <div class="lang-tab-disabled-title">${l.name} 語系已停用</div>
          <div class="lang-tab-disabled-desc">停用後此語系頁面不對外顯示。啟用後即可開始編輯內容。</div>
          <button class="btn btn-primary" onclick="enableFilterLang('${l.code}')">啟用語系</button>
        </div>
      </div>`;
    }

    const name     = (SAMPLE.filterEdit.names || {})[l.code] || '';
    const isDirty  = _filterDirtyLangs.has(l.code);
    const isFailed = l.status === 'sync_failed';

    const saveBtn = `<button class="btn btn-sm btn-secondary lang-dirty-btn"
      onclick="saveFilterLangDraft('${l.code}')"${isDirty?'':' disabled'}>儲存草稿</button>`;
    const publishDisabled = !isFailed && l.status === 'synced' && !isDirty;
    const publishBtn = isFailed
      ? `<button class="btn btn-sm btn-primary" style="background:#DC2626;border-color:#DC2626"
          onclick="retryFilterSync('${l.code}')">重試發佈</button>`
      : `<button class="btn btn-sm btn-primary lang-dirty-btn"
          onclick="publishFilterLang('${l.code}')"${publishDisabled?' disabled':''}>發佈</button>`;

    const syncDateTxt   = l.lastSynced ? '最後發佈：' + l.lastSynced : '尚未發佈';
    const syncDateStyle = isFailed ? ' style="color:#DC2626"' : '';
    const syncExtra     = isFailed ? `（${l.syncError || '發佈失敗'}）` : '';

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
            <button class="btn-icon" onclick="toggleFilterLangTabMenu(event,'${l.code}')" title="更多">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div class="more-menu-dropdown" id="filter-lang-tab-menu-${l.code}">
              <button class="more-menu-item danger" onclick="openFilterLangDisableModal('${l.code}');closeFilterLangTabMenu('${l.code}')">停用此語系</button>
            </div>
          </div>
        </div>
      </div>
      <div class="lang-edit-body">
        <div class="form-group">
          <label class="form-label">篩選器名稱</label>
          <input class="form-input" type="text" value="${name.replace(/"/g,'&quot;')}" />
        </div>
      </div>
    </div>`;
  }).join('');

  if (!panelsEl._filterDirtyListenerAttached) {
    panelsEl.addEventListener('input', _onFilterLangPanelInput);
    panelsEl._filterDirtyListenerAttached = true;
  }
}

export function switchFilterLangTab(code) {
  _filterCurrentLang = code;
  document.querySelectorAll('#filter-lang-tabs-bar .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#filter-lang-tab-panels .lang-tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.querySelector(`#filter-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  const panel = document.querySelector(`#filter-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function _onFilterLangPanelInput(e) {
  const panel = e.target.closest('.lang-tab-panel');
  if (!panel || !panel.dataset.langPanel) return;
  _markFilterLangDirty(panel.dataset.langPanel);
}

function _markFilterLangDirty(code) {
  _filterDirtyLangs.add(code);
  const panel = document.querySelector(`#filter-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (panel) panel.querySelectorAll('.lang-dirty-btn').forEach(b => { b.disabled = false; });
  const tabBtn = document.querySelector(`#filter-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.add('tab-btn-dirty');
}

export function saveFilterLangDraft(code) {
  _filterDirtyLangs.delete(code);
  const panel  = document.querySelector(`#filter-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#filter-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

export function publishFilterLang(code) {
  const lang = (SAMPLE.filterEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-20'; }
  _filterDirtyLangs.delete(code);
  renderFilterLangTabs();
  switchFilterLangTab(code);
}

export function retryFilterSync(code) { publishFilterLang(code); }

export function enableFilterLang(code) {
  const lang = (SAMPLE.filterEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _filterCurrentLang = code;
  renderFilterLangTabs();
}

export function openFilterLangDisableModal(code) {
  _filterPendingDisableLang = code;
  const lang = (SAMPLE.filterEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('filter-disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('filter-lang-disable-modal').style.display = 'flex';
}

export function confirmFilterLangDisable() {
  const lang = (SAMPLE.filterEdit.langStatuses || []).find(l => l.code === _filterPendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('filter-lang-disable-modal').style.display = 'none';
  _filterPendingDisableLang = null;
  const firstEnabled = (SAMPLE.filterEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _filterCurrentLang = firstEnabled.code;
  renderFilterLangTabs();
}

export function toggleFilterLangTabMenu(event, code) {
  event.stopPropagation();
  const dd = document.getElementById(`filter-lang-tab-menu-${code}`);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.more-menu-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

export function closeFilterLangTabMenu(code) {
  const dd = document.getElementById(`filter-lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

export function openFilterLangCopyModal() {
  const langs = (SAMPLE.filterEdit.langStatuses || []).filter(l => !l.disabled);
  const sourceEl = document.getElementById('filter-lang-copy-source');
  const targetEl = document.getElementById('filter-lang-copy-targets');
  if (!sourceEl || !targetEl) return;
  sourceEl.innerHTML = langs.map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="radio" name="filter-lang-copy-src" value="${l.code}" ${l.code===_filterCurrentLang?'checked':''}
        onchange="refreshFilterLangCopyTargets()">
      <span>${l.name}</span>
    </label>`).join('');
  refreshFilterLangCopyTargets();
  document.getElementById('filter-lang-copy-modal').style.display = 'flex';
}

export function refreshFilterLangCopyTargets() {
  const langs   = (SAMPLE.filterEdit.langStatuses || []).filter(l => !l.disabled);
  const srcCode = (document.querySelector('input[name="filter-lang-copy-src"]:checked') || {}).value;
  const targetEl = document.getElementById('filter-lang-copy-targets');
  if (!targetEl) return;
  targetEl.innerHTML = langs.filter(l => l.code !== srcCode).map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="checkbox" value="${l.code}">
      <span>${l.name}</span>
    </label>`).join('');
}

export function confirmFilterLangCopy() {
  const srcCode = (document.querySelector('input[name="filter-lang-copy-src"]:checked') || {}).value;
  if (!srcCode) return;
  const srcName = (SAMPLE.filterEdit.names || {})[srcCode] || '';
  const targets = [...document.querySelectorAll('#filter-lang-copy-targets input[type=checkbox]:checked')]
    .map(cb => cb.value);
  targets.forEach(code => {
    SAMPLE.filterEdit.names = SAMPLE.filterEdit.names || {};
    SAMPLE.filterEdit.names[code] = srcName;
    const lang = (SAMPLE.filterEdit.langStatuses || []).find(l => l.code === code);
    if (lang) lang.status = 'pending';
  });
  document.getElementById('filter-lang-copy-modal').style.display = 'none';
  renderFilterLangTabs();
  switchFilterLangTab(_filterCurrentLang);
}

// ── Tag language tab state ────────────────────────────────────
let _tagCurrentLang        = 'en';
let _tagDirtyLangs         = new Set();
let _tagPendingDisableLang = null;

export function renderTagLangTabs() {
  const langs = SAMPLE.tagEdit.langStatuses || [];

  const firstEnabled = langs.find(l => !l.disabled);
  if (firstEnabled && !langs.find(l => l.code === _tagCurrentLang && !l.disabled)) {
    _tagCurrentLang = firstEnabled.code;
  }

  const tabsBar = document.getElementById('tag-lang-tabs-bar');
  if (tabsBar) {
    const btnHtml = langs.map(l => {
      const isActive = l.code === _tagCurrentLang && !l.disabled;
      const isOff    = l.disabled === true;
      const isDirty  = _tagDirtyLangs.has(l.code);
      const dotClass = isOff                  ? 'dot-disabled' :
        l.status === 'synced'                 ? 'dot-synced'   :
        l.status === 'sync_failed'            ? 'dot-error'    :
        l.status === 'pending'                ? 'dot-pending'  :
        l.status === 'needs_update'           ? 'dot-pending'  : 'dot-draft';
      return `<button class="tab-btn${isActive?' active':''}${isOff?' tab-btn-lang-off':''}${isDirty?' tab-btn-dirty':''}"
        data-lang="${l.code}" onclick="switchTagLangTab('${l.code}')"
        ${isOff?'title="此語系已停用"':''}>${l.name}<span class="lang-tab-dot ${dotClass}"></span></button>`;
    }).join('');
    tabsBar.innerHTML = btnHtml +
      `<button class="btn btn-sm btn-secondary lang-tabs-copy-btn" onclick="openTagLangCopyModal()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        複製語系內容</button>`;
  }

  const panelsEl = document.getElementById('tag-lang-tab-panels');
  if (!panelsEl) return;

  panelsEl.innerHTML = langs.map(l => {
    const isActive = l.code === _tagCurrentLang && !l.disabled;
    const isOff    = l.disabled === true;

    if (isOff) {
      return `<div class="tab-panel lang-tab-panel${isActive?' active':''}" data-lang-panel="${l.code}">
        <div class="lang-tab-disabled-state">
          <svg class="lang-tab-disabled-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          <div class="lang-tab-disabled-title">${l.name} 語系已停用</div>
          <div class="lang-tab-disabled-desc">停用後此語系頁面不對外顯示。啟用後即可開始編輯內容。</div>
          <button class="btn btn-primary" onclick="enableTagLang('${l.code}')">啟用語系</button>
        </div>
      </div>`;
    }

    const content  = (SAMPLE.tagEdit.landings || {})[l.code] || {};
    const isDirty  = _tagDirtyLangs.has(l.code);
    const isFailed = l.status === 'sync_failed';

    const saveBtn = `<button class="btn btn-sm btn-secondary lang-dirty-btn"
      onclick="saveTagLangDraft('${l.code}')"${isDirty?'':' disabled'}>儲存草稿</button>`;
    const publishDisabled = !isFailed && l.status === 'synced' && !isDirty;
    const publishBtn = isFailed
      ? `<button class="btn btn-sm btn-primary" style="background:#DC2626;border-color:#DC2626"
          onclick="retryTagSync('${l.code}')">重試發佈</button>`
      : `<button class="btn btn-sm btn-primary lang-dirty-btn"
          onclick="publishTagLang('${l.code}')"${publishDisabled?' disabled':''}>發佈</button>`;

    const syncDateTxt   = l.lastSynced ? '最後發佈：' + l.lastSynced : '尚未發佈';
    const syncDateStyle = isFailed ? ' style="color:#DC2626"' : '';
    const syncExtra     = isFailed ? `（${l.syncError || '發佈失敗'}）` : '';

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
            <button class="btn-icon" onclick="toggleTagLangTabMenu(event,'${l.code}')" title="更多">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/></svg>
            </button>
            <div class="more-menu-dropdown" id="tag-lang-tab-menu-${l.code}">
              <button class="more-menu-item danger" onclick="openTagLangDisableModal('${l.code}');closeTagLangTabMenu('${l.code}')">停用此語系</button>
            </div>
          </div>
        </div>
      </div>
      <div class="lang-edit-body">
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">URL Slug</label>
            <input class="form-input" type="text" value="${(content.slug||'').replace(/"/g,'&quot;')}" />
          </div>
          <div class="form-group">
            <label class="form-label">Tag 名稱</label>
            <input class="form-input" type="text" value="${(content.name||'').replace(/"/g,'&quot;')}" />
          </div>
          <div class="form-group">
            <label class="form-label">H1 標題</label>
            <input class="form-input" type="text" value="${(content.h1||'').replace(/"/g,'&quot;')}" />
          </div>
          <div class="form-group form-full">
            <label class="form-label">內容</label>
            <div class="richtext-placeholder">富文字編輯器</div>
          </div>
          <div class="form-group">
            <label class="form-label">SEO Title</label>
            <input class="form-input" type="text" value="${(content.seoTitle||'').replace(/"/g,'&quot;')}" />
          </div>
          <div class="form-group">
            <label class="form-label">SEO Description</label>
            <textarea class="form-input" rows="2">${(content.seoDesc||'').replace(/</g,'&lt;')}</textarea>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  if (!panelsEl._tagDirtyListenerAttached) {
    panelsEl.addEventListener('input', _onTagLangPanelInput);
    panelsEl._tagDirtyListenerAttached = true;
  }
}

export function switchTagLangTab(code) {
  _tagCurrentLang = code;
  document.querySelectorAll('#tag-lang-tabs-bar .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#tag-lang-tab-panels .lang-tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.querySelector(`#tag-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  const panel = document.querySelector(`#tag-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function _onTagLangPanelInput(e) {
  const panel = e.target.closest('.lang-tab-panel');
  if (!panel || !panel.dataset.langPanel) return;
  _markTagLangDirty(panel.dataset.langPanel);
}

function _markTagLangDirty(code) {
  _tagDirtyLangs.add(code);
  const panel = document.querySelector(`#tag-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  if (panel) panel.querySelectorAll('.lang-dirty-btn').forEach(b => { b.disabled = false; });
  const tabBtn = document.querySelector(`#tag-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.add('tab-btn-dirty');
}

export function saveTagLangDraft(code) {
  _tagDirtyLangs.delete(code);
  const panel  = document.querySelector(`#tag-lang-tab-panels .lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#tag-lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

export function publishTagLang(code) {
  const lang = (SAMPLE.tagEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-20'; }
  _tagDirtyLangs.delete(code);
  renderTagLangTabs();
  switchTagLangTab(code);
}

export function retryTagSync(code) { publishTagLang(code); }

export function enableTagLang(code) {
  const lang = (SAMPLE.tagEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _tagCurrentLang = code;
  renderTagLangTabs();
}

export function openTagLangDisableModal(code) {
  _tagPendingDisableLang = code;
  const lang = (SAMPLE.tagEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('tag-disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('tag-lang-disable-modal').style.display = 'flex';
}

export function confirmTagLangDisable() {
  const lang = (SAMPLE.tagEdit.langStatuses || []).find(l => l.code === _tagPendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('tag-lang-disable-modal').style.display = 'none';
  _tagPendingDisableLang = null;
  const firstEnabled = (SAMPLE.tagEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _tagCurrentLang = firstEnabled.code;
  renderTagLangTabs();
}

export function toggleTagLangTabMenu(event, code) {
  event.stopPropagation();
  const dd = document.getElementById(`tag-lang-tab-menu-${code}`);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  document.querySelectorAll('.more-menu-dropdown.open').forEach(el => el.classList.remove('open'));
  if (!isOpen) dd.classList.add('open');
}

export function closeTagLangTabMenu(code) {
  const dd = document.getElementById(`tag-lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

export function openTagLangCopyModal() {
  const langs = (SAMPLE.tagEdit.langStatuses || []).filter(l => !l.disabled);
  const sourceEl = document.getElementById('tag-lang-copy-source');
  const targetEl = document.getElementById('tag-lang-copy-targets');
  if (!sourceEl || !targetEl) return;
  sourceEl.innerHTML = langs.map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="radio" name="tag-lang-copy-src" value="${l.code}" ${l.code===_tagCurrentLang?'checked':''}
        onchange="refreshTagLangCopyTargets()">
      <span>${l.name}</span>
    </label>`).join('');
  refreshTagLangCopyTargets();
  document.getElementById('tag-lang-copy-modal').style.display = 'flex';
}

export function refreshTagLangCopyTargets() {
  const langs   = (SAMPLE.tagEdit.langStatuses || []).filter(l => !l.disabled);
  const srcCode = (document.querySelector('input[name="tag-lang-copy-src"]:checked') || {}).value;
  const targetEl = document.getElementById('tag-lang-copy-targets');
  if (!targetEl) return;
  targetEl.innerHTML = langs.filter(l => l.code !== srcCode).map(l => `
    <label style="display:flex;align-items:center;gap:8px;padding:6px 0;cursor:pointer">
      <input type="checkbox" value="${l.code}">
      <span>${l.name}</span>
    </label>`).join('');
}

export function confirmTagLangCopy() {
  const srcCode = (document.querySelector('input[name="tag-lang-copy-src"]:checked') || {}).value;
  if (!srcCode) return;
  const srcContent = (SAMPLE.tagEdit.landings || {})[srcCode] || {};
  const targets = [...document.querySelectorAll('#tag-lang-copy-targets input[type=checkbox]:checked')]
    .map(cb => cb.value);
  targets.forEach(code => {
    SAMPLE.tagEdit.landings = SAMPLE.tagEdit.landings || {};
    SAMPLE.tagEdit.landings[code] = { ...srcContent };
    const lang = (SAMPLE.tagEdit.langStatuses || []).find(l => l.code === code);
    if (lang) lang.status = 'pending';
  });
  document.getElementById('tag-lang-copy-modal').style.display = 'none';
  renderTagLangTabs();
  switchTagLangTab(_tagCurrentLang);
}

Object.assign(window, { removeFilesEditProd, openFilesEditProdModal, closeFilesEditProdModal, confirmFilesEditProd,
  onFileCatStatusChange, toggleFileCatEnabled,
  switchFileCatLangTab, openFileCatLangCopyModal, refreshFileCatLangCopyTargets, confirmFileCatLangCopy,
  switchFilterLangTab, saveFilterLangDraft, publishFilterLang, retryFilterSync,
  enableFilterLang, openFilterLangDisableModal, confirmFilterLangDisable,
  toggleFilterLangTabMenu, closeFilterLangTabMenu,
  openFilterLangCopyModal, refreshFilterLangCopyTargets, confirmFilterLangCopy,
  switchTagLangTab, saveTagLangDraft, publishTagLang, retryTagSync,
  enableTagLang, openTagLangDisableModal, confirmTagLangDisable,
  toggleTagLangTabMenu, closeTagLangTabMenu,
  openTagLangCopyModal, refreshTagLangCopyTargets, confirmTagLangCopy,
});
