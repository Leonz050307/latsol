<?php $u = Auth::user(); ?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>SNBT AI Latsol</title>
<link rel="stylesheet" href="/assets/style.css">
<script src="/assets/fingerprint.js" defer></script>
<script src="/assets/app.js" defer></script>
</head>
<body>
<div class="container">
  <div class="nav">
    <div class="hero"><span class="badge">SNBT • AI</span><h1>Latihan Harian</h1></div>
    <div>
      <?php if ($u): ?>
        <span class="small">Halo, <?= htmlspecialchars($u['name']) ?><?= $u['premium'] ? ' • <span class="badge">Premium</span>' : '' ?></span>
        <?php if ($u['role'] === 'admin'): ?>
          <a class="btn" href="/admin">Admin</a>
        <?php endif; ?>
        <a class="btn" href="/logout">Logout</a>
      <?php else: ?>
        <a class="btn" href="/login">Login</a>
        <a class="btn" href="/register">Daftar</a>
      <?php endif; ?>
    </div>
  </div>
  <div class="grid bento">
    <div class="card" style="grid-column:1/-1">
      <?php include __DIR__ . '/' . $view . '.php'; ?>
    </div>
  </div>
  <div style="margin-top:24px" class="small">Model soal: Pilihan Ganda • Majemuk Kompleks • Isian Singkat. Materi mengikuti TPS & Tes Literasi SNBT 2025.</div>
</div>
</body>
</html>
