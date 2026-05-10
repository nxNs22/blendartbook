const fs = require('fs');

const contextPath = './app/context/LanguageContext.tsx';
let contextContent = fs.readFileSync(contextPath, 'utf8');

const newTranslations = {
  en: `    // Listing pages
    "properties": "Properties",
    "price_up_to": "Price: up to €",
    "items_found": "items found",
    "sort_by_popularity": "Sort by: Popularity",
    "no_products_found": "No products found.",
    "english": "English",
    "turkish": "Turkish",
    "romanian": "Romanian",
    "bulgarian": "Bulgarian",
    "all": "All",`,
  
  bg: `    "properties": "Свойства",
    "price_up_to": "Цена: до €",
    "items_found": "намерени продукта",
    "sort_by_popularity": "Сортиране по: Популярност",
    "no_products_found": "Няма намерени продукти.",
    "english": "Английски",
    "turkish": "Турски",
    "romanian": "Румънски",
    "bulgarian": "Български",
    "all": "Всички",`,
    
  tr: `    "properties": "Özellikler",
    "price_up_to": "Fiyat: maks €",
    "items_found": "ürün bulundu",
    "sort_by_popularity": "Sırala: Popülerlik",
    "no_products_found": "Ürün bulunamadı.",
    "english": "İngilizce",
    "turkish": "Türkçe",
    "romanian": "Rumence",
    "bulgarian": "Bulgarca",
    "all": "Tümü",`,
    
  ro: `    "properties": "Proprietăți",
    "price_up_to": "Preț: până la €",
    "items_found": "produse găsite",
    "sort_by_popularity": "Sortare: Popularitate",
    "no_products_found": "Niciun produs găsit.",
    "english": "Engleză",
    "turkish": "Turcă",
    "romanian": "Română",
    "bulgarian": "Bulgară",
    "all": "Toate",`
};

['en', 'bg', 'tr', 'ro'].forEach(lang => {
    const regex = new RegExp(`(${lang}: \\{[\\s\\S]*?)(\\n  \\},)`);
    contextContent = contextContent.replace(regex, `$1,\n${newTranslations[lang]}$2`);
});

fs.writeFileSync(contextPath, contextContent, 'utf8');

const pagesToUpdate = [
  './app/books/[languages]/page.tsx',
  './app/audiobooks/[languages]/page.tsx',
  './app/e-books/[languages]/page.tsx',
  './app/gifts/[target]/page.tsx',
  './app/art/[subcategory]/page.tsx',
  './app/other/[category]/page.tsx',
];

pagesToUpdate.forEach(pagePath => {
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');
    
    // add useLanguage import if not exists
    if (!content.includes('useLanguage')) {
      content = content.replace(
        /import .*? from .*?;/,
        match => `${match}\nimport { useLanguage } from "../../context/LanguageContext";`
      );
    }
    
    // add const { t } = useLanguage();
    if (!content.includes('const { t } = useLanguage();')) {
      content = content.replace(
        /export default function .*?\(\) \{/,
        match => `${match}\n  const { t } = useLanguage();`
      );
    }

    // replace hardcoded strings
    content = content.replace(/Properties/g, '{t("properties")}');
    content = content.replace(/Price: up to €/g, '{t("price_up_to")}');
    content = content.replace(/items found/g, '{t("items_found")}');
    content = content.replace(/Sort by: Popularity/g, '{t("sort_by_popularity")}');
    content = content.replace(/No products found for this language or price range\./g, '{t("no_products_found")}');
    content = content.replace(/No products found for this category or price range\./g, '{t("no_products_found")}');
    content = content.replace(/No products found for this target or price range\./g, '{t("no_products_found")}');

    // capitalize and translate the current category/language
    content = content.replace(
      />\s*\{currentLanguage\}\s+(.*?)\s*</,
      `>\n              {t(currentLanguage.toLowerCase()) || currentLanguage} {t("$1".toLowerCase()) || "$1"}\n            <`
    );
    
    content = content.replace(
      />\s*\{currentCategory\}\s+(.*?)\s*</,
      `>\n              {t(currentCategory.toLowerCase()) || currentCategory} {t("$1".toLowerCase()) || "$1"}\n            <`
    );
    
    content = content.replace(
      />\s*\{currentTarget\}\s+(.*?)\s*</,
      `>\n              {t(currentTarget.toLowerCase()) || currentTarget} {t("$1".toLowerCase()) || "$1"}\n            <`
    );
    
    content = content.replace(
      />\s*\{currentSubcategory\}\s+(.*?)\s*</,
      `>\n              {t(currentSubcategory.toLowerCase()) || currentSubcategory} {t("$1".toLowerCase()) || "$1"}\n            <`
    );

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log('Updated ' + pagePath);
  }
});

