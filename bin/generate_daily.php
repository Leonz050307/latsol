#!/usr/bin/env php
<?php
require __DIR__ . '/../app/core/DB.php';
require __DIR__ . '/../app/core/Auth.php';
require __DIR__ . '/../app/core/Csrf.php';
require __DIR__ . '/../app/core/Utils.php';
require __DIR__ . '/../app/core/AIClient.php';
require __DIR__ . '/../app/core/Blueprint.php';
require __DIR__ . '/../app/models/User.php';
require __DIR__ . '/../app/models/Question.php';
require __DIR__ . '/../app/models/Attempt.php';

Auth::startSession();
$pdo = DB::pdo();
$admin = $pdo->query("SELECT * FROM users WHERE role='admin' ORDER BY id LIMIT 1")->fetch();
if (!$admin) {
  fwrite(STDERR, "No admin user.\n");
  exit(1);
}

$_SESSION['user'] = $admin;
$daily = Utils::todayId();

try {
  QuestionModel::deleteDaily($daily);
  QuestionModel::createDaily($daily, (int) $admin['id']);
  $ai = new AIClient();
  $all = [];
  foreach (Blueprint::subtests() as $code => $def) {
    $sys = Blueprint::systemPrompt($code);
    $usr = Blueprint::userPrompt($code, $def['q']);
    $json = $ai->chatJSON($sys, $usr);
    foreach (($json['questions'] ?? []) as $q) {
      $q['subtest'] = $code;
      $all[] = $q;
    }
  }
  QuestionModel::bulkInsert($daily, $all);
  echo "Generated " . count($all) . " questions for {$daily}.\n";
  exit(0);
} catch (Throwable $e) {
  fwrite(STDERR, 'Generation failed: ' . $e->getMessage() . "\n");
  exit(2);
}
