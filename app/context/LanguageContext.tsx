"use client";

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

type Language = 'EN' | 'TR' | 'RO' | 'BG';

const translations: Record<string, Record<Language, string>> = {
  checkOrderStatus: { EN: 'Check order status', TR: 'Sipariş durumunu kontrol et', RO: 'Verificați starea comenzii', BG: 'Проверете състоянието на поръчката' },
  freeDelivery: { EN: 'Free delivery over €30', TR: '€30 üzeri ücretsiz teslimat', RO: 'Livrare gratuită peste 30 €', BG: 'Безплатна доставка над 30 €' },
  books: { EN: 'Books', TR: 'Kitaplar', RO: 'Cărți', BG: 'Книги' },
  ebooks: { EN: 'E-books', TR: 'E-kitaplar', RO: 'E-books', BG: 'Е-книги' },
  audiobooks: { EN: 'Audiobooks', TR: 'Sesli Kitaplar', RO: 'Cărți audio', BG: 'Аудиокниги' },
  otherProducts: { EN: 'Other products', TR: 'Diğer ürünler', RO: 'Alte produse', BG: 'Други продукти' },
  giftTips: { EN: 'Gift tips', TR: 'Hediye önerileri', RO: 'Idei de cadouri', BG: 'Идеи за подаръци' },
  giftVoucher: { EN: 'Gift voucher', TR: 'Hediye çeki', RO: 'Voucher cadou', BG: 'Ваучер за подарък' },
  searchPlaceholder: { EN: 'Search books, authors, categories...', TR: 'Kitap, yazar, kategori ara...', RO: 'Caută cărți, autori, categorii...', BG: 'Търсене на книги, автори, категории...' },
  search: { EN: 'Search', TR: 'Ara', RO: 'Căutare', BG: 'Търсене' },
  cart: { EN: 'Cart', TR: 'Sepet', RO: 'Coș', BG: 'Количка' },
  hi: { EN: 'Hi', TR: 'Merhaba', RO: 'Salut', BG: 'Здравей' },
  allTheBooks: { EN: 'All the books in the world', TR: 'Dünyadaki tüm kitaplar', RO: 'Toate cărțile din lume', BG: 'Всички книги на света' },
  allAboutShopping: { EN: 'All about shopping', TR: 'Alışveriş hakkında', RO: 'Totul despre cumpărături', BG: 'Всичко за пазаруването' },
  deliveryAndPayment: { EN: 'Delivery and payment', TR: 'Teslimat ve ödeme', RO: 'Livrare și plată', BG: 'Доставка и плащане' },
  termsAndConditions: { EN: 'Terms and conditions', TR: 'Şartlar ve koşullar', RO: 'Termeni și condiții', BG: 'Правила и условия' },
  aboutTheShop: { EN: 'About the shop', TR: 'Mağaza hakkında', RO: 'Despre magazin', BG: 'За магазина' },
  whoWeAre: { EN: 'Who we are', TR: 'Biz kimiz', RO: 'Cine suntem', BG: 'Кои сме ние' },
  contacts: { EN: 'Contacts', TR: 'İletişim', RO: 'Contacte', BG: 'Контакти' },
  booksSustainability: { EN: 'Books sustainability', TR: 'Kitap sürdürülebilirliği', RO: 'Sustenabilitatea cărților', BG: 'Устойчивост на книгите' },
  forCustomers: { EN: 'For customers', TR: 'Müşteriler için', RO: 'Pentru clienți', BG: 'За клиенти' },
  loyaltyProgramme: { EN: 'Loyalty programme', TR: 'Sadakat programı', RO: 'Program de fidelitate', BG: 'Програма за лоялност' },
  orderStatus: { EN: 'Order status', TR: 'Sipariş durumu', RO: 'Starea comenzii', BG: 'Статус на поръчката' },
  returnsComplaints: { EN: 'Returns / Complaints', TR: 'İade / Şikayet', RO: 'Returnări / Reclamații', BG: 'Връщания / Оплаквания' },
  letsStayTogether: { EN: "Let's stay together", TR: 'Birlikte kalalım', RO: 'Să rămânem împreună', BG: 'Да останем заедно' },
  exploreCategories: { EN: 'Explore Categories', TR: 'Kategorileri Keşfet', RO: 'Explorează categoriile', BG: 'Разгледайте категориите' },
  booksDesc: { EN: 'Classic and Modern Print', TR: 'Klasik ve Modern Baskı', RO: 'Tipărire clasică și modernă', BG: 'Класически и модерен печат' },
  ebooksDesc: { EN: 'Digital Reading Experience', TR: 'Dijital Okuma Deneyimi', RO: 'Experiență de citire digitală', BG: 'Дигитално изживяване при четене' },
  audiobooksDesc: { EN: 'Listen to Your Stories', TR: 'Hikayelerinizi Dinleyin', RO: 'Ascultă-ți poveștile', BG: 'Слушайте своите истории' },
  giftsDesc: { EN: 'Special Items for Lovers', TR: 'Sevdikleriniz İçin Özel Ürünler', RO: 'Articole speciale pentru îndrăgostiți', BG: 'Специални артикули за влюбени' },
  viewCollection: { EN: 'View Collection', TR: 'Koleksiyonu Gör', RO: 'Vezi colecția', BG: 'Вижте колекцията' },
  gifts: { EN: 'Gifts', TR: 'Hediyeler', RO: 'Cadouri', BG: 'Подаръци' },
  featuresTitle1: { EN: '23 million titles', TR: '23 milyon başlık', RO: '23 milioane de titluri', BG: '23 милиона заглавия' },
  featuresDesc1: { EN: 'in 150+ languages', TR: '150+ dilde', RO: 'în peste 150 de limbi', BG: 'на над 150 езика' },
  featuresTitle2: { EN: 'Great prices', TR: 'Harika fiyatlar', RO: 'Prețuri excelente', BG: 'Страхотни цени' },
  featuresDesc2: { EN: 'always up-to-date', TR: 'her zaman güncel', RO: 'întotdeauna actualizate', BG: 'винаги актуални' },
  featuresTitle3: { EN: 'LIBROAMANTO club', TR: 'LIBROAMANTO kulübü', RO: 'Clubul LIBROAMANTO', BG: 'Клуб LIBROAMANTO' },
  featuresDesc3: { EN: 'full of gifts', TR: 'hediyelerle dolu', RO: 'plin de cadouri', BG: 'пълен с подаръци' },
  featuresTitle4: { EN: '2 million customers', TR: '2 milyon müşteri', RO: '2 milioane de clienți', BG: '2 милиона клиенти' },
  featuresDesc4: { EN: 'served every year', TR: 'her yıl hizmet veriyoruz', RO: 'serviți în fiecare an', BG: 'обслужвани всяка година' },
  promoTitleStart: { EN: 'Join the', TR: '', RO: 'Alătură-te clubului', BG: 'Присъединете се към клуб' },
  promoTitleEnd: { EN: 'Club', TR: 'Kulübüne Katılın', RO: '', BG: '' },
  promoDesc: { EN: 'Get exclusive discounts, early access to new releases, and free shipping on your first order!', TR: 'Özel indirimler, yeni çıkanlara erken erişim ve ilk siparişinizde ücretsiz kargo fırsatını yakalayın!', RO: 'Obțineți reduceri exclusive, acces anticipat la noile lansări și livrare gratuită la prima comandă!', BG: 'Вземете изключителни отстъпки, ранен достъп до нови издания и безплатна доставка за първата си поръчка!' },
  promoPlaceholder: { EN: 'Enter your email address', TR: 'E-posta adresinizi girin', RO: 'Introduceți adresa de e-mail', BG: 'Въведете вашия имейл адрес' },
  promoButton: { EN: 'Join Now', TR: 'Şimdi Katıl', RO: 'Alătură-te acum', BG: 'Присъединете се сега' },
  promoTerms: { EN: 'By joining, you agree to our Terms & Conditions and Privacy Policy', TR: 'Katılarak, Şartlar ve Koşullarımız ile Gizlilik Politikamızı kabul etmiş olursunuz', RO: 'Prin înscriere, sunteți de acord cu Termenii și condițiile și Politica de confidențialitate', BG: 'С присъединяването си вие се съгласявате с нашите Общи условия и Политика за поверителност' }
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('preferredLang') as Language;
    if (savedLang && ['EN', 'TR', 'RO', 'BG'].includes(savedLang)) {
      setLanguageState(savedLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('preferredLang', lang);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}