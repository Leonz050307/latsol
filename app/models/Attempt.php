<?php
class AttemptModel {
  public static function start(int $user_id, string $daily): int {
    $pdo = DB::pdo();
    $pdo->prepare('INSERT INTO attempts(user_id,daily_id) VALUES(?,?)')->execute([$user_id, $daily]);
    return (int) $pdo->lastInsertId();
  }

  public static function answer(int $attempt_id, int $question_id, $ans, bool $is_correct): void {
    DB::pdo()->prepare('REPLACE INTO attempt_answers(attempt_id,question_id,user_answer,is_correct) VALUES (?,?,?,?)')->execute([
      $attempt_id,
      $question_id,
      json_encode($ans),
      $is_correct ? 1 : 0,
    ]);
  }

  public static function finish(int $attempt_id, float $score, int $dur): void {
    DB::pdo()->prepare('UPDATE attempts SET submitted_at=NOW(), score=?, duration_seconds=? WHERE id=?')->execute([
      $score,
      $dur,
      $attempt_id,
    ]);
  }
}
