export function lifecycleBadge(lc) {
  if (lc === 'Active')  return `<span class="badge badge-success"><span class="badge-dot"></span>Active</span>`;
  if (lc === 'EOL')     return `<span class="badge badge-danger"><span class="badge-dot"></span>EOL</span>`;
  if (lc === 'Preview') return `<span class="badge badge-warning"><span class="badge-dot"></span>Preview</span>`;
  return `<span class="badge badge-neutral">${lc}</span>`;
}

export function pubStatusBadge(s) {
  if (s === '草稿') return `<span class="badge badge-draft">草稿</span>`;
  if (s === '待發佈') return `<span class="badge badge-ready-publish">待發佈</span>`;
  if (s === '已發佈') return `<span class="badge badge-published">已發佈</span>`;
  if (s === '待更新') return `<span class="badge badge-ready-update">待更新</span>`;
  return `<span class="badge badge-neutral">${s}</span>`;
}

export function statusBadge(active) {
  return active
    ? `<span class="badge badge-success"><span class="badge-dot"></span>啟用</span>`
    : `<span class="badge badge-neutral"><span class="badge-dot"></span>停用</span>`;
}

export function typeBadge(t) {
  return `<span class="badge badge-neutral">${t}</span>`;
}

export function actionBadge(a) {
  if (a === 'CREATE') return `<span class="badge badge-success">CREATE</span>`;
  if (a === 'UPDATE') return `<span class="badge badge-warning">UPDATE</span>`;
  if (a === 'DELETE') return `<span class="badge badge-danger">DELETE</span>`;
  return `<span class="badge badge-neutral">${a}</span>`;
}

export function errorTypeBadge(t) {
  if (t === 'API 錯誤')  return `<span class="badge badge-danger">API 錯誤</span>`;
  if (t === '驗證失敗')  return `<span class="badge badge-warning">驗證失敗</span>`;
  if (t === '系統錯誤')  return `<span class="badge badge-neutral">系統錯誤</span>`;
  return `<span class="badge badge-neutral">${t}</span>`;
}

export function langDotsHtml(langs) {
  return Object.entries(langs).map(([lang, on]) =>
    `<span class="lang-dot ${on ? 'on' : 'off'}">${lang}</span>`
  ).join('');
}

export function productLangStatusDots(langStatuses) {
  return (langStatuses || []).map(l => {
    const label = l.enabled ? '已啟用' : '未啟用';
    const cls   = l.enabled ? 'ldot-on' : 'ldot-off';
    return `<span class="ldot ${cls}" title="${l.name} — ${label}">${l.name}</span>`;
  }).join('');
}

export function langPublishBadge(l) {
  if (l.status === 'synced')       return `<span class="badge badge-lang-synced">已發佈</span>`;
  if (l.status === 'sync_failed')  return `<span class="badge badge-lang-error" title="${l.syncError||'同步失敗'}">發佈失敗</span>`;
  if (l.status === 'pending')      return `<span class="badge badge-lang-pending">待發佈</span>`;
  if (l.status === 'needs_update') return `<span class="badge badge-lang-needs-update">待更新</span>`;
  return `<span class="badge badge-lang-draft">草稿</span>`;
}

export function roleBadge(role) {
  const map = { Admin: 'badge-danger', PM: 'badge-warning', MKT: 'badge-success', Designer: 'badge-neutral', FAE: 'badge-neutral' };
  return `<span class="badge ${map[role] || 'badge-neutral'}">${role}</span>`;
}

export function editDeleteBtns(editHash) {
  return `<div class="col-actions">
    <button class="btn btn-sm btn-secondary" onclick="navigate('${editHash}')">編輯</button>
    <button class="btn btn-sm btn-danger">刪除</button>
  </div>`;
}
