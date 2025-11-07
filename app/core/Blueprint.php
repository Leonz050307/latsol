<?php
class Blueprint {
  public static function subtests(): array {
    return [
      'PU' => ['name' => 'Penalaran Umum', 'q' => 5],
      'PPU' => ['name' => 'Pengetahuan & Pemahaman Umum', 'q' => 5],
      'PBM' => ['name' => 'Pemahaman Bacaan & Menulis', 'q' => 5],
      'PK' => ['name' => 'Pengetahuan Kuantitatif', 'q' => 5],
      'LBI' => ['name' => 'Literasi Bahasa Indonesia', 'q' => 5],
      'LBE' => ['name' => 'Literasi Bahasa Inggris', 'q' => 5],
      'PM' => ['name' => 'Penalaran Matematika', 'q' => 5],
    ];
  }

  public static function systemPrompt(string $subtest): string {
    return "Anda adalah pembuat soal UTBK-SNBT 2025. Ikuti format resmi 3 model: (1) pilihan ganda (single, 5 opsi A-E), (2) pilihan majemuk kompleks (tabel 2 kolom, setiap pernyataan bernilai BENAR/SALAH), (3) isian singkat. Materi sesuai subtes {$subtest}. Difficulty mayoritas menengah. Sertakan jawaban kunci, explanation_short (2-3 kalimat), explanation_full (mendalam, langkah-langkah). Output JSON valid sesuai schema.";
  }

  public static function jsonSchema(): string {
    return json_encode([
      'questions' => [
        [
          'qtype' => 'single',
          'prompt' => 'string',
          'options' => ['A', 'B', 'C', 'D', 'E'],
          'answer' => ['key' => 'A'],
          'explanation_short' => 'string',
          'explanation_full' => 'string',
          'subtest' => 'PU',
        ],
      ],
    ]);
  }

  public static function userPrompt(string $subtest, int $n): string {
    $scope = [
      'PU' => 'induktif, deduktif, analogi, penalaran kuantitatif dasar',
      'PPU' => 'bahasa Indonesia, perbendaharaan kata, pengetahuan umum kontekstual',
      'PBM' => 'reading comprehension: ide pokok, inferensi, koherensi, kebahasaan',
      'PK' => 'aritmetika, aljabar, geometri dasar, data dan peluang',
      'LBI' => 'teks artikel/ilmiah/sastra, gagasan utama, interpretasi, evaluasi',
      'LBE' => 'reading comprehension, vocabulary-in-context, inference',
      'PM' => 'pemodelan matematika, berpikir matematis, penyelesaian masalah',
    ][$subtest] ?? 'umum';

    return "Buat {$n} soal subtes {$subtest} cakupan {$scope}. Campur qtype: single/complex/short. Gunakan angka wajar (tanpa kalkulator tingkat lanjut). Kembalikan JSON:{\"questions\":[...]} persis.";
  }
}
