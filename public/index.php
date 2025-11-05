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

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?? '/';

function view(string $name, array $vars = []): void {
  extract($vars);
  $view = $name;
  require __DIR__ . '/../app/views/layout.php';
}

if ($path === '/' || $path === '') {
  $questions = QuestionModel::getForDaily(Utils::todayId());
  view('home', ['questions' => $questions]);
  exit;
}

if ($path === '/login') {
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $pass = $_POST['password'] ?? '';
    $u = UserModel::byEmail($email);
    if ($u && UserModel::checkPassword($u, $pass)) {
      UserModel::setDevice((int) $u['id'], Utils::deviceHash());
      Auth::login($u);
      header('Location: /');
      exit;
    }
    $err = 'Login gagal';
  }
  view('login', ['err' => $err ?? null]);
  exit;
}

if ($path === '/register') {
  if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    UserModel::create($_POST['email'], $_POST['name'], $_POST['password']);
    header('Location: /login');
    exit;
  }
  view('register');
  exit;
}

if ($path === '/logout') {
  Auth::logout();
  header('Location: /');
  exit;
}

if ($path === '/admin') {
  Auth::requireAdmin();
  view('admin');
  exit;
}

if ($path === '/admin/generate' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  Auth::requireAdmin();
  $token = $_POST['csrf'] ?? '';
  if (!Csrf::verify($token)) {
    Utils::json(['ok' => false, 'msg' => 'CSRF'], 400);
  }
  $daily = Utils::todayId();
  QuestionModel::deleteDaily($daily);
  QuestionModel::createDaily($daily, Auth::user()['id']);
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
  Utils::json(['ok' => true, 'count' => count($all)]);
}

if ($path === '/attempt/start' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $u = Auth::user();
  if (!$u) {
    Utils::json(['ok' => false, 'msg' => 'Auth'], 401);
  }
  $hash = Utils::deviceHash();
  if (!empty($u['device_hash']) && $u['device_hash'] !== $hash) {
    Utils::json(['ok' => false, 'msg' => 'Akun terkunci pada perangkat lain'], 403);
  }
  UserModel::setDevice((int) $u['id'], $hash);
  $daily = Utils::todayId();
  try {
    $id = AttemptModel::start((int) $u['id'], $daily);
    Utils::json(['ok' => true, 'attempt_id' => $id]);
  } catch (Throwable $e) {
    Utils::json(['ok' => false, 'msg' => 'Sudah mencoba hari ini'], 409);
  }
}

if ($path === '/attempt/submit' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  $u = Auth::user();
  if (!$u) {
    Utils::json(['ok' => false], 401);
  }
  $attempt_id = (int) ($_POST['attempt_id'] ?? 0);
  $daily = Utils::todayId();
  $questions = QuestionModel::getForDaily($daily);
  $answers = json_decode($_POST['answers'] ?? '[]', true);
  $correct = 0;
  $total = max(1, count($questions));
  foreach ($questions as $q) {
    $ua = $answers[$q['id']] ?? null;
    $ans = json_decode($q['answer'], true);
    $ok = false;
    if ($q['qtype'] === 'single') {
      $ok = isset($ua['key']) && strtoupper($ua['key']) === strtoupper($ans['key']);
    } elseif ($q['qtype'] === 'complex') {
      $ok = json_encode($ua['rows'] ?? []) === json_encode($ans['rows'] ?? []);
    } else {
      $ok = isset($ua['text']) && trim(strtolower($ua['text'])) === trim(strtolower($ans['text']));
    }
    if ($ok) {
      $correct++;
    }
    AttemptModel::answer($attempt_id, (int) $q['id'], $ua, (bool) $ok);
  }
  $score = round(100 * $correct / $total, 2);
  AttemptModel::finish($attempt_id, $score, (int) ($_POST['duration'] ?? 0));
  Utils::json(['ok' => true, 'score' => $score]);
}

if ($path === '/premium/toggle' && $_SERVER['REQUEST_METHOD'] === 'POST') {
  Auth::requireAdmin();
  $uid = (int) $_POST['user_id'];
  $st = DB::pdo()->prepare('UPDATE users SET premium=1-premium WHERE id=?');
  $st->execute([$uid]);
  Utils::json(['ok' => true]);
}

http_response_code(404);
view('404');
