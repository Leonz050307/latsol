CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  premium TINYINT(1) NOT NULL DEFAULT 0,
  device_hash CHAR(64) DEFAULT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id CHAR(64) PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  ip VARCHAR(45) NOT NULL,
  user_agent VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_seen TIMESTAMP NULL DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Daily set id = yyyy-mm-dd (server date)
CREATE TABLE IF NOT EXISTS daily_sets (
  id CHAR(10) PRIMARY KEY,
  generated_by BIGINT UNSIGNED NOT NULL,
  meta JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS subtests (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(16) NOT NULL UNIQUE,
  name VARCHAR(128) NOT NULL,
  category VARCHAR(64) NOT NULL, -- TPS, LIT
  description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS questions (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  daily_id CHAR(10) NOT NULL,
  subtest_code VARCHAR(16) NOT NULL,
  qtype ENUM('single','complex','short') NOT NULL, -- PG, kompleks, isian singkat
  prompt TEXT NOT NULL,
  options JSON NULL, -- for single: ["A","B",...]; for complex: [{"statement":"..","A":true,"B":false}], for short: null
  answer JSON NOT NULL, -- canonical answers: e.g. {"key":"B"} | {"rows":[{"A":true,"B":false},...]} | {"text":"..."}
  explanation_short TEXT NOT NULL,
  explanation_full MEDIUMTEXT NULL,
  difficulty ENUM('mudah','menengah','sulit') DEFAULT 'menengah',
  meta JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX (daily_id),
  CONSTRAINT fk_questions_daily FOREIGN KEY (daily_id) REFERENCES daily_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attempts (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  daily_id CHAR(10) NOT NULL,
  started_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  submitted_at TIMESTAMP NULL DEFAULT NULL,
  score DECIMAL(6,2) NULL,
  duration_seconds INT NULL,
  UNIQUE KEY uniq_user_daily (user_id, daily_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (daily_id) REFERENCES daily_sets(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS attempt_answers (
  attempt_id BIGINT UNSIGNED NOT NULL,
  question_id BIGINT UNSIGNED NOT NULL,
  user_answer JSON NULL,
  is_correct TINYINT(1) NULL,
  PRIMARY KEY (attempt_id, question_id),
  FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS ai_jobs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  daily_id CHAR(10) NOT NULL,
  status ENUM('queued','running','done','failed') NOT NULL DEFAULT 'queued',
  request_payload MEDIUMTEXT NULL,
  response_payload MEDIUMTEXT NULL,
  error TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL DEFAULT NULL,
  INDEX (daily_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed subtests (based on UTBK-SNBT 2025: TPS & Literasi)
INSERT IGNORE INTO subtests (code,name,category,description) VALUES
 ('PU','Penalaran Umum','TPS','Induktif, deduktif, kuantitatif (abstrak).'),
 ('PPU','Pengetahuan & Pemahaman Umum','TPS','Bahasa & pengetahuan umum konteks Indonesia.'),
 ('PBM','Pemahaman Bacaan & Menulis','TPS','Membaca pemahaman, ide pokok, koherensi.'),
 ('PK','Pengetahuan Kuantitatif','TPS','Aritmetika, aljabar, data, peluang dasar.'),
 ('LBI','Literasi Bahasa Indonesia','LIT','Literasi teks non-sastra & sastra Indonesia.'),
 ('LBE','Literasi Bahasa Inggris','LIT','Reading comprehension, vocab, inference.'),
 ('PM','Penalaran Matematika','LIT','Pemodelan, penalaran, problem solving.');
