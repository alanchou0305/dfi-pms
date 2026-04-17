import { SAMPLE } from './data.js';
import { langDotsHtml, statusBadge, typeBadge, actionBadge, errorTypeBadge, roleBadge, editDeleteBtns } from './helpers.js';

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

export function initFilesEdit() {
  const f = SAMPLE.files[0];
  document.querySelectorAll('#view-files-edit .form-group').forEach(grp => {
    const label = grp.querySelector('.form-label');
    if (!label) return;
    const text = label.textContent.trim();
    const inp  = grp.querySelector('input');
    const sel  = grp.querySelector('select');
    if (text === '檔案名稱' && inp) inp.value = f.name;
    if (text === '大分類' && sel) {
      const mains = [...new Set(SAMPLE.files.map(x => x.mainCategory))];
      sel.innerHTML = '<option value="">請選擇</option>' + mains.map(m => `<option${m === f.mainCategory ? ' selected' : ''}>${m}</option>`).join('');
    }
    if (text === '次分類' && sel) {
      const subs = [...new Set(SAMPLE.files.map(x => x.subCategory))];
      sel.innerHTML = '<option value="">請選擇</option>' + subs.map(s => `<option${s === f.subCategory ? ' selected' : ''}>${s}</option>`).join('');
    }
    if (text === '狀態' && sel) sel.value = f.status;
  });
}

export function initFileCategories() {
  const tbody = document.querySelector('#view-file-categories .table-wrap tbody');
  if (!tbody) return;
  tbody.innerHTML = SAMPLE.fileCategories.map(c => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td><span class="text-muted">${c.parent}</span></td>
      <td>${editDeleteBtns('file-categories-edit')}</td>
    </tr>`).join('');
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
