const fs = require('fs');
const path = './app/context/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const additions = {
  en: `    "audio_filters": "Audio Filters",
    "max_price": "Max Price: €",
    "audio_library": "Audio Library:",
    "syncing": "Syncing...",
    "tuning_frequencies": "Tuning frequencies...",
    "no_audiobooks_found": "No audiobooks found matching your criteria.",`,
  bg: `    "audio_filters": "Аудио филтри",
    "max_price": "Макс. цена: €",
    "audio_library": "Аудио библиотека:",
    "syncing": "Синхронизиране...",
    "tuning_frequencies": "Настройване на честотите...",
    "no_audiobooks_found": "Няма намерени аудиокниги, отговарящи на вашите критерии.",`,
  tr: `    "audio_filters": "Ses Filtreleri",
    "max_price": "Maks Fiyat: €",
    "audio_library": "Ses Kütüphanesi:",
    "syncing": "Senkronize ediliyor...",
    "tuning_frequencies": "Frekanslar ayarlanıyor...",
    "no_audiobooks_found": "Kriterlerinize uygun sesli kitap bulunamadı.",`,
  ro: `    "audio_filters": "Filtre audio",
    "max_price": "Preț maxim: €",
    "audio_library": "Bibliotecă audio:",
    "syncing": "Se sincronizează...",
    "tuning_frequencies": "Ajustare frecvențe...",
    "no_audiobooks_found": "Nicio carte audio nu corespunde criteriilor tale.",`
};

['en', 'bg', 'tr', 'ro'].forEach(lang => {
    const regex = new RegExp(`(${lang}: \\{[\\s\\S]*?)(\\n  \\},)`);
    content = content.replace(regex, `$1,\n${additions[lang]}$2`);
});

fs.writeFileSync(path, content, 'utf8');
