<?php
/**
 * CertifyX — Bulk Certificate Generator
 * PHP entry point. All certificate generation runs in the browser (Canvas API).
 * PHP serves the HTML page. No server-side data processing required.
 */

// Simple PHP routing — in future you can add API endpoints here
$page = $_GET['page'] ?? 'home';
$allowed = ['home', 'how', 'generator', 'features'];
if (!in_array($page, $allowed)) $page = 'home';

// Map page name to index for JS
$pageIndex = array_search($page, $allowed);
if ($pageIndex === false) $pageIndex = 0;
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CertifyX — Bulk Certificate Generator</title>
  <meta name="description" content="Generate hundreds of personalized certificates in seconds. Upload your template and Excel sheet — CertifyX handles the rest." />
  <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" />
  <link href="https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="assets/style.css" />
</head>
<body>

<!-- ── NAVBAR ── -->
<nav id="navbar">
  <div class="logo">
    <div class="logo-badge">
      <svg viewBox="0 0 24 24"><path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" stroke="#c8893a" fill="none" stroke-width="1.8" stroke-linecap="round"/></svg>
    </div>
    CertifyX
  </div>
  <div class="nav-links">
    <button class="nav-link" onclick="goTo(0)">Home</button>
    <button class="nav-link" onclick="goTo(1)">How it works</button>
    <button class="nav-link" onclick="goTo(2)">Generator</button>
    <button class="nav-link" onclick="goTo(3)">Features</button>
  </div>
  <!-- page dots -->
  <div class="page-dots" id="page-dots">
    <button class="dot-btn active" onclick="goTo(0)" title="Home"></button>
    <button class="dot-btn" onclick="goTo(1)" title="How it works"></button>
    <button class="dot-btn" onclick="goTo(2)" title="Generator"></button>
    <button class="dot-btn" onclick="goTo(3)" title="Features"></button>
  </div>
</nav>

<!-- ── PAGE WRAPPER ── -->
<div id="page-wrapper">

  <!-- PAGE 0: HOME -->
  <div class="page active" id="page-0">
    <div class="page-inner center-content">
      <div class="hero-pill"><span class="hero-pill-dot"></span> Free &amp; open — no sign-up required</div>
      <h1>Generate <em>hundreds</em> of<br>certificates in seconds.</h1>
      <p class="hero-sub">Upload your certificate template and an Excel sheet. CertifyX places names, IDs, and dates automatically — then packages everything into a ready-to-download ZIP.</p>
      <div class="hero-actions">
        <button class="btn-primary" onclick="goTo(1)">
          See how it works
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <button class="btn-secondary" onclick="goTo(2)">Open Generator</button>
      </div>
      <div class="stats-bar">
        <div class="stat-item"><span class="stat-num" data-target="1000">0</span><span class="stat-label">certs per batch</span></div>
        <div class="stat-item"><span class="stat-num">PNG / JPEG</span><span class="stat-label">output formats</span></div>
        <div class="stat-item"><span class="stat-num">0 uploads</span><span class="stat-label">runs in your browser</span></div>
      </div>
    </div>
    <button class="page-nav-btn page-nav-next" onclick="goTo(1)" title="Next">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
    </button>
  </div>

  <!-- PAGE 1: HOW IT WORKS -->
  <div class="page" id="page-1">
    <div class="page-inner">
      <button class="page-nav-btn page-nav-prev" onclick="goTo(0)" title="Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <div class="section-tag">Workflow</div>
      <div class="section-title">Three steps. That's it.</div>
      <p class="section-sub">No accounts, no cloud uploads, no waiting. Everything runs right in your browser.</p>
      <div class="how-grid">
        <div class="how-card" style="--delay:.05s">
          <div class="how-num">01</div>
          <div class="how-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
          <h3>Upload your template</h3>
          <p>Drop in any certificate image (PNG, JPG). CertifyX uses it as the background for every certificate.</p>
        </div>
        <div class="how-card" style="--delay:.15s">
          <div class="how-num">02</div>
          <div class="how-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
          <h3>Upload Excel data</h3>
          <p>Upload your spreadsheet (.xlsx or .csv) with names, IDs, dates — any columns you need.</p>
        </div>
        <div class="how-card" style="--delay:.25s">
          <div class="how-num">03</div>
          <div class="how-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
          <h3>Download your ZIP</h3>
          <p>Hit generate. Every certificate is rendered and packed into a ZIP file — ready to send.</p>
        </div>
      </div>
      <div style="text-align:center;margin-top:2.5rem">
        <button class="btn-primary" onclick="goTo(2)">
          Open Generator
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
      <button class="page-nav-btn page-nav-next" onclick="goTo(2)" title="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
    </div>
  </div>

  <!-- PAGE 2: GENERATOR -->
  <div class="page" id="page-2">
    <div class="page-inner">
      <button class="page-nav-btn page-nav-prev" onclick="goTo(1)" title="Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <div class="section-tag">Generator</div>
      <div class="section-title">CertifyX Studio</div>
      <div class="app-container">
        <div class="app-header">
          <div class="dot-row"><div class="dot dot-r"></div><div class="dot dot-y"></div><div class="dot dot-g"></div></div>
          <div class="app-header-text"><h2>CertifyX Studio</h2><p>Configure → Preview → Generate</p></div>
        </div>
        <div class="app-body">
          <!-- LEFT PANEL -->
          <div class="panel" id="left-panel">
            <div class="panel-title">Certificate template</div>
            <div class="upload-zone" id="template-zone" ondragover="onDrag(event,'template-zone')" ondragleave="offDrag('template-zone')" ondrop="onDrop(event,'template')">
              <input type="file" accept="image/*" id="template-input" onchange="handleTemplate(event)" />
              <div class="upload-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg></div>
              <h4>Certificate image</h4>
              <p>Drop PNG/JPG or <span>Browse files</span></p>
            </div>
            <div id="template-file-tag" style="display:none" class="file-tag">
              <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span id="template-name">template.png</span>
              <button class="remove-btn" onclick="removeFile('template')">&times;</button>
            </div>
            <div class="divider"></div>
            <div class="panel-title">Data file</div>
            <div class="upload-zone" id="excel-zone" ondragover="onDrag(event,'excel-zone')" ondragleave="offDrag('excel-zone')" ondrop="onDrop(event,'excel')">
              <input type="file" accept=".xlsx,.xls,.csv" id="excel-input" onchange="handleExcel(event)" />
              <div class="upload-icon"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
              <h4>Excel / CSV file</h4>
              <p>Drop .xlsx or .csv or <span>Browse files</span></p>
            </div>
            <div id="excel-file-tag" style="display:none" class="file-tag">
              <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <span id="excel-name">data.xlsx</span>
              <button class="remove-btn" onclick="removeFile('excel')">&times;</button>
            </div>
            <button class="sample-link" onclick="loadSampleData()">&#9654; Load sample data</button>
            <div id="rows-info" style="display:none;margin-top:8px"><span class="rows-badge" id="rows-badge">0 rows</span></div>
            <div class="divider"></div>
            <div class="panel-title">Field mapping</div>
            <p style="font-size:.78rem;color:var(--ink-3);margin-bottom:1rem;">Map Excel columns → certificate text</p>
            <div id="mapping-area" class="mapping-area"><div id="map-rows"></div><button class="add-field-btn" onclick="addMapRow()">+ Add another field</button></div>
            <div id="mapping-placeholder" style="font-size:.8rem;color:var(--ink-3);padding:1rem;text-align:center;border:1px dashed var(--border);border-radius:8px;">Upload an Excel file to configure field mapping</div>
            <div class="divider"></div>
            <div class="panel-title">Text style</div>
            <div class="style-grid">
              <div>
                <label class="field-label" for="font-family">Font family</label>
                <select class="field-input" id="font-family" onchange="updatePreview()">
                  <option value="Arial">Arial</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Courier New">Courier New</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Palatino Linotype">Palatino Linotype</option>
                </select>
              </div>
              <div>
                <label class="field-label" for="font-size">Font size (px)</label>
                <input type="number" class="field-input" id="font-size" value="36" min="10" max="120" onchange="updatePreview()" />
              </div>
            </div>
            <div>
              <label class="field-label">Text color</label>
              <div class="color-row">
                <input type="color" id="text-color" value="#1a1a1a" onchange="updatePreview()" />
                <span style="font-size:.8rem;color:var(--ink-3);" id="color-hex">#1a1a1a</span>
                <div class="align-btns" style="margin-left:auto">
                  <button class="align-btn active" id="align-left" onclick="setAlign('left')" title="Left"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg></button>
                  <button class="align-btn" id="align-center" onclick="setAlign('center')" title="Center"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="7" y1="12" x2="17" y2="12"/><line x1="5" y1="18" x2="19" y2="18"/></svg></button>
                  <button class="align-btn" id="align-right" onclick="setAlign('right')" title="Right"><svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg></button>
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="panel-title">Text position</div>
            <div class="position-grid">
              <div><label class="field-label" for="pos-x">X position (%)</label><input type="number" class="field-input" id="pos-x" value="50" min="0" max="100" onchange="updatePreview()" /></div>
              <div><label class="field-label" for="pos-y">Y position (%)</label><input type="number" class="field-input" id="pos-y" value="58" min="0" max="100" onchange="updatePreview()" /></div>
            </div>
            <p style="font-size:.75rem;color:var(--ink-3);margin-top:6px;">50, 50 = center of certificate.</p>
          </div>
          <!-- RIGHT PANEL -->
          <div class="panel" style="display:flex;flex-direction:column;">
            <div class="panel-title">Preview</div>
            <div class="preview-wrap" id="preview-wrap">
              <div class="preview-placeholder" id="preview-placeholder">
                <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                <p>Upload a template to see preview</p>
              </div>
              <canvas id="preview-canvas" style="display:none"></canvas>
            </div>
            <div style="flex:1"></div>
            <div style="margin-top:auto">
              <div class="panel-title" style="margin-top:1rem">Output settings</div>
              <div class="style-grid">
                <div><label class="field-label" for="output-format">Format</label><select class="field-input" id="output-format"><option value="png">PNG image</option><option value="jpeg">JPEG image</option></select></div>
                <div><label class="field-label" for="naming-col">File naming column</label><select class="field-input" id="naming-col"><option value="">— auto number —</option></select></div>
              </div>
            </div>
          </div>
        </div>
        <div class="generate-wrap">
          <button class="generate-btn" id="generate-btn" onclick="generateAll()" disabled>
            <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
            Generate &amp; Download ZIP
          </button>
          <div class="progress-wrap" id="progress-wrap">
            <div class="progress-bar-track"><div class="progress-bar-fill" id="progress-fill"></div></div>
            <div class="progress-label" id="progress-label">Processing...</div>
          </div>
        </div>
      </div>
      <button class="page-nav-btn page-nav-next" onclick="goTo(3)" title="Next">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 9l6 6 6-6"/></svg>
      </button>
    </div>
  </div>

  <!-- PAGE 3: FEATURES -->
  <div class="page" id="page-3">
    <div class="page-inner">
      <button class="page-nav-btn page-nav-prev" onclick="goTo(2)" title="Back">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 15l-6-6-6 6"/></svg>
      </button>
      <div class="section-tag">Features</div>
      <div class="section-title">Everything you need.</div>
      <div class="features-grid">
        <div class="feature-card" style="--delay:.05s">
          <div class="feature-icon" style="background:#f0f8f4"><svg viewBox="0 0 24 24" stroke="var(--green)" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg></div>
          <h3>100% private</h3>
          <p>Your files never leave your browser. No servers, no tracking, no data collection. Ever.</p>
        </div>
        <div class="feature-card" style="--delay:.1s">
          <div class="feature-icon" style="background:#fef5e8"><svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
          <h3>Blazing fast</h3>
          <p>Generate 500 certificates in under 30 seconds. Powered by native Canvas API.</p>
        </div>
        <div class="feature-card" style="--delay:.15s">
          <div class="feature-icon" style="background:#f0f3fe"><svg viewBox="0 0 24 24" stroke="#534AB7" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg></div>
          <h3>Flexible field mapping</h3>
          <p>Map as many columns as you want — Name, ID, course, date, score.</p>
        </div>
        <div class="feature-card" style="--delay:.2s">
          <div class="feature-icon" style="background:#fef0f0"><svg viewBox="0 0 24 24" stroke="var(--red)" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg></div>
          <h3>Excel &amp; CSV ready</h3>
          <p>Works with .xlsx, .xls, and .csv. Auto-detects column headers.</p>
        </div>
        <div class="feature-card" style="--delay:.25s">
          <div class="feature-icon" style="background:#f0f8f4"><svg viewBox="0 0 24 24" stroke="var(--green)" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5"/></svg></div>
          <h3>Live preview</h3>
          <p>Instantly preview your first certificate before generating the batch.</p>
        </div>
        <div class="feature-card" style="--delay:.3s">
          <div class="feature-icon" style="background:#fef5e8"><svg viewBox="0 0 24 24" stroke="var(--accent)" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg></div>
          <h3>ZIP download</h3>
          <p>All certificates packed into a single ZIP — named by your chosen column.</p>
        </div>
      </div>
      <footer><strong>CertifyX</strong> &copy; <?php echo date('Y'); ?>. All processing happens locally in your browser.</footer>
    </div>
  </div>

</div><!-- end page-wrapper -->

<!-- TOAST -->
<div class="toast" id="toast">
  <svg viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" id="toast-icon"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
  <span id="toast-msg">Done!</span>
</div>

<!-- CDN Libraries -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js"></script>
<script src="assets/app.js"></script>

<!-- Pass PHP initial page index to JS -->
<script>
  // Navigate to the page requested via PHP query string (e.g. ?page=generator)
  (function() {
    var startPage = <?php echo (int)$pageIndex; ?>;
    if (startPage > 0) {
      // Use a tiny delay so DOM is fully painted before animating
      requestAnimationFrame(function() { goTo(startPage); });
    }
  })();
</script>

</body>
</html>
