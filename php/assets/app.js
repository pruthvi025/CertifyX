// ── Page Router ──────────────────────────────────────────────
var currentPage = 0;
var TOTAL_PAGES  = 4;
var cleanupTimer = null;

function goTo(index) {
  if (index < 0 || index >= TOTAL_PAGES || index === currentPage) return;

  // Cancel any in-flight cleanup and snap everything to a clean state
  if (cleanupTimer !== null) {
    clearTimeout(cleanupTimer);
    cleanupTimer = null;
    document.querySelectorAll('.page').forEach(function(p) {
      p.style.cssText = '';
      p.classList.remove('exit-left');
    });
  }

  var prev    = document.getElementById('page-' + currentPage);
  var next    = document.getElementById('page-' + index);
  var forward = index > currentPage;

  // ── Exit previous page ──
  prev.classList.remove('active');
  if (forward) {
    // slide left via CSS class
    prev.classList.add('exit-left');
  } else {
    // slide right — remove active, CSS .page already has translateX(100%)
    // but we explicitly animate it so the transition fires correctly
    prev.style.transform    = 'translateX(100%)';
    prev.style.opacity      = '0';
    prev.style.pointerEvents = 'none';
  }

  // ── Position next page at its starting off-screen spot ──
  if (!forward) {
    // entering from the left: start at -60px
    next.style.transition    = 'none';
    next.style.transform     = 'translateX(-60px)';
    next.style.opacity       = '0';
    next.style.pointerEvents = 'none';
  } else {
    // entering from the right: CSS .page default is already translateX(100%)
    // ensure no stale inline styles interfere
    next.style.cssText = '';
  }

  // Force reflow to commit starting position
  next.getBoundingClientRect();

  // ── Animate next page in ──
  // Double rAF guarantees the browser has painted the starting frame
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      // Clear all inline overrides — .page.active CSS will take over
      next.style.transition    = '';
      next.style.transform     = '';
      next.style.opacity       = '';
      next.style.pointerEvents = '';
      next.classList.add('active');
    });
  });

  currentPage = index;
  updateDots();

  // Clean up exited page's inline styles after transition finishes
  cleanupTimer = setTimeout(function() {
    cleanupTimer = null;
    document.querySelectorAll('.page:not(.active)').forEach(function(p) {
      p.style.cssText = '';
      p.classList.remove('exit-left');
    });
  }, 600);
}

function updateDots() {
  document.querySelectorAll('.dot-btn').forEach(function(d, i) {
    d.classList.toggle('active', i === currentPage);
  });
  document.querySelectorAll('.nav-links .nav-link').forEach(function(l, i) {
    l.classList.toggle('active', i === currentPage);
  });
}

// ── Certificate State ──────────────────────────────────────────
var templateImg = null;
var excelRows   = [];
var excelCols   = [];
var mapFields   = [];
var textAlign   = 'left';

// ── Drag & Drop ────────────────────────────────────────────────
function onDrag(e, zoneId) {
  e.preventDefault();
  document.getElementById(zoneId).classList.add('drag-over');
}
function offDrag(zoneId) {
  document.getElementById(zoneId).classList.remove('drag-over');
}
function onDrop(e, type) {
  e.preventDefault();
  offDrag(type === 'template' ? 'template-zone' : 'excel-zone');
  var file = e.dataTransfer.files[0];
  if (!file) return;
  type === 'template' ? loadTemplate(file) : loadExcel(file);
}

// ── Template ───────────────────────────────────────────────────
function handleTemplate(e) {
  var file = e.target.files[0];
  if (file) loadTemplate(file);
}

function loadTemplate(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Please upload a PNG or JPG image.', 'error');
    return;
  }
  var reader = new FileReader();
  reader.onload = function(ev) {
    var img = new Image();
    img.onload = function() {
      templateImg = img;
      document.getElementById('template-name').textContent = file.name;
      document.getElementById('template-file-tag').style.display = 'flex';
      document.getElementById('template-zone').style.display    = 'none';
      updatePreview();
      checkReady();
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
}

// ── Excel ──────────────────────────────────────────────────────
function handleExcel(e) {
  var file = e.target.files[0];
  if (file) loadExcel(file);
}

function loadExcel(file) {
  var reader = new FileReader();
  reader.onload = function(ev) {
    try {
      var wb   = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
      var json = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' });
      if (!json.length) { showToast('No data rows found.', 'error'); return; }
      excelRows = json;
      excelCols = Object.keys(json[0]);
      document.getElementById('excel-name').textContent      = file.name;
      document.getElementById('excel-file-tag').style.display = 'flex';
      document.getElementById('excel-zone').style.display    = 'none';
      document.getElementById('rows-info').style.display     = 'block';
      document.getElementById('rows-badge').textContent      = json.length + ' rows detected';
      setupMapping();
      populateNamingCol();
      updatePreview();
      checkReady();
      showToast(json.length + ' records loaded.', 'success');
    } catch(err) {
      showToast('Error reading file. Check the format.', 'error');
    }
  };
  reader.readAsArrayBuffer(file);
}

// ── Remove files ───────────────────────────────────────────────
function removeFile(type) {
  if (type === 'template') {
    templateImg = null;
    document.getElementById('template-file-tag').style.display = 'none';
    document.getElementById('template-zone').style.display     = 'block';
    document.getElementById('template-input').value            = '';
    document.getElementById('preview-canvas').style.display    = 'none';
    document.getElementById('preview-placeholder').style.display = 'block';
  } else {
    excelRows = []; excelCols = []; mapFields = [];
    document.getElementById('excel-file-tag').style.display  = 'none';
    document.getElementById('excel-zone').style.display      = 'block';
    document.getElementById('excel-input').value             = '';
    document.getElementById('rows-info').style.display       = 'none';
    document.getElementById('mapping-area').classList.remove('show');
    document.getElementById('mapping-placeholder').style.display = 'block';
    document.getElementById('map-rows').innerHTML            = '';
  }
  checkReady();
}

// ── Sample Data ────────────────────────────────────────────────
function loadSampleData() {
  excelRows = [
    { Name: 'Pruthviraj Thorbole', Course: 'Web Development', Date: '26 Apr 2025', ID: 'CX-001' },
    { Name: 'Aisha Sharma',        Course: 'Web Development', Date: '26 Apr 2025', ID: 'CX-002' },
    { Name: 'Rahul Mehta',         Course: 'Web Development', Date: '26 Apr 2025', ID: 'CX-003' }
  ];
  excelCols = ['Name', 'Course', 'Date', 'ID'];
  document.getElementById('excel-file-tag').style.display  = 'flex';
  document.getElementById('excel-zone').style.display      = 'none';
  document.getElementById('excel-name').textContent        = 'sample_data.xlsx';
  document.getElementById('rows-info').style.display       = 'block';
  document.getElementById('rows-badge').textContent        = excelRows.length + ' rows detected';
  setupMapping();
  populateNamingCol();
  updatePreview();
  checkReady();
  showToast('Sample data loaded!', 'success');
}

// ── Mapping ────────────────────────────────────────────────────
function setupMapping() {
  mapFields = [{ excelCol: excelCols[0], label: 'Name' }];
  document.getElementById('map-rows').innerHTML = '';
  document.getElementById('mapping-area').classList.add('show');
  document.getElementById('mapping-placeholder').style.display = 'none';
  renderMapRow(0);
}

function renderMapRow(idx) {
  var wrap = document.getElementById('map-rows');
  var row  = document.createElement('div');
  row.className = 'map-row';

  var sel = document.createElement('select');
  excelCols.forEach(function(c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = c;
    if (c === mapFields[idx].excelCol) o.selected = true;
    sel.appendChild(o);
  });
  sel.onchange = function(e) { mapFields[idx].excelCol = e.target.value; updatePreview(); };

  var arrow = document.createElement('div');
  arrow.className = 'map-arrow'; arrow.textContent = '→';

  var inp = document.createElement('input');
  inp.type = 'text'; inp.placeholder = 'Label on cert';
  inp.value = mapFields[idx].label || '';
  inp.onchange = function(e) { mapFields[idx].label = e.target.value; };

  row.appendChild(sel); row.appendChild(arrow); row.appendChild(inp);

  if (idx > 0) {
    var rb = document.createElement('button');
    rb.textContent = '✕';
    rb.style.cssText = 'background:none;border:none;color:var(--ink-3);cursor:pointer;font-size:.9rem;margin-left:4px;';
    rb.onclick = (function(i, r) {
      return function() { mapFields.splice(i, 1); r.remove(); updatePreview(); };
    })(idx, row);
    row.appendChild(rb);
  }
  wrap.appendChild(row);
  updatePreview();
}

function addMapRow() {
  if (!excelCols.length) return;
  mapFields.push({ excelCol: excelCols[0], label: '' });
  renderMapRow(mapFields.length - 1);
}

function populateNamingCol() {
  var sel = document.getElementById('naming-col');
  sel.innerHTML = '<option value="">— auto number —</option>';
  excelCols.forEach(function(c) {
    var o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
}

// ── Align ──────────────────────────────────────────────────────
function setAlign(a) {
  textAlign = a;
  ['left', 'center', 'right'].forEach(function(x) {
    document.getElementById('align-' + x).classList.toggle('active', x === a);
  });
  updatePreview();
}

// ── Preview ────────────────────────────────────────────────────
function updatePreview() {
  if (!templateImg) return;
  var canvas = document.getElementById('preview-canvas');
  var ctx    = canvas.getContext('2d');
  canvas.width  = templateImg.naturalWidth;
  canvas.height = templateImg.naturalHeight;
  ctx.drawImage(templateImg, 0, 0);

  var fontSize   = parseInt(document.getElementById('font-size').value)  || 36;
  var fontFamily = document.getElementById('font-family').value;
  var color      = document.getElementById('text-color').value;
  var xPct       = parseFloat(document.getElementById('pos-x').value) / 100;
  var yPct       = parseFloat(document.getElementById('pos-y').value) / 100;

  document.getElementById('color-hex').textContent = color;

  var sampleRow   = excelRows[0] || null;
  var displayText = (sampleRow && mapFields.length)
    ? (sampleRow[mapFields[0].excelCol] || 'Sample Name')
    : 'Sample Name';

  ctx.font         = fontSize + 'px "' + fontFamily + '"';
  ctx.fillStyle    = color;
  ctx.textAlign    = textAlign;
  ctx.textBaseline = 'middle';
  ctx.fillText(displayText, canvas.width * xPct, canvas.height * yPct);

  canvas.style.display = 'block';
  document.getElementById('preview-placeholder').style.display = 'none';
}

// ── Ready check ────────────────────────────────────────────────
function checkReady() {
  document.getElementById('generate-btn').disabled = !(templateImg && excelRows.length);
}

// ── Generate ───────────────────────────────────────────────────
function generateAll() {
  if (!templateImg || !excelRows.length) return;

  var btn      = document.getElementById('generate-btn');
  var progWrap = document.getElementById('progress-wrap');
  var fill     = document.getElementById('progress-fill');
  var label    = document.getElementById('progress-label');

  btn.disabled = true;
  progWrap.classList.add('show');

  var fmt        = document.getElementById('output-format').value;
  var namingCol  = document.getElementById('naming-col').value;
  var fontSize   = parseInt(document.getElementById('font-size').value) || 36;
  var fontFamily = document.getElementById('font-family').value;
  var color      = document.getElementById('text-color').value;
  var xPct       = parseFloat(document.getElementById('pos-x').value) / 100;
  var yPct       = parseFloat(document.getElementById('pos-y').value) / 100;

  var zip   = new JSZip();
  var total = excelRows.length;
  var i     = 0;

  function processNext() {
    if (i >= total) {
      // All done — pack ZIP
      label.textContent = 'Packing ZIP…';
      zip.generateAsync({ type: 'blob' }).then(function(blob) {
        saveAs(blob, 'certifyx_certificates.zip');
        fill.style.width  = '100%';
        label.textContent = 'Done! ' + total + ' certificates downloaded.';
        showToast(total + ' certificates generated!', 'success');
        setTimeout(function() {
          progWrap.classList.remove('show');
          fill.style.width = '0%';
          btn.disabled = false;
        }, 3000);
      });
      return;
    }

    var row    = excelRows[i];
    var canvas = document.createElement('canvas');
    canvas.width  = templateImg.naturalWidth;
    canvas.height = templateImg.naturalHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(templateImg, 0, 0);

    ctx.font         = fontSize + 'px "' + fontFamily + '"';
    ctx.fillStyle    = color;
    ctx.textAlign    = textAlign;
    ctx.textBaseline = 'middle';

    var gap = fontSize * 1.4;
    mapFields.forEach(function(f, fi) {
      ctx.fillText(row[f.excelCol] || '', canvas.width * xPct, canvas.height * yPct + fi * gap);
    });

    var ext    = fmt === 'jpeg' ? 'jpg' : 'png';
    var mime   = fmt === 'jpeg' ? 'image/jpeg' : 'image/png';
    var base64 = canvas.toDataURL(mime, 0.92).split(',')[1];

    var filename = (namingCol && row[namingCol])
      ? String(row[namingCol]).replace(/[^a-z0-9_\-\s]/gi, '_') + '_certificate.' + ext
      : 'certificate_' + String(i + 1).padStart(4, '0') + '.' + ext;

    zip.file(filename, base64, { base64: true });

    fill.style.width  = Math.round(((i + 1) / total) * 100) + '%';
    label.textContent = 'Generating ' + (i + 1) + ' of ' + total + '…';
    i++;

    // Yield every 10 items to keep UI responsive
    if (i % 10 === 0) {
      setTimeout(processNext, 0);
    } else {
      processNext();
    }
  }

  processNext();
}

// ── Toast ──────────────────────────────────────────────────────
function showToast(msg, type) {
  var t = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  document.getElementById('toast-icon').innerHTML = type === 'success'
    ? '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>'
    : '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>';
  t.className = 'toast ' + type + ' show';
  setTimeout(function() { t.classList.remove('show'); }, 4000);
}

// ── Init ───────────────────────────────────────────────────────
updateDots();
