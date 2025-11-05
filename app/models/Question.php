<?php
class QuestionModel {
  public static function deleteDaily(string $daily): void {
    DB::pdo()->prepare('DELETE FROM daily_sets WHERE id=?')->execute([$daily]);
  }

  public static function createDaily(string $daily, int $admin_id, array $meta = []): void {
    DB::pdo()->prepare('INSERT INTO daily_sets(id,generated_by,meta) VALUES(?,?,JSON_OBJECT())')->execute([$daily, $admin_id]);
  }

  public static function bulkInsert(string $daily, array $items): void {
    $pdo = DB::pdo();
    $q = $pdo->prepare('INSERT INTO questions (daily_id,subtest_code,qtype,prompt,options,answer,explanation_short,explanation_full,difficulty,meta) VALUES (?,?,?,?,?,?,?,?,?,NULL)');
    foreach ($items as $it) {
      $q->execute([
        $daily,
        $it['subtest'] ?? 'PU',
        $it['qtype'],
        $it['prompt'],
        isset($it['options']) ? json_encode($it['options']) : null,
        json_encode($it['answer']),
        $it['explanation_short'] ?? '—',
        $it['explanation_full'] ?? null,
        $it['difficulty'] ?? 'menengah',
      ]);
    }
  }

  public static function getForDaily(string $daily): array {
    $st = DB::pdo()->prepare('SELECT * FROM questions WHERE daily_id=? ORDER BY id');
    $st->execute([$daily]);
    return $st->fetchAll();
  }
}
