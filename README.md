# Family Trivia 🍜

Game trivia keluarga **pass-and-play** (main bergiliran di satu HP) — buat seru-seruan
sambil nunggu makanan datang di restoran. Mobile-first, Bahasa Indonesia, dan bisa
dipasang sebagai app (PWA) yang jalan **offline** setelah dibuka sekali.


## Fitur

- **3 layar:** Lobby (tambah pemain) → Gameplay (flashcard soal) → Leaderboard (podium + hukuman).
- **Pemain:** nama, kategori **Anak/Dewasa** (color-coded), dan avatar emoji (yang
  sudah dipakai otomatis terkunci). Minimal 2 pemain untuk mulai.
- **Soal otomatis menyesuaikan kategori:** anak dapat soal `anak`+`umum`, dewasa dapat
  `dewasa`+`umum`; menghindari pengulangan 6 soal terakhir.
- **Skor real-time** dengan highlight giliran; +10 untuk jawaban benar.
- **Akhir game:** podium 🥇🥈🥉 + confetti, plus kartu hukuman lucu untuk juru kunci.
- **Tombol darurat** "🛑 Makanan Datang!" untuk mengakhiri kapan saja.
- **Auto-save:** progres tersimpan di `localStorage` (aman saat HP terkunci / refresh).

## Menjalankan

```bash
npm install
npm run dev      # mode pengembangan (http://localhost:5173)
npm run build    # type-check + build produksi ke dist/
npm run preview  # menyajikan hasil build
```

## Menambah / mengubah soal

Bank soal & hukuman ada di satu file: **`src/data/bank.json`**.

```json
{
  "questions": [
    { "topic": "Sains", "level": "anak", "q": "…", "a": "…", "explain": "…" }
  ],
  "punishments": ["… {name} …"]
}
```

- `level`: `"anak"` (mudah), `"dewasa"` (lebih sulit), atau `"umum"` (untuk siapa saja).
- Di `punishments`, teks `{name}` diganti otomatis dengan nama pemain juru kunci.

Strukturnya sengaja dipisah ke JSON agar mudah diperluas — sekarang oleh developer,
nanti bisa dikembangkan jadi editable oleh pengguna sendiri.

## Struktur

```
src/
  data/bank.json        # bank soal + hukuman (satu sumber data)
  types.ts              # tipe domain (Player, Question, GameState, …)
  theme.css             # token warna (tema "Ceria") + base style + animasi
  lib/
    constants.ts        # avatar, warna kategori, poin, kunci storage
    game.ts             # pemilihan soal & hukuman, helper
    storage.ts          # load/save localStorage
  hooks/useGameState.ts # state machine: lobby → play → over
  components/           # Avatar, CatChip, BigButton, Confetti, IconX
  screens/              # LobbyScreen, PlayScreen, OverScreen (+ CSS Modules)
  App.tsx, main.tsx
```

## Catatan teknis

- **Styling:** CSS Modules + CSS variables. Hanya tema **Ceria** yang di-ship; palet
  tetap berupa variabel agar mudah di-retema nanti.
- **Font:** Fredoka (display) + Nunito (body), di-bundle lokal via `@fontsource`
  (tanpa CDN runtime, supaya jalan offline).
- **PWA:** `vite-plugin-pwa` membuat service worker + manifest; installable dan
  bekerja offline setelah kunjungan pertama.
- Mockup asli memakai iOS device frame & panel "Tweaks" — keduanya scaffolding alat
  desain dan sengaja tidak dibawa ke app produksi.
