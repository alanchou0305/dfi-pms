import { SAMPLE } from './data.js';
import { lifecycleBadge, pubStatusBadge, productLangStatusDots, editDeleteBtns } from './helpers.js';

export function renderProductRows() {
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

export function initProductList() {
  renderProductRows();

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

export function openAddCatModal() {
  document.getElementById('add-cat-modal').style.display = 'flex';
}

export function closeAddCatModal() {
  document.getElementById('add-cat-modal').style.display = 'none';
}

export function openSyncModal() {
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

export function toggleSyncSelectAll(cb) {
  document.querySelectorAll('#sync-modal-body .sync-check').forEach(c => {
    c.checked = cb.checked;
  });
  updateSyncCount();
}

export function updateSyncCount() {
  const countEl = document.getElementById('sync-modal-count');
  const checked = document.querySelectorAll('#sync-modal-body .sync-check:checked');
  const total   = document.querySelectorAll('#sync-modal-body .sync-check');
  if (countEl) countEl.textContent = `已選 ${checked.length} / ${total.length} 筆`;
}

export function closeSyncModal() {
  document.getElementById('sync-modal').style.display = 'none';
}

export function handleSyncOverlayClick(e) {
  if (e.target === document.getElementById('sync-modal')) closeSyncModal();
}

export function confirmSync() {
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

Object.assign(window, {
  openAddCatModal, closeAddCatModal,
  openSyncModal, closeSyncModal, handleSyncOverlayClick,
  toggleSyncSelectAll, updateSyncCount, confirmSync,
});
