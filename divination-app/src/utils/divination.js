// ===== 星座 (Western Zodiac) =====
export function getZodiac(month, day) {
  const dates = [
    [1, 20, '水瓶座', 'Aquarius', '♒'],
    [2, 19, '魚座', 'Pisces', '♓'],
    [3, 21, '牡羊座', 'Aries', '♈'],
    [4, 20, '牡牛座', 'Taurus', '♉'],
    [5, 21, '双子座', 'Gemini', '♊'],
    [6, 21, '蟹座', 'Cancer', '♋'],
    [7, 23, '獅子座', 'Leo', '♌'],
    [8, 23, '乙女座', 'Virgo', '♍'],
    [9, 23, '天秤座', 'Libra', '♎'],
    [10, 23, '蠍座', 'Scorpio', '♏'],
    [11, 22, '射手座', 'Sagittarius', '♐'],
    [12, 22, '山羊座', 'Capricorn', '♑'],
  ];

  const descriptions = {
    '水瓶座': { element: '風', ruling: '天王星', trait: '革新的・独立心旺盛・人道主義的' },
    '魚座': { element: '水', ruling: '海王星', trait: '直感的・共感力が高い・夢想家' },
    '牡羊座': { element: '火', ruling: '火星', trait: '情熱的・行動力・リーダーシップ' },
    '牡牛座': { element: '土', ruling: '金星', trait: '忍耐強い・現実的・美的センス' },
    '双子座': { element: '風', ruling: '水星', trait: '知的好奇心・コミュニケーション上手・多才' },
    '蟹座': { element: '水', ruling: '月', trait: '感受性豊か・家庭的・直感力が強い' },
    '獅子座': { element: '火', ruling: '太陽', trait: '自信家・カリスマ性・寛大' },
    '乙女座': { element: '土', ruling: '水星', trait: '分析的・完璧主義・勤勉' },
    '天秤座': { element: '風', ruling: '金星', trait: '調和を重んじる・社交的・公平' },
    '蠍座': { element: '水', ruling: '冥王星', trait: '深い洞察力・情熱的・変容力' },
    '射手座': { element: '火', ruling: '木星', trait: '楽観的・冒険好き・哲学的' },
    '山羊座': { element: '土', ruling: '土星', trait: '野心的・責任感が強い・忍耐力' },
  };

  // Default to 山羊座 (covers Dec 22 – Jan 19)
  let sign = dates[11];
  for (const [m, d, name, eng, sym] of dates) {
    if (month > m || (month === m && day >= d)) {
      sign = [m, d, name, eng, sym];
    }
  }

  const name = sign[2];
  return {
    name,
    english: sign[3],
    symbol: sign[4],
    ...descriptions[name],
  };
}

// ===== 四柱推命 (Four Pillars of Destiny) =====
const TEN_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const TWELVE_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const STEM_ELEMENT = { '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水' };
const BRANCH_ELEMENT = { '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水' };
const BRANCH_ANIMAL = { '子': '鼠', '丑': '牛', '寅': '虎', '卯': '兎', '辰': '龍', '巳': '蛇', '午': '馬', '未': '羊', '申': '猿', '酉': '鶏', '戌': '犬', '亥': '猪' };

function getStemBranch(offset) {
  return {
    stem: TEN_STEMS[((offset % 10) + 10) % 10],
    branch: TWELVE_BRANCHES[((offset % 12) + 12) % 12],
  };
}

export function getFourPillars(year, month, day) {
  // Year pillar (年柱): 甲子 = 1984, offset = (year - 4) % 60
  // Adjust: before 立春(2/4), use previous year
  const yearAdj = (month === 1 || (month === 2 && day < 4)) ? year - 1 : year;
  const yearOffset = (yearAdj - 4 + 1200) % 60;
  const yearPillar = getStemBranch(yearOffset);

  // Month pillar (月柱)
  // Branch: Jan=丑(1), Feb=寅(2), ..., Dec=子(0) → TWELVE_BRANCHES[month % 12]
  // Stem base corrected: 甲/己年=丙(2), 乙/庚年=戊(4), 丙/辛年=庚(6), 丁/壬年=壬(8), 戊/癸年=甲(0)
  const monthBranch = TWELVE_BRANCHES[month % 12];
  const monthStemBase = ((yearOffset % 5) * 2 + 2) % 10;
  // Chinese month 1 = February; convert: chineseMonth = ((month - 2) + 12) % 12 + 1
  const chineseMonth = ((month - 2) + 12) % 12 + 1;
  const monthStem = TEN_STEMS[(monthStemBase + chineseMonth - 1) % 10];
  const monthPillar = { stem: monthStem, branch: monthBranch };

  // Day pillar (日柱): base 1900/1/1 = 甲子 (offset 0)
  const baseDate = new Date(1900, 0, 1);
  const targetDate = new Date(year, month - 1, day);
  const dayDiff = Math.floor((targetDate - baseDate) / 86400000);
  const dayOffset = ((dayDiff % 60) + 60) % 60;
  const dayPillar = getStemBranch(dayOffset);

  // Hour pillar (時柱): noon (午時) default
  const hourStemBase = (dayOffset % 5) * 2;
  const hourPillar = {
    stem: TEN_STEMS[(hourStemBase + 4) % 10],
    branch: '午',
  };

  const pillars = [yearPillar, monthPillar, dayPillar, hourPillar];
  const labels = ['年柱', '月柱', '日柱', '時柱'];

  const elementCount = { 木: 0, 火: 0, 土: 0, 金: 0, 水: 0 };
  pillars.forEach(p => {
    elementCount[STEM_ELEMENT[p.stem]]++;
    elementCount[BRANCH_ELEMENT[p.branch]]++;
  });

  const dominantElement = Object.entries(elementCount).sort((a, b) => b[1] - a[1])[0][0];
  const elementTraits = {
    木: '成長・向上心・柔軟性があり、クリエイティブな才能を持つ',
    火: '情熱・明朗・リーダーシップがあり、周囲を明るく照らす',
    土: '誠実・安定・責任感があり、信頼される存在',
    金: '意志が強く・完璧主義・正義感があり、目標達成力が高い',
    水: '知恵・適応力・直感力があり、深い洞察を持つ',
  };

  return {
    pillars: pillars.map((p, i) => ({
      label: labels[i],
      stem: p.stem,
      branch: p.branch,
      stemElement: STEM_ELEMENT[p.stem],
      branchElement: BRANCH_ELEMENT[p.branch],
      animal: BRANCH_ANIMAL[p.branch],
    })),
    elementCount,
    dominantElement,
    trait: elementTraits[dominantElement],
    dayMaster: dayPillar.stem,
    dayMasterElement: STEM_ELEMENT[dayPillar.stem],
  };
}

// ===== 六星占術 (Six Star Astrology by Kazuko Hosoki) =====
export function getSixStar(year, month, day) {
  // Hosoki method: (year's last 2 digits) + month + day + 2, reduce to 1-12
  // For Jan/Feb before Setsubun (2/4), use previous year
  let adjustedYear = year;
  if (month === 1 || (month === 2 && day < 4)) {
    adjustedYear = year - 1;
  }

  const base = (adjustedYear % 100) + month + day + 2;
  const birthNumber = ((base - 1) % 12) + 1;

  // 1-6 = 陰(マイナス), 7-12 = 陽(プラス)
  const starIndex = (birthNumber - 1) % 6; // 0=土, 1=金, 2=火, 3=天王, 4=木, 5=水
  const isPositive = birthNumber >= 7;

  const starDefs = [
    { name: '土星人', symbol: '⊕', color: '#8B7355', description: '忍耐力と実行力の持ち主。コツコツと努力を積み重ね、着実に夢を叶える' },
    { name: '金星人', symbol: '☽', color: '#DAA520', description: '美的感覚と社交性に優れ、人を惹きつけるカリスマ性がある' },
    { name: '火星人', symbol: '△', color: '#DC143C', description: '情熱的で行動力旺盛。直感力が鋭く、リーダーとして輝く' },
    { name: '天王星人', symbol: '✦', color: '#4169E1', description: '革新的なアイデアと独自の視点を持つ。時代の先を行く革命家' },
    { name: '木星人', symbol: '☉', color: '#228B22', description: '大らかで親切心に満ちた人格者。人徳があり周囲に慕われる' },
    { name: '水星人', symbol: '☿', color: '#20B2AA', description: '知性と機転が利く才人。コミュニケーション能力が高く多才' },
  ];

  const star = starDefs[starIndex];

  // Annual fortune: 12-year personal cycle based on current year
  const currentYear = new Date().getFullYear();
  const fortunePhases = ['種', '芽吹き', '成長', '開花', '実り', '乱気', '停止', '減退', '整理', '陰影', '停止', '大殺界'];
  const cyclePos = ((currentYear - year) % 12 + 12) % 12;
  const currentFortune = fortunePhases[cyclePos];

  const fortuneDescriptions = {
    '種': '新しい始まりのサイクル。種を蒔く時期で、基盤作りに最適',
    '芽吹き': '物事が動き出すサイクル。積極的な行動が実を結ぶ',
    '成長': '着実に成長できるサイクル。努力が確実に報われる',
    '開花': '運気絶好調のサイクル。全力で挑戦し花を咲かせよう',
    '実り': '努力の成果が実る収穫のサイクル。感謝と喜びに満ちる',
    '乱気': '波乱含みのサイクル。焦らず慎重に行動することが大切',
    '停止': '立ち止まって見直すサイクル。内省と準備の時期',
    '減退': '後退を恐れず自然の流れに従うサイクル',
    '整理': '不要なものを手放し、本質を見極めるサイクル',
    '陰影': '忍耐のサイクル。静かに力を蓄え、次のチャンスを待つ',
    '大殺界': '大きな変化のサイクル。慎重に行動し、無謀な挑戦は避ける',
  };

  return {
    star: star.name,
    symbol: star.symbol,
    color: star.color,
    description: star.description,
    isPositive,
    polarity: isPositive ? '陽(プラス)' : '陰(マイナス)',
    currentFortune,
    fortuneDescription: fortuneDescriptions[currentFortune] || '',
    birthNumber,
  };
}

// ===== 九星気学 (Nine Star Ki) =====
export function getNineStarKi(year, month, day) {
  // Before Setsubun (Feb 4), use previous year
  const adjustedYear = (month === 1 || (month === 2 && day < 4)) ? year - 1 : year;
  // Correct formula: (12 - ((year - 1900) % 9)) % 9, 0 → 9
  const starNum = (12 - ((adjustedYear - 1900) % 9)) % 9 || 9;

  const stars = [
    { num: 1, name: '一白水星', element: '水', color: '#1E90FF', trait: '知恵・柔軟性・コミュニケーション能力に優れる' },
    { num: 2, name: '二黒土星', element: '土', color: '#8B6914', trait: '勤勉・忍耐・母性的で周囲を支える力がある' },
    { num: 3, name: '三碧木星', element: '木', color: '#228B22', trait: '活発・行動力・新しいことへの挑戦精神が旺盛' },
    { num: 4, name: '四緑木星', element: '木', color: '#32CD32', trait: '信頼・調和・縁を大切にし人望が厚い' },
    { num: 5, name: '五黄土星', element: '土', color: '#DAA520', trait: 'カリスマ・中心的存在・強い影響力を持つ帝王' },
    { num: 6, name: '六白金星', element: '金', color: '#C0C0C0', trait: '気品・完璧主義・高い理想と強いリーダーシップ' },
    { num: 7, name: '七赤金星', element: '金', color: '#FF6347', trait: '社交的・弁才・喜びをもたらすエンターテイナー' },
    { num: 8, name: '八白土星', element: '土', color: '#CD853F', trait: '堅実・変革・困難を乗り越える不屈の精神力' },
    { num: 9, name: '九紫火星', element: '火', color: '#DC143C', trait: '直感・美的センス・輝く個性と高い精神性' },
  ];

  const star = stars[starNum - 1];

  return {
    number: star.num,
    name: star.name,
    element: star.element,
    color: star.color,
    trait: star.trait,
  };
}

// ===== 数秘術 (Numerology) =====
export function getNumerology(year, month, day) {
  const digits = String(year) + String(month).padStart(2, '0') + String(day).padStart(2, '0');
  let sum = digits.split('').reduce((acc, d) => acc + parseInt(d), 0);

  // Preserve master numbers 11, 22, 33
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((acc, d) => acc + parseInt(d), 0);
  }

  const meanings = {
    1: { title: '独立・リーダー', desc: '開拓者精神と強いリーダーシップで自分の道を切り拓く' },
    2: { title: '協調・感受性', desc: '繊細な感受性と協調性で人々の橋渡しをする平和主義者' },
    3: { title: '創造・表現', desc: '豊かな創造力と自己表現で周囲を魅了するアーティスト' },
    4: { title: '安定・勤勉', desc: '忍耐と努力で着実に基盤を作り上げる信頼の人' },
    5: { title: '自由・変化', desc: '変化と冒険を愛し、自由な発想で新境地を開拓する' },
    6: { title: '愛・責任', desc: '愛情深く責任感が強い。家族や仲間を守るナーチュラー' },
    7: { title: '探求・神秘', desc: '深い思索と精神性を持つ探求者。真実を追い求める' },
    8: { title: '達成・権力', desc: '高い目標に向かって突き進む強い意志と実行力の持ち主' },
    9: { title: '完成・奉仕', desc: '広い視野と深い慈悲心で世界に貢献する人道主義者' },
    11: { title: 'マスター・直感', desc: '高い直感と霊的な感受性を持つ光の使者。特別な使命がある' },
    22: { title: 'マスター・建設', desc: '大きなビジョンを現実に落とし込む力を持つマスタービルダー' },
    33: { title: 'マスター・奉仕', desc: '無条件の愛で世界を癒すマスターヒーラー。最高の奉仕者' },
  };

  return {
    number: sum,
    ...meanings[sum],
    isMaster: [11, 22, 33].includes(sum),
  };
}
