const fs = require('fs');
const path = '/Users/nurmuhammetsohbetov02/blendartbook/app/context/LanguageContext.tsx';

const content = fs.readFileSync(path, 'utf8');

const newTranslations = {
  en: {
    "delivery_hero_desc": "Reliable shipping and secure payment methods for your peace of mind.",
    "standard_delivery_desc": "3-5 business days across Europe.",
    "worldwide_shipping": "Worldwide Shipping",
    "credit_debit_cards": "Credit/Debit Cards",
    "revolut_pay": "Revolut Pay",
    "art_street_address": "123 Art Street, London, UK"
  },
  tr: {
    "delivery_hero_desc": "Huzurunuz için güvenilir nakliye ve güvenli ödeme yöntemleri.",
    "standard_delivery_desc": "Avrupa genelinde 3-5 iş günü.",
    "worldwide_shipping": "Dünya Çapında Nakliye",
    "credit_debit_cards": "Kredi/Banka Kartları",
    "revolut_pay": "Revolut Ödeme",
    "art_street_address": "123 Sanat Sokağı, Londra, Birleşik Krallık"
  },
  ro: {
    "delivery_hero_desc": "Livrare fiabilă și metode de plată sigure pentru liniștea dumneavoastră.",
    "standard_delivery_desc": "3-5 zile lucrătoare în toată Europa.",
    "worldwide_shipping": "Livrare în întreaga lume",
    "credit_debit_cards": "Carduri de Credit/Debit",
    "revolut_pay": "Plată Revolut",
    "art_street_address": "Strada Artelor nr. 123, Londra, Regatul Unit"
  },
  bg: {
    "delivery_hero_desc": "Надеждна доставка и сигурни методи за плащане за вашето спокойствие.",
    "standard_delivery_desc": "3-5 работни дни в цяла Европа.",
    "worldwide_shipping": "Доставка в целия свят",
    "credit_debit_cards": "Кредитни/Дебитни карти",
    "revolut_pay": "Плащане с Revolut",
    "art_street_address": "ул. Изкуство 123, Лондон, Обединено кралство"
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
console.log('Final translations updated successfully!');
