<?php
class UserModel {
  public static function create(string $email, string $name, string $password): void {
    $pdo = DB::pdo();
    $st = $pdo->prepare('INSERT INTO users(email,name,password_hash) VALUES(?,?,?)');
    $st->execute([$email, $name, password_hash($password, PASSWORD_BCRYPT)]);
  }

  public static function byEmail(string $email): ?array {
    $st = DB::pdo()->prepare('SELECT * FROM users WHERE email=?');
    $st->execute([$email]);
    return $st->fetch() ?: null;
  }

  public static function setDevice(int $id, string $hash): void {
    $st = DB::pdo()->prepare('UPDATE users SET device_hash=? WHERE id=? AND (device_hash IS NULL OR device_hash=?)');
    $st->execute([$hash, $id, $hash]);
  }

  public static function checkPassword(array $u, string $p): bool {
    return password_verify($p, $u['password_hash']);
  }
}
