const fs = require('fs');
const path = '/Users/nurmuhammetsohbetov02/blendartbook/app/context/LanguageContext.tsx';

const content = fs.readFileSync(path, 'utf8');

const additions = {
  tr: {
    "delivery_payment": "Teslimat ve ödeme"
  },
  ro: {
    "delivery_payment": "Livrare și plată",
    "contacts": "Contacte"
  }
};

let updatedContent = content;

Object.keys(additions).forEach(lang => {
  const langKey = lang + ': {';
  const startIdx = updatedContent.indexOf(langKey);
  if (startIdx !== -1) {
    const endIdx = updatedContent.indexOf('},', startIdx);
    const langSection = updatedContent.substring(startIdx, endIdx);
    
    let newLangSection = langSection;
    Object.entries(additions[lang]).forEach(([key, value]) => {
      // If it exists but is different, replace it. If not exists, add it.
      const keyPattern = `"${key}":`;
      const keyIdx = newLangSection.indexOf(keyPattern);
      if (keyIdx !== -1) {
        // Replace existing
        const lineEndIdx = newLangSection.indexOf('\n', keyIdx);
        const existingLine = newLangSection.substring(keyIdx, lineEndIdx);
        newLangSection = newLangSection.replace(existingLine, `"${key}": "${value}",`);
      } else {
        // Add new
        newLangSection += `    "${key}": "${value}",\n`;
      }
    });
    
    updatedContent = updatedContent.replace(langSection, newLangSection);
  }
});

fs.writeFileSync(path, updatedContent);
console.log('Missing footer translations fixed!');
