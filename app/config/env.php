<?php
return [
  'db' => [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: '3306',
    'name' => getenv('DB_NAME') ?: 'nnqodivk_latsolsnbt',
    'user' => getenv('DB_USER') ?: 'nnqodivk_candu',
    'pass' => getenv('DB_PASS') ?: 'candubanget',
    'charset' => 'utf8mb4',
  ],
  'app' => [
    'base_url' => getenv('BASE_URL') ?: '/',
    'env' => getenv('APP_ENV') ?: 'prod',
    'session_name' => 'snbt_sid',
    'csrf_key' => getenv('CSRF_KEY') ?: 'change-this',
  ],
  'ai' => [
    'provider' => 'openai',
    'api_key' => getenv('OPENAI_API_KEY') ?: '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',
    'model' => getenv('OPENAI_MODEL') ?: 'gpt-4o-mini',
    'timeout' => 60,
  ],
];
