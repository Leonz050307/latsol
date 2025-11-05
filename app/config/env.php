<?php
return [
  'db' => [
    'host' => getenv('DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DB_PORT') ?: '3306',
    'name' => getenv('DB_NAME') ?: 'snbt_ai',
    'user' => getenv('DB_USER') ?: 'root',
    'pass' => getenv('DB_PASS') ?: '',
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
    'api_key' => getenv('OPENAI_API_KEY') ?: '',
    'model' => getenv('OPENAI_MODEL') ?: 'gpt-4o-mini',
    'timeout' => 60,
  ],
];
