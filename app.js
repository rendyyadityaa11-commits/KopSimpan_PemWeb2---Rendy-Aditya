(function () {
  'use strict';

  const root = document.getElementById('app');
  if (!root) return;

  const page = root.dataset.page || 'login';
  const base = ['login', 'admin-dashboard', 'member-dashboard'].includes(page) ? '.' : '..';
  const storeKeys = {
    members: 'kopsimpan_members_v1',
    transactions: 'kopsimpan_transactions_v1',
    loans: 'kopsimpan_loans_v1',
    applications: 'kopsimpan_applications_v1',
    session: 'kopsimpan_session_v1',
    theme: 'kopsimpan_theme_v1',
    accounts: 'kopsimpan_accounts_v1'
  };
  const rupiah = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat('id-ID');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  let charts = [];
  let pendingDeleteId = null;
  let loginRole = 'admin';

  const seed = {
    members: [
      { id: 'A001', name: 'Siti Aminah', nik: '3276011204900001', phone: '081234567801', email: 'siti.aminah@email.com', type: 'Anggota Aktif', joinDate: '2025-04-12', savings: 1250000, loan: 3000000, status: 'Aktif', address: 'Jl. Melati No. 12, Depok' },
      { id: 'A004', name: 'Budi Santoso', nik: '3276012501880004', phone: '081234567804', email: 'budi.santoso@email.com', type: 'Anggota Aktif', joinDate: '2025-05-03', savings: 875000, loan: 4500000, status: 'Aktif', address: 'Jl. Kenanga No. 8, Depok' },
      { id: 'A007', name: 'Rina Wijaya', nik: '3276016402920007', phone: '081234567807', email: 'rina.wijaya@email.com', type: 'Anggota Aktif', joinDate: '2025-07-19', savings: 2450000, loan: 1800000, status: 'Aktif', address: 'Jl. Mawar No. 21, Bogor' },
      { id: 'A009', name: 'Dimas Pratama', nik: '3276010907950009', phone: '081234567809', email: 'dimas.pratama@email.com', type: 'Anggota Baru', joinDate: '2026-08-02', savings: 650000, loan: 0, status: 'Menunggu Verifikasi', address: 'Jl. Anggrek No. 6, Depok' },
      { id: 'A012', name: 'Nurul Hidayah', nik: '3276015303970012', phone: '081234567812', email: 'nurul.hidayah@email.com', type: 'Anggota Aktif', joinDate: '2026-01-10', savings: 975000, loan: 2200000, status: 'Aktif', address: 'Jl. Dahlia No. 17, Jakarta Selatan' }
    ],
    transactions: [
      { id: 'STR-2026-089', memberId: 'A001', memberName: 'Siti Aminah', type: 'Angsuran Pinjaman', amount: 479167, method: 'Transfer Bank', date: '2026-10-16', status: 'Menunggu Cek', loanRef: 'PJ-082', installment: 'Ke-3 dari 12' },
      { id: 'STR-2026-090', memberId: 'A004', memberName: 'Budi Santoso', type: 'Angsuran Pinjaman', amount: 520000, method: 'Transfer Bank', date: '2026-10-16', status: 'Menunggu Cek', loanRef: 'PJ-079', installment: 'Ke-6 dari 10' },
      { id: 'STR-2026-091', memberId: 'A007', memberName: 'Rina Wijaya', type: 'Setoran Simpanan', amount: 438334, method: 'Tunai/Kasir', date: '2026-10-15', status: 'Menunggu Cek', loanRef: '-', installment: '-' },
      { id: 'STR-2026-088', memberId: 'A012', memberName: 'Nurul Hidayah', type: 'Simpanan Wajib', amount: 150000, method: 'Tunai/Kasir', date: '2026-10-14', status: 'Terverifikasi', loanRef: '-', installment: '-' },
      { id: 'STR-2026-087', memberId: 'A001', memberName: 'Siti Aminah', type: 'Simpanan Sukarela', amount: 250000, method: 'Transfer Bank', date: '2026-10-12', status: 'Terverifikasi', loanRef: '-', installment: '-' }
    ],
    loans: [
      { id: 'PJ-082', memberId: 'A001', memberName: 'Siti Aminah', purpose: 'Modal Usaha Warung', principal: 5000000, remaining: 3500000, installment: 479167, duration: 12, paid: 3, date: '2026-08-01', status: 'Berjalan', dueDate: '2026-10-20' },
      { id: 'PJ-079', memberId: 'A004', memberName: 'Budi Santoso', purpose: 'Renovasi Toko Kelontong', principal: 5200000, remaining: 2080000, installment: 520000, duration: 10, paid: 6, date: '2026-05-10', status: 'Berjalan', dueDate: '2026-10-22' },
      { id: 'PJ-084', memberId: 'A007', memberName: 'Rina Wijaya', purpose: 'Modal Jahit dan Konveksi', principal: 2600000, remaining: 1733334, installment: 433334, duration: 6, paid: 2, date: '2026-08-22', status: 'Berjalan', dueDate: '2026-10-25' },
      { id: 'PJ-088', memberId: 'A009', memberName: 'Dimas Pratama', purpose: 'Peralatan Usaha', principal: 7500000, remaining: 7500000, installment: 625000, duration: 12, paid: 0, date: '2026-10-14', status: 'Menunggu Persetujuan', dueDate: '2026-11-15' }
    ],
    applications: [
      { id: 'PG-2026-041', memberId: 'A009', memberName: 'Dimas Pratama', type: 'Pendaftaran Anggota', date: '2026-10-14', amount: 0, status: 'Menunggu Verifikasi', note: 'Dokumen identitas perlu dicek.' },
      { id: 'PG-2026-040', memberId: 'A009', memberName: 'Dimas Pratama', type: 'Pengajuan Pinjaman', date: '2026-10-13', amount: 7500000, status: 'Menunggu Verifikasi', note: 'Pengajuan modal peralatan usaha.' },
      { id: 'PG-2026-039', memberId: 'A007', memberName: 'Rina Wijaya', type: 'Perubahan Data', date: '2026-10-11', amount: 0, status: 'Diproses', note: 'Pembaruan alamat domisili.' },
      { id: 'PG-2026-038', memberId: 'A012', memberName: 'Nurul Hidayah', type: 'Penutupan Simpanan', date: '2026-10-09', amount: 300000, status: 'Disetujui', note: 'Menunggu proses administrasi akhir.' }
    ]
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); return true; }
    catch (error) { console.error('KopSimpan: penyimpanan lokal gagal.', error); return false; }
  }
  function initData() {
    Object.keys(seed).forEach((key) => {
      if (read(storeKeys[key], null) === null) write(storeKeys[key], seed[key]);
    });
    if (read(storeKeys.accounts, null) === null) write(storeKeys.accounts, [
      { email: 'admin@kopsimpan.id', password: 'admin123', role: 'admin', name: 'Ahmad Fauzi', id: '20240901', active: true },
      { email: 'anggota@kopsimpan.id', password: 'anggota123', role: 'member', name: 'Siti Aminah', id: 'A001', memberId: 'A001', active: true },
      ...seed.members.map(m => ({ email: m.email, password: 'anggota123', role: 'member', name: m.name, id: m.id, memberId: m.id, active: m.status !== 'Nonaktif' }))
    ]);
  }
  function getData(key) { return read(storeKeys[key], seed[key]); }
  function setData(key, value) { write(storeKeys[key], value); }
  function escapeHTML(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  }
  function fmtCurrency(value) { return rupiah.format(Number(value) || 0).replace(/,00$/, ''); }
  function compactCurrency(value) {
    const n = Number(value) || 0;
    if (n >= 1000000000) return `Rp ${(n / 1000000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} M`;
    if (n >= 1000000) return `Rp ${(n / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} jt`;
    return fmtCurrency(n);
  }
  function fmtDate(value) {
    if (!value) return '-';
    const d = new Date(`${value}T00:00:00`);
    if (Number.isNaN(d.getTime())) return value;
    return d.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  function initials(name) { return String(name || 'KS').split(/\s+/).slice(0, 2).map((part) => part[0] || '').join('').toUpperCase(); }
  function icon(name, extra = '') { return `<span class="material-symbols-outlined ${extra}">${name}</span>`; }
  function statusClass(status) {
    if (/aktif|berjalan|terverifikasi|disetujui|lunas/i.test(status)) return 'pill-success';
    if (/menunggu|diproses|pending/i.test(status)) return 'pill-warning';
    if (/ditolak|macet|terlambat/i.test(status)) return 'pill-danger';
    if (/baru|info/i.test(status)) return 'pill-info';
    return 'pill-neutral';
  }
  function statusPill(status) { return `<span class="pill ${statusClass(status)}">${escapeHTML(status)}</span>`; }
  function navLink(id, label, symbol, href) {
    return `<a class="${page === id ? 'active' : ''}" href="${href}">${icon(symbol)}<span>${label}</span></a>`;
  }
  function renderLogin() {
    document.title = 'Masuk | KopSimpan';
    document.body.classList.add('login-body');
    root.innerHTML = `
      <main class="login-layout">
        <section class="login-brand" aria-label="Tentang KopSimpan">
          <a class="brand-lockup" href="index.html" aria-label="KopSimpan beranda">
            <div class="brand-mark">${icon('eco')}</div>
            <div><div class="brand-name">KopSimpan</div><div class="brand-tagline">FINTECH KOPERASI</div></div>
          </a>
          <div class="login-hero">
            <span class="eyebrow">${icon('verified_user')} Koperasi aman dan transparan</span>
            <h1>Kelola keuangan bersama, <span>tumbuh lebih baik.</span></h1>
            <p>Platform operasional koperasi yang membantu pengurus mengelola anggota, simpanan, pinjaman, dan laporan dalam satu tempat.</p>
            <div class="hero-points">
              <div class="hero-point">${icon('shield_with_heart')} Data tertata</div>
              <div class="hero-point">${icon('monitoring')} Ringkasan real-time</div>
              <div class="hero-point">${icon('groups')} Berbasis gotong royong</div>
            </div>
          </div>
          <div class="login-footer-note">KopSimpan Platform Finansial Terpadu · Demo tugas Pemrograman Web 2</div>
        </section>
        <section class="login-card" aria-labelledby="login-title">
          <div class="login-card-head">
            <div class="brand-mark">${icon('eco')}</div>
            <h2 id="login-title">Selamat datang kembali</h2>
            <p>Masuk ke ruang kerja KopSimpan</p>
          </div>
          <div class="login-tabs" role="tablist" aria-label="Jenis akun">
            <button class="active" type="button" data-role="admin">Petugas / Admin</button>
            <button type="button" data-role="member">Anggota / Nasabah</button>
          </div>
          <form id="login-form">
            <div class="form-field"><label for="login-email">Email atau Username</label><div class="input-wrap">${icon('mail')}<input id="login-email" name="email" type="text" value="admin@kopsimpan.id" placeholder="nama@kopsimpan.id" autocomplete="username" required></div></div>
            <div class="form-field"><label for="login-password">Kata Sandi</label><div class="input-wrap">${icon('lock')}<input id="login-password" name="password" type="password" value="admin123" placeholder="Masukkan kata sandi" autocomplete="current-password" required><button class="password-toggle" type="button" data-action="toggle-password" aria-label="Tampilkan kata sandi">${icon('visibility')}</button></div></div>
            <div class="login-remember"><label class="checkline"><input type="checkbox" checked> Ingat saya</label><a href="#bantuan" class="text-link" data-action="login-help">Butuh bantuan?</a></div>
            <button class="btn btn-primary btn-block" type="submit">Masuk ke Dashboard ${icon('arrow_forward')}</button>
          </form>
          <div class="login-demo"><strong>Akun demo</strong><br>Admin: admin@kopsimpan.id / admin123<br>Anggota: anggota@kopsimpan.id / anggota123<br><span>Data contoh tersimpan di browser, tanpa server atau database.</span></div>
          <div class="login-card-foot">${icon('verified_user')} Simulasi antarmuka untuk pembelajaran · Tidak memproses data keuangan nyata</div>
        </section>
      </main>`;
  }

  function renderShell(content) {
    document.body.classList.remove('login-body');
    const session = read(storeKeys.session, { name: 'Ahmad Fauzi', role: 'SUPER ADMIN', id: '20240901' }) || { name: 'Ahmad Fauzi', role: 'SUPER ADMIN', id: '20240901' };
    const nav = `
      ${navLink('dashboard', 'Dashboard', 'space_dashboard', `${base}/pages/dashboard.html`)}
      ${navLink('anggota', 'Data Anggota', 'groups', `${base}/pages/anggota.html`)}
      ${navLink('form-anggota', 'Form Anggota', 'person_add', `${base}/pages/form-anggota.html`)}
      ${navLink('transaksi', 'Transaksi Simpanan', 'account_balance_wallet', `${base}/pages/transaksi.html`)}
      ${navLink('pinjaman', 'Pinjaman & Setoran', 'payments', `${base}/pages/pinjaman.html`)}
      ${navLink('pengajuan', 'Status Pengajuan', 'pending_actions', `${base}/pages/pengajuan.html`)}
      ${navLink('admin-verifikasi', 'Verifikasi Pinjaman', 'fact_check', `${base}/pages/verifikasi-transaksi.html`)}
      ${navLink('admin-anggota', 'Kelola Akun Anggota', 'manage_accounts', `${base}/pages/kelola-anggota.html`)}
      ${navLink('laporan', 'Laporan & Cetak', 'summarize', `${base}/pages/laporan.html`)}`;
    root.innerHTML = `
      <div class="app-layout">
        <aside class="sidebar" id="sidebar">
          <a class="brand-lockup" href="${base}/pages/dashboard.html"><div class="brand-mark">${icon('eco')}</div><div><div class="brand-name">KopSimpan</div><div class="brand-tagline">FINTECH KOPERASI</div></div></a>
          <div class="role-card"><div class="role-icon">${icon('admin_panel_settings')}</div><div><strong>Petugas Admin</strong><small>● ${escapeHTML(session.role || 'SUPER ADMIN')}</small></div></div>
          <div class="nav-label">Menu Utama</div><nav class="side-nav" aria-label="Navigasi utama">${nav}</nav>
          <div class="sidebar-bottom"><strong>${icon('verified_user')} Sistem Terverifikasi</strong>Koperasi Simpan Pinjam<br>Gotong Royong Digital · v1.0</div>
        </aside>
        <div class="sidebar-backdrop" data-action="close-sidebar"></div>
        <div class="main-area">
          <header class="topbar">
            <div class="topbar-left">
              <button class="top-icon mobile-menu" type="button" data-action="toggle-sidebar" aria-label="Buka menu">${icon('menu')}</button>
              <div class="breadcrumbs">${icon('home')} <span>/</span> <strong>Admin</strong> <span>/</span> <span>${pageTitle()}</span></div>
              <div class="global-search">${icon('search')}<input type="search" data-global-search placeholder="Cari anggota, NIK, transaksi..." aria-label="Cari seluruh data"></div>
            </div>
            <div class="topbar-right">
              <button class="top-icon" type="button" data-action="toggle-theme" aria-label="Ganti tema">${icon('dark_mode')}</button>
              <button class="top-icon" type="button" data-action="notifications" aria-label="Notifikasi">${icon('notifications')}<span class="notification-dot"></span></button>
              <div class="profile-pill"><div class="avatar">${initials(session.name || 'Ahmad Fauzi')}</div><div class="profile-copy"><strong>${escapeHTML(session.name || 'Ahmad Fauzi')}</strong><small>NIP. ${escapeHTML(session.id || '20240901')}</small></div></div>
              <button class="btn btn-danger btn-small" type="button" data-action="logout">${icon('logout')} Keluar</button>
            </div>
          </header>
          <main class="page-content">${content}</main>
          <footer class="page-footer"><span>KopSimpan Platform Finansial Terpadu · v1.0</span><span>Demo pembelajaran · Data simulasi</span></footer>
        </div>
      </div>
      <div id="modal-host"></div><div class="toast-container" id="toast-container" aria-live="polite"></div>`;
    if (read(storeKeys.theme, 'light') === 'dark') document.body.classList.add('dark-mode');
    else document.body.classList.remove('dark-mode');
  }
  function pageTitle() {
    return ({ dashboard: 'Ringkasan', 'admin-dashboard': 'Ringkasan', anggota: 'Data Anggota', 'form-anggota': 'Form Anggota', transaksi: 'Transaksi Simpanan', pinjaman: 'Pinjaman & Setoran', pengajuan: 'Status Pengajuan', laporan: 'Laporan & Cetak', 'dashboard-anggota': 'Dashboard Anggota', 'member-dashboard': 'Dashboard Anggota', 'admin-verifikasi': 'Verifikasi Transaksi', 'admin-anggota': 'Kelola Anggota', 'member-pengajuan': 'Pengajuan Pinjaman' })[page] || 'Admin';
  }
  function statCard(label, value, symbol, foot, color = '', trend = '') {
    return `<article class="stat-card"><div class="stat-top"><div class="stat-label">${label}</div><div class="stat-icon ${color}">${icon(symbol)}</div></div><div class="stat-value">${value}</div><div class="stat-foot"><span>${foot}</span>${trend ? `<span class="trend">${icon('trending_up')} ${trend}</span>` : ''}</div></article>`;
  }
  function memberAvatar(name, idx = 0) {
    const colors = ['', 'blue', 'gold', 'pink'];
    return `<span class="member-avatar ${colors[idx % colors.length]}">${initials(name)}</span>`;
  }
  function dashboardContent() {
    const members = getData('members');
    const transactions = getData('transactions');
    const loans = getData('loans');
    const totalSavings = members.reduce((sum, member) => sum + Number(member.savings || 0), 0);
    const activeLoans = loans.filter((loan) => ['Berjalan', 'Aktif'].includes(loan.status));
    const totalLoans = activeLoans.reduce((sum, loan) => sum + Number(loan.principal || 0), 0);
    const pending = transactions.filter((item) => item.status === 'Menunggu Cek');
    const rows = pending.slice(0, 4).map((item, index) => `<tr>
      <td><strong>${escapeHTML(item.id)}</strong></td>
      <td><div class="member-cell">${memberAvatar(item.memberName, index)}<div><strong>${escapeHTML(item.memberName)}</strong><small>ID: ${escapeHTML(item.memberId)}</small></div></div></td>
      <td>${escapeHTML(item.type)}<small style="display:block;color:#87968b;margin-top:3px">${escapeHTML(item.loanRef || '-')}</small></td>
      <td>${escapeHTML(item.installment || '-')}</td><td class="currency">${fmtCurrency(item.amount)}</td>
      <td>${statusPill(item.status)}</td><td><button class="btn btn-primary btn-small" data-action="verify-transaction" data-id="${escapeHTML(item.id)}">${icon('task_alt')} Verifikasi</button></td>
    </tr>`).join('');
    return `
      <div class="notice-banner" id="operational-notice"><div class="notice-icon">${icon('campaign')}</div><div class="notice-text"><strong>Pemberitahuan Operasional</strong>${pending.length} setoran menunggu verifikasi. Pastikan bukti pembayaran diperiksa sebelum penutupan kas.</div><span class="notice-tag">● PRIORITAS KASIR</span><button class="notice-close" data-action="dismiss-banner" aria-label="Tutup pemberitahuan">${icon('close')}</button></div>
      <div class="stats-grid">
        ${statCard('Anggota Aktif', `${members.filter(m => m.status === 'Aktif').length} <span style="font-size:14px;font-weight:600;letter-spacing:0">Orang</span>`, 'groups', `Total ${members.length} terdaftar`, '', '+1 bln ini')}
        ${statCard('Total Simpanan', compactCurrency(totalSavings), 'account_balance_wallet', 'Simpanan pokok, wajib, sukarela', '', '+8,2%')}
        ${statCard('Pinjaman Beredar', compactCurrency(totalLoans), 'payments', `${activeLoans.length} pinjaman berjalan`, 'blue', 'Aktif')}
        ${statCard('Setoran Menunggu Cek', `${pending.length} <span style="font-size:14px;font-weight:600;letter-spacing:0">Berkas</span>`, 'pending_actions', `Total ${fmtCurrency(pending.reduce((s,t)=>s+t.amount,0))}`, 'gold', 'Perlu verifikasi')}
      </div>
      <div class="content-grid">
        <section class="panel"><div class="panel-head"><div><h2>Statistik Arus Kas</h2><p>Perbandingan dana masuk dan pinjaman yang dicairkan per bulan</p></div><div class="panel-actions"><select id="chart-period" aria-label="Periode grafik"><option value="6">6 Bulan Terakhir</option><option value="4">4 Bulan Terakhir</option></select><button class="icon-btn" data-action="export-csv" data-kind="transactions" aria-label="Ekspor transaksi">${icon('download')}</button></div></div>
          <div class="chart-legend"><span class="legend-item"><i class="legend-dot" style="background:#005136"></i>Simpanan Masuk</span><span class="legend-item"><i class="legend-dot" style="background:#ffc247"></i>Pinjaman Dicairkan</span><span style="margin-left:auto">Skala: Rupiah</span></div>
          <div class="chart-wrap"><canvas id="cashflow-chart" aria-label="Grafik arus kas simpanan dan pinjaman"></canvas></div>
          <div class="health-strip"><div>● Rasio Likuiditas Kas<strong>136% <span class="pill pill-success">Sehat</span></strong></div><div>● NPL / Kredit Macet<strong>0,0% <span class="pill pill-success">Risiko rendah</span></strong></div></div>
        </section>
        <section class="panel"><div class="panel-head"><div><h2>Distribusi Portofolio Pinjaman</h2><p>Berdasarkan status pinjaman aktif</p></div><button class="icon-btn" aria-label="Informasi portofolio" data-action="portfolio-info">${icon('pie_chart')}</button></div>
          <div class="chart-wrap doughnut"><canvas id="portfolio-chart" aria-label="Grafik distribusi pinjaman"></canvas></div>
          <div class="portfolio-list"><div class="portfolio-row"><div class="portfolio-label"><i class="legend-dot" style="background:#07558e"></i><span>Berjalan (Lancar)</span></div><span class="portfolio-amount">${activeLoans.length} pinjaman</span></div><div class="portfolio-row"><div class="portfolio-label"><i class="legend-dot" style="background:#005136"></i><span>Lunas Tepat Waktu</span></div><span class="portfolio-amount">2 pinjaman</span></div><div class="portfolio-row"><div class="portfolio-label"><i class="legend-dot" style="background:#ffc247"></i><span>Menunggu Verifikasi</span></div><span class="portfolio-amount">${loans.filter(l => /Menunggu/.test(l.status)).length} berkas</span></div><div class="portfolio-row"><div class="portfolio-label"><i class="legend-dot" style="background:#c93434"></i><span>Menunggak lebih dari 30 hari</span></div><span class="portfolio-amount">0 berkas</span></div></div>
        </section>
      </div>
      <section class="panel table-panel" style="margin-bottom:18px"><div class="panel-head"><div><h2>Setoran Angsuran Menunggu Pengecekan Admin</h2><p>Validasi bukti transfer atau setoran loket sebelum saldo dibukukan ke buku tabungan.</p></div><div class="heading-actions"><a class="btn btn-secondary btn-small" href="${base}/pages/transaksi.html">Buka Panel Setoran ${icon('arrow_forward')}</a></div></div>
        <div class="table-wrap"><table><thead><tr><th>No. Setoran</th><th>Anggota & ID</th><th>Rincian</th><th>Angsuran ke</th><th>Jumlah</th><th>Status</th><th>Tindakan</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty-state">${icon('task_alt')}<strong>Tidak ada setoran tertunda</strong><br>Semua transaksi sudah diperiksa.</div></td></tr>`}</tbody></table></div>
        <div class="table-foot"><span>Menampilkan ${Math.min(pending.length, 4)} dari ${pending.length} setoran tertunda</span><a class="text-link" href="${base}/pages/transaksi.html">Lihat semua transaksi →</a></div>
      </section>
      <section class="panel"><div class="panel-head"><div><h2>Pintas Operasional Pengurus</h2><p>Akses cepat untuk pekerjaan harian koperasi.</p></div></div><div class="quick-actions"><a class="quick-action" href="${base}/pages/form-anggota.html">${icon('person_add')} Tambah Anggota Baru</a><button class="quick-action" data-action="open-transaction-modal">${icon('point_of_sale')} Catat Setoran Tunai</button><a class="quick-action" href="${base}/pages/laporan.html">${icon('print')} Cetak Laporan</a></div></section>`;
  }

  function membersContent() {
    const members = getData('members');
    const rows = members.map((m, i) => `<tr data-row-search="${escapeHTML(`${m.name} ${m.id} ${m.nik} ${m.phone} ${m.email}`.toLowerCase())}" data-status="${escapeHTML(m.status)}">
      <td><strong>${escapeHTML(m.id)}</strong><small style="display:block;color:#89978d;margin-top:3px">${fmtDate(m.joinDate)}</small></td>
      <td><div class="member-cell">${memberAvatar(m.name, i)}<div><strong>${escapeHTML(m.name)}</strong><small>${escapeHTML(m.email || '-')}</small></div></div></td>
      <td>${escapeHTML(m.nik)}</td><td>${escapeHTML(m.phone)}</td><td class="currency">${fmtCurrency(m.savings)}</td><td>${statusPill(m.status)}</td>
      <td><div class="action-group"><a class="icon-btn" href="${base}/pages/form-anggota.html?id=${encodeURIComponent(m.id)}" title="Edit anggota" aria-label="Edit anggota">${icon('edit')}</a><button class="icon-btn" data-action="view-member" data-id="${escapeHTML(m.id)}" title="Detail anggota" aria-label="Detail anggota">${icon('visibility')}</button><button class="icon-btn danger" data-action="delete-member" data-id="${escapeHTML(m.id)}" title="Hapus anggota" aria-label="Hapus anggota">${icon('delete')}</button></div></td>
    </tr>`).join('');
    return `<div class="page-heading"><div><h1>Data Anggota</h1><p>Kelola identitas, status keanggotaan, dan saldo simpanan anggota koperasi.</p></div><div class="heading-actions"><button class="btn btn-outline" data-action="export-csv" data-kind="members">${icon('download')} Ekspor CSV</button><a class="btn btn-primary" href="${base}/pages/form-anggota.html">${icon('person_add')} Tambah Anggota</a></div></div>
      <div class="stats-grid">${statCard('Total Anggota', `${members.length} orang`, 'groups', 'Seluruh data anggota')}${statCard('Anggota Aktif', `${members.filter(m=>m.status==='Aktif').length} orang`, 'verified_user', 'Status keanggotaan aktif')}${statCard('Menunggu Verifikasi', `${members.filter(m=>m.status==='Menunggu Verifikasi').length} orang`, 'pending_actions', 'Perlu pemeriksaan', 'gold')}${statCard('Total Simpanan', compactCurrency(members.reduce((s,m)=>s+Number(m.savings||0),0)), 'account_balance_wallet', 'Akumulasi simpanan anggota', 'blue')}</div>
      <section class="panel table-panel"><div class="panel-head"><div><h2>Direktori Anggota</h2><p>Gunakan pencarian dan filter untuk menemukan data anggota.</p></div><div class="table-tools"><input class="control-input" type="search" data-table-search placeholder="Cari nama, ID, NIK, nomor HP..." aria-label="Cari anggota"><select data-status-filter aria-label="Filter status"><option value="">Semua status</option><option>Aktif</option><option>Menunggu Verifikasi</option><option>Nonaktif</option></select></div></div>
      <div class="table-wrap"><table><thead><tr><th>ID / Tanggal Bergabung</th><th>Nama Anggota</th><th>NIK</th><th>Nomor HP</th><th>Total Simpanan</th><th>Status</th><th>Aksi</th></tr></thead><tbody id="members-table-body">${rows}</tbody></table></div><div class="table-foot"><span id="table-count">Menampilkan ${members.length} anggota</span><div class="pagination"><button type="button" disabled>Sebelumnya</button><button type="button" class="active">1</button><button type="button" disabled>Berikutnya</button></div></div></section>`;
  }

  function memberFormContent() {
    const id = new URLSearchParams(window.location.search).get('id');
    const members = getData('members');
    const member = id ? members.find((m) => m.id === id) : null;
    const isEdit = Boolean(member);
    const m = member || { id: '', name: '', nik: '', phone: '', email: '', type: 'Anggota Baru', joinDate: '2026-10-17', savings: 0, loan: 0, status: 'Aktif', address: '' };
    return `<div class="page-heading"><div><h1>${isEdit ? 'Edit Data Anggota' : 'Form Anggota Baru'}</h1><p>${isEdit ? 'Perbarui data anggota dengan memeriksa kembali setiap informasi.' : 'Lengkapi identitas anggota baru untuk menambahkan data ke sistem koperasi.'}</p></div><div class="heading-actions"><a class="btn btn-outline" href="${base}/pages/anggota.html">${icon('arrow_back')} Kembali ke Data Anggota</a></div></div>
      <div class="form-layout"><section class="panel"><form id="member-form" novalidate><input type="hidden" name="originalId" value="${escapeHTML(m.id)}">
        <div class="form-section"><h3>Informasi Identitas</h3><p>Data utama untuk mengenali anggota dan memvalidasi keanggotaan.</p><div class="form-grid">
          <div class="form-field"><label for="member-name">Nama lengkap *</label><input id="member-name" name="name" value="${escapeHTML(m.name)}" placeholder="Masukkan nama sesuai identitas" required minlength="3"></div>
          <div class="form-field"><label for="member-nik">NIK *</label><input id="member-nik" name="nik" value="${escapeHTML(m.nik)}" placeholder="16 digit NIK" inputmode="numeric" minlength="8" maxlength="16" required><span class="help-text">Gunakan angka sesuai dokumen identitas.</span></div>
          <div class="form-field"><label for="member-phone">Nomor HP *</label><input id="member-phone" name="phone" value="${escapeHTML(m.phone)}" placeholder="08xxxxxxxxxx" inputmode="tel" required></div>
          <div class="form-field"><label for="member-email">Email</label><input id="member-email" name="email" value="${escapeHTML(m.email)}" type="email" placeholder="nama@email.com"></div>
          <div class="form-field"><label for="member-join-date">Tanggal bergabung *</label><input id="member-join-date" name="joinDate" value="${escapeHTML(m.joinDate)}" type="date" required></div>
          <div class="form-field"><label for="member-type">Jenis keanggotaan</label><select id="member-type" name="type"><option ${m.type==='Anggota Baru'?'selected':''}>Anggota Baru</option><option ${m.type==='Anggota Aktif'?'selected':''}>Anggota Aktif</option></select></div>
          <div class="form-field full"><label for="member-address">Alamat domisili</label><textarea id="member-address" name="address" placeholder="Masukkan alamat lengkap">${escapeHTML(m.address)}</textarea></div>
        </div></div>
        <div class="form-section"><h3>Informasi Keanggotaan</h3><p>Pengaturan status dan saldo awal untuk data simulasi.</p><div class="form-grid">
          <div class="form-field"><label for="member-status">Status anggota</label><select id="member-status" name="status"><option ${m.status==='Aktif'?'selected':''}>Aktif</option><option ${m.status==='Menunggu Verifikasi'?'selected':''}>Menunggu Verifikasi</option><option ${m.status==='Nonaktif'?'selected':''}>Nonaktif</option></select></div>
          <div class="form-field"><label for="member-savings">Saldo simpanan awal (Rp)</label><input id="member-savings" name="savings" type="number" min="0" step="1000" value="${Number(m.savings)||0}" inputmode="numeric"></div>
        </div></div>
        <div class="form-actions"><a class="btn btn-outline" href="${base}/pages/anggota.html">Batal</a><button class="btn btn-primary" type="submit">${icon('save')} ${isEdit?'Simpan Perubahan':'Simpan Anggota'}</button></div>
      </form></section>
      <aside><div class="info-card"><h3>${icon('info')} Petunjuk pengisian</h3><p>Pastikan data sesuai dokumen anggota. Data pada project ini disimpan secara lokal di browser.</p><div class="info-row">${icon('check_circle')} Nama dan NIK wajib diisi.</div><div class="info-row">${icon('check_circle')} NIK hanya berisi angka.</div><div class="info-row">${icon('check_circle')} Periksa nomor HP sebelum menyimpan.</div><div class="info-row">${icon('database')} Data tidak dikirim ke server.</div></div><div class="panel" style="margin-top:15px"><h3 style="margin:0 0 8px;font-size:13px">Ringkasan data</h3><p style="font-size:11px;color:var(--muted);margin:0 0 13px">${isEdit?'ID anggota yang sedang diperbarui':'ID anggota dibuat otomatis saat data disimpan.'}</p><div class="info-row">${icon('badge')} <span>ID: <strong>${isEdit?escapeHTML(m.id):'Otomatis'}</strong></span></div><div class="info-row">${icon('event')} <span>Tanggal bergabung: <strong>${fmtDate(m.joinDate)}</strong></span></div></div></aside></div>`;
  }

  function transactionsContent() {
    const transactions = getData('transactions');
    const rows = transactions.map((t, i) => `<tr data-row-search="${escapeHTML(`${t.id} ${t.memberName} ${t.memberId} ${t.type} ${t.method} ${t.status}`.toLowerCase())}" data-status="${escapeHTML(t.status)}" data-date="${escapeHTML(t.date)}"><td><strong>${escapeHTML(t.id)}</strong><small style="display:block;color:#87968b;margin-top:3px">${fmtDate(t.date)}</small></td><td><div class="member-cell">${memberAvatar(t.memberName,i)}<div><strong>${escapeHTML(t.memberName)}</strong><small>${escapeHTML(t.memberId)}</small></div></div></td><td>${escapeHTML(t.type)}<small style="display:block;color:#87968b;margin-top:3px">${escapeHTML(t.loanRef || '-')}</small></td><td>${escapeHTML(t.method)}</td><td class="currency">${fmtCurrency(t.amount)}</td><td>${statusPill(t.status)}</td><td><div class="action-group"><button class="icon-btn" data-action="view-transaction" data-id="${escapeHTML(t.id)}" title="Detail transaksi">${icon('receipt_long')}</button>${t.status==='Menunggu Cek'?`<button class="btn btn-primary btn-small" data-action="verify-transaction" data-id="${escapeHTML(t.id)}">${icon('task_alt')} Verifikasi</button>`:''}</div></td></tr>`).join('');
    const pending = transactions.filter((t)=>t.status==='Menunggu Cek');
    return `<div class="page-heading"><div><h1>Transaksi Simpanan</h1><p>Catat setoran simpanan dan angsuran, lalu periksa status pembukuannya.</p></div><div class="heading-actions"><button class="btn btn-outline" data-action="export-csv" data-kind="transactions">${icon('download')} Ekspor CSV</button><button class="btn btn-primary" data-action="open-transaction-modal">${icon('add')} Catat Transaksi</button></div></div>
      <div class="stats-grid">${statCard('Total Transaksi', `${transactions.length} transaksi`, 'receipt_long', 'Semua aktivitas tercatat')}${statCard('Menunggu Verifikasi', `${pending.length} transaksi`, 'pending_actions', 'Butuh pemeriksaan petugas', 'gold')}${statCard('Dana Menunggu Cek', compactCurrency(pending.reduce((s,t)=>s+Number(t.amount||0),0)), 'account_balance_wallet', 'Total nominal tertunda', 'blue')}${statCard('Terverifikasi', `${transactions.filter(t=>t.status==='Terverifikasi').length} transaksi`, 'verified', 'Berhasil diperiksa', '')}</div>
      <section class="panel table-panel"><div class="panel-head"><div><h2>Riwayat Transaksi</h2><p>Transaksi terbaru akan muncul di bagian atas setelah disimpan.</p></div><div class="table-tools"><input class="control-input" type="search" data-table-search placeholder="Cari nomor, nama anggota..." aria-label="Cari transaksi"><select data-status-filter><option value="">Semua status</option><option>Menunggu Cek</option><option>Terverifikasi</option></select></div></div>
      <div class="table-wrap"><table><thead><tr><th>No. Transaksi / Tanggal</th><th>Anggota</th><th>Jenis Transaksi</th><th>Metode</th><th>Jumlah</th><th>Status</th><th>Tindakan</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty-state">${icon('receipt_long')}<strong>Belum ada transaksi</strong></div></td></tr>`}</tbody></table></div><div class="table-foot"><span id="table-count">Menampilkan ${transactions.length} transaksi</span><span>Data simulasi lokal</span></div></section>`;
  }

  function loansContent() {
    const loans = getData('loans');
    const rows = loans.map((l, i) => `<tr data-row-search="${escapeHTML(`${l.id} ${l.memberName} ${l.purpose} ${l.status}`.toLowerCase())}" data-status="${escapeHTML(l.status)}"><td><strong>${escapeHTML(l.id)}</strong><small style="display:block;color:#87968b;margin-top:3px">${fmtDate(l.date)}</small></td><td><div class="member-cell">${memberAvatar(l.memberName,i)}<div><strong>${escapeHTML(l.memberName)}</strong><small>${escapeHTML(l.memberId)}</small></div></div></td><td>${escapeHTML(l.purpose)}</td><td class="currency">${fmtCurrency(l.principal)}</td><td class="currency">${fmtCurrency(l.remaining)}</td><td>${Number(l.paid)} / ${Number(l.duration)} kali</td><td>${statusPill(l.status)}</td><td><button class="btn btn-outline btn-small" data-action="view-loan" data-id="${escapeHTML(l.id)}">${icon('visibility')} Detail</button></td></tr>`).join('');
    return `<div class="page-heading"><div><h1>Pinjaman & Setoran</h1><p>Pantau pinjaman berjalan, sisa kewajiban, angsuran, dan pengajuan pencairan.</p></div><div class="heading-actions"><button class="btn btn-outline" data-action="export-csv" data-kind="loans">${icon('download')} Ekspor CSV</button><button class="btn btn-primary" data-action="open-transaction-modal">${icon('add')} Catat Angsuran</button></div></div>
      <div class="stats-grid">${statCard('Pinjaman Berjalan', `${loans.filter(l=>['Berjalan','Aktif'].includes(l.status)).length} pinjaman`, 'payments', 'Pinjaman aktif anggota')}${statCard('Total Plafon', compactCurrency(loans.reduce((s,l)=>s+Number(l.principal||0),0)), 'account_balance', 'Nilai pinjaman tercatat', 'blue')}${statCard('Sisa Pinjaman', compactCurrency(loans.reduce((s,l)=>s+Number(l.remaining||0),0)), 'pending', 'Saldo kewajiban berjalan', 'gold')}${statCard('Menunggu Persetujuan', `${loans.filter(l=>l.status==='Menunggu Persetujuan').length} berkas`, 'fact_check', 'Perlu keputusan pengurus', 'red')}</div>
      <section class="panel table-panel"><div class="panel-head"><div><h2>Daftar Pinjaman</h2><p>Pilih detail untuk memeriksa jadwal dan memperbarui status pinjaman.</p></div><div class="table-tools"><input class="control-input" type="search" data-table-search placeholder="Cari ID atau anggota..." aria-label="Cari pinjaman"><select data-status-filter><option value="">Semua status</option><option>Berjalan</option><option>Menunggu Persetujuan</option><option>Lunas</option></select></div></div><div class="table-wrap"><table><thead><tr><th>ID Pinjaman / Tanggal</th><th>Anggota</th><th>Tujuan</th><th>Plafon</th><th>Sisa Pinjaman</th><th>Angsuran</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-foot"><span id="table-count">Menampilkan ${loans.length} pinjaman</span><span>Nominal menggunakan rupiah</span></div></section>`;
  }

  function applicationsContent() {
    const apps = getData('applications');
    const counts = {
      pending: apps.filter(a => a.status === 'Menunggu Verifikasi').length,
      process: apps.filter(a => a.status === 'Diproses').length,
      approved: apps.filter(a => a.status === 'Disetujui').length,
      rejected: apps.filter(a => a.status === 'Ditolak').length
    };
    const rows = apps.map((a, i) => `<tr data-row-search="${escapeHTML(`${a.id} ${a.memberName} ${a.type} ${a.status}`.toLowerCase())}" data-status="${escapeHTML(a.status)}"><td><strong>${escapeHTML(a.id)}</strong><small style="display:block;color:#87968b;margin-top:3px">${fmtDate(a.date)}</small></td><td><div class="member-cell">${memberAvatar(a.memberName,i)}<div><strong>${escapeHTML(a.memberName)}</strong><small>${escapeHTML(a.memberId)}</small></div></div></td><td>${escapeHTML(a.type)}</td><td>${a.amount ? fmtCurrency(a.amount) : '-'}</td><td>${statusPill(a.status)}</td><td><button class="btn btn-outline btn-small" data-action="view-application" data-id="${escapeHTML(a.id)}">${icon('visibility')} Periksa</button></td></tr>`).join('');
    return `<div class="page-heading"><div><h1>Status Pengajuan</h1><p>Pantau pendaftaran anggota, perubahan data, dan permohonan layanan koperasi.</p></div><div class="heading-actions"><button class="btn btn-outline" data-action="export-csv" data-kind="applications">${icon('download')} Ekspor CSV</button></div></div>
      <div class="stats-grid">${statCard('Menunggu Verifikasi', `${counts.pending} berkas`, 'pending_actions', 'Perlu pemeriksaan dokumen', 'gold')}${statCard('Sedang Diproses', `${counts.process} berkas`, 'sync', 'Dalam tindak lanjut')}${statCard('Disetujui', `${counts.approved} berkas`, 'task_alt', 'Pengajuan disetujui')}${statCard('Ditolak', `${counts.rejected} berkas`, 'cancel', 'Perlu komunikasi ke anggota', 'red')}</div>
      <section class="panel table-panel"><div class="panel-head"><div><h2>Daftar Pengajuan Layanan</h2><p>Pilih pengajuan untuk melihat ringkasan dan memperbarui statusnya.</p></div><div class="table-tools"><input class="control-input" type="search" data-table-search placeholder="Cari pengajuan atau anggota..." aria-label="Cari pengajuan"><select data-status-filter><option value="">Semua status</option><option>Menunggu Verifikasi</option><option>Diproses</option><option>Disetujui</option><option>Ditolak</option></select></div></div><div class="table-wrap"><table><thead><tr><th>Nomor Pengajuan / Tanggal</th><th>Anggota</th><th>Jenis Layanan</th><th>Nominal</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-foot"><span id="table-count">Menampilkan ${apps.length} pengajuan</span><span>Pembaruan tersimpan di browser</span></div></section>`;
  }

  function reportsContent() {
    const transactions = getData('transactions');
    const members = getData('members');
    const verified = transactions.filter(t => t.status === 'Terverifikasi');
    const incoming = verified.reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const rows = transactions.map((t, i) => `<tr data-row-search="${escapeHTML(`${t.id} ${t.memberName} ${t.type} ${t.method}`.toLowerCase())}" data-date="${escapeHTML(t.date)}"><td>${fmtDate(t.date)}</td><td><strong>${escapeHTML(t.id)}</strong></td><td>${escapeHTML(t.memberName)}</td><td>${escapeHTML(t.type)}</td><td>${escapeHTML(t.method)}</td><td class="currency">${fmtCurrency(t.amount)}</td><td>${statusPill(t.status)}</td></tr>`).join('');
    return `<div class="page-heading"><div><h1>Laporan & Cetak</h1><p>Ringkasan aktivitas keuangan koperasi untuk mendukung evaluasi dan dokumentasi pengurus.</p></div><div class="heading-actions"><button class="btn btn-outline" data-action="export-csv" data-kind="transactions">${icon('download')} Unduh CSV</button><button class="btn btn-primary" data-action="print-report">${icon('print')} Cetak Laporan</button></div></div>
      <section class="panel" style="margin-bottom:18px"><div class="panel-head"><div><h2>Periode Laporan</h2><p>Atur tanggal untuk menyaring riwayat transaksi yang tampil.</p></div></div><div class="table-tools"><label style="font-size:11px;font-weight:700;color:#52665a">Dari <input class="control-input" type="date" id="report-start" value="2026-10-01" style="width:auto;min-width:150px;margin-left:6px"></label><label style="font-size:11px;font-weight:700;color:#52665a">Sampai <input class="control-input" type="date" id="report-end" value="2026-10-31" style="width:auto;min-width:150px;margin-left:6px"></label><button class="btn btn-secondary" data-action="apply-report-filter">${icon('filter_alt')} Terapkan Filter</button><button class="btn btn-outline" data-action="reset-report-filter">Reset</button></div></section>
      <div class="stats-grid">${statCard('Dana Terverifikasi', compactCurrency(incoming), 'account_balance_wallet', `${verified.length} transaksi berhasil`, '')}${statCard('Total Anggota', `${members.length} orang`, 'groups', 'Seluruh status anggota')}${statCard('Transaksi Tercatat', `${transactions.length} transaksi`, 'receipt_long', 'Pada data demo')}${statCard('Menunggu Verifikasi', `${transactions.filter(t=>t.status==='Menunggu Cek').length} transaksi`, 'pending_actions', 'Belum masuk rekap final', 'gold')}</div>
      <div class="content-grid"><section class="panel"><div class="panel-head"><div><h2>Tren Transaksi Bulanan</h2><p>Perbandingan nominal transaksi yang tercatat.</p></div></div><div class="chart-wrap"><canvas id="report-chart" aria-label="Grafik transaksi bulanan"></canvas></div></section><section class="panel"><div class="panel-head"><div><h2>Komposisi Transaksi</h2><p>Pengelompokan jenis transaksi dalam data demo.</p></div></div><div class="chart-wrap doughnut"><canvas id="report-doughnut" aria-label="Komposisi jenis transaksi"></canvas></div></section></div>
      <section class="panel table-panel"><div class="panel-head"><div><h2>Rincian Aktivitas Keuangan</h2><p>Gunakan tombol cetak untuk menyimpan laporan sebagai PDF dari browser.</p></div><div class="table-tools"><input class="control-input" type="search" data-table-search placeholder="Cari transaksi atau anggota..." aria-label="Cari laporan"></div></div><div class="table-wrap"><table><thead><tr><th>Tanggal</th><th>No. Transaksi</th><th>Anggota</th><th>Jenis</th><th>Metode</th><th>Nominal</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table></div><div class="table-foot"><span id="table-count">Menampilkan ${transactions.length} transaksi</span><span>Dicetak dari KopSimpan Demo</span></div></section>`;
  }

  function renderMemberDashboard() {
    document.body.classList.remove('login-body');
    const session = read(storeKeys.session, {}) || {};
    const member = findMember(session.memberId || 'A001') || getData('members')[0];
    const transactions = getData('transactions').filter(t => t.memberId === member.id).slice(0, 4);
    const loans = getData('loans').filter(l => l.memberId === member.id && ['Berjalan', 'Aktif'].includes(l.status));
    const currentLoan = loans[0];
    document.title = 'Dashboard Anggota | KopSimpan';
    root.innerHTML = `
      <div class="member-app">
        <header class="member-topbar"><a class="brand-lockup" href="${base}/pages/dashboard-anggota.html"><div class="brand-mark">${icon('eco')}</div><div><div class="brand-name">KopSimpan</div><div class="brand-tagline">DASHBOARD ANGGOTA</div></div></a><div class="member-top-actions"><span class="member-greeting">Halo, ${escapeHTML(member.name.split(' ')[0])}</span><button class="top-icon" data-action="toggle-theme" aria-label="Ganti tema">${icon('dark_mode')}</button><button class="top-icon" data-action="logout" aria-label="Keluar">${icon('logout')}</button></div></header>
        <main class="member-content">
          <div class="member-welcome"><div><span class="eyebrow">${icon('verified_user')} Anggota terverifikasi</span><h1>Selamat datang, ${escapeHTML(member.name.split(' ')[0])}!</h1><p>Ini ringkasan simpanan dan aktivitas koperasi kamu.</p></div><div class="member-id-chip">ID Anggota <strong>${escapeHTML(member.id)}</strong></div></div>
          <section class="member-balance-card"><div class="member-balance-top"><div><span>Total Simpanan Saya</span><h2>${fmtCurrency(member.savings)}</h2><small>Saldo gabungan simpanan pokok, wajib, dan sukarela</small></div><div class="member-balance-icon">${icon('account_balance_wallet')}</div></div><div class="member-balance-bottom"><span>${icon('trending_up')} Simpanan bertumbuh bersama</span><span>Sejak ${fmtDate(member.joinDate)}</span></div></section>
          <div class="member-stats-grid"><article class="member-stat"><div class="member-stat-icon">${icon('savings')}</div><span>Simpanan Pokok</span><strong>${fmtCurrency(Math.min(500000, member.savings))}</strong><small>${icon('check_circle')} Terbayar</small></article><article class="member-stat"><div class="member-stat-icon gold">${icon('event_repeat')}</div><span>Simpanan Wajib</span><strong>${fmtCurrency(Math.min(250000, Math.round(member.savings * .25)))}</strong><small>${icon('check_circle')} Bulan ini</small></article><article class="member-stat member-stat-clickable" role="button" tabindex="0" data-action="view-billing" data-id="${escapeHTML(currentLoan ? currentLoan.id : '')}" aria-label="Lihat rincian tagihan"><div class="member-stat-icon blue">${icon('payments')}</div><span>Sisa Pinjaman <small class="card-open-hint">Lihat rincian ${icon('arrow_forward')}</small></span><strong>${fmtCurrency(currentLoan ? currentLoan.remaining : 0)}</strong><small>${currentLoan ? `${currentLoan.paid} dari ${currentLoan.duration} angsuran` : 'Tidak ada pinjaman aktif'}</small></article><article class="member-stat member-stat-clickable" role="button" tabindex="0" data-action="view-billing" data-id="${escapeHTML(currentLoan ? currentLoan.id : '')}" aria-label="Lihat rincian jatuh tempo"><div class="member-stat-icon gold">${icon('event')}</div><span>Jatuh Tempo <small class="card-open-hint">Lihat rincian ${icon('arrow_forward')}</small></span><strong>${currentLoan ? fmtDate(currentLoan.dueDate) : 'N/A'}</strong><small>${currentLoan ? 'Jadwal angsuran berikutnya' : 'Tidak ada tagihan aktif'}</small></article></div>
          <div class="member-dashboard-actions"><div><strong>Butuh dana tambahan?</strong><span>Ajukan pinjaman baru langsung dari dashboard.</span></div><button class="btn btn-primary" data-action="open-member-loan-modal">${icon('add')} Ajukan Pinjaman</button></div>
          <section class="panel member-panel"><div class="panel-head"><div><h2>Pinjaman Saya</h2><p>Informasi pinjaman dan jadwal angsuran.</p></div><span class="pill ${currentLoan ? 'pill-success' : 'pill-neutral'}">${currentLoan ? 'Berjalan' : 'Tidak aktif'}</span></div>${currentLoan ? `<div class="member-loan-card"><div class="member-loan-title"><div class="member-loan-icon">${icon('storefront')}</div><div><strong>${escapeHTML(currentLoan.purpose)}</strong><small>ID Pinjaman ${escapeHTML(currentLoan.id)}</small></div></div><div class="member-loan-numbers"><div><span>Plafon awal</span><strong>${fmtCurrency(currentLoan.principal)}</strong></div><div><span>Sisa pinjaman</span><strong>${fmtCurrency(currentLoan.remaining)}</strong></div><div><span>Angsuran per bulan</span><strong>${fmtCurrency(currentLoan.installment)}</strong></div></div><div class="progress-track"><span style="width:${Math.min(100, Math.round(currentLoan.paid / currentLoan.duration * 100))}%"></span></div><div class="progress-meta"><span>${currentLoan.paid} dari ${currentLoan.duration} angsuran terbayar</span><span>${Math.round(currentLoan.paid / currentLoan.duration * 100)}%</span></div><div class="member-loan-footer">${icon('event')} Jatuh tempo berikutnya: <strong>${fmtDate(currentLoan.dueDate)}</strong></div></div>` : `<div class="empty-state">${icon('payments')}<strong>Belum ada pinjaman aktif</strong><br>Informasi pinjaman akan tampil di sini.</div>`}</section>
          <section class="panel member-panel"><div class="panel-head"><div><h2>Aktivitas Terbaru</h2><p>Riwayat setoran dan pembayaran kamu.</p></div><a class="text-link" href="#aktivitas" data-action="member-all-transactions">Lihat semua</a></div><div class="member-activity-list">${transactions.map(t => `<button class="member-activity" data-action="view-transaction" data-id="${escapeHTML(t.id)}"><span class="member-activity-icon">${icon(t.type.includes('Angsuran') ? 'payments' : 'savings')}</span><span class="member-activity-main"><strong>${escapeHTML(t.type)}</strong><small>${fmtDate(t.date)} · ${escapeHTML(t.id)}</small></span><span class="member-activity-amount"><strong>${fmtCurrency(t.amount)}</strong>${statusPill(t.status)}</span></button>`).join('') || '<div class="empty-state">Belum ada transaksi.</div>'}</div></section>
          <section class="member-help-card"><div class="member-help-icon">${icon('support_agent')}</div><div><strong>Butuh bantuan?</strong><p>Hubungi petugas koperasi untuk pertanyaan tentang simpanan atau pinjaman.</p></div><button class="btn btn-secondary" data-action="member-help">Hubungi petugas</button></section>
        </main>
        <nav class="member-bottom-nav"><a class="active" href="${base}/pages/dashboard-anggota.html">${icon('home')}<span>Beranda</span></a><a href="${base}/pages/pengajuan-pinjaman.html">${icon('payments')}<span>Pinjaman</span></a><button data-action="member-all-transactions">${icon('receipt_long')}<span>Aktivitas</span></button><button data-action="member-help">${icon('support_agent')}<span>Bantuan</span></button><button data-action="logout">${icon('logout')}<span>Keluar</span></button></nav>
      </div><div id="modal-host"></div><div class="toast-container" id="toast-container" aria-live="polite"></div>`;
    if (read(storeKeys.theme, 'light') === 'dark') document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');
  }

  function adminVerificationContent() {
    const loans = getData('loans').filter(l => ['Menunggu Persetujuan', 'Menunggu Persetujuan'].includes(l.status));
    const rows = loans.map(l => `<tr><td><strong>${escapeHTML(l.id)}</strong><small style="display:block">${fmtDate(l.date)}</small></td><td>${escapeHTML(l.memberName)}<small style="display:block">${escapeHTML(l.memberId)}</small></td><td>${escapeHTML(l.purpose || 'Pengajuan pinjaman')}</td><td class="currency">${fmtCurrency(l.principal)}</td><td>${Number(l.duration) || 0} bulan</td><td>${statusPill(l.status)}</td><td class="action-group"><button class="btn btn-primary btn-small" data-action="approve-application-loan" data-id="${escapeHTML(l.id)}">Setujui</button><button class="btn btn-danger btn-small" data-action="reject-application-loan" data-id="${escapeHTML(l.id)}">Tolak</button></td></tr>`).join('');
    return `<div class="page-heading"><div><h1>Verifikasi Transaksi</h1><p>Periksa pengajuan pinjaman anggota dan tetapkan keputusan persetujuan.</p></div></div><div class="stats-grid">${statCard('Menunggu Persetujuan', `${loans.length} pengajuan`, 'pending_actions', 'Perlu keputusan petugas', 'gold')}</div><section class="panel table-panel"><div class="panel-head"><div><h2>Pengajuan Pinjaman</h2><p>Persetujuan mengubah status pinjaman menjadi Aktif.</p></div><input class="control-input" type="search" data-table-search placeholder="Cari ID atau anggota..."></div><div class="table-wrap"><table><thead><tr><th>ID / Tanggal</th><th>Anggota</th><th>Tujuan</th><th>Nominal</th><th>Tenor</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows || `<tr><td colspan="7"><div class="empty-state">${icon('inbox')}<strong>Data belum tersedia</strong><br>Tidak ada pengajuan pinjaman yang menunggu persetujuan.</div></td></tr>`}</tbody></table></div></section>`;
  }

  function adminManageMembersContent() {
    const members = getData('members');
    const rows = members.map(m => `<tr data-row-search="${escapeHTML(`${m.name} ${m.id} ${m.email}`.toLowerCase())}" data-status="${escapeHTML(m.status)}"><td><strong>${escapeHTML(m.id)}</strong></td><td>${escapeHTML(m.name)}<small style="display:block">${escapeHTML(m.email || '-')}</small></td><td>${statusPill(m.status)}</td><td class="action-group"><button class="btn btn-outline btn-small" data-action="reset-member-password" data-id="${escapeHTML(m.id)}">Reset Password</button><button class="btn ${m.status==='Nonaktif'?'btn-secondary':'btn-danger'} btn-small" data-action="toggle-member-account" data-id="${escapeHTML(m.id)}" data-status="${m.status==='Nonaktif'?'Aktif':'Nonaktif'}">${m.status==='Nonaktif'?'Aktifkan':'Nonaktifkan'}</button></td></tr>`).join('');
    return `<div class="page-heading"><div><h1>Kelola Anggota</h1><p>Reset kata sandi demo dan kelola status akses akun anggota.</p></div></div><section class="panel table-panel"><div class="panel-head"><div><h2>Daftar Akun Anggota</h2><p>Reset password akan menetapkan kata sandi sementara <code>anggota123</code>.</p></div><div class="table-tools"><input class="control-input" type="search" data-table-search placeholder="Cari anggota..."><select data-status-filter><option value="">Semua status</option><option>Aktif</option><option>Nonaktif</option><option>Menunggu Verifikasi</option></select></div></div><div class="table-wrap"><table><thead><tr><th>ID</th><th>Anggota</th><th>Status</th><th>Aksi</th></tr></thead><tbody>${rows || `<tr><td colspan="4"><div class="empty-state">${icon('groups')}<strong>Data belum tersedia</strong><br>Belum ada anggota yang terdaftar.</div></td></tr>`}</tbody></table></div></section>`;
  }

  function memberLoanApplicationContent() {
    const session = read(storeKeys.session, {}) || {};
    const member = findMember(session.memberId) || getData('members').find(m => m.email === session.email) || getData('members')[0];
    const apps = getData('loans').filter(l => l.memberId === member?.id).sort((a,b) => String(b.date).localeCompare(String(a.date)));
    const rows = apps.map(l => `<tr><td><strong>${escapeHTML(l.id)}</strong></td><td>${fmtDate(l.date)}</td><td class="currency">${fmtCurrency(l.principal)}</td><td>${l.duration} bulan</td><td>${statusPill(l.status)}</td></tr>`).join('');
    return `<div class="page-heading"><div><h1>Pengajuan Pinjaman</h1><p>Isi nominal dan tenor. Pengajuan baru menunggu keputusan petugas koperasi.</p></div></div><section class="panel" style="margin-bottom:18px"><div class="panel-head"><div><h2>Form Pengajuan</h2><p>Data ini hanya disimpan pada browser demonstrasi.</p></div></div><form id="member-loan-form" class="form-layout" style="padding:0 22px 22px" novalidate><div class="form-grid"><div class="form-field"><label for="loan-amount">Nominal pinjaman (Rp) *</label><input id="loan-amount" name="amount" type="number" min="100000" max="100000000" step="1000" inputmode="numeric" required placeholder="Contoh: 5000000"><span class="help-text">Minimal Rp100.000, maksimal Rp100.000.000.</span></div><div class="form-field"><label for="loan-tenor">Tenor *</label><select id="loan-tenor" name="duration" required><option value="">Pilih tenor</option><option value="3">3 bulan</option><option value="6">6 bulan</option><option value="9">9 bulan</option><option value="12">12 bulan</option><option value="18">18 bulan</option><option value="24">24 bulan</option></select></div><div class="form-field full"><label for="loan-purpose">Tujuan pinjaman *</label><input id="loan-purpose" name="purpose" required minlength="5" maxlength="120" placeholder="Contoh: Modal usaha kecil"></div><div class="form-field full"><div class="form-error" id="loan-form-error" role="alert" aria-live="polite"></div></div></div><div class="form-actions"><button class="btn btn-primary" type="submit">Kirim Pengajuan</button></div></form></section><section class="panel table-panel"><div class="panel-head"><div><h2>Riwayat Pengajuan Saya</h2><p>Status akan diperbarui setelah petugas melakukan verifikasi.</p></div></div><div class="table-wrap"><table><thead><tr><th>ID Pengajuan</th><th>Tanggal</th><th>Nominal</th><th>Tenor</th><th>Status</th></tr></thead><tbody>${rows || `<tr><td colspan="5"><div class="empty-state">${icon('inbox')}<strong>Data belum tersedia</strong><br>Kamu belum pernah mengajukan pinjaman.</div></td></tr>`}</tbody></table></div></section>`;
  }

  function render() {
    initData();
    if (page === 'login') { renderLogin(); return; }
    const session = read(storeKeys.session, null);
    const memberPages = ['dashboard-anggota', 'member-dashboard', 'member-pengajuan'];
    const adminPages = ['dashboard', 'admin-dashboard', 'anggota', 'form-anggota', 'transaksi', 'pinjaman', 'pengajuan', 'laporan', 'admin-verifikasi', 'admin-anggota'];
    if (!session || !session.roleKey) { window.location.href = `${base}/login.html`; return; }
    if (memberPages.includes(page) && session.roleKey !== 'member') { window.location.href = `${base}/login.html`; return; }
    if (adminPages.includes(page) && session.roleKey !== 'admin') { window.location.href = `${base}/login.html`; return; }
    if (['dashboard-anggota', 'member-dashboard'].includes(page)) { renderMemberDashboard(); return; }
    if (page === 'member-pengajuan') {
      document.body.classList.remove('login-body');
      const session = read(storeKeys.session, {}) || {};
      root.innerHTML = `<div class="member-app"><header class="member-topbar"><a class="brand-lockup" href="${base}/pages/dashboard-anggota.html"><div class="brand-mark">${icon('eco')}</div><div><div class="brand-name">KopSimpan</div><div class="brand-tagline">AREA ANGGOTA</div></div></a><div class="member-top-actions"><span class="member-greeting">${escapeHTML(session.name || 'Anggota')}</span><button class="top-icon" data-action="logout" aria-label="Keluar">${icon('logout')}</button></div></header><main class="member-content">${memberLoanApplicationContent()}</main><nav class="member-bottom-nav"><a href="${base}/pages/dashboard-anggota.html">${icon('home')}<span>Beranda</span></a><a class="active" href="${base}/pages/pengajuan-pinjaman.html">${icon('payments')}<span>Pinjaman</span></a><button data-action="member-help">${icon('support_agent')}<span>Bantuan</span></button><button data-action="logout">${icon('logout')}<span>Keluar</span></button></nav></div><div id="modal-host"></div><div class="toast-container" id="toast-container" aria-live="polite"></div>`;
      if (read(storeKeys.theme, 'light') === 'dark') document.body.classList.add('dark-mode'); else document.body.classList.remove('dark-mode');
      return;
    }
    const renderers = {
      dashboard: dashboardContent,
      anggota: membersContent,
      'form-anggota': memberFormContent,
      transaksi: transactionsContent,
      pinjaman: loansContent,
      pengajuan: applicationsContent,
      laporan: reportsContent,
      'admin-verifikasi': adminVerificationContent,
      'admin-anggota': adminManageMembersContent,
      'member-pengajuan': memberLoanApplicationContent
    };
    const renderer = renderers[page] || dashboardContent;
    document.title = `${pageTitle()} | KopSimpan`;
    renderShell(renderer());
    document.querySelectorAll('table tbody').forEach(tbody => {
      if (!tbody.querySelector('tr')) {
        const cols = Math.max(1, tbody.closest('table')?.querySelectorAll('thead th').length || 1);
        tbody.innerHTML = `<tr><td colspan="${cols}"><div class="empty-state">${icon('inbox')}<strong>Data belum tersedia</strong><br>Belum ada data untuk ditampilkan.</div></td></tr>`;
      }
    });
    attachCharts();
    updateVisibleCount();
  }

  function attachCharts() {
    charts.forEach((chart) => { try { chart.destroy(); } catch (error) {} });
    charts = [];
    if (typeof Chart === 'undefined') return;
    const textColor = document.body.classList.contains('dark-mode') ? '#c4d7ca' : '#718176';
    const gridColor = document.body.classList.contains('dark-mode') ? '#2c4133' : '#e8f0ea';
    const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false }, tooltip: { backgroundColor: '#153d2a', padding: 11, titleFont: { family: 'Inter', size: 11 }, bodyFont: { family: 'Inter', size: 11 }, callbacks: { label: (ctx) => `${ctx.dataset.label || ctx.label}: ${fmtCurrency(ctx.raw)}` } } } };
    const cash = document.getElementById('cashflow-chart');
    if (cash) {
      const ctx = cash.getContext('2d');
      charts.push(new Chart(ctx, { type: 'bar', data: { labels: ['Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt'], datasets: [ { label: 'Simpanan Masuk', data: [17400000, 19300000, 21400000, 22400000, 24100000, 25200000], backgroundColor: '#005136', borderRadius: 4, maxBarThickness: 19 }, { label: 'Pinjaman Dicairkan', data: [14300000, 16200000, 18100000, 16900000, 18800000, 19200000], backgroundColor: '#ffc247', borderRadius: 4, maxBarThickness: 19 } ] }, options: { ...commonOptions, scales: { x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 10 } }, border: { display: false } }, y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 10 }, callback: (v) => `${v / 1000000} jt` }, border: { display: false } } }, plugins: { ...commonOptions.plugins, legend: { display: false } } } }));
    }
    const portfolio = document.getElementById('portfolio-chart');
    if (portfolio) charts.push(new Chart(portfolio.getContext('2d'), { type: 'doughnut', data: { labels: ['Berjalan lancar', 'Lunas', 'Menunggu verifikasi', 'Menunggak'], datasets: [{ data: [60, 25, 10, 5], backgroundColor: ['#07558e', '#005136', '#ffc247', '#c93434'], borderWidth: 0, hoverOffset: 5 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '68%', plugins: { legend: { display: false }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${ctx.raw}%` } } } } }));
    const report = document.getElementById('report-chart');
    if (report) charts.push(new Chart(report.getContext('2d'), { type: 'bar', data: { labels: ['Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt'], datasets: [{ label: 'Total transaksi', data: [3200000, 5100000, 4600000, 6200000, 5800000, 7300000], backgroundColor: '#176b4b', borderRadius: 5, maxBarThickness: 30 }] }, options: { ...commonOptions, scales: { x: { grid: { display: false }, ticks: { color: textColor, font: { family: 'Inter', size: 10 } }, border: { display: false } }, y: { beginAtZero: true, grid: { color: gridColor }, ticks: { color: textColor, callback: (v) => `${v / 1000000} jt`, font: { family: 'Inter', size: 10 } }, border: { display: false } } } } }));
    const reportDoughnut = document.getElementById('report-doughnut');
    if (reportDoughnut) {
      const tx = getData('transactions');
      const kinds = ['Setoran Simpanan', 'Angsuran Pinjaman', 'Simpanan Wajib', 'Simpanan Sukarela'];
      const amounts = kinds.map((kind) => tx.filter(t => t.type === kind).reduce((sum, t) => sum + Number(t.amount || 0), 0));
      charts.push(new Chart(reportDoughnut.getContext('2d'), { type: 'doughnut', data: { labels: kinds, datasets: [{ data: amounts, backgroundColor: ['#005136', '#07558e', '#ffc247', '#4d9b72'], borderWidth: 0, hoverOffset: 4 }] }, options: { responsive: true, maintainAspectRatio: false, cutout: '66%', plugins: { legend: { position: 'bottom', labels: { color: textColor, boxWidth: 9, boxHeight: 9, padding: 13, font: { family: 'Inter', size: 10 } } }, tooltip: { callbacks: { label: (ctx) => `${ctx.label}: ${fmtCurrency(ctx.raw)}` } } } } }));
    }
  }

  function showModal(title, description, body, footer, wide = false) {
    const host = document.getElementById('modal-host') || root;
    host.innerHTML = `<div class="modal-root ${page.includes('anggota') || page.includes('member') ? 'member-modal-root' : ''}" role="presentation" data-action="backdrop-close"><section class="modal-card ${wide ? 'wide' : ''} ${page.includes('anggota') || page.includes('member') ? 'member-glass-modal' : ''}" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}"><header class="modal-head"><div><h2>${escapeHTML(title)}</h2>${description ? `<p>${escapeHTML(description)}</p>` : ''}</div><button class="icon-btn" data-action="close-modal" aria-label="Tutup">${icon('close')}</button></header><div class="modal-body">${body}</div>${footer ? `<footer class="modal-foot">${footer}</footer>` : ''}</section></div>`;
  }
  function closeModal() {
    const host = document.getElementById('modal-host');
    if (host) host.innerHTML = '';
    else if (page === 'login') renderLogin();
  }
  function toast(message, symbol = 'check_circle') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `${icon(symbol)}<span>${escapeHTML(message)}</span>`;
    container.appendChild(el);
    window.setTimeout(() => el.remove(), 3200);
  }
  function findMember(id) { return getData('members').find((m) => m.id === id); }
  function findTransaction(id) { return getData('transactions').find((t) => t.id === id); }
  function findLoan(id) { return getData('loans').find((l) => l.id === id); }
  function localDateKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  function localMonthKey(date = new Date()) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
  }
  function addMonthsToDate(dateString, months) {
    const source = dateString ? new Date(`${dateString}T00:00:00`) : new Date();
    if (Number.isNaN(source.getTime())) return localDateKey();
    const day = source.getDate();
    source.setDate(1);
    source.setMonth(source.getMonth() + months);
    const lastDay = new Date(source.getFullYear(), source.getMonth() + 1, 0).getDate();
    source.setDate(Math.min(day, lastDay));
    return `${source.getFullYear()}-${String(source.getMonth() + 1).padStart(2, '0')}-${String(source.getDate()).padStart(2, '0')}`;
  }
  function getCurrentMember() {
    const session = read(storeKeys.session, {}) || {};
    const members = getData('members');
    if (session.memberId) return members.find(member => member.id === session.memberId) || null;
    if (session.email) return members.find(member => member.email === session.email) || null;
    return members.find(member => member.id === 'A001') || members[0] || null;
  }
  function loanBelongsToCurrentMember(loan) {
    const member = getCurrentMember();
    return Boolean(member && loan && loan.memberId === member.id);
  }
  function hasPaidThisMonth(loan) {
    const month = localMonthKey();
    return loan?.lastPaidMonth === month || (Array.isArray(loan?.payments) && loan.payments.some(payment => payment.month === month && payment.status === 'Lunas'));
  }
  function nextInstallmentAmount(loan) {
    const remaining = Math.max(0, Number(loan?.remaining) || 0);
    const paid = Math.max(0, Number(loan?.paid) || 0);
    const duration = Math.max(1, Number(loan?.duration) || 1);
    if (paid + 1 >= duration) return remaining;
    return Math.min(Math.max(0, Number(loan?.installment) || 0), remaining);
  }
  function openMemberLoanModal() {
    showModal('Ajukan Pinjaman Baru', 'Lengkapi detail pinjaman. Pengajuan akan menunggu persetujuan petugas.', `<form id="member-loan-modal-form" class="member-modal-form" novalidate><div class="form-field"><label for="member-loan-modal-amount">Nominal pinjaman (Rp) *</label><input id="member-loan-modal-amount" name="amount" type="text" inputmode="numeric" pattern="[0-9]+" autocomplete="off" placeholder="Contoh: 5000000" required><small class="help-text">Minimal Rp100.000 dan maksimal Rp100.000.000.</small></div><div class="form-field"><label for="member-loan-modal-tenor">Tenor pinjaman *</label><select id="member-loan-modal-tenor" name="duration" required><option value="">Pilih tenor</option><option value="3">3 bulan</option><option value="6">6 bulan</option><option value="12">12 bulan</option></select></div><div class="form-field"><label for="member-loan-modal-purpose">Tujuan pinjaman *</label><textarea id="member-loan-modal-purpose" name="purpose" minlength="5" maxlength="120" rows="3" placeholder="Contoh: Modal usaha kecil" required></textarea></div><p class="form-error" id="member-loan-modal-error" role="alert" aria-live="polite"></p></form>`, `<button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-primary" type="submit" form="member-loan-modal-form">${icon('send')} Kirim Pengajuan</button>`, true);
  }
  function openBillingDetail(id) {
    const loan = findLoan(id);
    if (!loan || !loanBelongsToCurrentMember(loan)) {
      toast('Belum ada tagihan pinjaman aktif untuk ditampilkan.', 'info');
      return;
    }
    const payments = Array.isArray(loan.payments) ? loan.payments : [];
    const paidCount = Math.max(0, Number(loan.paid) || 0);
    const installmentAmount = nextInstallmentAmount(loan);
    const paidRows = Array.from({ length: Math.min(paidCount, Number(loan.duration) || paidCount) }, (_, index) => {
      const installmentNo = index + 1;
      const payment = payments.find(item => Number(item.installmentNumber) === installmentNo);
      return `<div class="billing-history-row"><span class="billing-check">${icon('check_circle')}</span><span><strong>Angsuran ke-${installmentNo}</strong><small>${payment ? `${fmtDate(payment.date)} · ${escapeHTML(payment.method || 'Pembayaran')}` : 'Tercatat telah dibayar'}</small></span><span class="billing-history-amount">${payment ? fmtCurrency(payment.amount) : statusPill('Lunas')}</span></div>`;
    }).join('');
    const paidThisMonth = hasPaidThisMonth(loan);
    const active = ['Berjalan', 'Aktif'].includes(loan.status) && Number(loan.remaining) > 0;
    const paymentButton = active && !paidThisMonth
      ? `<button class="btn btn-primary" data-action="open-payment-modal" data-id="${escapeHTML(loan.id)}">${icon('payments')} Bayar Angsuran Bulan Ini</button>`
      : `<button class="btn btn-secondary" disabled>${icon('check_circle')} ${paidThisMonth ? 'Angsuran bulan ini sudah lunas' : 'Tidak ada tagihan aktif'}</button>`;
    showModal('Rincian Tagihan', `${escapeHTML(loan.id)} · ${escapeHTML(loan.purpose || 'Pinjaman anggota')}`, `<div class="billing-summary-grid"><div class="billing-summary-card"><span>Sisa pokok hutang</span><strong>${fmtCurrency(loan.remaining)}</strong></div><div class="billing-summary-card"><span>Angsuran bulan ini</span><strong>${fmtCurrency(installmentAmount)}</strong></div></div><div class="billing-progress"><div><span>Angsuran terbayar</span><strong>${paidCount} dari ${Number(loan.duration) || 0}</strong></div><div class="progress-track"><span style="width:${Math.min(100, Math.round(paidCount / Math.max(1, Number(loan.duration) || 1) * 100))}%"></span></div></div><div class="billing-meta"><div><span>Jatuh tempo berikutnya</span><strong>${fmtDate(loan.dueDate)}</strong></div><div><span>Status pinjaman</span>${statusPill(loan.status)}</div></div><div class="billing-history"><h3>Riwayat Angsuran</h3>${paidRows || `<div class="empty-state">${icon('receipt_long')}<strong>Belum ada angsuran yang tercatat</strong><br>Riwayat pembayaran akan muncul setelah pembayaran dilakukan.</div>`}</div>${paidThisMonth ? '<p class="billing-paid-note">Angsuran bulan ini sudah tercatat lunas.</p>' : ''}`, `<button class="btn btn-outline" data-action="close-modal">Tutup</button>${paymentButton}`, true);
  }
  function openPaymentModal(id) {
    const loan = findLoan(id);
    if (!loan || !loanBelongsToCurrentMember(loan) || !['Berjalan', 'Aktif'].includes(loan.status) || Number(loan.remaining) <= 0) {
      toast('Pinjaman ini tidak memiliki tagihan aktif.', 'error');
      return;
    }
    if (hasPaidThisMonth(loan)) {
      toast('Angsuran bulan ini sudah lunas.', 'info');
      openBillingDetail(id);
      return;
    }
    const amount = nextInstallmentAmount(loan);
    const member = getCurrentMember();
    window.__kopsimpanPayLoanId = loan.id;
    showModal('Simulasi Pembayaran', 'Pilih metode pembayaran untuk menyelesaikan angsuran bulan ini.', `<form id="member-payment-form" class="member-modal-form"><div class="payment-amount-card"><span>Nominal yang dibayar</span><strong>${fmtCurrency(amount)}</strong><small>Pinjaman ${escapeHTML(loan.id)} · jatuh tempo ${fmtDate(loan.dueDate)}</small></div><div class="form-field"><label for="member-payment-method">Metode pembayaran *</label><select id="member-payment-method" name="method" required><option value="Transfer Bank">Transfer Bank</option><option value="Saldo Simpanan">Saldo Simpanan (tersedia ${fmtCurrency(member?.savings || 0)})</option></select></div><p class="form-error" id="member-payment-error" role="alert" aria-live="polite"></p><p class="payment-disclaimer">Ini simulasi client-side. Pembayaran akan langsung tercatat pada data demo di browser ini.</p></form>`, `<button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-primary" type="submit" form="member-payment-form">${icon('verified')} Bayar Sekarang</button>`);
  }
  function processMemberPayment(form) {
    const fd = new FormData(form);
    const method = String(fd.get('method') || '');
    const errorEl = document.getElementById('member-payment-error');
    const fail = (message) => { if (errorEl) errorEl.textContent = message; };
    if (!['Transfer Bank', 'Saldo Simpanan'].includes(method)) { fail('Pilih metode pembayaran yang tersedia.'); return; }
    const paymentButton = document.querySelector('[form="member-payment-form"][type="submit"]');
    if (paymentButton) paymentButton.disabled = true;
    // The loan ID is stored explicitly when opening the payment dialog, not taken from user input.
    const id = window.__kopsimpanPayLoanId;
    const loan = findLoan(id);
    const member = getCurrentMember();
    if (!loan || !member || !loanBelongsToCurrentMember(loan)) { if (paymentButton) paymentButton.disabled = false; fail('Data pinjaman tidak ditemukan. Tutup dialog dan coba kembali.'); return; }
    if (hasPaidThisMonth(loan)) { if (paymentButton) paymentButton.disabled = false; fail('Angsuran bulan ini sudah lunas.'); return; }
    const amount = nextInstallmentAmount(loan);
    if (amount <= 0) { if (paymentButton) paymentButton.disabled = false; fail('Nominal angsuran tidak valid.'); return; }
    if (method === 'Saldo Simpanan' && Number(member.savings || 0) < amount) { if (paymentButton) paymentButton.disabled = false; fail(`Saldo simpanan tidak cukup. Saldo tersedia ${fmtCurrency(member.savings || 0)}.`); return; }
    const loans = getData('loans');
    const transactions = getData('transactions');
    const members = getData('members');
    const today = new Date();
    const date = localDateKey(today);
    const month = localMonthKey(today);
    const installmentNumber = (Number(loan.paid) || 0) + 1;
    const remaining = Math.max(0, Number(loan.remaining) - amount);
    const payment = { id: `BYR-${loan.id}-${month}`, month, date, amount, method, installmentNumber, status: 'Lunas' };
    const updatedLoan = { ...loan, remaining, paid: installmentNumber, lastPaidMonth: month, payments: [...(Array.isArray(loan.payments) ? loan.payments : []), payment], dueDate: remaining > 0 ? addMonthsToDate(loan.dueDate || date, 1) : loan.dueDate, status: remaining <= 0 || installmentNumber >= Number(loan.duration) ? 'Lunas' : loan.status };
    const updatedLoans = loans.map(item => item.id === loan.id ? updatedLoan : item);
    const updatedMembers = method === 'Saldo Simpanan' ? members.map(item => item.id === member.id ? { ...item, savings: Math.max(0, Number(item.savings || 0) - amount) } : item) : members;
    const nextTxNo = Math.max(0, ...transactions.map(t => Number(String(t.id).split('-').pop()) || 0)) + 1;
    const tx = { id: `STR-${today.getFullYear()}-${String(nextTxNo).padStart(3, '0')}`, memberId: member.id, memberName: member.name, type: 'Angsuran Pinjaman', amount, method, date, status: 'Terverifikasi', loanRef: loan.id, installment: `Ke-${installmentNumber} dari ${loan.duration}`, note: `Pembayaran simulasi ${month}` };
    // Save each related collection and roll back earlier writes if a later write fails.
    const oldLoans = loans, oldMembers = members, oldTransactions = transactions;
    const okLoans = write(storeKeys.loans, updatedLoans);
    const okMembers = method === 'Saldo Simpanan' ? write(storeKeys.members, updatedMembers) : true;
    const okTransactions = write(storeKeys.transactions, [tx, ...transactions]);
    if (!okLoans || !okMembers || !okTransactions) {
      write(storeKeys.loans, oldLoans);
      if (method === 'Saldo Simpanan') write(storeKeys.members, oldMembers);
      write(storeKeys.transactions, oldTransactions);
      if (paymentButton) paymentButton.disabled = false;
      fail('Pembayaran gagal disimpan. Ruang localStorage mungkin penuh. Hapus data demo yang tidak diperlukan lalu coba lagi.');
      return;
    }
    window.__kopsimpanPayLoanId = null;
    closeModal();
    render();
    toast(`Angsuran ke-${installmentNumber} berhasil dibayar dan tercatat lunas.`);
  }

  function openTransactionModal() {
    const members = getData('members').filter(m => m.status !== 'Nonaktif');
    const options = members.map(m => `<option value="${escapeHTML(m.id)}">${escapeHTML(m.name)} (${escapeHTML(m.id)})</option>`).join('');
    showModal('Catat Transaksi', 'Masukkan setoran simpanan atau pembayaran angsuran anggota.', `<form id="transaction-form"><div class="form-grid"><div class="form-field full"><label for="tx-member">Anggota *</label><select id="tx-member" name="memberId" required>${options}</select></div><div class="form-field"><label for="tx-type">Jenis transaksi *</label><select id="tx-type" name="type" required><option>Setoran Simpanan</option><option>Simpanan Wajib</option><option>Simpanan Sukarela</option><option>Angsuran Pinjaman</option></select></div><div class="form-field"><label for="tx-amount">Nominal (Rp) *</label><input id="tx-amount" name="amount" type="number" min="1000" step="1000" placeholder="Contoh: 150000" required></div><div class="form-field"><label for="tx-method">Metode pembayaran *</label><select id="tx-method" name="method"><option>Transfer Bank</option><option>Tunai/Kasir</option><option>E-Wallet</option></select></div><div class="form-field"><label for="tx-date">Tanggal transaksi *</label><input id="tx-date" name="date" type="date" value="2026-10-17" required></div><div class="form-field full"><label for="tx-note">Catatan</label><input id="tx-note" name="note" placeholder="Opsional, misalnya nomor referensi transfer"></div></div><p style="font-size:10px;color:#718176;margin:4px 0 0">Transaksi baru berstatus Menunggu Cek sampai diverifikasi petugas.</p></form>`, `<button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-primary" type="submit" form="transaction-form">${icon('save')} Simpan Transaksi</button>`, true);
  }
  function openVerifyModal(id) {
    const tx = findTransaction(id);
    if (!tx) return;
    showModal('Verifikasi Setoran', `Periksa detail transaksi ${tx.id} sebelum mengonfirmasi.`, `<div class="info-card"><h3>${escapeHTML(tx.memberName)} · ${escapeHTML(tx.memberId)}</h3><p>${escapeHTML(tx.type)} pada ${fmtDate(tx.date)}</p><div class="info-row">${icon('receipt_long')} <span>Nomor transaksi: <strong>${escapeHTML(tx.id)}</strong></span></div><div class="info-row">${icon('payments')} <span>Nominal: <strong>${fmtCurrency(tx.amount)}</strong></span></div><div class="info-row">${icon('account_balance')} <span>Metode: <strong>${escapeHTML(tx.method)}</strong></span></div><div class="info-row">${icon('pending_actions')} <span>Status saat ini: <strong>${escapeHTML(tx.status)}</strong></span></div></div><p style="font-size:11px;color:#65766b;margin:14px 0 0">Pastikan bukti pembayaran telah sesuai sebelum melanjutkan.</p>`, `<button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-primary" data-action="confirm-verify-transaction" data-id="${escapeHTML(id)}">${icon('verified')} Konfirmasi Verifikasi</button>`);
  }
  function openTransactionDetail(id) {
    const tx = findTransaction(id);
    if (!tx) return;
    showModal('Detail Transaksi', `Rincian transaksi ${tx.id}.`, `<div class="info-card"><h3>${escapeHTML(tx.memberName)}</h3><p>${escapeHTML(tx.memberId)} · ${fmtDate(tx.date)}</p><div class="info-row">${icon('receipt_long')} <span>Nomor transaksi: <strong>${escapeHTML(tx.id)}</strong></span></div><div class="info-row">${icon('category')} <span>Jenis: <strong>${escapeHTML(tx.type)}</strong></span></div><div class="info-row">${icon('payments')} <span>Nominal: <strong>${fmtCurrency(tx.amount)}</strong></span></div><div class="info-row">${icon('account_balance')} <span>Metode: <strong>${escapeHTML(tx.method)}</strong></span></div><div class="info-row">${icon('task_alt')} <span>Status: ${statusPill(tx.status)}</span></div></div>`, `<button class="btn btn-outline" data-action="close-modal">Tutup</button>${page !== 'dashboard-anggota' && tx.status === 'Menunggu Cek' ? `<button class="btn btn-primary" data-action="verify-transaction" data-id="${escapeHTML(id)}">${icon('verified')} Verifikasi</button>` : ''}`);
  }
  function openMemberDetail(id) {
    const m = findMember(id);
    if (!m) return;
    showModal('Detail Anggota', `Profil ringkas anggota ${m.id}.`, `<div class="member-cell" style="margin-bottom:18px">${memberAvatar(m.name,0)}<div><strong style="font-size:15px">${escapeHTML(m.name)}</strong><small>${escapeHTML(m.id)} · Bergabung ${fmtDate(m.joinDate)}</small></div></div><div class="form-grid"><div class="form-field"><label>NIK</label><div class="control-input">${escapeHTML(m.nik)}</div></div><div class="form-field"><label>Nomor HP</label><div class="control-input">${escapeHTML(m.phone)}</div></div><div class="form-field"><label>Email</label><div class="control-input">${escapeHTML(m.email || '-')}</div></div><div class="form-field"><label>Status</label><div style="padding:10px 0">${statusPill(m.status)}</div></div><div class="form-field"><label>Saldo Simpanan</label><div class="control-input">${fmtCurrency(m.savings)}</div></div><div class="form-field"><label>Pinjaman</label><div class="control-input">${fmtCurrency(m.loan)}</div></div><div class="form-field full"><label>Alamat</label><div class="control-input">${escapeHTML(m.address || '-')}</div></div></div>`, `<a class="btn btn-primary" href="${base}/pages/form-anggota.html?id=${encodeURIComponent(m.id)}">${icon('edit')} Edit Anggota</a><button class="btn btn-outline" data-action="close-modal">Tutup</button>`, true);
  }
  function openLoanDetail(id) {
    const loan = findLoan(id);
    if (!loan) return;
    const pending = loan.status === 'Menunggu Persetujuan';
    showModal(`Detail Pinjaman ${loan.id}`, `${loan.memberName} · ${loan.purpose}`, `<div class="stats-grid" style="grid-template-columns:1fr 1fr;margin-bottom:14px"><div class="stat-card"><div class="stat-label">Plafon Pinjaman</div><div class="stat-value" style="font-size:19px">${compactCurrency(loan.principal)}</div></div><div class="stat-card"><div class="stat-label">Sisa Pinjaman</div><div class="stat-value" style="font-size:19px">${compactCurrency(loan.remaining)}</div></div></div><div class="info-card"><div class="info-row">${icon('person')} <span>Anggota: <strong>${escapeHTML(loan.memberName)} (${escapeHTML(loan.memberId)})</strong></span></div><div class="info-row">${icon('event')} <span>Tanggal pengajuan: <strong>${fmtDate(loan.date)}</strong></span></div><div class="info-row">${icon('payments')} <span>Angsuran per bulan: <strong>${fmtCurrency(loan.installment)}</strong></span></div><div class="info-row">${icon('calendar_month')} <span>Angsuran terbayar: <strong>${loan.paid} dari ${loan.duration} kali</strong></span></div><div class="info-row">${icon('schedule')} <span>Jatuh tempo berikutnya: <strong>${fmtDate(loan.dueDate)}</strong></span></div><div class="info-row">${icon('task_alt')} <span>Status: ${statusPill(loan.status)}</span></div></div>`, `${pending ? `<button class="btn btn-danger" data-action="update-loan-status" data-id="${escapeHTML(id)}" data-status="Ditolak">${icon('close')} Tolak</button><button class="btn btn-primary" data-action="update-loan-status" data-id="${escapeHTML(id)}" data-status="Berjalan">${icon('check')} Setujui Pinjaman</button>` : `<button class="btn btn-outline" data-action="close-modal">Tutup</button>`}`, true);
  }
  function openApplicationDetail(id) {
    const apps = getData('applications');
    const a = apps.find(item => item.id === id);
    if (!a) return;
    const actions = a.status === 'Menunggu Verifikasi' || a.status === 'Diproses';
    showModal(`Pengajuan ${a.id}`, `${a.memberName} · ${a.type}`, `<div class="info-card"><h3>${escapeHTML(a.type)}</h3><p>Nomor pengajuan ${escapeHTML(a.id)} diterima pada ${fmtDate(a.date)}.</p><div class="info-row">${icon('person')} <span>Anggota: <strong>${escapeHTML(a.memberName)} (${escapeHTML(a.memberId)})</strong></span></div><div class="info-row">${icon('payments')} <span>Nominal: <strong>${a.amount ? fmtCurrency(a.amount) : 'Tidak ada nominal'}</strong></span></div><div class="info-row">${icon('pending_actions')} <span>Status saat ini: ${statusPill(a.status)}</span></div><div class="info-row">${icon('notes')} <span>Catatan: <strong>${escapeHTML(a.note || '-')}</strong></span></div></div>`, `${actions ? `<button class="btn btn-danger" data-action="update-application-status" data-id="${escapeHTML(id)}" data-status="Ditolak">${icon('close')} Tolak</button><button class="btn btn-secondary" data-action="update-application-status" data-id="${escapeHTML(id)}" data-status="Diproses">${icon('sync')} Proses</button><button class="btn btn-primary" data-action="update-application-status" data-id="${escapeHTML(id)}" data-status="Disetujui">${icon('check')} Setujui</button>` : `<button class="btn btn-outline" data-action="close-modal">Tutup</button>`}`);
  }

  function updateVisibleCount() {
    const rows = Array.from(document.querySelectorAll('tbody tr'));
    const visible = rows.filter(row => row.style.display !== 'none' && !row.querySelector('.empty-state')).length;
    const count = document.getElementById('table-count');
    if (count && rows.length) count.textContent = `Menampilkan ${visible} dari ${rows.filter(row => !row.querySelector('.empty-state')).length} data`;
  }
  function applyTableFilters() {
    const localSearch = document.querySelector('[data-table-search]');
    const globalSearch = document.querySelector('[data-global-search]');
    const statusFilter = document.querySelector('[data-status-filter]');
    const search = ((localSearch && localSearch.value) || (globalSearch && globalSearch.value) || '').trim().toLowerCase();
    const status = statusFilter ? statusFilter.value : '';
    document.querySelectorAll('tbody tr').forEach((row) => {
      const rowText = (row.dataset.rowSearch || row.innerText || '').toLowerCase();
      const matchesSearch = !search || rowText.includes(search);
      const matchesStatus = !status || row.dataset.status === status;
      row.style.display = matchesSearch && matchesStatus ? '' : 'none';
    });
    updateVisibleCount();
  }
  function exportCSV(kind) {
    const data = getData(kind);
    if (!Array.isArray(data) || !data.length) { toast('Tidak ada data untuk diekspor.', 'info'); return; }
    const keys = Object.keys(data[0]);
    const csvCell = (value) => `"${String(value == null ? '' : value).replace(/"/g, '""')}"`;
    const csv = [keys.map(csvCell).join(','), ...data.map(row => keys.map(key => csvCell(row[key])).join(','))].join('\r\n');
    const blob = new Blob(['\ufeff', csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kopsimpan-${kind}-${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(link); link.click(); link.remove(); URL.revokeObjectURL(url);
    toast('File CSV berhasil disiapkan.', 'download');
  }
  function applyReportFilter() {
    const start = document.getElementById('report-start')?.value || '';
    const end = document.getElementById('report-end')?.value || '';
    document.querySelectorAll('tbody tr[data-date]').forEach((row) => {
      const date = row.dataset.date || '';
      row.style.display = (!start || date >= start) && (!end || date <= end) ? '' : 'none';
    });
    updateVisibleCount();
    toast('Filter periode laporan diterapkan.', 'filter_alt');
  }

  root.addEventListener('submit', function (event) {
    const form = event.target;
    if (form.id === 'login-form') {
      event.preventDefault();
      const email = String(form.elements.namedItem('email').value || '').trim();
      const password = String(form.elements.namedItem('password').value || '');
      if (!email || !password) { toast('Isi email dan kata sandi terlebih dahulu.', 'error'); return; }
      const accounts = read(storeKeys.accounts, []);
      const account = accounts.find(a => String(a.email).toLowerCase() === email.toLowerCase() && a.password === password && a.role === loginRole);
      if (!account) { toast('Email, kata sandi, atau tipe akun tidak sesuai.', 'error'); return; }
      if (account.active === false) { toast('Akun dinonaktifkan. Hubungi petugas koperasi.', 'error'); return; }
      const session = { name: account.name, role: account.role === 'admin' ? 'ADMIN' : 'ANGGOTA', id: account.id, memberId: account.memberId || '', email: account.email, roleKey: account.role, loggedAt: new Date().toISOString() };
      if (!write(storeKeys.session, session)) { toast('Penyimpanan browser tidak tersedia. Periksa pengaturan browser.', 'error'); return; }
      window.location.href = account.role === 'admin' ? 'pages/dashboard.html' : 'pages/dashboard-anggota.html';
    }
    if (form.id === 'member-loan-form') {
      event.preventDefault();
      const fd = new FormData(form); const amountRaw = String(fd.get('amount') || '').trim(); const amount = Number(amountRaw); const duration = Number(fd.get('duration')); const purpose = String(fd.get('purpose') || '').trim();
      const errorEl = document.getElementById('loan-form-error');
      const fail = (message, field) => { if (errorEl) errorEl.textContent = message; if (field) form.elements.namedItem(field)?.focus(); };
      if (!amountRaw || !Number.isFinite(amount) || amount < 100000 || amount > 100000000) { fail('Nominal wajib diisi dengan angka Rp100.000 sampai Rp100.000.000.', 'amount'); return; }
      if (!Number.isInteger(duration) || duration < 3 || duration > 24) { fail('Pilih tenor pinjaman yang tersedia.', 'duration'); return; }
      if (purpose.length < 5) { fail('Tujuan pinjaman minimal 5 karakter.', 'purpose'); return; }
      const session = read(storeKeys.session, {}) || {}; const member = findMember(session.memberId) || getData('members').find(m => m.email === session.email);
      if (!member || member.status === 'Nonaktif') { fail('Akun anggota tidak aktif atau tidak ditemukan.'); return; }
      const loans = getData('loans'); const next = Math.max(0, ...loans.map(l => Number(String(l.id).replace(/\D/g, '')) || 0)) + 1;
      const loan = { id: `PJ-${String(next).padStart(3, '0')}`, memberId: member.id, memberName: member.name, purpose, principal: amount, remaining: amount, installment: Math.ceil(amount / duration), duration, paid: 0, date: new Date().toISOString().slice(0,10), status: 'Menunggu Persetujuan', dueDate: '' };
      if (!write(storeKeys.loans, [loan, ...loans])) { fail('Penyimpanan penuh atau tidak tersedia. Hapus sebagian data browser lalu coba lagi.'); return; }
      render(); toast('Pengajuan pinjaman berhasil dikirim dan menunggu persetujuan.'); return;
    }
    if (form.id === 'member-loan-modal-form') {
      event.preventDefault();
      const fd = new FormData(form);
      const amountRaw = String(fd.get('amount') || '').trim();
      const amount = Number(amountRaw);
      const duration = Number(fd.get('duration'));
      const purpose = String(fd.get('purpose') || '').trim();
      const errorEl = document.getElementById('member-loan-modal-error');
      const fail = (message, field) => { if (errorEl) errorEl.textContent = message; if (field) form.elements.namedItem(field)?.focus(); };
      if (!/^\d+$/.test(amountRaw) || !Number.isSafeInteger(amount) || amount < 100000 || amount > 100000000) { fail('Nominal wajib berupa angka bulat Rp100.000 sampai Rp100.000.000.', 'amount'); return; }
      if (![3, 6, 12].includes(duration)) { fail('Pilih tenor 3, 6, atau 12 bulan.', 'duration'); return; }
      if (purpose.length < 5 || purpose.length > 120) { fail('Tujuan pinjaman harus terdiri dari 5 sampai 120 karakter.', 'purpose'); return; }
      const member = getCurrentMember();
      if (!member || member.status === 'Nonaktif') { fail('Akun anggota tidak aktif atau tidak ditemukan.'); return; }
      const loans = getData('loans');
      const next = Math.max(0, ...loans.map(l => Number(String(l.id).replace(/\D/g, '')) || 0)) + 1;
      const loan = { id: `PJ-${String(next).padStart(3, '0')}`, memberId: member.id, memberName: member.name, purpose, principal: amount, remaining: amount, installment: Math.ceil(amount / duration), duration, paid: 0, payments: [], date: localDateKey(), status: 'Menunggu Persetujuan', dueDate: addMonthsToDate(localDateKey(), 1) };
      if (!write(storeKeys.loans, [loan, ...loans])) { fail('Pengajuan tidak tersimpan. Penyimpanan browser penuh atau tidak tersedia.'); return; }
      window.__kopsimpanPayLoanId = null;
      closeModal();
      render();
      toast('Pengajuan pinjaman berhasil dikirim. Status: Menunggu Persetujuan.');
      return;
    }
    if (form.id === 'member-payment-form') {
      event.preventDefault();
      processMemberPayment(form);
      return;
    }
    if (form.id === 'member-form') {
      event.preventDefault();
      const formData = new FormData(form);
      const name = String(formData.get('name') || '').trim();
      const nik = String(formData.get('nik') || '').trim();
      const phone = String(formData.get('phone') || '').trim();
      const email = String(formData.get('email') || '').trim();
      if (name.length < 3) { toast('Nama lengkap minimal 3 karakter.', 'error'); form.elements.namedItem('name').focus(); return; }
      if (!/^\d{8,16}$/.test(nik)) { toast('NIK harus berisi 8 sampai 16 digit angka.', 'error'); form.elements.namedItem('nik').focus(); return; }
      if (!/^[0-9+()\-\s]{8,18}$/.test(phone)) { toast('Periksa kembali nomor HP.', 'error'); form.elements.namedItem('phone').focus(); return; }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Format email belum benar.', 'error'); form.elements.namedItem('email').focus(); return; }
      const members = getData('members');
      const originalId = String(formData.get('originalId') || '');
      const duplicate = members.some(m => m.nik === nik && m.id !== originalId);
      if (duplicate) { toast('NIK sudah digunakan anggota lain.', 'error'); form.elements.namedItem('nik').focus(); return; }
      const id = originalId || `A${String(Math.max(0, ...members.map(m => Number(String(m.id).replace(/\D/g, '')) || 0)) + 1).padStart(3, '0')}`;
      const existing = members.find(m => m.id === originalId);
      const newMember = { id, name, nik, phone, email, type: String(formData.get('type') || 'Anggota Baru'), joinDate: String(formData.get('joinDate') || '2026-10-17'), savings: Math.max(0, Number(formData.get('savings') || 0)), loan: existing ? Number(existing.loan || 0) : 0, status: String(formData.get('status') || 'Aktif'), address: String(formData.get('address') || '').trim() };
      const updated = originalId ? members.map(m => m.id === originalId ? newMember : m) : [...members, newMember];
      setData('members', updated);
      toast(originalId ? 'Data anggota berhasil diperbarui.' : 'Anggota baru berhasil ditambahkan.');
      window.setTimeout(() => { window.location.href = `${base}/pages/anggota.html`; }, 550);
    }
    if (form.id === 'transaction-form') {
      event.preventDefault();
      const formData = new FormData(form);
      const member = findMember(String(formData.get('memberId') || ''));
      const amount = Number(formData.get('amount') || 0);
      const date = String(formData.get('date') || '2026-10-17');
      if (!member) { toast('Pilih anggota yang valid.', 'error'); return; }
      if (amount < 1000) { toast('Nominal transaksi minimal Rp 1.000.', 'error'); form.elements.namedItem('amount').focus(); return; }
      const transactions = getData('transactions');
      const nextNumber = Math.max(0, ...transactions.map(t => Number(String(t.id).split('-').pop()) || 0)) + 1;
      const type = String(formData.get('type') || 'Setoran Simpanan');
      const tx = { id: `STR-2026-${String(nextNumber).padStart(3,'0')}`, memberId: member.id, memberName: member.name, type, amount, method: String(formData.get('method') || 'Transfer Bank'), date, status: 'Menunggu Cek', loanRef: type === 'Angsuran Pinjaman' ? (getData('loans').find(l => l.memberId === member.id && ['Berjalan', 'Aktif'].includes(l.status))?.id || '-') : '-', installment: type === 'Angsuran Pinjaman' ? 'Angsuran berjalan' : '-', note: String(formData.get('note') || '') };
      setData('transactions', [tx, ...transactions]);
      closeModal();
      render();
      toast('Transaksi berhasil dicatat dan menunggu verifikasi.');
    }
  });

  root.addEventListener('click', function (event) {
    const roleButton = event.target.closest('[data-role]');
    if (roleButton) {
      loginRole = roleButton.dataset.role || 'admin';
      document.querySelectorAll('[data-role]').forEach(btn => btn.classList.toggle('active', btn === roleButton));
      if (roleButton.dataset.role === 'member') {
        document.getElementById('login-email').value = 'anggota@kopsimpan.id';
        document.getElementById('login-password').value = 'anggota123';
      } else {
        document.getElementById('login-email').value = 'admin@kopsimpan.id';
        document.getElementById('login-password').value = 'admin123';
      }
      return;
    }
    const actionEl = event.target.closest('[data-action]');
    if (!actionEl) return;
    const action = actionEl.dataset.action;
    const id = actionEl.dataset.id;
    if (action === 'toggle-password') {
      const input = document.getElementById('login-password');
      if (input) { input.type = input.type === 'password' ? 'text' : 'password'; actionEl.innerHTML = icon(input.type === 'password' ? 'visibility' : 'visibility_off'); }
    } else if (action === 'login-help') {
      event.preventDefault();
      showModal('Bantuan akses demo', 'Informasi untuk mencoba prototipe KopSimpan.', '<div class="info-card"><h3>Akun simulasi</h3><p>Gunakan akun admin yang telah diisi otomatis pada formulir masuk.</p><div class="info-row">'+icon('mail')+' <span>Email: <strong>admin@kopsimpan.id</strong></span></div><div class="info-row">'+icon('lock')+' <span>Kata sandi: <strong>admin123</strong></span></div><div class="info-row">'+icon('info')+' <span>Aplikasi ini tidak terhubung ke server.</span></div></div>', '<button class="btn btn-primary" data-action="close-modal">Mengerti</button>');
    } else if (action === 'toggle-sidebar') {
      document.getElementById('sidebar')?.classList.toggle('open'); document.querySelector('.sidebar-backdrop')?.classList.toggle('show');
    } else if (action === 'close-sidebar') {
      document.getElementById('sidebar')?.classList.remove('open'); document.querySelector('.sidebar-backdrop')?.classList.remove('show');
    } else if (action === 'toggle-theme') {
      document.body.classList.toggle('dark-mode'); write(storeKeys.theme, document.body.classList.contains('dark-mode') ? 'dark' : 'light'); attachCharts();
    } else if (action === 'notifications') {
      const pending = getData('transactions').filter(t => t.status === 'Menunggu Cek').length;
      showModal('Notifikasi operasional', 'Ringkasan hal yang perlu diperiksa.', `<div class="info-card"><h3>${pending ? `${pending} setoran menunggu verifikasi` : 'Semua setoran telah diperiksa'}</h3><p>${pending ? 'Buka halaman transaksi untuk memeriksa bukti pembayaran dan memperbarui status.' : 'Tidak ada transaksi tertunda saat ini.'}</p></div>`, `<a class="btn btn-primary" href="${base}/pages/transaksi.html">Buka Transaksi</a><button class="btn btn-outline" data-action="close-modal">Tutup</button>`);
    } else if (action === 'open-member-loan-modal') {
      openMemberLoanModal();
    } else if (action === 'view-billing') {
      if (id) openBillingDetail(id); else toast('Belum ada tagihan pinjaman aktif.', 'info');
    } else if (action === 'open-payment-modal') {
      openPaymentModal(id);
    } else if (action === 'member-all-transactions') {
      const member = findMember((read(storeKeys.session, {}) || {}).memberId || 'A001') || getData('members')[0];
      const txs = getData('transactions').filter(t => t.memberId === member.id);
      showModal('Aktivitas saya', 'Riwayat transaksi simpanan dan angsuran.', `<div class="member-activity-list">${txs.map(t => `<button class="member-activity" data-action="view-transaction" data-id="${escapeHTML(t.id)}"><span class="member-activity-icon">${icon(t.type.includes('Angsuran') ? 'payments' : 'savings')}</span><span class="member-activity-main"><strong>${escapeHTML(t.type)}</strong><small>${fmtDate(t.date)} · ${escapeHTML(t.id)}</small></span><span class="member-activity-amount"><strong>${fmtCurrency(t.amount)}</strong>${statusPill(t.status)}</span></button>`).join('') || '<p>Belum ada transaksi.</p>'}</div>`, `<button class="btn btn-primary" data-action="close-modal">Tutup</button>`, true);
    } else if (action === 'member-help') {
      showModal('Bantuan anggota', 'Saluran bantuan simulasi.', '<div class="info-card"><h3>Hubungi petugas koperasi</h3><p>Untuk demonstrasi, silakan sampaikan pertanyaan kepada petugas admin saat presentasi. Kontak ini tidak mengirim pesan ke server.</p><div class="info-row">'+icon('support_agent')+' <span>Petugas layanan: <strong>Ahmad Fauzi</strong></span></div><div class="info-row">'+icon('schedule')+' <span>Jam layanan: <strong>Senin sampai Jumat, 08.00 sampai 16.00</strong></span></div></div>', '<button class="btn btn-primary" data-action="close-modal">Mengerti</button>');
    } else if (action === 'logout') {
      write(storeKeys.session, null); window.location.href = `${base}/index.html`;
    } else if (action === 'dismiss-banner') {
      document.getElementById('operational-notice')?.remove();
    } else if (action === 'open-transaction-modal') {
      openTransactionModal();
    } else if (action === 'close-modal') {
      closeModal();
    } else if (action === 'backdrop-close') {
      if (event.target === actionEl) closeModal();
    } else if (action === 'delete-member') {
      pendingDeleteId = id;
      const m = findMember(id);
      showModal('Hapus data anggota?', `Tindakan ini akan menghapus ${m ? m.name : 'anggota'} dari data demo lokal.`, '<p style="font-size:12px;color:#65766b;margin:0">Pastikan tidak ada transaksi atau pinjaman yang masih memerlukan data anggota ini. Penghapusan tidak dapat dibatalkan.</p>', `<button class="btn btn-outline" data-action="close-modal">Batal</button><button class="btn btn-danger" data-action="confirm-delete-member">${icon('delete')} Hapus Anggota</button>`);
    } else if (action === 'confirm-delete-member') {
      const members = getData('members').filter(m => m.id !== pendingDeleteId);
      setData('members', members); pendingDeleteId = null; closeModal(); render(); toast('Data anggota berhasil dihapus.', 'delete');
    } else if (action === 'view-member') {
      openMemberDetail(id);
    } else if (action === 'verify-transaction') {
      openVerifyModal(id);
    } else if (action === 'confirm-verify-transaction') {
      const transactions = getData('transactions').map(t => t.id === id ? { ...t, status: 'Terverifikasi' } : t);
      setData('transactions', transactions);
      const tx = transactions.find(t => t.id === id);
      if (tx && tx.type !== 'Angsuran Pinjaman') {
        const members = getData('members').map(m => m.id === tx.memberId ? { ...m, savings: Number(m.savings || 0) + Number(tx.amount || 0) } : m);
        setData('members', members);
      }
      closeModal(); render(); toast('Transaksi berhasil diverifikasi.');
    } else if (action === 'view-transaction') {
      openTransactionDetail(id);
    } else if (action === 'view-loan') {
      openLoanDetail(id);
    } else if (action === 'update-loan-status') {
      const status = actionEl.dataset.status;
      const loans = getData('loans').map(l => l.id === id ? { ...l, status } : l);
      setData('loans', loans); closeModal(); render(); toast(`Status pinjaman diperbarui menjadi ${status}.`);
    } else if (action === 'view-application') {
      openApplicationDetail(id);
    } else if (action === 'update-application-status') {
      const status = actionEl.dataset.status;
      const apps = getData('applications').map(a => a.id === id ? { ...a, status } : a);
      setData('applications', apps); closeModal(); render(); toast(`Status pengajuan diperbarui menjadi ${status}.`);
    } else if (action === 'approve-application-loan' || action === 'reject-application-loan') {
      const status = action === 'approve-application-loan' ? 'Aktif' : 'Ditolak';
      const loans = getData('loans').map(l => l.id === id ? { ...l, status, approvedAt: new Date().toISOString() } : l);
      if (write(storeKeys.loans, loans)) { render(); toast(`Pengajuan ${id} ${status === 'Aktif' ? 'disetujui' : 'ditolak'}.`); } else toast('Gagal menyimpan perubahan. Periksa ruang penyimpanan browser.', 'error');
    } else if (action === 'reset-member-password') {
      const member = findMember(id); const accounts = read(storeKeys.accounts, []);
      const updated = accounts.map(a => a.memberId === id || a.id === id ? { ...a, password: 'anggota123', active: member?.status !== 'Nonaktif' } : a);
      if (!updated.some(a => a.memberId === id || a.id === id) && member) updated.push({ email: member.email, password: 'anggota123', role: 'member', name: member.name, id: member.id, memberId: member.id, active: member.status !== 'Nonaktif' });
      if (write(storeKeys.accounts, updated)) showModal('Password berhasil direset', `Kata sandi sementara untuk ${member?.name || id} adalah anggota123.`, '<div class="info-card"><p>Ganti kata sandi sementara setelah pengembangan backend diterapkan.</p></div>', '<button class="btn btn-primary" data-action="close-modal">Mengerti</button>');
      else toast('Reset password gagal karena penyimpanan tidak tersedia.', 'error');
    } else if (action === 'toggle-member-account') {
      const status = actionEl.dataset.status; const members = getData('members').map(m => m.id === id ? { ...m, status } : m);
      const accounts = read(storeKeys.accounts, []).map(a => a.memberId === id || a.id === id ? { ...a, active: status !== 'Nonaktif' } : a);
      const ok1 = write(storeKeys.members, members); const ok2 = write(storeKeys.accounts, accounts);
      if (ok1 && ok2) { render(); toast(`Akun anggota ${status === 'Nonaktif' ? 'dinonaktifkan' : 'diaktifkan'}.`); } else toast('Perubahan tidak dapat disimpan. Periksa penyimpanan browser.', 'error');
    } else if (action === 'export-csv') {
      exportCSV(actionEl.dataset.kind || 'transactions');
    } else if (action === 'print-report') {
      window.print();
    } else if (action === 'apply-report-filter') {
      applyReportFilter();
    } else if (action === 'reset-report-filter') {
      const start = document.getElementById('report-start'); const end = document.getElementById('report-end');
      if (start) start.value = ''; if (end) end.value = '';
      document.querySelectorAll('tbody tr[data-date]').forEach(row => row.style.display = ''); updateVisibleCount(); toast('Filter periode direset.');
    } else if (action === 'portfolio-info') {
      showModal('Distribusi portofolio', 'Informasi ringkasan status pinjaman.', '<p style="font-size:12px;color:#65766b;margin:0">Grafik ini merupakan data ilustrasi untuk menampilkan komposisi pinjaman berjalan, lunas, menunggu verifikasi, dan menunggak. Sesuaikan dengan data aktual apabila aplikasi dikembangkan dengan backend.</p>', '<button class="btn btn-primary" data-action="close-modal">Tutup</button>');
    }
  });

  root.addEventListener('input', function (event) {
    if (event.target.matches('[data-table-search], [data-global-search]')) applyTableFilters();
    if (event.target.id === 'member-loan-modal-amount') event.target.value = event.target.value.replace(/[^0-9]/g, '').slice(0, 9);
    if (event.target.matches('input[type="number"]')) {
      event.target.value = event.target.value.replace(/[^0-9.]/g, '');
      if (event.target.value && Number(event.target.value) < 0) event.target.value = '0';
    }
  });
  root.addEventListener('keydown', function (event) {
    const card = event.target.closest('.member-stat-clickable[data-action="view-billing"]');
    if (card && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      const id = card.dataset.id;
      if (id) openBillingDetail(id); else toast('Belum ada tagihan pinjaman aktif.', 'info');
    }
  });

  root.addEventListener('change', function (event) {
    if (event.target.matches('[data-status-filter]')) applyTableFilters();
    if (event.target.id === 'chart-period') {
      const chart = charts.find(c => c.canvas && c.canvas.id === 'cashflow-chart');
      if (chart) {
        const count = Number(event.target.value || 6);
        chart.data.labels = ['Mei', 'Jun', 'Jul', 'Ags', 'Sep', 'Okt'].slice(-count);
        chart.data.datasets.forEach((ds) => { ds.data = ds.data.slice(-count); });
        chart.update();
      }
    }
  });

  initData();
  render();
})();
