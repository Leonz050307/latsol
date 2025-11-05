<?php
class Utils {
  public static function json($data, int $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
  }

  public static function todayId(): string {
    return gmdate('Y-m-d');
  }

  public static function deviceHash(): string {
    $ua = $_SERVER['HTTP_USER_AGENT'] ?? '';
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $fp = $_COOKIE['fp'] ?? '';
    return hash('sha256', $ua . '|' . $ip . '|' . $fp);
  }
}
