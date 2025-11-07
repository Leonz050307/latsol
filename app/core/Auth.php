<?php
class Auth {
  public static function startSession(): void {
    $cfg = require __DIR__ . '/../config/env.php';
    session_name($cfg['app']['session_name']);
    session_set_cookie_params([
      'lifetime' => 0,
      'path' => '/',
      'httponly' => true,
      'samesite' => 'Lax',
      'secure' => isset($_SERVER['HTTPS'])
    ]);
    if (session_status() === PHP_SESSION_NONE) {
      session_start();
    }
  }

  public static function user(): ?array {
    return $_SESSION['user'] ?? null;
  }

  public static function requireAdmin(): void {
    if (!self::user() || self::user()['role'] !== 'admin') {
      http_response_code(403);
      require __DIR__ . '/../views/403.php';
      exit;
    }
  }

  public static function login(array $user): void {
    $_SESSION['user'] = $user;
  }

  public static function logout(): void {
    $_SESSION = [];
    session_destroy();
  }
}
