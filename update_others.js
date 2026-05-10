const fs = require('fs');

const contextPath = './app/context/LanguageContext.tsx';
let contextContent = fs.readFileSync(contextPath, 'utf8');

const newTranslations = {
  en: `    "browsing": "Browsing:",
    "no_products_collection": "No products found in this collection.",
    "error_label": "Error:",`,
  bg: `    "browsing": "Разглеждане:",
    "no_products_collection": "Няма намерени продукти в тази колекция.",
    "error_label": "Грешка:",`,
  tr: `    "browsing": "İnceleniyor:",
    "no_products_collection": "Bu koleksiyonda ürün bulunamadı.",
    "error_label": "Hata:",`,
  ro: `    "browsing": "Navigare:",
    "no_products_collection": "Nu au fost găsite produse în această colecție.",
    "error_label": "Eroare:",`
};

['en', 'bg', 'tr', 'ro'].forEach(lang => {
    const regex = new RegExp(`(${lang}: \\{[\\s\\S]*?)(\\n  \\},)`);
    contextContent = contextContent.replace(regex, `$1,\n${newTranslations[lang]}$2`);
});

fs.writeFileSync(contextPath, contextContent, 'utf8');

const path = './app/other/[category]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/Browsing:/g, '{t("browsing")}');
content = content.replace(/Hata:/g, '{t("error_label")}');
content = content.replace(/No products found in this collection\./g, '{t("no_products_collection")}');
content = content.replace(
      />\s*\{displayCategory\}\s*</,
      `>{t(displayCategory.toLowerCase().replace(" ", "_")) || displayCategory}<`
    );

fs.writeFileSync(path, content, 'utf8');

// Also adding "all_products" to LanguageContext
const additions2 = {
  en: `    "all_products": "All Products",`,
  bg: `    "all_products": "Всички продукти",`,
  tr: `    "all_products": "Tüm Ürünler",`,
  ro: `    "all_products": "Toate produsele",`
};

contextContent = fs.readFileSync(contextPath, 'utf8');
['en', 'bg', 'tr', 'ro'].forEach(lang => {
    const regex = new RegExp(`(${lang}: \\{[\\s\\S]*?)(\\n  \\},)`);
    contextContent = contextContent.replace(regex, `$1,\n${additions2[lang]}$2`);
});
fs.writeFileSync(contextPath, contextContent, 'utf8');


