<?php
class Csrf {
  public static function token(): string {
    $key = (require __DIR__ . '/../config/env.php')['app']['csrf_key'];
    $t = bin2hex(random_bytes(16));
    $_SESSION['csrf'] = $t;
    return hash_hmac('sha256', $t, $key);
  }

  public static function verify(string $token): bool {
    if (!isset($_SESSION['csrf'])) {
      return false;
    }
    $key = (require __DIR__ . '/../config/env.php')['app']['csrf_key'];
    $valid = hash_hmac('sha256', $_SESSION['csrf'], $key);
    return hash_equals($valid, $token);
  }
}
