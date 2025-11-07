# SNBT AI Latsol

Latihan soal harian UTBK-SNBT 2025 dengan generator AI mandiri. Proyek ini dibangun menggunakan PHP 7.4 dan MySQL tanpa framework agar ramah shared hosting.

## Fitur utama
- Set soal harian otomatis dengan pembangkit AI (OpenAI Chat Completions JSON mode)
- Role admin & user dengan sesi aman (cookie SameSite, CSRF token)
- Binding perangkat (device hash) untuk mencegah multi login
- Premium toggle untuk akses pembahasan lengkap
- Satu percobaan per hari per pengguna

## Struktur folder
```
/app
  /config
  /core
  /models
  /views
/public
  /assets
/bin
/sql
```

## Persiapan
1. Buat database dan import `sql/schema.sql`.
2. Buat akun admin pertama:
   ```sql
   INSERT INTO users(email,name,password_hash,role,premium)
   VALUES ('admin@example.com','Admin', '$2y$10$Z3lZ3/J2Zk9c9v8VtNNp5uQ8Zy7YV3g6M09W6z7Y6zQhlj3Qp6V3a', 'admin', 1);
   ```
   Password di atas adalah hash untuk `Admin123!`.
3. Set environment variable berikut sesuai hosting:
   - `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASS`
   - `OPENAI_API_KEY`, `OPENAI_MODEL`
   - Opsional: `BASE_URL`, `APP_ENV`, `CSRF_KEY`
4. Set document root ke folder `public/`.
5. Login sebagai admin dan klik **Generate Soal Harian**, atau jalankan `bin/generate_daily.php` lewat CLI/cron.

## Lisensi
MIT
