const fs = require('fs');

const path = './app/audiobooks/[languages]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/Audio Filters/g, '{t("audio_filters") || "Audio Filters"}');
content = content.replace(/Max Price: €/g, '{t("max_price") || "Max Price: €"}');
content = content.replace(/Audio Library:/g, '{t("audio_library") || "Audio Library:"}');
content = content.replace(/\{loading \? "Syncing\.\.\." : \`\$\{filteredProducts\.length\} Audiobooks\`\}/g, '{loading ? (t("syncing") || "Syncing...") : `${filteredProducts.length} ${t("audiobooks") || "Audiobooks"}`}');
content = content.replace(/Tuning frequencies\.\.\./g, '{t("tuning_frequencies") || "Tuning frequencies..."}');
content = content.replace(/No audiobooks found matching your criteria\./g, '{t("no_audiobooks_found") || "No audiobooks found matching your criteria."}');

fs.writeFileSync(path, content, 'utf8');
