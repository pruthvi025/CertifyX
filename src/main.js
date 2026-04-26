// ── Page Router ──────────────────────────────────────────────
let currentPage = 0;
const TOTAL_PAGES = 4;

export function goTo(index) {
  if (index < 0 || index >= TOTAL_PAGES || index === currentPage) return;

  const prev = document.getElementById(`page-${currentPage}`);
  const next = document.getElementById(`page-${index}`);

  // direction: going forward or back
  const goingForward = index > currentPage;

  // exit current
  prev.classList.remove('active');
  prev.classList.add(goingForward ? 'exit-left' : '');
  if (!goingForward) {
    prev.style.transform = 'translateX(100%)';
    prev.style.opacity = '0';
  }

  // prepare next (offscreen)
  next.style.transition = 'none';
  next.style.transform = goingForward ? 'translateX(100%)' : 'translateX(-60px)';
  next.style.opacity = '0';
  next.style.pointerEvents = 'none';

  // force reflow
  next.getBoundingClientRect();

  // animate in
  next.style.transition = '';
  next.style.transform = '';
  next.style.opacity = '';
  next.style.pointerEvents = '';
  next.classList.add('active');

  currentPage = index;
  updateDots();

  // clean up exit class after transition
  setTimeout(() => {
    prev.classList.remove('exit-left');
    prev.style.transform = '';
    prev.style.opacity = '';
  }, 550);
}

function updateDots() {
  document.querySelectorAll('.dot-btn').forEach((d, i) => {
    d.classList.toggle('active', i === currentPage);
  });
  document.querySelectorAll('.nav-links .nav-link').forEach((l, i) => {
    l.classList.toggle('active', i === currentPage);
  });
}

// Expose globally for HTML onclick
window.goTo = goTo;

// ── Certificate State ──────────────────────────────────────────
let templateImg = null;
let excelRows   = [];
let excelCols   = [];
let mapFields   = [];
let textAlign   = 'left';

// ── Drag & Drop ────────────────────────────────────────────────
window.onDrag = (e, zoneId) => {
  e.preventDefault();
  document.getElementById(zoneId).classList.add('drag-over');
};
window.offDrag = (zoneId) => {
  document.getElementById(zoneId).classList.remove('drag-over');
};
window.onDrop = (e, type) => {
  e.preventDefault();
  window.offDrag(type === 'template' ? 'template-zone' : 'excel-zone');
  const file = e.dataTransfer.files[0];
  if (!file) return;
  type === 'template' ? loadTemplate(file) : loadExcel(file);
};

// ── Template ───────────────────────────────────────────────────
window.handleTemplate = (e) => {
  const file = e.target.files[0];
  if (file) loadTemplate(file);
};

function loadTemplate(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload a PNG or JPG image.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (ev) => {
    const img = new Image();
    img.onload = () => {
      templateImg = img;
      document.getElementById('template-name').textContent = file.name;
      document.getElementById('template-file-tag').style.display = 'flex';
      document.getElementById('template-zone').style.display = 'none';
      updatePreview();
      checkReady();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Excel ──────────────────────────────────────────────────────
window.handleExcel = (e) => {
  const file = e.target.files[0];
  if (file) loadExcel(file);
};

function loadExcel(file) {
  const reader = new FileReader();
  reader.onload = (ev) => {
    try {
      const wb = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
      const json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      if (!json.length) { showToast('No data rows found.', 'error'); return; }
      excelRows = json;
      excelCols = Object.keys(json[0]);
      document.getElementById('excel-name').textContent = file.name;
      document.getElementById('excel-file-tag').style.display = 'flex';
      document.getElementById('excel-zone').style.display = 'none';
      document.getElementById('rows-info').style.display = 'block';
      document.getElementById('rows-badge').textContent = `${json.length} rows detected`;
      setupMapping();
      populateNamingCol();
      updatePreview();
      checkReady();
      showToast(`${json.length} records loaded.`, 'success');
    } catch {
      showToast('Error reading file. Check the format.', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

// ── Remove files ───────────────────────────────────────────────
window.removeFile = (type) => {
  if (type === 'template') {
    templateImg = null;
    document.getElementById('template-file-tag').style.display = 'none';
    document.getElementById('template-zone').style.display = 'block';
    document.getElementById('template-input').value = '';
    document.getElementById('preview-canvas').style.display = 'none';
    document.getElementById('preview-placeholder').style.display = 'block';
  } else {
    excelRows = []; excelCols = []; mapFields = [];
    document.getElementById('excel-file-tag').style.display = 'none';
    document.getElementById('excel-zone').style.display = 'block';
    document.getElementById('excel-input').value = '';
    document.getElementById('rows-info').style.display = 'none';
    document.getElementById('mapping-area').classList.remove('show');
    document.getElementById('mapping-placeholder').style.display = 'block';
    document.getElementById('map-rows').innerHTML = '';
  }
  checkReady();
};

// ── Sample Data ────────────────────────────────────────────────
window.loadSampleData = () => {
  excelRows = [
    { Name: 'Pruthviraj Thorbole', Course: 'Web Development', Date: '26 Apr 2025', ID: 'CX-001' },
    { Name: 'Aisha Sharma',        Course: 'Web Development', Date: '26 Apr 2025', ID: 'CX-002' },
    { Name: 'Rahul Mehta',         Course: 'Web Development', Date: '26 Apr 2025', ID: 'CX-003' },
  ];
  excelCols = ['Name', 'Course', 'Date', 'ID'];
  document.getElementById('excel-file-tag').style.display = 'flex';
  document.getElementById('excel-zone').style.display = 'none';
  document.getElementById('excel-name').textContent = 'sample_data.xlsx';
  document.getElementById('rows-info').style.display = 'block';
  document.getElementById('rows-badge').textContent = `${excelRows.length} rows detected`;
  setupMapping();
  populateNamingCol();
  updatePreview();
  checkReady();
  showToast('Sample data loaded!', 'success');
};

// ── Mapping ────────────────────────────────────────────────────
function setupMapping() {
  mapFields = [{ excelCol: excelCols[0], label: 'Name' }];
  document.getElementById('map-rows').innerHTML = '';
  document.getElementById('mapping-area').classList.add('show');
  document.getElementById('mapping-placeholder').style.display = 'none';
  renderMapRow(0);
}

function renderMapRow(idx) {
  const wrap = document.getElementById('map-rows');
  const row  = document.createElement('div');
  row.className = 'map-row';

  const sel = document.createElement('select');
  excelCols.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    if (c === mapFields[idx].excelCol) o.selected = true;
    sel.appendChild(o);
  });
  sel.onchange = (e) => { mapFields[idx].excelCol = e.target.value; updatePreview(); };

  const arrow = document.createElement('div');
  arrow.className = 'map-arrow'; arrow.textContent = '→';

  const inp = document.createElement('input');
  inp.type = 'text'; inp.placeholder = 'Label on cert';
  inp.value = mapFields[idx].label || '';
  inp.onchange = (e) => { mapFields[idx].label = e.target.value; };

  row.appendChild(sel); row.appendChild(arrow); row.appendChild(inp);

  if (idx > 0) {
    const rb = document.createElement('button');
    rb.textContent = '✕';
    rb.style.cssText = 'background:none;border:none;color:var(--ink-3);cursor:pointer;font-size:.9rem;margin-left:4px;';
    rb.onclick = () => { mapFields.splice(idx, 1); row.remove(); updatePreview(); };
    row.appendChild(rb);
  }
  wrap.appendChild(row);
  updatePreview();
}

window.addMapRow = () => {
  if (!excelCols.length) return;
  mapFields.push({ excelCol: excelCols[0], label: '' });
  renderMapRow(mapFields.length - 1);
};

function populateNamingCol() {
  const sel = document.getElementById('naming-col');
  sel.innerHTML = '<option value="">— auto number —</option>';
  excelCols.forEach(c => {
    const o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
}

// ── Align ──────────────────────────────────────────────────────
window.setAlign = (a) => {
  textAlign = a;
  ['left','center','right'].forEach(x =>
    document.getElementById('align-' + x).classList.toggle('active', x === a)
  );
  updatePreview();
};

// ── Preview ────────────────────────────────────────────────────
window.updatePreview = () => {
  if (!templateImg) return;
  const canvas = document.getElementById('preview-canvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = templateImg.naturalWidth;
  canvas.height = templateImg.naturalHeight;
  ctx.drawImage(templateImg, 0, 0);

  const fontSize   = parseInt(document.getElementById('font-size').value)  || 36;
  const fontFamily = document.getElementById('font-family').value;
  const color      = document.getElementById('text-color').value;
  const xPct       = parseFloat(document.getElementById('pos-x').value) / 100;
  const yPct       = parseFloat(document.getElementById('pos-y').value) / 100;

  document.getElementById('color-hex').textContent = color;

  const sampleRow   = excelRows[0] || null;
  const displayText = sampleRow && mapFields.length
    ? (sampleRow[mapFields[0].excelCol] || 'Sample Name')
    : 'Sample Name';

  ctx.font         = `${fontSize}px "${fontFamily}"`;
  ctx.fillStyle    = color;
  ctx.textAlign    = textAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(displayText, canvas.width * xPct, canvas.height * yPct);

  canvas.style.display = 'block';
  document.getElementById('preview-placeholder').style.display = 'none';
};

// ── Ready check ────────────────────────────────────────────────
function checkReady() {
  document.getElementById('generate-btn').disabled = !(templateImg && excelRows.length);
}

// ── Generate ───────────────────────────────────────────────────
window.generateAll = async () => {
  if (!templateImg || !excelRows.length) return;

  const btn      = document.getElementById('generate-btn');
  const progWrap = document.getElementById('progress-wrap');
  const fill     = document.getElementById('progress-fill');
  const label    = document.getElementById('progress-label');

  btn.disabled = true;
  progWrap.classList.add('show');

  const fmt       = document.getElementById('output-format').value;
  const namingCol = document.getElementById('naming-col').value;
  const fontSize  = parseInt(document.getElementById('font-size').value) || 36;
  const fontFamily= document.getElementById('font-family').value;
  const color     = document.getElementById('text-color').value;
  const xPct      = parseFloat(document.getElementById('pos-x').value) / 100;
  const yPct      = parseFloat(document.getElementById('pos-y').value) / 100;

  const zip   = new JSZip();
  const total = excelRows.length;

  for (let i = 0; i < total; i++) {
    const row    = excelRows[i];
    const canvas = document.createElement('canvas');
    canvas.width  = templateImg.naturalWidth;
    canvas.height = templateImg.naturalHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(templateImg, 0, 0);

    ctx.font         = `${fontSize}px "${fontFamily}"`;
    ctx.fillStyle    = color;
    ctx.textAlign    = textAlign;
    ctx.textBaseline = 'middle';

    const gap = fontSize * 1.4;
    mapFields.forEach((f, fi) => {
      ctx.fillText(row[f.excelCol] || '', canvas.width * xPct, canvas.height * yPct + fi * gap);
    });

    const ext    = fmt === 'jpeg' ? 'jpg' : 'png';
    const mime   = fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
    const base64 = canvas.toDataURL(mime, 0.92).split(',')[1];

    const filename = namingCol && row[namingCol]
      ? String(row[namingCol]).replace(/[^a-z0-9_\-\s]/gi, '_') + '_certificate.' + ext
      : `certificate_${String(i+1).padStart(4,'0')}.${ext}`;

    zip.file(filename, base64, { base64: true });

    fill.style.width  = Math.round(((i+1)/total)*100) + '%';
    label.textContent = `Generating ${i+1} of ${total}…`;

    if (i % 10 === 9) await new Promise(r => setTimeout(r, 0));
  }

  label.textContent = 'Packing ZIP…';
  saveAs(await zip.generateAsync({ type: 'blob' }), 'certifyx_certificates.zip');

  fill.style.width  = '100%';
  label.textContent = `Done! ${total} certificates downloaded.`;
  showToast(`${total} certificates generated!`, 'success');

  setTimeout(() => {
    progWrap.classList.remove('show');
    fill.style.width = '0%';
    btn.disabled = false;
  }, 3000);
};

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg, type) {
  const t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').innerHTML = type === 'success'
    ? '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    : '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
  t.className = 'toast ' + type + ' show';
  setTimeout(() => t.classList.remove('show'), 4000);
}

// ── Init ───────────────────────────────────────────────────────
updateDots();
