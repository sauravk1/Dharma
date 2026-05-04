import { Verse } from '@/hooks/useGitaData';

interface DivineAdvice {
  english: string;
  hindi: string;
}

const DIVINE_INSIGHTS: Record<string, { en: string; hi: string }> = {
  ego: {
    en: "Understand that external power is temporary. True strength comes from inner alignment with Dharma, not from pride or position.",
    hi: "यह समझें कि बाहरी शक्ति अस्थायी है। सच्ची शक्ति अहंकार या पद से नहीं, बल्कि धर्म के साथ आंतरिक जुड़ाव से आती है।"
  },
  resilience: {
    en: "Life is a series of changing seasons. Just as winter leads to spring, your current struggle is preparing you for a new beginning. Stay steady.",
    hi: "जीवन बदलते मौसमों की एक श्रृंखला है। जैसे सर्दी वसंत की ओर ले जाती है, वैसे ही आपका वर्तमान संघर्ष आपको एक नई शुरुआत के लिए तैयार कर रहा है। स्थिर रहें।"
  },
  soul: {
    en: "You are the eternal witness of your thoughts and body. Recognize that your essence is untouched by death, birth, or pain.",
    hi: "आप अपने विचारों और शरीर के शाश्वत साक्षी हैं। पहचानें कि आपका सार मृत्यु, जन्म या दर्द से अछूता है।"
  },
  action: {
    en: "Focus entirely on the quality of your effort. When you let go of the anxiety over the result, your work becomes a sacred offering.",
    hi: "पूरी तरह से अपने प्रयास की गुणवत्ता पर ध्यान केंद्रित करें। जब आप परिणाम की चिंता छोड़ देते हैं, तो आपका कार्य एक पवित्र भेंट बन जाता है।"
  },
  mind: {
    en: "The mind can be a turbulent ocean. Use the anchor of meditation and consistent practice to find the stillness beneath the waves.",
    hi: "मन एक अशांत सागर हो सकता है। लहरों के नीचे शांति पाने के लिए ध्यान और निरंतर अभ्यास के लंगर का उपयोग करें।"
  },
  surrender: {
    en: "You don't have to carry the weight of the world alone. Offer your burdens to the Divine and move forward with a light heart.",
    hi: "आपको दुनिया का बोझ अकेले उठाने की जरूरत नहीं है। अपनी चिंताओं को प्रभु को अर्पित करें और हल्के मन से आगे बढ़ें।"
  },
  equality: {
    en: "See the same Divine light in a friend, a stranger, and even an enemy. This vision of equality is the highest form of wisdom.",
    hi: "एक मित्र, एक अजनबी और यहाँ तक कि एक शत्रु में भी वही दिव्य प्रकाश देखें। समानता की यह दृष्टि ज्ञान का उच्चतम रूप है।"
  },
  focus: {
    en: "One-pointed determination is the secret to success. Do not let your energy be scattered by a thousand different desires.",
    hi: "एकाग्रता ही सफलता का रहस्य है। अपनी ऊर्जा को हजारों अलग-अलग इच्छाओं में बिखरने न दें।"
  },
};

const OPENINGS = [
  { en: "Krishna's Lesson:", hi: "कृष्ण की सीख:" },
  { en: "Divine Strategy:", hi: "दिव्य रणनीति:" },
  { en: "Sacred Wisdom:", hi: "पवित्र ज्ञान:" },
  { en: "Gita Takeaway:", hi: "गीता का सार:" },
  { en: "Path to Peace:", hi: "शांति का मार्ग:" },
];

export const getDivineAdvice = (verse: Verse): DivineAdvice => {
  const { chapter, verse: verseNum, english, translation } = verse;
  
  // 1. Direct Truths for famous verses
  if (chapter === 2 && verseNum === 47) {
    return {
      english: "You have the right to work, but never to the fruit of work. Work for the sake of duty, and you will find freedom from stress.",
      hindi: "कर्म करो, फल की चिंता मत करो। कर्म पर तुम्हारा अधिकार है, फल पर नहीं। यही शांति का मार्ग है।"
    };
  }

  // 2. Identify Strategy
  const text = english.toLowerCase();
  let key = 'action';
  if (text.includes('army') || text.includes('fear') || text.includes('proud')) key = 'ego';
  else if (text.includes('soul') || text.includes('body') || text.includes('death')) key = 'soul';
  else if (text.includes('mind') || text.includes('senses') || text.includes('desire')) key = 'mind';
  else if (text.includes('equal') || text.includes('same') || text.includes('all beings')) key = 'equality';
  else if (text.includes('devotion') || text.includes('love') || text.includes('me')) key = 'surrender';
  else if (text.includes('success') || text.includes('failure') || text.includes('pain')) key = 'resilience';

  const insight = DIVINE_INSIGHTS[key];
  const id = (chapter * 100) + verseNum;
  const opening = OPENINGS[id % OPENINGS.length];

  // 3. Combine English
  let enMsg = english.replace(/^(Sanjaya|Arjuna|The Blessed Lord|Krishna) (said|spoke):? /i, "").split('.')[0];
  
  // 4. Combine Hindi (Using translation field from JSON)
  let hiMsg = translation.replace(/^।।.*।। /i, "").split('।')[0];

  return {
    english: `${opening.en} ${enMsg}. ${insight.en}`,
    hindi: `${opening.hi} ${hiMsg}। ${insight.hi}`
  };
};
