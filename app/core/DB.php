<?php
class DB {
  private static ?PDO $pdo = null;

  public static function pdo(): PDO {
    if (self::$pdo) {
      return self::$pdo;
    }

    $cfg = require __DIR__ . '/../config/env.php';
    $dsn = sprintf(
      'mysql:host=%s;port=%s;dbname=%s;charset=%s',
      $cfg['db']['host'],
      $cfg['db']['port'],
      $cfg['db']['name'],
      $cfg['db']['charset']
    );
    $opt = [
      PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
      PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
      PDO::ATTR_EMULATE_PREPARES => false,
    ];
    self::$pdo = new PDO($dsn, $cfg['db']['user'], $cfg['db']['pass'], $opt);
    return self::$pdo;
  }
}
