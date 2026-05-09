"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// --- SUPPORTED LANGUAGES ---
export type Language = "en" | "bg" | "tr" | "ro";

export interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
];

// --- TRANSLATION DICTIONARIES ---
type TranslationKey = string;
type Translations = Record<Language, Record<TranslationKey, string>>;

const translations: Translations = {
  en: {
    // Top bar
    "check_order_status": "Check order status",
    "free_delivery": "Free delivery over €30",
    
    // Search
    "search_placeholder": "Search books, authors, categories...",
    "search": "Search",
    
    // Nav
    "books": "Books",
    "art": "Art",
    "handmade": "Handmade",
    "ebooks": "E-books",
    "audiobooks": "Audiobooks",
    "other_products": "Other products",
    "gift_tips": "Gift tips",
    "gift_voucher": "Gift voucher",
    "cart": "Cart",
    
    // Auth
    "hi": "Hi",
    
    // Dropdown titles
    "books_title": "16 386 577 books in 175 languages",
    "ebooks_title": "1 245 000 e-books to download",
    "audiobooks_title": "450 000 audiobooks for your ears",
    "art_title": "Explore Unique Art Pieces",
    "help_text": "Don't know what to choose? We are here to help!",
    "buy_now": "Buy now",

    // Book languages
    "books_in_english": "Books in English",
    "books_in_turkish": "Books in Turkish",
    "books_in_romanian": "Books in Romanian",
    "books_in_bulgarian": "Books in Bulgarian",

    // Ebook languages
    "ebooks_in_turkish": "E-books in Turkish",
    "ebooks_in_english": "E-books in English",
    "ebooks_in_romanian": "E-books in Romanian",
    "ebooks_in_bulgarian": "E-books in Bulgarian",

    // Audiobook languages
    "audiobooks_in_turkish": "Audiobooks in Turkish",
    "audiobooks_in_english": "Audiobooks in English",
    "audiobooks_in_romanian": "Audiobooks in Romanian",
    "audiobooks_in_bulgarian": "Audiobooks in Bulgarian",

    // Other products
    "calendar_diary": "Calendar/Diary",
    "audio": "Audio",
    "game_toy": "Game/Toy",
    "video": "Video",
    "printed_items": "Printed items",
    "stationery": "Stationery",
    "digital": "Digital",

    // Gift categories
    "gifts_for_women": "Gifts for women",
    "gifts_for_men": "Gifts for men",
    "gifts_for_girls": "Gifts for girls",
    "gifts_for_boys": "Gifts for boys",
    "gifts_for_children": "Gifts for children",

    // Art categories
    "painting": "Painting",
    "sculpture": "Sculpture",
    "music": "Music",
    "crafts": "Crafts",

    // Hero / Home
    "be_whoever": "Be Whoever",
    "worlds_widest_selection": "THE WORLD'S WIDEST SELECTION OF BOOKS",
    // Footer
    "all_the_books": "All the books in the world",
    "all_about_shopping": "All about shopping",
    "delivery_payment": "Delivery and payment",
    "terms_conditions": "Terms and conditions",
    "about_the_shop": "About the shop",
    "who_we_are": "Who we are",
    "contacts": "Contacts",
    "books_sustainability": "Books sustainability",
    "for_customers": "For customers",
    "loyalty_programme": "Loyalty programme",
    "order_status": "Order status",
    "returns_complaints": "Returns / Complaints",
    "lets_stay_together": "Let's stay together",
    
    // HeroSection
    "buy_book": "Buy book",
    "video_btn": "Video",
    
    // FeaturesBar
    "23_million_titles": "23 million titles",
    "in_150_languages": "in 150+ languages",
    "great_prices": "Great prices",
    "always_up_to_date": "always up-to-date",
    "libroamanto_club": "LIBROAMANTO club",
    "full_of_gifts": "full of gifts",
    "2_million_customers": "2 million customers",
    "served_every_year": "served every year",
    
    // Categories
    "explore_categories": "Explore Categories",
    "classic_modern_print": "Classic and Modern Print",
    "digital_reading_exp": "Digital Reading Experience",
    "listen_to_stories": "Listen to Your Stories",
    "gifts_category": "Gifts",
    "special_items_lovers": "Special Items for Lovers",
    "view_collection": "View Collection",

    // Home sections
    "new_arrivals": "New Arrivals",
    "freshly_added": "Freshly added to our collection",
    "bestsellers": "Bestsellers",
    "most_loved_books": "Most loved books by our readers",
    "book_set_of_month": "Book Set of the Month",
    "carefully_selected": "Carefully selected books for this month",
    "world_literature": "World Literature",
    "timeless_classics": "Timeless classics from around the globe",
    "only": "Only",
    "left": "left!",
    "unknown_author": "Unknown Author",

    // PromoBanner
    "join_the": "Join the",
    "club": "Club",
    "promo_desc": "Get exclusive discounts, early access to new releases, and free shipping on your first order!",
    "enter_email": "Enter your email address",
    "join_now": "Join Now",
    "promo_terms": "By joining, you agree to our Terms & Conditions and Privacy Policy",

    // AI Widget
    "ai_greeting": "Hi there! 📚 I'm blendartbook AI, your personal book assistant. I can help you discover amazing books, recommend reads based on your taste, or answer any questions about our library. What are you looking for today?",
    "recommend_book": "📖 Recommend a book",
    "popular_genres": "🎭 Popular genres",
    "gift_ideas": "🎁 Gift ideas",
    "ask_me_about": "Ask me about books...",
    "powered_by": "Powered by blendartbook AI ✨",
    // Listing pages
    "properties": "Properties",
    "price_up_to": "Price: up to €",
    "items_found": "items found",
    "sort_by_popularity": "Sort by: Popularity",
    "no_products_found": "No products found.",
    "english": "English",
    "turkish": "Turkish",
    "romanian": "Romanian",
    "bulgarian": "Bulgarian",
    "all": "All",
    "audio_filters": "Audio Filters",
    "max_price": "Max Price: €",
    "audio_library": "Audio Library:",
    "syncing": "Syncing...",
    "tuning_frequencies": "Tuning frequencies...",
    "no_audiobooks_found": "No audiobooks found matching your criteria.",
    "browsing": "Browsing:",
    "no_products_collection": "No products found in this collection.",
    "error_label": "Error:",
    "all_products": "All Products",
    // Auth
    "set_new_password": "Set your new password",
    "reset_your_password": "Reset your password",
    "welcome_back": "Welcome back",
    "create_an_account": "Create an Account",
    "choose_secure_password": "Choose a secure password and save it.",
    "email_reset_link": "We'll email you a password reset link.",
    "enter_details_access": "Enter your details to access your account.",
    "join_track_orders": "Join us to track orders and save your cart.",
    "check_your_email": "Check your email!",
    "if_account_exists": "If an account exists for",
    "receive_reset_link": "you'll receive a reset link shortly.",
    "return_to_login": "Return to Login",
    "sent_confirmation_link": "We've sent a confirmation link to",
    "click_verify_account": "Please click it to verify your account.",
    "full_name": "Full Name",
    "phone_number": "Phone Number",
    "email_address": "Email Address",
    "password_label": "Password",
    "forgot_password": "Forgot password?",
    "at_least_6_chars": "At least 6 characters",
    "new_password": "New Password",
    "confirm_password": "Confirm Password",
    "repeat_new_password": "Repeat new password",
    "update_password": "Update Password",
    "send_reset_link": "Send Reset Link",
    "log_in": "Log In",
    "create_account_btn": "Create Account",
    "back_to_login": "Back to Login",
    "dont_have_account": "Don't have an account?",
    "already_have_account": "Already have an account?",
    "sign_up_free": "Sign up for free",
    "log_in_here": "Log in here",

    // Account
    "my_account": "My Account",
    "profile_details": "Profile Details",
    "my_orders": "My Orders",
    "log_out": "Log Out",
    "shipping_contact_details": "Shipping & Contact Details",
    "profile_updated_success": "Profile updated successfully!",
    "delivery_address": "Delivery Address",
    "saving": "Saving...",
    "save_changes": "Save Changes",
    "no_orders_yet": "You haven't placed any orders yet.",
    "delivered": "Delivered",
    "in_transit": "In Transit",
    "order_items": "Order Items",
    "qty": "Qty:",
    "total": "Total:",
    "status": "Status:",
    "john_doe": "John Doe",

    // Update Password
    "set_new_password_title": "Set a new password",
    "enter_new_password_desc": "Enter a new password for your account.",
    "missing_expired_link": "This reset link is missing or expired. Please go back and request a new password reset email.",
    "go_to_signin": "Go to Sign In",
    "password_updated": "Password updated",
    "can_signin_new_password": "You can now sign in with your new password.",
    "continue_to_signin": "Continue to Sign In",
    "repeat_password": "Repeat password"
  },

  bg: {
    "check_order_status": "Проверете статуса на поръчката",
    "free_delivery": "Безплатна доставка над €30",
    
    "search_placeholder": "Търсете книги, автори, категории...",
    "search": "Търсене",
    
    "books": "Книги",
    "art": "Изкуство",
    "handmade": "Ръчна изработка",
    "ebooks": "Е-книги",
    "audiobooks": "Аудиокниги",
    "other_products": "Други продукти",
    "gift_tips": "Идеи за подаръци",
    "gift_voucher": "Подаръчен ваучер",
    "cart": "Кошница",
    
    "hi": "Здравей",
    
    "books_title": "16 386 577 книги на 175 езика",
    "ebooks_title": "1 245 000 е-книги за изтегляне",
    "audiobooks_title": "450 000 аудиокниги за вашите уши",
    "art_title": "Открийте уникални произведения на изкуството",
    "help_text": "Не знаете какво да изберете? Ние сме тук, за да помогнем!",
    "buy_now": "Купи сега",

    "books_in_english": "Книги на английски",
    "books_in_turkish": "Книги на турски",
    "books_in_romanian": "Книги на румънски",
    "books_in_bulgarian": "Книги на български",

    "ebooks_in_turkish": "Е-книги на турски",
    "ebooks_in_english": "Е-книги на английски",
    "ebooks_in_romanian": "Е-книги на румънски",
    "ebooks_in_bulgarian": "Е-книги на български",

    "audiobooks_in_turkish": "Аудиокниги на турски",
    "audiobooks_in_english": "Аудиокниги на английски",
    "audiobooks_in_romanian": "Аудиокниги на румънски",
    "audiobooks_in_bulgarian": "Аудиокниги на български",

    "calendar_diary": "Календар/Дневник",
    "audio": "Аудио",
    "game_toy": "Игра/Играчка",
    "video": "Видео",
    "printed_items": "Печатни материали",
    "stationery": "Канцеларски материали",
    "digital": "Дигитални",

    "gifts_for_women": "Подаръци за жени",
    "gifts_for_men": "Подаръци за мъже",
    "gifts_for_girls": "Подаръци за момичета",
    "gifts_for_boys": "Подаръци за момчета",
    "gifts_for_children": "Подаръци за деца",

    "painting": "Живопис",
    "sculpture": "Скулптура",
    "music": "Музика",
    "crafts": "Занаяти",

    "be_whoever": "Бъди Който Пожелаеш",
    "worlds_widest_selection": "НАЙ-ГОЛЕМИЯТ ИЗБОР НА КНИГИ В СВЕТА",
    "all_the_books": "Всички книги на света",
    "all_about_shopping": "Всичко за пазаруването",
    "delivery_payment": "Доставка и плащане",
    "terms_conditions": "Условия за ползване",
    "about_the_shop": "За магазина",
    "who_we_are": "Кои сме ние",
    "contacts": "Контакти",
    "books_sustainability": "Устойчивост на книгите",
    "for_customers": "За клиенти",
    "loyalty_programme": "Програма за лоялност",
    "order_status": "Статус на поръчката",
    "returns_complaints": "Връщане / Оплаквания",
    "lets_stay_together": "Нека останем заедно",
    
    "buy_book": "Купи книга",
    "video_btn": "Видео",
    
    "23_million_titles": "23 милиона заглавия",
    "in_150_languages": "на 150+ езика",
    "great_prices": "Страхотни цени",
    "always_up_to_date": "винаги актуални",
    "libroamanto_club": "Клуб LIBROAMANTO",
    "full_of_gifts": "пълен с подаръци",
    "2_million_customers": "2 милиона клиенти",
    "served_every_year": "обслужвани всяка година",
    
    "explore_categories": "Разгледайте категориите",
    "classic_modern_print": "Класически и модерен печат",
    "digital_reading_exp": "Дигитално четене",
    "listen_to_stories": "Слушайте историите си",
    "gifts_category": "Подаръци",
    "special_items_lovers": "Специални артикули за влюбени",
    "view_collection": "Вижте колекцията",

    "new_arrivals": "Нови предложения",
    "freshly_added": "Току-що добавени към нашата колекция",
    "bestsellers": "Бестселъри",
    "most_loved_books": "Най-обичаните книги от нашите читатели",
    "book_set_of_month": "Книжен комплект на месеца",
    "carefully_selected": "Внимателно подбрани книги за този месец",
    "world_literature": "Световна литература",
    "timeless_classics": "Вечни класики от цял свят",
    "only": "Само",
    "left": "останали!",
    "unknown_author": "Неизвестен автор",

    "join_the": "Присъединете се към",
    "club": "клуб",
    "promo_desc": "Получете ексклузивни отстъпки, ранен достъп до нови издания и безплатна доставка за първата си поръчка!",
    "enter_email": "Въведете вашия имейл адрес",
    "join_now": "Присъедини се сега",
    "promo_terms": "С присъединяването си се съгласявате с нашите Условия за ползване и Политика за поверителност",

    "ai_greeting": "Здравейте! 📚 Аз съм AI на blendartbook, вашият личен асистент за книги. Мога да ви помогна да откриете невероятни книги, да препоръчам четива въз основа на вашия вкус или да отговоря на всякакви въпроси относно нашата библиотека. Какво търсите днес?",
    "recommend_book": "📖 Препоръчай книга",
    "popular_genres": "🎭 Популярни жанрове",
    "gift_ideas": "🎁 Идеи за подаръци",
    "ask_me_about": "Попитайте ме за книги...",
    "powered_by": "Задвижвано от blendartbook AI ✨",
    "properties": "Свойства",
    "price_up_to": "Цена: до €",
    "items_found": "намерени продукта",
    "sort_by_popularity": "Сортиране по: Популярност",
    "no_products_found": "Няма намерени продукти.",
    "english": "Английски",
    "turkish": "Турски",
    "romanian": "Румънски",
    "bulgarian": "Български",
    "all": "Всички",
    "audio_filters": "Аудио филтри",
    "max_price": "Макс. цена: €",
    "audio_library": "Аудио библиотека:",
    "syncing": "Синхронизиране...",
    "tuning_frequencies": "Настройване на честотите...",
    "no_audiobooks_found": "Няма намерени аудиокниги, отговарящи на вашите критерии.",
    "browsing": "Разглеждане:",
    "no_products_collection": "Няма намерени продукти в тази колекция.",
    "error_label": "Грешка:",
    "all_products": "Всички продукти",
    "set_new_password": "Задайте нова парола",
    "reset_your_password": "Възстановете паролата си",
    "welcome_back": "Добре дошли отново",
    "create_an_account": "Създайте профил",
    "choose_secure_password": "Изберете сигурна парола и я запазете.",
    "email_reset_link": "Ще ви изпратим линк за възстановяване на паролата.",
    "enter_details_access": "Въведете данните си за достъп.",
    "join_track_orders": "Присъединете се, за да следите поръчките си.",
    "check_your_email": "Проверете имейла си!",
    "if_account_exists": "Ако съществува профил за",
    "receive_reset_link": "ще получите линк скоро.",
    "return_to_login": "Към Вход",
    "sent_confirmation_link": "Изпратихме линк за потвърждение на",
    "click_verify_account": "Кликнете върху него, за да потвърдите профила си.",
    "full_name": "Пълно име",
    "phone_number": "Телефон",
    "email_address": "Имейл адрес",
    "password_label": "Парола",
    "forgot_password": "Забравена парола?",
    "at_least_6_chars": "Поне 6 символа",
    "new_password": "Нова парола",
    "confirm_password": "Потвърдете паролата",
    "repeat_new_password": "Повторете новата парола",
    "update_password": "Обнови паролата",
    "send_reset_link": "Изпрати линк",
    "log_in": "Вход",
    "create_account_btn": "Създай профил",
    "back_to_login": "Назад към Вход",
    "dont_have_account": "Нямате профил?",
    "already_have_account": "Вече имате профил?",
    "sign_up_free": "Регистрирай се безплатно",
    "log_in_here": "Влез тук",

    "my_account": "Моят профил",
    "profile_details": "Данни на профила",
    "my_orders": "Моите поръчки",
    "log_out": "Изход",
    "shipping_contact_details": "Данни за доставка",
    "profile_updated_success": "Профилът е обновен успешно!",
    "delivery_address": "Адрес за доставка",
    "saving": "Запазване...",
    "save_changes": "Запази промените",
    "no_orders_yet": "Все още нямате поръчки.",
    "delivered": "Доставена",
    "in_transit": "В транзит",
    "order_items": "Артикули",
    "qty": "Количество:",
    "total": "Общо:",
    "status": "Статус:",
    "john_doe": "Иван Иванов",

    "set_new_password_title": "Задайте нова парола",
    "enter_new_password_desc": "Въведете нова парола за профила си.",
    "missing_expired_link": "Този линк е невалиден или с изтекъл срок.",
    "go_to_signin": "Към Вход",
    "password_updated": "Паролата е обновена",
    "can_signin_new_password": "Вече можете да влезете с новата си парола.",
    "continue_to_signin": "Продължи към Вход",
    "repeat_password": "Повторете паролата"
  },

  tr: {
    "check_order_status": "Sipariş durumunu kontrol et",
    "free_delivery": "€30 üzeri ücretsiz kargo",
    
    "search_placeholder": "Kitap, yazar, kategori ara...",
    "search": "Ara",
    
    "books": "Kitaplar",
    "art": "Sanat",
    "handmade": "El Yapımı",
    "ebooks": "E-kitaplar",
    "audiobooks": "Sesli Kitaplar",
    "other_products": "Diğer Ürünler",
    "gift_tips": "Hediye Önerileri",
    "gift_voucher": "Hediye çeki",
    "cart": "Sepet",
    
    "hi": "Merhaba",
    
    "books_title": "175 dilde 16 386 577 kitap",
    "ebooks_title": "İndirilecek 1 245 000 e-kitap",
    "audiobooks_title": "Kulaklarınız için 450 000 sesli kitap",
    "art_title": "Benzersiz Sanat Eserlerini Keşfedin",
    "help_text": "Ne seçeceğinizi bilmiyor musunuz? Size yardımcı olmak için buradayız!",
    "buy_now": "Şimdi al",

    "books_in_english": "İngilizce Kitaplar",
    "books_in_turkish": "Türkçe Kitaplar",
    "books_in_romanian": "Rumence Kitaplar",
    "books_in_bulgarian": "Bulgarca Kitaplar",

    "ebooks_in_turkish": "Türkçe E-kitaplar",
    "ebooks_in_english": "İngilizce E-kitaplar",
    "ebooks_in_romanian": "Rumence E-kitaplar",
    "ebooks_in_bulgarian": "Bulgarca E-kitaplar",

    "audiobooks_in_turkish": "Türkçe Sesli Kitaplar",
    "audiobooks_in_english": "İngilizce Sesli Kitaplar",
    "audiobooks_in_romanian": "Rumence Sesli Kitaplar",
    "audiobooks_in_bulgarian": "Bulgarca Sesli Kitaplar",

    "calendar_diary": "Takvim/Günlük",
    "audio": "Ses",
    "game_toy": "Oyun/Oyuncak",
    "video": "Video",
    "printed_items": "Basılı ürünler",
    "stationery": "Kırtasiye",
    "digital": "Dijital",

    "gifts_for_women": "Kadınlara hediyeler",
    "gifts_for_men": "Erkeklere hediyeler",
    "gifts_for_girls": "Kızlara hediyeler",
    "gifts_for_boys": "Erkek çocuklara hediyeler",
    "gifts_for_children": "Çocuklara hediyeler",

    "painting": "Resim",
    "sculpture": "Heykel",
    "music": "Müzik",
    "crafts": "El Sanatları",

    "be_whoever": "İstediğin Kişi Ol",
    "worlds_widest_selection": "DÜNYANIN EN GENİŞ KİTAP SEÇKİSİ",
    "all_the_books": "Dünyadaki tüm kitaplar",
    "all_about_shopping": "Alışveriş hakkında her şey",
    
    "terms_conditions": "Şartlar ve koşullar",
    "about_the_shop": "Mağaza hakkında",
    "who_we_are": "Biz kimiz",
    "contacts": "İletişim",
    "books_sustainability": "Kitapların sürdürülebilirliği",
    "for_customers": "Müşteriler için",
    "loyalty_programme": "Sadakat programı",
    "order_status": "Sipariş durumu",
    "returns_complaints": "İadeler / Şikayetler",
    "lets_stay_together": "Birlikte kalalım",
    
    "buy_book": "Kitap al",
    "video_btn": "Video",
    
    "23_million_titles": "23 milyon kitap",
    "in_150_languages": "150'den fazla dilde",
    "great_prices": "Harika fiyatlar",
    "always_up_to_date": "her zaman güncel",
    "libroamanto_club": "LIBROAMANTO kulübü",
    "full_of_gifts": "hediyelerle dolu",
    "2_million_customers": "2 milyon müşteri",
    "served_every_year": "her yıl hizmet verilen",
    
    "explore_categories": "Kategorileri Keşfet",
    "classic_modern_print": "Klasik ve Modern Baskı",
    "digital_reading_exp": "Dijital Okuma Deneyimi",
    "listen_to_stories": "Hikayelerinizi Dinleyin",
    "gifts_category": "Hediyeler",
    "special_items_lovers": "Aşıklar için Özel Ürünler",
    "view_collection": "Koleksiyonu Gör",

    "new_arrivals": "Yeni Gelenler",
    "freshly_added": "Koleksiyonumuza yeni eklenenler",
    "bestsellers": "Çok Satanlar",
    "most_loved_books": "Okurlarımız tarafından en çok sevilen kitaplar",
    "book_set_of_month": "Ayın Kitap Seti",
    "carefully_selected": "Bu ay için özenle seçilmiş kitaplar",
    "world_literature": "Dünya Edebiyatı",
    "timeless_classics": "Dünyanın dört bir yanından zamansız klasikler",
    "only": "Sadece",
    "left": "kaldı!",
    "unknown_author": "Bilinmeyen Yazar",

    "join_the": "Katıl",
    "club": "Kulübüne",
    "promo_desc": "Özel indirimler, yeni çıkanlara erken erişim ve ilk siparişinizde ücretsiz kargo fırsatı yakalayın!",
    "enter_email": "E-posta adresinizi girin",
    "join_now": "Şimdi Katıl",
    "promo_terms": "Katılarak, Şartlar ve Koşullarımızı ve Gizlilik Politikamızı kabul etmiş olursunuz",

    "ai_greeting": "Merhaba! 📚 Ben blendartbook AI, kişisel kitap asistanınız. Harika kitaplar keşfetmenize, zevkinize göre kitap önermeme veya kütüphanemiz hakkındaki sorularınızı yanıtlamama yardımcı olabilirim. Bugün ne arıyorsunuz?",
    "recommend_book": "📖 Kitap öner",
    "popular_genres": "🎭 Popüler türler",
    "gift_ideas": "🎁 Hediye fikirleri",
    "ask_me_about": "Bana kitaplar hakkında soru sor...",
    "powered_by": "blendartbook AI tarafından desteklenmektedir ✨",
    "properties": "Özellikler",
    "price_up_to": "Fiyat: maks €",
    "items_found": "ürün bulundu",
    "sort_by_popularity": "Sırala: Popülerlik",
    "no_products_found": "Ürün bulunamadı.",
    "english": "İngilizce",
    "turkish": "Türkçe",
    "romanian": "Rumence",
    "bulgarian": "Bulgarca",
    "all": "Tümü",
    "audio_filters": "Ses Filtreleri",
    "max_price": "Maks Fiyat: €",
    "audio_library": "Ses Kütüphanesi:",
    "syncing": "Senkronize ediliyor...",
    "tuning_frequencies": "Frekanslar ayarlanıyor...",
    "no_audiobooks_found": "Kriterlerinize uygun sesli kitap bulunamadı.",
    "browsing": "İnceleniyor:",
    "no_products_collection": "Bu koleksiyonda ürün bulunamadı.",
    "error_label": "Hata:",
    "all_products": "Tüm Ürünler",
    "set_new_password": "Yeni şifrenizi belirleyin",
    "reset_your_password": "Şifrenizi sıfırlayın",
    "welcome_back": "Tekrar hoş geldiniz",
    "create_an_account": "Hesap Oluştur",
    "choose_secure_password": "Güvenli bir şifre seçin ve kaydedin.",
    "email_reset_link": "Size bir şifre sıfırlama bağlantısı göndereceğiz.",
    "enter_details_access": "Hesabınıza erişmek için bilgilerinizi girin.",
    "join_track_orders": "Siparişlerinizi takip etmek için bize katılın.",
    "check_your_email": "E-postanızı kontrol edin!",
    "if_account_exists": "Eğer hesap varsa:",
    "receive_reset_link": "kısa süre içinde bir bağlantı alacaksınız.",
    "return_to_login": "Girişe Dön",
    "sent_confirmation_link": "Onay bağlantısı gönderdik:",
    "click_verify_account": "Hesabınızı doğrulamak için tıklayın.",
    "full_name": "Ad Soyad",
    "phone_number": "Telefon Numarası",
    "email_address": "E-posta Adresi",
    "password_label": "Şifre",
    "forgot_password": "Şifremi unuttum?",
    "at_least_6_chars": "En az 6 karakter",
    "new_password": "Yeni Şifre",
    "confirm_password": "Şifreyi Onayla",
    "repeat_new_password": "Yeni şifreyi tekrarla",
    "update_password": "Şifreyi Güncelle",
    "send_reset_link": "Bağlantıyı Gönder",
    "log_in": "Giriş Yap",
    "create_account_btn": "Hesap Oluştur",
    "back_to_login": "Girişe Dön",
    "dont_have_account": "Hesabınız yok mu?",
    "already_have_account": "Zaten bir hesabınız var mı?",
    "sign_up_free": "Ücretsiz üye ol",
    "log_in_here": "Buradan giriş yap",

    "my_account": "Hesabım",
    "profile_details": "Profil Detayları",
    "my_orders": "Siparişlerim",
    "log_out": "Çıkış Yap",
    "shipping_contact_details": "Teslimat ve İletişim Bilgileri",
    "profile_updated_success": "Profil başarıyla güncellendi!",
    "delivery_address": "Teslimat Adresi",
    "saving": "Kaydediliyor...",
    "save_changes": "Değişiklikleri Kaydet",
    "no_orders_yet": "Henüz sipariş vermediniz.",
    "delivered": "Teslim Edildi",
    "in_transit": "Yolda",
    "order_items": "Sipariş Öğeleri",
    "qty": "Adet:",
    "total": "Toplam:",
    "status": "Durum:",
    "john_doe": "Ahmet Yılmaz",

    "set_new_password_title": "Yeni şifre belirle",
    "enter_new_password_desc": "Hesabınız için yeni bir şifre girin.",
    "missing_expired_link": "Bu bağlantı eksik veya süresi dolmuş.",
    "go_to_signin": "Girişe Git",
    "password_updated": "Şifre güncellendi",
    "can_signin_new_password": "Artık yeni şifrenizle giriş yapabilirsiniz.",
    "continue_to_signin": "Giriş Yapmaya Devam Et",
    "repeat_password": "Şifreyi tekrarla"
  },

  ro: {
    "check_order_status": "Verifică starea comenzii",
    "free_delivery": "Livrare gratuită peste €30",
    
    "search_placeholder": "Caută cărți, autori, categorii...",
    "search": "Caută",
    
    "books": "Cărți",
    "art": "Artă",
    "handmade": "Handmade",
    "ebooks": "E-book-uri",
    "audiobooks": "Audiobook-uri",
    "other_products": "Alte produse",
    "gift_tips": "Sfaturi cadouri",
    "gift_voucher": "Voucher cadou",
    "cart": "Coș",
    
    "hi": "Salut",
    
    "books_title": "16 386 577 de cărți în 175 de limbi",
    "ebooks_title": "1 245 000 de e-book-uri de descărcat",
    "audiobooks_title": "450 000 de audiobook-uri pentru urechile tale",
    "art_title": "Explorează piese de artă unice",
    "help_text": "Nu știi ce să alegi? Suntem aici să te ajutăm!",
    "buy_now": "Cumpără acum",

    "books_in_english": "Cărți în engleză",
    "books_in_turkish": "Cărți în turcă",
    "books_in_romanian": "Cărți în română",
    "books_in_bulgarian": "Cărți în bulgară",

    "ebooks_in_turkish": "E-book-uri în turcă",
    "ebooks_in_english": "E-book-uri în engleză",
    "ebooks_in_romanian": "E-book-uri în română",
    "ebooks_in_bulgarian": "E-book-uri în bulgară",

    "audiobooks_in_turkish": "Audiobook-uri în turcă",
    "audiobooks_in_english": "Audiobook-uri în engleză",
    "audiobooks_in_romanian": "Audiobook-uri în română",
    "audiobooks_in_bulgarian": "Audiobook-uri în bulgară",

    "calendar_diary": "Calendar/Jurnal",
    "audio": "Audio",
    "game_toy": "Joc/Jucărie",
    "video": "Video",
    "printed_items": "Articole tipărite",
    "stationery": "Papetărie",
    "digital": "Digital",

    "gifts_for_women": "Cadouri pentru femei",
    "gifts_for_men": "Cadouri pentru bărbați",
    "gifts_for_girls": "Cadouri pentru fete",
    "gifts_for_boys": "Cadouri pentru băieți",
    "gifts_for_children": "Cadouri pentru copii",

    "painting": "Pictură",
    "sculpture": "Sculptură",
    "music": "Muzică",
    "crafts": "Meșteșuguri",

    "be_whoever": "Fii Cine Vrei",
    "worlds_widest_selection": "CEA MAI LARGĂ SELECȚIE DE CĂRȚI DIN LUME",
    "all_the_books": "Toate cărțile din lume",
    "all_about_shopping": "Totul despre cumpărături",
    
    "terms_conditions": "Termeni și condiții",
    "about_the_shop": "Despre magazin",
    "who_we_are": "Cine suntem",
    "contacts": "Contact",
    "books_sustainability": "Sustenabilitatea cărților",
    "for_customers": "Pentru clienți",
    "loyalty_programme": "Program de loialitate",
    "order_status": "Starea comenzii",
    "returns_complaints": "Retururi / Reclamații",
    "lets_stay_together": "Să rămânem împreună",
    
    "buy_book": "Cumpără carte",
    "video_btn": "Video",
    
    "23_million_titles": "23 milioane de titluri",
    "in_150_languages": "în 150+ limbi",
    "great_prices": "Prețuri excelente",
    "always_up_to_date": "mereu actualizate",
    "libroamanto_club": "Clubul LIBROAMANTO",
    "full_of_gifts": "plin de cadouri",
    "2_million_customers": "2 milioane de clienți",
    "served_every_year": "serviți în fiecare an",
    
    "explore_categories": "Explorează categoriile",
    "classic_modern_print": "Tipărit clasic și modern",
    "digital_reading_exp": "Experiență de citire digitală",
    "listen_to_stories": "Ascultă poveștile tale",
    "gifts_category": "Cadouri",
    "special_items_lovers": "Articole speciale pentru îndrăgostiți",
    "view_collection": "Vezi colecția",

    "new_arrivals": "Noutăți",
    "freshly_added": "Proaspăt adăugate în colecția noastră",
    "bestsellers": "Bestselleruri",
    "most_loved_books": "Cele mai iubite cărți de cititorii noștri",
    "book_set_of_month": "Setul de cărți al lunii",
    "carefully_selected": "Cărți selectate cu atenție pentru luna aceasta",
    "world_literature": "Literatură universală",
    "timeless_classics": "Clasici atemporali din întreaga lume",
    "only": "Doar",
    "left": "rămase!",
    "unknown_author": "Autor necunoscut",

    "join_the": "Alătură-te",
    "club": "Clubului",
    "promo_desc": "Obține reduceri exclusive, acces anticipat la noi lansări și livrare gratuită la prima ta comandă!",
    "enter_email": "Introdu adresa ta de email",
    "join_now": "Alătură-te acum",
    "promo_terms": "Prin înscriere, ești de acord cu Termenii și Condițiile și cu Politica de confidențialitate",

    "ai_greeting": "Salut! 📚 Sunt blendartbook AI, asistentul tău personal pentru cărți. Te pot ajuta să descoperi cărți uimitoare, să îți recomand lecturi în funcție de gustul tău sau să îți răspund la orice întrebare despre biblioteca noastră. Ce cauți astăzi?",
    "recommend_book": "📖 Recomandă o carte",
    "popular_genres": "🎭 Genuri populare",
    "gift_ideas": "🎁 Idei de cadouri",
    "ask_me_about": "Întreabă-mă despre cărți...",
    "powered_by": "Powered by blendartbook AI ✨",
    "properties": "Proprietăți",
    "price_up_to": "Preț: până la €",
    "items_found": "produse găsite",
    "sort_by_popularity": "Sortare: Popularitate",
    "no_products_found": "Niciun produs găsit.",
    "english": "Engleză",
    "turkish": "Turcă",
    "romanian": "Română",
    "bulgarian": "Bulgară",
    "all": "Toate",
    "audio_filters": "Filtre audio",
    "max_price": "Preț maxim: €",
    "audio_library": "Bibliotecă audio:",
    "syncing": "Se sincronizează...",
    "tuning_frequencies": "Ajustare frecvențe...",
    "no_audiobooks_found": "Nicio carte audio nu corespunde criteriilor tale.",
    "browsing": "Navigare:",
    "no_products_collection": "Nu au fost găsite produse în această colecție.",
    "error_label": "Eroare:",
    "all_products": "Toate produsele",
    "set_new_password": "Setați o parolă nouă",
    "reset_your_password": "Resetați parola",
    "welcome_back": "Bine ai revenit",
    "create_an_account": "Creează un cont",
    "choose_secure_password": "Alegeți o parolă sigură și salvați-o.",
    "email_reset_link": "Vă vom trimite un link de resetare.",
    "enter_details_access": "Introduceți detaliile pentru a accesa contul.",
    "join_track_orders": "Alăturați-vă pentru a urmări comenzile.",
    "check_your_email": "Verificați emailul!",
    "if_account_exists": "Dacă există un cont pentru",
    "receive_reset_link": "veți primi un link în scurt timp.",
    "return_to_login": "Înapoi la Autentificare",
    "sent_confirmation_link": "Am trimis un link de confirmare către",
    "click_verify_account": "Vă rugăm să dați clic pentru a verifica contul.",
    "full_name": "Nume Complet",
    "phone_number": "Număr de telefon",
    "email_address": "Adresă de Email",
    "password_label": "Parolă",
    "forgot_password": "Ați uitat parola?",
    "at_least_6_chars": "Cel puțin 6 caractere",
    "new_password": "Parolă Nouă",
    "confirm_password": "Confirmați Parola",
    "repeat_new_password": "Repetați parola nouă",
    "update_password": "Actualizează Parola",
    "send_reset_link": "Trimite Link",
    "log_in": "Autentificare",
    "create_account_btn": "Creează Cont",
    "back_to_login": "Înapoi la Autentificare",
    "dont_have_account": "Nu ai cont?",
    "already_have_account": "Ai deja un cont?",
    "sign_up_free": "Înscrie-te gratuit",
    "log_in_here": "Autentifică-te aici",

    "my_account": "Contul meu",
    "profile_details": "Detalii profil",
    "my_orders": "Comenzile mele",
    "log_out": "Deconectare",
    "shipping_contact_details": "Detalii de livrare",
    "profile_updated_success": "Profil actualizat cu succes!",
    "delivery_address": "Adresa de livrare",
    "saving": "Se salvează...",
    "save_changes": "Salvează",
    "no_orders_yet": "Nu ai plasat nicio comandă încă.",
    "delivered": "Livrat",
    "in_transit": "În tranzit",
    "order_items": "Articole",
    "qty": "Cantitate:",
    "total": "Total:",
    "status": "Stare:",
    "john_doe": "Ion Popescu",

    "set_new_password_title": "Setați o parolă nouă",
    "enter_new_password_desc": "Introduceți o nouă parolă pentru contul dvs.",
    "missing_expired_link": "Acest link a expirat sau lipsește.",
    "go_to_signin": "Mergi la Autentificare",
    "password_updated": "Parolă actualizată",
    "can_signin_new_password": "Acum vă puteți autentifica cu noua parolă.",
    "continue_to_signin": "Continuă spre Autentificare",
    "repeat_password": "Repetați parola"
  },
};

// --- CONTEXT ---
interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  currentLanguageOption: LanguageOption;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("blendartbook-lang") as Language | null;
    if (saved && ["en", "bg", "tr", "ro"].includes(saved)) {
      setLanguageState(saved);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("blendartbook-lang", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  }, [language]);

  const currentLanguageOption = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  // Prevent hydration mismatch by rendering children only after mount
  if (!mounted) {
    return (
      <LanguageContext.Provider value={{ language: "en", setLanguage, t: (key: string) => translations["en"]?.[key] || key, currentLanguageOption: LANGUAGES[0] }}>
        {children}
      </LanguageContext.Provider>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, currentLanguageOption }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
