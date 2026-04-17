import { SAMPLE } from './data.js';
import { langPublishBadge, productLangStatusDots, editDeleteBtns } from './helpers.js';
import { buildCatTree } from './categories.js';

// ── Product edit state ───────────────────────────────────────
let _prodPrimaryParent = '';
let _prodPrimarySub    = '';
let _prodSecondaryCats = [];
let _prodFilters       = new Set();
let _prodRelations  = { derivatives: [], accessories: [] };
let _currentLang        = 'en';
let _pendingDisableLang = null;
let _prodReturnSection  = 'info';
let _dirtyLangs         = new Set();

// ── Ordering columns ─────────────────────────────────────────
const BASE_ORDERING_COLS = [
  { key: 'modelName',    label: 'Model Name',    width: '140px' },
  { key: 'pn',          label: 'P/N',            width: '160px' },
  { key: 'processor',   label: 'Processor',      width: '220px' },
  { key: 'memory',      label: 'Memory',         width: '160px' },
  { key: 'thermal',     label: 'Thermal',        width: '100px' },
  { key: 'operatingTemp', label: 'Operating Temp', width: '130px' },
];

let _ecWorkingState = null;
let _ecDragKey = null;
const _BASE_KEYS = () => BASE_ORDERING_COLS.map(c => c.key);

export function initProductEdit() {
  _dirtyLangs = new Set();
  const d = SAMPLE.productEdit;

  const titleEl = document.getElementById('prod-edit-model-title');
  if (titleEl) titleEl.textContent = d.model;

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
  _prodReturnSection = 'info';

  const basicPanel = document.querySelector('[data-tab-panel="prod-edit"][data-tab="basic"]');
  if (basicPanel) {
    const modelInp = basicPanel.querySelector('input.form-input');
    if (modelInp) modelInp.value = d.model;
    const lcSel = basicPanel.querySelector('select.form-input');
    if (lcSel) lcSel.value = d.lifecycle;
  }

  renderWebContentTabs();

  _prodPrimaryParent = d.primaryParent || '';
  _prodPrimarySub    = d.primarySub    || '';
  _prodSecondaryCats = d.secondaryCats ? [...d.secondaryCats] : [];
  _prodFilters       = new Set(d.filters || []);
  renderPrimaryParentZone();
  renderPrimarySubZone();
  renderSecondaryZone();
  renderFilterZone();

  const tagsZone = document.getElementById('tags-zone');
  if (tagsZone) {
    tagsZone.innerHTML = d.tags.map(t =>
      `<span class="chip">${t}<em class="chip-remove" onclick="this.parentElement.remove()">×</em></span>`
    ).join('') + ' <button class="chip chip-add">＋ 新增</button>';
  }

  const specsPanel = document.querySelector('[data-tab-panel="prod-edit"][data-tab="specs"]');
  if (specsPanel) {
    const skuData = JSON.parse(JSON.stringify(d.skuSpecs));

    function renderSkuSpecsTable() {
      const skus     = skuData.skus;
      const groups   = skuData.groups;
      const canAdd   = skus.length < 4;
      const colCount = skus.length + 1;

      const skuHeaders = skus.map((sku, si) => {
        const inactive = !sku.name || !sku.name.trim();
        return `<th class="sku-data-col sku-header-cell${inactive ? ' sku-col-inactive' : ''}">
          ${skus.length > 1 ? `<button class="sku-col-delete" onclick="deleteSku(${si})" title="移除此欄">×</button>` : ''}
          <input class="sku-header-pn" type="text" value="${(sku.name || '').replace(/"/g,'&quot;')}"
            placeholder="配置名稱"
            oninput="skuData.skus[${si}].name=this.value;setColActive(${si},!!this.value.trim())" />
        </th>`;
      }).join('');

      const bodyRows = groups.map((grp, gi) => {
        const groupRow = `<tr class="sku-group-row"><td colspan="${colCount}">${grp.group}</td></tr>`;
        const fieldRows = grp.fields.map((f, fi) => {
          const cells = skus.map((sku, si) => {
            const inactive = !sku.name || !sku.name.trim();
            const val = (f.values && f.values[si] != null) ? f.values[si] : '';
            return `<td class="${inactive ? 'sku-cell-inactive' : ''}">
              <input class="spec-cell-input" type="text" value="${val.replace(/"/g,'&quot;')}"
                ${inactive ? 'disabled placeholder="—"' : ''}
                oninput="skuData.groups[${gi}].fields[${fi}].values[${si}]=this.value" />
            </td>`;
          }).join('');
          return `<tr><td class="sku-label-cell">${f.label}</td>${cells}</tr>`;
        }).join('');
        return groupRow + fieldRows;
      }).join('');

      specsPanel.innerHTML = `
        <div style="display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:16px">
          <button class="btn btn-secondary">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            Excel 批次匯入
          </button>
          ${canAdd ? `<button class="btn btn-primary" onclick="addSku()">＋ 新增 SKU</button>` : ''}
        </div>
        <div class="sku-compare-wrap">
          <table class="sku-compare-table">
            <thead>
              <tr>
                <th class="sku-label-col" style="padding:10px;font-size:12px;color:var(--text-2);font-weight:600">規格項目</th>
                ${skuHeaders}
              </tr>
            </thead>
            <tbody>${bodyRows}</tbody>
          </table>
        </div>

        <div class="divider" style="margin:28px 0 20px"></div>
        <div class="tab-section-title" style="margin-bottom:14px">技術文件 <em style="font-size:11px;font-weight:400;color:var(--text-3);margin-left:6px">全語系共用</em></div>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:16px">
          ${['Datasheet', 'Block Diagram', 'Mechanical Drawing'].map(label => `
            <div>
              <div style="font-size:13px;font-weight:500;margin-bottom:8px">${label}</div>
              <div class="upload-zone" style="padding:24px 16px">
                <div class="upload-zone-icon">📄</div>
                <div style="font-size:13px">點擊或拖曳上傳 PDF</div>
              </div>
            </div>`).join('')}
        </div>`;

      window.skuData   = skuData;
      window.addSku    = addSku;
      window.deleteSku = deleteSku;
      window.setColActive = setColActive;
    }

    function setColActive(si, active) {
      const headers = specsPanel.querySelectorAll('.sku-header-cell');
      if (headers[si]) headers[si].classList.toggle('sku-col-inactive', !active);
      specsPanel.querySelectorAll('tbody tr').forEach(row => {
        if (row.classList.contains('sku-group-row')) return;
        const cell = row.querySelectorAll('td')[si + 1];
        if (!cell) return;
        cell.classList.toggle('sku-cell-inactive', !active);
        const inp = cell.querySelector('input');
        if (inp) { inp.disabled = !active; inp.placeholder = active ? '' : '—'; }
      });
    }

    function addSku() {
      if (skuData.skus.length >= 4) return;
      skuData.skus.push({ name: '' });
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

  renderOrderingTable();

  _prodRelations = JSON.parse(JSON.stringify(d.relations));
  renderRelations();
}

// ── Edit Columns panel ────────────────────────────────────────

export function openEditColumnsPanel() {
  const ord = SAMPLE.productEdit.ordering;
  _ecWorkingState = {
    dynamicCols: ord.dynamicCols.map(c => ({ ...c })),
    visibleColKeys: [...(ord.visibleColKeys || [..._BASE_KEYS(), ...ord.dynamicCols.map(c => c.key)])],
  };
  renderEditColumnsPanel();
  document.getElementById('edit-columns-modal').style.display = 'flex';
}

export function cancelEditColumns() {
  _ecWorkingState = null;
  document.getElementById('edit-columns-modal').style.display = 'none';
}

export function applyEditColumns() {
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
  const el = document.getElementById('ec-single-list');
  if (!el) return;

  const lockIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0;color:var(--text-3)"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`;
  const trashIcon = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>`;
  const dragIcon = `<svg width="10" height="14" viewBox="0 0 10 16" fill="none"><circle cx="3" cy="3" r="1.1" fill="currentColor"/><circle cx="7" cy="3" r="1.1" fill="currentColor"/><circle cx="3" cy="8" r="1.1" fill="currentColor"/><circle cx="7" cy="8" r="1.1" fill="currentColor"/><circle cx="3" cy="13" r="1.1" fill="currentColor"/><circle cx="7" cy="13" r="1.1" fill="currentColor"/></svg>`;

  const fixedHtml = `
    <div class="ec-section-label">固定欄位</div>
    ${BASE_ORDERING_COLS.map(c => `
      <div class="ec-col-item ec-col-fixed">
        ${lockIcon}
        <span class="ec-col-name">${c.label}</span>
      </div>`).join('')}`;

  const portHtml = `
    <div class="ec-section-header">
      <span class="ec-section-label" style="margin:0">Port 欄位</span>
      <button class="btn btn-sm btn-secondary" onclick="openAddPortModal()">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        新增
      </button>
    </div>
    ${dynamicCols.length === 0
      ? `<div class="ec-list-empty">尚無 Port 欄位，點擊「新增」建立</div>`
      : dynamicCols.map(c => {
          const isVisible = visibleColKeys.includes(c.key);
          return `
            <div class="ec-col-item ec-col-port" draggable="true" data-key="${c.key}">
              <span class="ec-col-drag" title="拖曳排序">${dragIcon}</span>
              <input type="checkbox" class="ec-col-check" ${isVisible ? 'checked' : ''}
                onchange="ecTogglePortVisible('${c.key}', this.checked)" />
              <span class="ec-col-name">${c.label}</span>
              <button class="ec-col-del-btn" onclick="ecDeletePortSchema('${c.key}')" title="從 schema 中移除">${trashIcon}</button>
            </div>`;
        }).join('')}`;

  el.innerHTML = fixedHtml + portHtml;
  setupEcPortDnD();
}

function setupEcPortDnD() {
  const container = document.getElementById('ec-single-list');
  if (!container) return;
  container.querySelectorAll('.ec-col-port[draggable]').forEach(item => {
    item.addEventListener('dragstart', e => {
      _ecDragKey = item.dataset.key;
      item.classList.add('port-dragging');
      e.dataTransfer.effectAllowed = 'move';
    });
    item.addEventListener('dragend', () => {
      _ecDragKey = null;
      item.classList.remove('port-dragging');
      container.querySelectorAll('.ec-col-port').forEach(t => t.classList.remove('port-drag-over'));
    });
    item.addEventListener('dragover', e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      container.querySelectorAll('.ec-col-port').forEach(t => t.classList.remove('port-drag-over'));
      if (item.dataset.key !== _ecDragKey) item.classList.add('port-drag-over');
    });
    item.addEventListener('dragleave', () => item.classList.remove('port-drag-over'));
    item.addEventListener('drop', e => {
      e.preventDefault();
      const targetKey = item.dataset.key;
      if (!_ecDragKey || _ecDragKey === targetKey) return;
      const dc = _ecWorkingState.dynamicCols;
      const fromIdx = dc.findIndex(c => c.key === _ecDragKey);
      const toIdx   = dc.findIndex(c => c.key === targetKey);
      if (fromIdx === -1 || toIdx === -1) return;
      const [moved] = dc.splice(fromIdx, 1);
      dc.splice(toIdx, 0, moved);
      const vk = _ecWorkingState.visibleColKeys;
      const fromVk = vk.indexOf(_ecDragKey);
      const toVk   = vk.indexOf(targetKey);
      if (fromVk !== -1 && toVk !== -1) {
        const [movedKey] = vk.splice(fromVk, 1);
        vk.splice(toVk, 0, movedKey);
      }
      _ecDragKey = null;
      renderEditColumnsPanel();
    });
  });
}

export function ecTogglePortVisible(key, checked) {
  const vk = _ecWorkingState.visibleColKeys;
  if (checked && !vk.includes(key)) {
    vk.push(key);
  } else if (!checked) {
    _ecWorkingState.visibleColKeys = vk.filter(k => k !== key);
  }
}

export function ecDeletePortSchema(key) {
  if (_BASE_KEYS().includes(key)) return;
  _ecWorkingState.dynamicCols = _ecWorkingState.dynamicCols.filter(c => c.key !== key);
  _ecWorkingState.visibleColKeys = _ecWorkingState.visibleColKeys.filter(k => k !== key);
  renderEditColumnsPanel();
}

export function openAddPortModal() {
  document.getElementById('add-port-name').value = '';
  document.getElementById('add-port-type').value = 'number';
  document.getElementById('add-port-modal').style.display = 'flex';
  setTimeout(() => document.getElementById('add-port-name').focus(), 50);
}

export function closeAddPortModal() {
  document.getElementById('add-port-modal').style.display = 'none';
}

export function confirmAddPort() {
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

// ── Ordering table ────────────────────────────────────────────

export function renderOrderingTable() {
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

export function addOrderingRow() {
  const ord = SAMPLE.productEdit.ordering;
  const row = { modelName: SAMPLE.productEdit.model, pn: '', processor: '', memory: '', thermal: '', operatingTemp: '' };
  ord.dynamicCols.forEach(c => { row[c.key] = ''; });
  ord.rows.push(row);
  renderOrderingTable();
}

export function removeOrderingRow(index) {
  SAMPLE.productEdit.ordering.rows.splice(index, 1);
  renderOrderingTable();
}

// ── Relations ─────────────────────────────────────────────────

export function renderRelations() {
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

export function removeRelation(type, idx) {
  _prodRelations[type].splice(idx, 1);
  renderRelations();
}

export function openAddRelationModal(type) {
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

export function confirmAddRelation(model) {
  const modal = document.getElementById('add-relation-modal');
  const type  = modal.dataset.relType;
  if (!_prodRelations[type].includes(model)) {
    _prodRelations[type].push(model);
    renderRelations();
    const search = document.getElementById('add-relation-modal-search');
    renderRelationPickerList(type, search ? search.value.trim().toLowerCase() : '');
  }
}

export function closeAddRelationModal() {
  document.getElementById('add-relation-modal').style.display = 'none';
}

// ── Web content lang tabs ─────────────────────────────────────

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

export function renderWebContentTabs() {
  const langs = SAMPLE.productEdit.langStatuses || [];

  const firstEnabled = langs.find(l => !l.disabled);
  if (firstEnabled && !langs.find(l => l.code === _currentLang && !l.disabled)) {
    _currentLang = firstEnabled.code;
  }

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

  if (!panelsEl._dirtyListenerAttached) {
    panelsEl.addEventListener('input', _onLangPanelInput);
    panelsEl._dirtyListenerAttached = true;
  }
}

export function switchLangTab(code) {
  _currentLang = code;
  document.querySelectorAll('#lang-tabs-bar .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.lang-tab-panel').forEach(p => p.classList.remove('active'));
  const btn   = document.querySelector(`#lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  const panel = document.querySelector(`.lang-tab-panel[data-lang-panel="${code}"]`);
  if (btn)   btn.classList.add('active');
  if (panel) panel.classList.add('active');
}

function _onLangPanelInput(e) {
  const panel = e.target.closest('.lang-tab-panel');
  if (!panel || !panel.dataset.langPanel) return;
  _markLangDirty(panel.dataset.langPanel);
}

function _markLangDirty(code) {
  _dirtyLangs.add(code);
  const panel = document.querySelector(`.lang-tab-panel[data-lang-panel="${code}"]`);
  if (panel) panel.querySelectorAll('.lang-dirty-btn').forEach(b => { b.disabled = false; });
  const tabBtn = document.querySelector(`#lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.add('tab-btn-dirty');
}

export function saveLangDraftInline(code) {
  _dirtyLangs.delete(code);
  const panel  = document.querySelector(`.lang-tab-panel[data-lang-panel="${code}"]`);
  const tabBtn = document.querySelector(`#lang-tabs-bar .tab-btn[data-lang="${code}"]`);
  if (tabBtn) tabBtn.classList.remove('tab-btn-dirty');
  if (panel) {
    const saveBtn = panel.querySelector('.btn-secondary.lang-dirty-btn');
    if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = '已儲存'; setTimeout(() => { saveBtn.textContent = '儲存草稿'; }, 1500); }
  }
}

export function publishLang(code) {
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { lang.status = 'synced'; lang.lastSynced = '2026-04-17'; }
  _dirtyLangs.delete(code);
  renderWebContentTabs();
  switchLangTab(code);
}

export function enableLang(code) {
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
  if (lang) { delete lang.disabled; lang.status = 'draft'; }
  _currentLang = code;
  renderWebContentTabs();
}

export function openLangDisableModal(code) {
  _pendingDisableLang = code;
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === code);
  const nameEl = document.getElementById('disable-lang-name');
  if (nameEl && lang) nameEl.textContent = lang.name;
  document.getElementById('lang-disable-modal').style.display = 'flex';
}

export function confirmDisableLang() {
  const lang = (SAMPLE.productEdit.langStatuses || []).find(l => l.code === _pendingDisableLang);
  if (lang) { lang.disabled = true; lang.status = 'draft'; lang.lastSynced = null; delete lang.syncError; }
  document.getElementById('lang-disable-modal').style.display = 'none';
  _pendingDisableLang = null;
  const firstEnabled = (SAMPLE.productEdit.langStatuses || []).find(l => !l.disabled);
  if (firstEnabled) _currentLang = firstEnabled.code;
  renderWebContentTabs();
}

export function retrySync(code) { publishLang(code); }

export function toggleLangTabMenu(e, code) {
  e.stopPropagation();
  document.querySelectorAll('.lang-tab-panel .more-menu-dropdown').forEach(d => {
    if (d.id !== `lang-tab-menu-${code}`) d.classList.remove('open');
  });
  document.getElementById(`lang-tab-menu-${code}`).classList.toggle('open');
}

export function closeLangTabMenu(code) {
  const dd = document.getElementById(`lang-tab-menu-${code}`);
  if (dd) dd.classList.remove('open');
}

export function openLangSyncModal() {
  _renderLangCopyModal(null);
  document.getElementById('lang-copy-modal').style.display = 'flex';
}

export function openLangCopyToModal(targetCode) {
  _renderLangCopyModal(targetCode);
  document.getElementById('lang-copy-modal').style.display = 'flex';
}

function _renderLangCopyModal(preselectedTarget) {
  const langs = (SAMPLE.productEdit.langStatuses || []).filter(l => !l.disabled);
  const sourceEl = document.getElementById('lang-copy-source');
  const targetEl = document.getElementById('lang-copy-targets');
  if (!sourceEl || !targetEl) return;

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

export function _refreshLangCopyTargets(preselectedTarget) {
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

export function confirmLangCopy() {
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

export function addIconRow(triggerBtn) {
  const panel = triggerBtn ? triggerBtn.closest('.lang-tab-panel') : null;
  const container = panel ? panel.querySelector('.icon-rows') : document.querySelector('.lang-tab-panel.active .icon-rows');
  if (!container) return;
  container.insertAdjacentHTML('beforeend', _iconRowHtml('', ''));
}

// ── Classification zones ──────────────────────────────────────

export function renderPrimaryParentZone() {
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

export function renderPrimarySubZone() {
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

export function onPrimaryParentChanged(parent) {
  _prodPrimaryParent = parent;
  _prodPrimarySub    = '';
  _prodFilters       = new Set();
  renderPrimaryParentZone();
  renderPrimarySubZone();
  renderFilterZone();
}

export function onPrimarySubChanged(sub) {
  _prodPrimarySub = sub;
  _prodFilters    = new Set();
  renderPrimarySubZone();
  renderFilterZone();
}

export function renderSecondaryZone() {
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

  el.querySelectorAll('.sec-cat-parent input[type=checkbox]').forEach(cb => {
    const item = cb.closest('.sec-cat-item');
    const node = tree.find(p => p.name === item.dataset.cat);
    if (!node || node.children.length === 0) return;
    const checkedCount = node.children.filter(c => _prodSecondaryCats.includes(c.name)).length;
    cb.indeterminate = checkedCount > 0 && checkedCount < node.children.length;
  });
}

function onSecondaryToggled(cat, checked) {
  const tree = buildCatTree(SAMPLE.categories);
  const parentNode = tree.find(p => p.name === cat);

  if (parentNode) {
    const all = [parentNode.name, ...parentNode.children.map(c => c.name)];
    if (checked) {
      all.forEach(n => { if (!_prodSecondaryCats.includes(n)) _prodSecondaryCats.push(n); });
    } else {
      _prodSecondaryCats = _prodSecondaryCats.filter(s => !all.includes(s));
    }
  } else {
    if (checked) {
      if (!_prodSecondaryCats.includes(cat)) _prodSecondaryCats.push(cat);
    } else {
      _prodSecondaryCats = _prodSecondaryCats.filter(s => s !== cat);
    }
  }
  renderSecondaryZone();
}

export function renderFilterZone() {
  const el = document.getElementById('filter-zone-body');
  if (!el) return;

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

function onFilterToggled(key, checked) {
  if (checked) _prodFilters.add(key);
  else         _prodFilters.delete(key);
}

export function renderLandingLangTabs() {
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

function onLandingLangClick(code) {
  _currentLang = code;
  document.querySelectorAll('#prod-landing-lang-tabs .lang-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === code);
  });
  document.querySelectorAll('#lang-dashboard .lang-dashboard-row').forEach(row => {
    row.classList.toggle('row-active', row.dataset.lang === code);
  });
}

Object.assign(window, {
  openEditColumnsPanel, cancelEditColumns, applyEditColumns,
  ecTogglePortVisible, ecDeletePortSchema,
  openAddPortModal, closeAddPortModal, confirmAddPort,
  renderOrderingTable, addOrderingRow, removeOrderingRow,
  removeRelation, openAddRelationModal, confirmAddRelation, closeAddRelationModal,
  renderWebContentTabs, switchLangTab,
  saveLangDraftInline, publishLang, enableLang,
  openLangDisableModal, confirmDisableLang, retrySync,
  toggleLangTabMenu, closeLangTabMenu,
  openLangSyncModal, openLangCopyToModal, _refreshLangCopyTargets, confirmLangCopy,
  addIconRow,
  renderPrimaryParentZone, renderPrimarySubZone,
  onPrimaryParentChanged, onPrimarySubChanged,
  renderSecondaryZone, renderFilterZone,
});
