const fs = require('fs');
const path = '/Users/nurmuhammetsohbetov02/blendartbook/app/context/LanguageContext.tsx';

const content = fs.readFileSync(path, 'utf8');

const newTranslations = {
  en: {
    "sustainability_desc": "Our commitment to the planet and responsible publishing.",
    "sustainability_content": "We believe in a sustainable future for the world of art and literature. We source our paper from FSC-certified forests and use eco-friendly inks whenever possible.",
    "loyalty_desc": "Rewarding our most passionate readers and collectors.",
    "loyalty_content": "Join the BlendArtBook Loyalty Programme to earn points on every purchase. Points can be redeemed for exclusive discounts and free shipping.",
    "returns_desc": "Hassle-free returns and dedicated support for your satisfaction.",
    "returns_content": "Not satisfied with your purchase? No problem. We offer a 30-day return policy for all items in their original condition.",
    "still_have_questions": "Still have questions?",
    "support_team_desc": "Our dedicated support team is ready to assist you with any further details regarding this topic."
  },
  tr: {
    "sustainability_desc": "Gezegenimize olan bağlılığımız ve sorumlu yayıncılık.",
    "sustainability_content": "Sanat ve edebiyat dünyası için sürdürülebilir bir geleceğe inanıyoruz. Kağıtlarımızı FSC sertifikalı ormanlardan temin ediyor ve mümkün olduğunca çevre dostu mürekkepler kullanıyoruz.",
    "loyalty_desc": "En tutkulu okurlarımızı ve koleksiyoncularımızı ödüllendiriyoruz.",
    "loyalty_content": "Her satın alma işleminizde puan kazanmak için BlendArtBook Sadakat Programına katılın. Puanlar özel indirimler ve ücretsiz kargo için kullanılabilir.",
    "returns_desc": "Memnuniyetiniz için sorunsuz iadeler ve özel destek.",
    "returns_content": "Satın aldığınız üründen memnun kalmadınız mı? Sorun değil. Orijinal durumundaki tüm ürünler için 30 günlük iade politikası sunuyoruz.",
    "still_have_questions": "Hala sorularınız mı var?",
    "support_team_desc": "Özel destek ekibimiz, bu konuyla ilgili diğer detaylarda size yardımcı olmaya hazırdır."
  },
  ro: {
    "sustainability_desc": "Angajamentul nostru față de planetă și publicarea responsabilă.",
    "sustainability_content": "Credem într-un viitor sustenabil pentru lumea artei și a literaturii. Ne aprovizionăm cu hârtie din păduri certificate FSC și folosim cerneluri ecologice ori de câte ori este posibil.",
    "loyalty_desc": "Recompensarea celor mai pasionați cititori și colecționari ai noștri.",
    "loyalty_content": "Alăturați-vă Programului de Loialitate BlendArtBook pentru a câștiga puncte la fiecare achiziție. Punctele pot fi răscumpărate pentru reduceri exclusive și transport gratuit.",
    "returns_desc": "Retururi fără bătăi de cap și asistență dedicată pentru satisfacția dumneavoastră.",
    "returns_content": "Nu sunteți mulțumit de achiziție? Nicio problemă. Oferim o politică de retur de 30 de zile pentru toate articolele în starea lor originală.",
    "still_have_questions": "Mai aveți întrebări?",
    "support_team_desc": "Echipa noastră dedicată de asistență este gata să vă ajute cu orice alte detalii referitoare la acest subiect."
  },
  bg: {
    "sustainability_desc": "Нашият ангажимент към планетата и отговорното публикуване.",
    "sustainability_content": "Вярваме в устойчивото бъдеще за света на изкуството и литературата. Снабдяваме се с хартия от FSC-сертифицирани гори и използваме екологични мастила.",
    "loyalty_desc": "Възнаграждаваме нашите най-страстни читатели и колекционери.",
    "loyalty_content": "Присъединете се към програмата за лоялност на BlendArtBook, за да печелите точки при всяка покупка. Точките могат да се обменят за ексклузивни отстъпки и безплатна доставка.",
    "returns_desc": "Безпроблемно връщане и специална поддръжка за вашето удовлетворение.",
    "returns_content": "Не сте доволни от покупката си? Няма проблем. Предлагаме 30-дневна политика за връщане на всички артикули в оригиналното им състояние.",
    "still_have_questions": "Все още имате въпроси?",
    "support_team_desc": "Нашият специализиран екип за поддръжка е готов да ви съдейства с всякакви допълнителни подробности по тази тема."
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
console.log('Dynamic page translations updated successfully!');
