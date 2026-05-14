const fs = require('fs');
const path = '/Users/nurmuhammetsohbetov02/blendartbook/app/context/LanguageContext.tsx';

const content = fs.readFileSync(path, 'utf8');

const newTranslations = {
  en: {
    "who_we_are_hero_title": "Crafting stories, inspiring minds.",
    "who_we_are_hero_desc": "BlendArtBook was born out of a simple passion: to bring the world's most beautiful books and art pieces to a global community of curious readers and art lovers.",
    "curated_with_love": "Curated with Love",
    "quality_first": "Quality First",
    "contacts_hero_desc": "We're here to help. Reach out to us through any of these channels.",
    "live_chat_desc": "Need immediate assistance? Our AI assistant and support team are available 24/7.",
    "start_conversation": "Start a Conversation"
  },
  tr: {
    "who_we_are_hero_title": "Hikayeler yaratıyor, zihinlere ilham veriyoruz.",
    "who_we_are_hero_desc": "BlendArtBook basit bir tutkuyla doğdu: dünyanın en güzel kitaplarını ve sanat eserlerini meraklı okurlar ve sanatseverlerden oluşan küresel bir topluluğa sunmak.",
    "curated_with_love": "Sevgiyle Seçildi",
    "quality_first": "Önce Kalite",
    "contacts_hero_desc": "Size yardımcı olmak için buradayız. Bu kanallardan herhangi biri aracılığıyla bize ulaşın.",
    "live_chat_desc": "Acil yardıma mı ihtiyacınız var? Yapay zeka asistanımız ve destek ekibimiz 7/24 hizmetinizdedir.",
    "start_conversation": "Sohbet Başlat"
  },
  ro: {
    "who_we_are_hero_title": "Creăm povești, inspirăm minți.",
    "who_we_are_hero_desc": "BlendArtBook s-a născut dintr-o pasiune simplă: de a aduce cele mai frumoase cărți și piese de artă din lume unei comunități globale de cititori curioși și iubitori de artă.",
    "curated_with_love": "Curat cu Dragoste",
    "quality_first": "Calitatea pe Primul Loc",
    "contacts_hero_desc": "Suntem aici să te ajutăm. Contactează-ne prin oricare dintre aceste canale.",
    "live_chat_desc": "Ai nevoie de asistență imediată? Asistentul nostru AI și echipa de suport sunt disponibili 24/7.",
    "start_conversation": "Începe o Conversație"
  },
  bg: {
    "who_we_are_hero_title": "Създаваме истории, вдъхновяваме умове.",
    "who_we_are_hero_desc": "BlendArtBook се роди от проста страст: да пренесе най-красивите книги и предмети на изкуството в света до глобална общност от любопитни читатели и любители на изкуството.",
    "curated_with_love": "Подбрано с любов",
    "quality_first": "Качеството на първо място",
    "contacts_hero_desc": "Тук сме, за да помогнем. Свържете се с нас чрез някой от тези канали.",
    "live_chat_desc": "Нуждаете се от незабавна помощ? Нашият AI асистент и екип за поддръжка са на разположение 24/7.",
    "start_conversation": "Започнете разговор"
  }
};

let updatedContent = content;

Object.keys(newTranslations).forEach(lang => {
  const langKey = lang + ': {';
  const startIdx = updatedContent.indexOf(langKey);
  if (startIdx !== -1) {
    const endIdx = updatedContent.indexOf('},', startIdx);
    const langSection = updatedContent.substring(startIdx, endIdx);
    
    let newLangSection = langSection;
    Object.entries(newTranslations[lang]).forEach(([key, value]) => {
      if (!newLangSection.includes(`"${key}":`)) {
        newLangSection += `    "${key}": "${value}",\n`;
      }
    });
    
    updatedContent = updatedContent.replace(langSection, newLangSection);
  }
});

fs.writeFileSync(path, updatedContent);
console.log('More translations updated successfully!');
