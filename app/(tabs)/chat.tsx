import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams } from 'expo-router';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useGitaData, Verse } from '@/hooks/useGitaData';
import { ChatBubble } from '@/components/ChatBubble';
import { VerseCard } from '@/components/VerseCard';
import { MoodButton } from '@/components/MoodButton';
import { useTheme } from '@/context/ThemeContext';
import { Send, Zap, CloudRain, Flame, HelpCircle as HelpIcon, BookOpen } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isKrishna: boolean;
  verse?: Verse;
  showVerse?: boolean;
}

export default function ChatScreen() {
  const { mood: initialMood } = useLocalSearchParams<{ mood: string }>();
  const { getVersesByMood, findBestMatch } = useGitaData();
  const { colors } = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const MOODS = [
    { name: 'Confused', icon: <HelpIcon size={20} color={colors.saffron} /> },
    { name: 'Anxious', icon: <Zap size={20} color={colors.saffron} /> },
    { name: 'Sad', icon: <CloudRain size={20} color={colors.saffron} /> },
    { name: 'Angry', icon: <Flame size={20} color={colors.saffron} /> },
  ];

  useEffect(() => {
    const welcome = "Radhe Radhe, mere priya dost! Main Krishna hoon. Bataiye, aaj aapke mann mein kya chal raha hai?";
    setMessages([{ id: '1', text: welcome, isKrishna: true }]);

    if (initialMood) {
      handleMoodSelection(initialMood);
    }
  }, [initialMood]);

  const handleMoodSelection = (mood: string) => {
    const userMsg: Message = { id: Date.now().toString(), text: `Krishna, main thoda ${mood.toLowerCase()} feel kar raha hoon.`, isKrishna: false };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    
    setTimeout(() => {
      setIsTyping(false);
      const relevant = getVersesByMood(mood);
      const randomVerse = relevant[Math.floor(Math.random() * relevant.length)];
      setMessages(prev => [...prev, {
        id: Date.now() + 'k',
        text: `Mere priya, ghabraiye mat. Gita ka yeh gyan aapke mann ko shanti dega:`,
        isKrishna: true,
        verse: randomVerse,
        showVerse: false
      }]);
    }, 1500);
  };

  const handleSend = () => {
    if (!inputText.trim()) return;
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const userMessage: Message = { id: Date.now().toString(), text: inputText, isKrishna: false };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      const lowerInput = currentInput.toLowerCase().trim();
      const greetings = ['hi', 'hello', 'hey', 'radhe radhe', 'namaste', 'pranam', 'krishna'];
      
      if (greetings.includes(lowerInput) || lowerInput.length < 3) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          text: "Radhe Radhe, mere sakha! Main humesha aapke saath hoon. Bataiye, aaj main aapki kaise sahayata kar sakta hoon?",
          isKrishna: true
        }]);
        return;
      }

      const matchedVerse = findBestMatch(currentInput);
      let advice = matchedVerse?.connection || "Mere priya Parth, jeevan mein humesha dherya rakhein aur apne karma par dhyan dein. Phal ki chinta na karein, main sab dekh raha hoon.";
      
      // Add a divine touch to the matched advice
      if (matchedVerse) {
        advice = `Suno Parth, Gita kehti hai... ${advice}`;
      }

      const wantsVerse = lowerInput.includes('shloka') || 
                         lowerInput.includes('verse') || 
                         lowerInput.includes('dikhao') || 
                         lowerInput.includes('padhna') || 
                         lowerInput.includes('gita');

      const krishnaMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: advice,
        isKrishna: true,
        verse: matchedVerse || undefined,
        showVerse: wantsVerse
      };
      setMessages(prev => [...prev, krishnaMessage]);
    }, 2000);
  };

  const toggleVerse = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showVerse: !m.showVerse } : m));
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={styles.messageWrapper}>
      <ChatBubble message={item.text} isKrishna={item.isKrishna} />
      
      {item.verse && !item.showVerse && (
        <Pressable 
          onPress={() => toggleVerse(item.id)}
          style={[styles.viewVerseBtn, { borderColor: colors.saffron }]}
        >
          <BookOpen size={14} color={colors.saffron} />
          <Text style={[styles.viewVerseText, { color: colors.saffron }]}>Padhein Shloka</Text>
        </Pressable>
      )}

      {item.verse && item.showVerse && (
        <View style={styles.verseCardContainer}>
          <VerseCard 
            shloka={item.verse.shloka}
            translation={item.verse.translation}
            english={item.verse.english}
            connection={item.verse.connection}
            chapter={item.verse.chapter}
            verse={item.verse.verse}
            alwaysExpanded={true}
          />
          <Pressable onPress={() => toggleVerse(item.id)} style={styles.hideVerseBtn}>
            <Text style={{ color: colors.gray, fontSize: 12 }}>Hide Shloka</Text>
          </Pressable>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }} keyboardVerticalOffset={100}>
      <ResponsiveContainer scrollable={false}>
        <View style={[styles.container, { backgroundColor: colors.sacredSilk }]}>
          {/* Divine Background Element */}
          <View style={styles.divineGlow} />

          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            ListFooterComponent={
              isTyping ? (
                <View style={styles.typingContainer}>
                  <ChatBubble message="Krishna Ji is reflecting..." isKrishna={true} />
                </View>
              ) : null
            }
            ListHeaderComponent={
              <View style={styles.headerContent}>
                {/* Divine Guidance Card */}
                <View style={[styles.guidanceCard, { backgroundColor: colors.white, borderColor: colors.saffron }]}>
                  <View style={styles.guidanceHeader}>
                    <HelpIcon size={18} color={colors.saffron} />
                    <Text style={[styles.guidanceTitle, { color: colors.text }]}>How to talk to Krishna?</Text>
                  </View>
                  <Text style={[styles.guidanceText, { color: colors.subText }]}>
                    Share your feelings (e.g., "I am feeling stressed") or ask life questions (e.g., "What is my duty?") to receive guidance from the Bhagavad Gita.
                  </Text>
                  <Text style={[styles.disclaimerText, { color: colors.subText }]}>
                    Note: Responses are based on matching your input with sacred verses and may not always be exactly accurate.
                  </Text>
                </View>

                <View style={styles.moodSection}>
                  <Text style={[styles.moodTitle, { color: colors.text }]}>Select your mood to start:</Text>
                  <View style={styles.moodGrid}>
                    {MOODS.map((m) => (
                      <MoodButton key={m.name} mood={m.name} icon={m.icon} onPress={() => handleMoodSelection(m.name)} />
                    ))}
                  </View>
                  <View style={[styles.divider, { backgroundColor: colors.border }]} />
                </View>
              </View>
            }
          />
          <View style={[styles.inputArea, { backgroundColor: colors.cream }]}>
            <View style={[styles.inputWrapper, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <TextInput 
                style={[styles.input, { color: colors.royalBlue }]} 
                placeholder="Krishna se baat karein..." 
                value={inputText} 
                onChangeText={setInputText} 
                multiline 
                placeholderTextColor={colors.gray} 
              />
              <Pressable onPress={handleSend} style={[styles.sendBtn, { backgroundColor: colors.royalBlue }]}>
                <Send size={24} color="#FFF" />
              </Pressable>
            </View>
          </View>
        </View>
      </ResponsiveContainer>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  divineGlow: {
    position: 'absolute',
    top: '20%',
    left: '10%',
    width: 400,
    height: 400,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
    borderRadius: 200,
    ...Platform.select({ web: { filter: 'blur(80px)' } as any }),
  },
  listContent: { paddingBottom: 20 },
  messageWrapper: { marginBottom: 16, paddingHorizontal: 4, zIndex: 10 },
  verseCardContainer: { marginLeft: 12, marginTop: 4, marginBottom: 16 },
  inputArea: { paddingVertical: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)' },
  inputWrapper: { flexDirection: 'row', alignItems: 'flex-end', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1 },
  input: { flex: 1, fontSize: 16, maxHeight: 100, paddingTop: 8, paddingBottom: 8 },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginLeft: 8, marginBottom: 2 },
  moodSection: { marginBottom: 20, padding: 10 },
  headerContent: {
    padding: 10,
    zIndex: 10,
  },
  guidanceCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderLeftWidth: 6,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  guidanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guidanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  guidanceText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  disclaimerText: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 10,
    opacity: 0.7,
  },
  moodTitle: { fontSize: 14, marginBottom: 10, fontWeight: 'bold' },
  moodGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  divider: { height: 1, marginTop: 20 },
  viewVerseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginLeft: 12,
    marginTop: -8,
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
    backgroundColor: 'rgba(255, 153, 51, 0.05)',
  },
  viewVerseText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  hideVerseBtn: {
    padding: 8,
    alignItems: 'center',
  },
  typingContainer: {
    opacity: 0.7,
  },
});
