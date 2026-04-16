const fs = require('fs');
const path = require('path');

const KEYWORD_PREFIXES = {
  'benefit': 'benefit',
  'growth': 'growth',
  'urgent': 'urgent',
  '100won': 'hundred',
  'info': 'info',
};

const SEASON_TOKENS = {
  'spring': 'spring',
  'summer': 'summer',
  'autumn': 'autumn',
  'winter': 'winter',
  'christmas': 'christmas',
  'newyear': 'newyear',
  'chuseok': 'chuseok',
};

const dir = path.join(__dirname, '..', 'public', 'assets', '3d');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
const groups = {};

const addToGroup = (groupId, filePath) => {
  if (!groups[groupId]) groups[groupId] = [];
  groups[groupId].push(filePath);
};

for (const file of files) {
  const name = file.replace('.webp', '').toLowerCase();
  const filePath = `/assets/3d/${file}`;

  const matchedKeywords = [];
  const matchedSeasons = [];

  for (const [prefix, kwId] of Object.entries(KEYWORD_PREFIXES)) {
    if (name.startsWith(prefix + '-') || name === prefix) {
      matchedKeywords.push(kwId);
    }
  }

  for (const [token, seasonId] of Object.entries(SEASON_TOKENS)) {
    if (name.includes('-' + token + '-') || name.includes('-' + token + '.') || name.endsWith('-' + token)) {
      matchedSeasons.push(seasonId);
    }
  }

  if (matchedKeywords.length > 0 && matchedSeasons.length > 0) {
    for (const kwId of matchedKeywords) {
      for (const seasonId of matchedSeasons) {
        addToGroup(`${kwId}_${seasonId}`, filePath);
      }
    }
  } else if (matchedKeywords.length > 0) {
    for (const kwId of matchedKeywords) {
      addToGroup(kwId, filePath);
    }
  } else if (matchedSeasons.length > 0) {
    for (const seasonId of matchedSeasons) {
      addToGroup(seasonId, filePath);
    }
  } else {
    addToGroup('uncategorized', filePath);
  }
}

const outPath = path.join(__dirname, '..', 'public', 'assets', 'asset-groups.json');
fs.writeFileSync(outPath, JSON.stringify({ groups }, null, 2));
console.log(`Generated ${outPath} (${Object.keys(groups).length} groups, ${files.length} files)`);
