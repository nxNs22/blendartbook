const fs = require('fs');

// 1. Who We Are
const whoPath = '/Users/nurmuhammetsohbetov02/blendartbook/app/about/who-we-are/page.tsx';
let whoContent = fs.readFileSync(whoPath, 'utf8');
whoContent = whoContent.replace('Crafting stories, <br />', '{t("who_we_are_hero_title")}');
whoContent = whoContent.replace('<span className="text-[#2CB391]">inspiring minds.</span>', '');
whoContent = whoContent.replace('BlendArtBook was born out of a simple passion: to bring the world\'s most beautiful books and art pieces to a global community of curious readers and art lovers.', '{t("who_we_are_hero_desc")}');
whoContent = whoContent.replace('Curated with Love', '{t("curated_with_love")}');
whoContent = whoContent.replace('Quality First', '{t("quality_first")}');
fs.writeFileSync(whoPath, whoContent);

// 2. Contacts
const contactsPath = '/Users/nurmuhammetsohbetov02/blendartbook/app/about/contacts/page.tsx';
let contactsContent = fs.readFileSync(contactsPath, 'utf8');
contactsContent = contactsContent.replace('We\'re here to help. Reach out to us through any of these channels.', '{t("contacts_hero_desc")}');
contactsContent = contactsContent.replace('Need immediate assistance? Our AI assistant and support team are available 24/7.', '{t("live_chat_desc")}');
contactsContent = contactsContent.replace('Start a Conversation', '{t("start_conversation")}');
fs.writeFileSync(contactsPath, contactsContent);

console.log('Components updated successfully!');
