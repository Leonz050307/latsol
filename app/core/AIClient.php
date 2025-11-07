<?php
class AIClient {
  private string $apiKey;
  private string $model;
  private int $timeout;

  public function __construct() {
    $cfg = (require __DIR__ . '/../config/env.php')['ai'];
    $this->apiKey = $cfg['api_key'];
    $this->model = $cfg['model'];
    $this->timeout = $cfg['timeout'];
  }

  public function chatJSON(string $system, string $user): array {
    if (!$this->apiKey) {
      throw new RuntimeException('OPENAI_API_KEY missing');
    }

    $payload = [
      'model' => $this->model,
      'response_format' => ['type' => 'json_object'],
      'messages' => [
        ['role' => 'system', 'content' => $system],
        ['role' => 'user', 'content' => $user],
      ],
    ];

    $ch = curl_init('https://api.openai.com/v1/chat/completions');
    curl_setopt_array($ch, [
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_POST => true,
      CURLOPT_HTTPHEADER => [
        'Content-Type: application/json',
        'Authorization: Bearer ' . $this->apiKey,
      ],
      CURLOPT_TIMEOUT => $this->timeout,
      CURLOPT_POSTFIELDS => json_encode($payload),
    ]);
    $res = curl_exec($ch);
    if ($res === false) {
      throw new RuntimeException('cURL: ' . curl_error($ch));
    }
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    if ($code < 200 || $code >= 300) {
      throw new RuntimeException('OpenAI HTTP ' . $code . ': ' . $res);
    }

    $data = json_decode($res, true);
    $content = $data['choices'][0]['message']['content'] ?? '{}';
    $json = json_decode($content, true);
    if (!is_array($json)) {
      throw new RuntimeException('AI returned non-JSON');
    }
    return $json;
  }
}
