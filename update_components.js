const fs = require('fs');
const path = require('path');

const replaceInFile = (filePath, replacements) => {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  // Ensure useLanguage import
  if (!content.includes('useLanguage')) {
    const importMatch = content.match(/import.*?from.*?["'].*?["'];?/);
    if (importMatch) {
      content = content.replace(importMatch[0], `${importMatch[0]}\nimport { useLanguage } from "../context/LanguageContext";`);
    } else {
      content = `import { useLanguage } from "../context/LanguageContext";\n${content}`;
    }
  }

  // Ensure const { t } = useLanguage(); inside the component
  const componentMatch = content.match(/export default function \w+\(.*?\)\s*\{/);
  if (componentMatch && !content.includes('const { t } = useLanguage();')) {
    content = content.replace(componentMatch[0], `${componentMatch[0]}\n  const { t } = useLanguage();`);
  }

  // Apply replacements
  for (const [search, replace] of replacements) {
    // Escape regex characters except for the ones we want
    content = content.replace(search, replace);
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
};

// Footer.tsx
replaceInFile('./app/components/Footer.tsx', [
  [/All the books in the world/g, '{t("all_the_books")}'],
  [/All about shopping/g, '{t("all_about_shopping")}'],
  [/Delivery and payment/g, '{t("delivery_payment")}'],
  [/Terms and conditions/g, '{t("terms_conditions")}'],
  [/About the shop/g, '{t("about_the_shop")}'],
  [/Who we are/g, '{t("who_we_are")}'],
  [/Contacts/g, '{t("contacts")}'],
  [/Books sustainability/g, '{t("books_sustainability")}'],
  [/For customers/g, '{t("for_customers")}'],
  [/Loyalty programme/g, '{t("loyalty_programme")}'],
  [/Order status/g, '{t("order_status")}'],
  [/Returns \/ Complaints/g, '{t("returns_complaints")}'],
  [/Let&apos;s stay together/g, '{t("lets_stay_together")}'],
]);

// HeroSection.tsx
replaceInFile('./app/components/HeroSection.tsx', [
  [/THE WORLD&apos;S WIDEST SELECTION OF BOOKS/g, '{t("worlds_widest_selection")}'],
  [/Buy book/g, '{t("buy_book")}'],
  [/>Video</g, '>{t("video_btn")}<'],
  [/BE\{" "\}/g, '{t("be_whoever").split(" ")[0]}{" "}'],
  [/{active\.title}/g, '{active.title || t("be_whoever").split(" ")[1]}']
]);

// FeaturesBar.tsx
replaceInFile('./app/components/FeaturesBar.tsx', [
  [/23 million titles/g, '{t("23_million_titles")}'],
  [/in 150\+ languages/g, '{t("in_150_languages")}'],
  [/Great prices/g, '{t("great_prices")}'],
  [/always up-to-date/g, '{t("always_up_to_date")}'],
  [/LIBROAMANTO club/g, '{t("libroamanto_club")}'],
  [/full of gifts/g, '{t("full_of_gifts")}'],
  [/2 million customers/g, '{t("2_million_customers")}'],
  [/served every year/g, '{t("served_every_year")}'],
]);

// CategoriesSection.tsx
replaceInFile('./app/components/CategoriesSection.tsx', [
  [/Explore Categories/g, '{t("explore_categories")}'],
  [/name: "Books".*?desc: "Classic and Modern Print"/g, 'name: t("books"), href: "/books/all", gradient: "from-teal-600 to-teal-700", desc: t("classic_modern_print")'],
  [/name: "E-Books".*?desc: "Digital Reading Experience"/g, 'name: t("ebooks"), href: "/e-books/all", gradient: "from-blue-600 to-blue-700", desc: t("digital_reading_exp")'],
  [/name: "Audiobooks".*?desc: "Listen to Your Stories"/g, 'name: t("audiobooks"), href: "/audiobooks/all", gradient: "from-purple-600 to-purple-700", desc: t("listen_to_stories")'],
  [/name: "Gifts".*?desc: "Special Items for Lovers"/g, 'name: t("gifts_category"), href: "/gifts/all", gradient: "from-rose-600 to-rose-700", desc: t("special_items_lovers")'],
  [/View Collection/g, '{t("view_collection")}'],
]);

// NewArrivals.tsx
replaceInFile('./app/components/NewArrivals.tsx', [
  [/New Arrivals/g, '{t("new_arrivals")}'],
  [/Freshly added to our collection/g, '{t("freshly_added")}'],
  [/Unknown Author/g, '{t("unknown_author")}'],
]);

// MonthlySet.tsx
replaceInFile('./app/components/MonthlySet.tsx', [
  [/Book Set of the Month/g, '{t("book_set_of_month")}'],
  [/Carefully selected books for this month/g, '{t("carefully_selected")}'],
]);

// WorldLiterature.tsx
replaceInFile('./app/components/WorldLiterature.tsx', [
  [/World Literature/g, '{t("world_literature")}'],
  [/Timeless classics from around the globe/g, '{t("timeless_classics")}'],
]);

// BestsellersSection.tsx
replaceInFile('./app/components/BestsellersSection.tsx', [
  [/Bestsellers/g, '{t("bestsellers")}'],
  [/Most loved books by our readers/g, '{t("most_loved_books")}'],
  [/Only \{book.stock\} left!/g, '{t("only")} {book.stock} {t("left")}'],
  [/Unknown Author/g, '{t("unknown_author")}'],
]);

// PromoBanner.tsx
replaceInFile('./app/components/PromoBanner.tsx', [
  [/Join the\{" "\}/g, '{t("join_the")}{" "}'],
  [/>\s*Club\s*</g, '>\n          {t("club")}\n          <'],
  [/Get exclusive discounts, early access to new releases, and free\s*shipping on your first order!/g, '{t("promo_desc")}'],
  [/placeholder="Enter your email address"/g, 'placeholder={t("enter_email")}'],
  [/>\s*Join Now\s*</g, '>\n            {t("join_now")}\n          <'],
  [/By joining, you agree to our Terms & Conditions and Privacy Policy/g, '{t("promo_terms")}'],
]);

// AIChatWidget.tsx
replaceInFile('./app/components/AIChatWidget.tsx', [
  [/Hi there! 📚 I'm blendartbook AI, your personal book assistant. I can help you discover amazing books, recommend reads based on your taste, or answer any questions about our library. What are you looking for today\?/g, '{t("ai_greeting")}'],
  [/📖 Recommend a book/g, '{t("recommend_book")}'],
  [/🎭 Popular genres/g, '{t("popular_genres")}'],
  [/🎁 Gift ideas/g, '{t("gift_ideas")}'],
  [/🌍 Books in English/g, '{t("books_in_english")}'],
  [/placeholder="Ask me about books..."/g, 'placeholder={t("ask_me_about")}'],
  [/Powered by blendartbook AI ✨/g, '{t("powered_by")}'],
]);

// ProductCard.tsx
replaceInFile('./app/components/ProductCard.tsx', [
  [/Unknown Author/g, '{t("unknown_author")}'],
]);

console.log("Done");
