import json
import os

def romanize_hindi(text):
    char_map = {
        'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo', 'ऋ': 'ri',
        'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
        'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'na',
        'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'na',
        'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
        'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
        'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
        'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha', 'ष': 'sha', 'स': 'sa', 'ह': 'ha',
        'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo', 'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au', 'ं': 'n', 'ः': 'h',
        '्': '', '।': '.', '॥': '..'
    }
    result = ""
    for char in text:
        result += char_map.get(char, char)
    result = result.replace('aaa', 'aa').replace('ii', 'ee').replace('uu', 'oo')
    return result

def merge_gita_data():
    verse_path = '/Users/sauravkumar/Desktop/Gita/assets/verse.json'
    translation_path = '/Users/sauravkumar/Desktop/Gita/assets/translation.json'
    output_path = '/Users/sauravkumar/Desktop/Gita/assets/gita_full.json'

    with open(verse_path, 'r', encoding='utf-8') as f:
        verses = json.load(f)

    with open(translation_path, 'r', encoding='utf-8-sig') as f:
        translations_raw = json.load(f)

    trans_map = {}
    for t in translations_raw:
        v_id = t['verse_id']
        if v_id not in trans_map:
            trans_map[v_id] = {'hindi': None, 'english': None}
        if t['lang'] == 'hindi' and (trans_map[v_id]['hindi'] is None or t['authorName'] == 'Swami Ramsukhdas'):
            trans_map[v_id]['hindi'] = t['description'].strip()
        if t['lang'] == 'english' and (trans_map[v_id]['english'] is None or t['authorName'] == 'Swami Sivananda'):
            trans_map[v_id]['english'] = t['description'].strip()

    original_samples = {
        "1:1": "Sanjay, Kurukshetra ke dharam-yuddh ke maidaan mein, mere bete aur Pandu ke bete ikatthe hue hain. Batao unhone kya kiya?",
        "2:47": "Tumhara haq sirf apne kaam (karma) par hai, uske phal (result) par nahi. Isliye phal ki chinta chhod kar apna kaam poore dil se karo.",
        "2:22": "Jaise hum purane kapde badal kar naye pehente hain, waise hi aatma purana sharir chhod kar naya sharir dharan karti hai.",
        "6:5": "Apne aap ko khud hi upar uthao. Tum hi apne sabse bade dost ho aur tum hi apne sabse bade dushman.",
        "3:35": "Apna kaam (dharma) bhale hi chhota ho, dusre ke bade kaam se behtar hai. Apne raste par chalna hi asli kamyabi hai.",
        "18:66": "Saari chintaon ko chhod kar meri sharan mein aa jao. Main tumhe saare dukhon se mukt kar dunga. Daro mat.",
        "2:62": "Jab hum kisi cheez ke baare mein zyada sochte hain, toh humein usse lagaav ho jata hai. Lagaav se ichha (desire) paida hoti hai, aur jab ichha puri nahi hoti toh gussa (anger) aata hai.",
        "4:7": "Jab-jab dharam (sachai) ki hani hoti hai aur adharam (burai) badhta hai, tab-tab main (Krishna) dharti par aata hoon."
    }

    chapter_themes = {
        1: "Jab mann mein dukh aur confusion ho, toh dherya rakhein. Krishna ka gyan humein rasta dikhayega.",
        2: "Apne mann ko sthir rakhein. Phal ki chinta chhod kar sirf apne kaam par dhyan dein.",
        3: "Karma Yoga humein sikhata hai ki bina kaam ke jeevan nahi chalta. Apne farz ko pehchanein.",
        4: "Gyan hi sabse badi shakti hai. Apne doubts ko khatam karein.",
        5: "Shanti tab milti hai jab hum cheezon se chipakna chhod dete hain.",
        6: "Meditation se mann ko dost banayein.",
        18: "Sab kuch chhod kar Krishna ki sharan mein aa jayein. Wo aapko har dukh se mukt kar denge."
    }

    chapter_moods = {i: m for i, m in enumerate(["Confused", "Stressed", "Anxious", "Angry", "Sad", "Low Confidence"] * 3, 1)}

    final_data = []
    for v in verses:
        ch, vn, v_id = v['chapter_number'], v['verse_number'], v['verse_id']
        key = f"{ch}:{vn}"
        t = trans_map.get(v_id, {})
        hindi = (t.get('hindi') or "").replace('\u00a0', ' ').strip()
        english = (t.get('english') or "").strip()
        
        secondary_translation = original_samples.get(key) or english or "Gyan loading..."
        
        theme = chapter_themes.get(ch, "Krishna teaches us to stay focused on our duty and trust the divine process.")
        advice = f"Chapter {ch}, Verse {vn}: {theme}"

        final_data.append({
            "chapter": ch,
            "verse": vn,
            "shloka": v['text'].strip(),
            "translation": hindi,
            "english": secondary_translation,
            "connection": advice,
            "mood": chapter_moods.get(ch, "Confused")
        })

    final_data.sort(key=lambda x: (x['chapter'], x['verse']))
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=2)
    print(f"Reverted to simple advice data.")

if __name__ == "__main__":
    merge_gita_data()
