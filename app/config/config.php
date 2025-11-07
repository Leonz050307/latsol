<?php
return [
  'app_name' => 'Latsol SNBT Daily',
  'base_url' => getenv('BASE_URL') ?: 'https://latsolsnbt.candubelajaar.my.id',
  'timezone' => 'Asia/Jakarta',
  'db_host' => getenv('DB_HOST') ?: '127.0.0.1',
  'db_name' => getenv('DB_NAME') ?: 'nnqodivk_latsolsnbt',
  'db_user' => getenv('DB_USER') ?: 'nnqodivk_candu',
  'db_pass' => getenv('DB_PASS') ?: 'candubanget',
  'session_lifetime' => 604800,
  'csrf' => [ 'token_name' => '_csrf', 'storage_key' => 'csrf_token' ],
  'security' => [ 'rate_limit' => [ 'login' => ['max'=>5,'window'=>60], 'api'=>['max'=>60,'window'=>60] ] ],
  'timers' => [ 'kejar_waktu'=>420, 'santai'=>1200 ],
  'sse' => [ 'enabled'=>true, 'retry'=>4000 ],
  'ai' => [
    'provider' => getenv('AI_PROVIDER') ?: 'openai',
    'api_key' => getenv('AI_API_KEY') ?: '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',
    'model' => getenv('AI_MODEL') ?: 'gpt-4o-mini',
    'endpoint' => getenv('AI_ENDPOINT') ?: 'https://api.openai.com/v1/chat/completions',
    'timeout' => 20,
  ],
];
