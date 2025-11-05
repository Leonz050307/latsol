<?php $u = Auth::user(); $isAdmin = $u && $u['role'] === 'admin'; $daily = Utils::todayId(); ?>
<div>
  <h2 style="margin:0 0 6px">Set Harian: <?= $daily ?></h2>
  <p class="small">Selesaikan sekali saja per akun dan per perangkat.</p>
  <div class="grid bento">
    <div class="card glow">
      <h3 style="margin-top:0">Leaderboard Hari Ini</h3>
      <div id="leaderboard" class="small">Memuat…</div>
    </div>
    <div class="card" style="grid-column: span 2; min-width:260px">
      <?php if (!$u): ?>
        <div class="card" style="border-color:#fca5a5"><b>Masuk dulu</b> untuk mulai mengerjakan.</div>
      <?php else: ?>
        <button id="start" class="btn glow">Mulai Kerjakan</button>
        <section id="attempt-section" class="hidden" style="margin-top:10px">
          <?php if (!$questions): ?>
            <p>Belum ada soal hari ini. <?php if ($isAdmin): ?>Buka <a href="/admin">Admin</a> untuk generate.<?php endif; ?></p>
          <?php else: ?>
            <?php foreach ($questions as $q): ?>
              <div class="card" data-qid-wrap>
                <div class="small">[<?= $q['subtest_code'] ?>] • <?= $q['qtype'] ?></div>
                <div><?= nl2br(htmlspecialchars($q['prompt'])) ?></div>
                <div data-qid="<?= $q['id'] ?>" data-qtype="<?= $q['qtype'] ?>">
                  <?php if ($q['qtype'] === 'single'): $opts = json_decode($q['options'], true) ?? []; $labels = ['A','B','C','D','E']; foreach ($labels as $i => $lab): $text = $opts[$i] ?? $lab; ?>
                    <label style="display:block;margin-top:8px"><input type="radio" name="q<?= $q['id'] ?>" value="<?= $lab ?>"> <b><?= $lab ?>.</b> <?= htmlspecialchars($text) ?></label>
                  <?php endforeach; elseif ($q['qtype'] === 'complex'): $rows = json_decode($q['options'], true) ?? []; ?>
                    <table class="table"><tbody>
                      <?php foreach ($rows as $idx => $row): ?>
                      <tr data-row>
                        <td><?= htmlspecialchars($row['statement'] ?? ('Pernyataan #' . ($idx + 1))) ?></td>
                        <td><label><input type="checkbox" value="A"> A (Benar)</label> <label style="margin-left:12px"><input type="checkbox" value="B"> B (Salah)</label></td>
                      </tr>
                      <?php endforeach; ?>
                    </tbody></table>
                  <?php else: ?>
                    <input class="input" type="text" placeholder="jawaban singkat…">
                  <?php endif; ?>
                </div>
                <details style="margin-top:8px">
                  <summary class="btn">Pembahasan</summary>
                  <div style="margin-top:8px" class="small">
                    <div><b>Ringkas:</b> <?= nl2br(htmlspecialchars($q['explanation_short'])) ?></div>
                    <?php if ($u['premium']): ?>
                      <div style="margin-top:6px"><b>Full:</b> <?= nl2br(htmlspecialchars($q['explanation_full'] ?? '-')) ?></div>
                    <?php else: ?>
                      <div style="margin-top:6px">Untuk <b>pembahasan lengkap</b>, upgrade Premium. <a class="btn" href="https://wa.me/6281234567890" target="_blank">Chat Admin WA</a></div>
                    <?php endif; ?>
                  </div>
                </details>
              </div>
            <?php endforeach; ?>
            <button id="submit" class="btn">Kumpulkan</button>
          <?php endif; ?>
        </section>
      <?php endif; ?>
    </div>
  </div>
</div>
