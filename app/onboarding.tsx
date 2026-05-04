import React, { useRef, useEffect } from 'react';
import { 
  View, Text, StyleSheet, Pressable, ScrollView, 
  Dimensions, Animated, StatusBar, Platform
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Sparkles, BookOpen, MessageCircle, Bookmark } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');
const ONBOARDING_KEY = 'dharma_onboarding_done';

const slides = [
  {
    id: '1',
    emoji: '🪷',
    title: 'Jai Shri Krishna!',
    subtitle: 'Welcome to Dharma',
    description: 'Your personal spiritual companion. Receive daily wisdom from the Bhagavad Gita and find peace in the ancient words of Lord Krishna.',
    bg: '#FFF8F0',
    accent: '#FF9800',
  },
  {
    id: '2',
    emoji: '🪶',
    title: 'Talk to Krishna Ji',
    subtitle: 'Divine Guidance, Anytime',
    description: 'Share your feelings and worries with Krishna Ji. He will guide you with relevant wisdom from the Gita, just as he guided Arjuna on the battlefield.',
    bg: '#F0F4FF',
    accent: '#3949AB',
  },
  {
    id: '3',
    emoji: '📖',
    title: 'Sampoorna Gita',
    subtitle: 'All 700+ Verses',
    description: 'Read, bookmark, and master all 18 chapters of the Bhagavad Gita. Track your progress and build a daily reading habit with streaks.',
    bg: '#F0FFF4',
    accent: '#2E7D32',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleDone = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    router.replace('/(tabs)');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (currentIndex + 1) * width, animated: true });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleDone();
    }
  };

  const isLast = currentIndex === slides.length - 1;

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={{ flex: 1 }}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={[styles.slide, { backgroundColor: slide.bg, width }]}>
            {/* Sacred glow */}
            <View style={[styles.glow, { backgroundColor: slide.accent + '15' }]} />
            
            {/* Emoji icon */}
            <View style={[styles.emojiCircle, { backgroundColor: slide.accent + '20', borderColor: slide.accent + '40' }]}>
              <Text style={styles.emoji}>{slide.emoji}</Text>
            </View>

            <Text style={[styles.subtitle, { color: slide.accent }]}>{slide.subtitle}</Text>
            <Text style={[styles.title, { color: '#1A1A2E' }]}>{slide.title}</Text>
            
            <View style={[styles.dividerLine, { backgroundColor: slide.accent }]} />

            <Text style={styles.description}>{slide.description}</Text>

            {/* Feature icons for last slide */}
            {index === 2 && (
              <View style={styles.featureRow}>
                {[
                  { icon: <BookOpen size={18} color={slide.accent} />, label: '18 Chapters' },
                  { icon: <Sparkles size={18} color={slide.accent} />, label: '700+ Verses' },
                  { icon: <Bookmark size={18} color={slide.accent} />, label: 'Bookmark & Save' },
                ].map((f) => (
                  <View key={f.label} style={[styles.featureTag, { borderColor: slide.accent + '40' }]}>
                    {f.icon}
                    <Text style={[styles.featureLabel, { color: slide.accent }]}>{f.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Controls */}
      <View style={styles.controls}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                { backgroundColor: i === currentIndex ? slides[currentIndex].accent : '#DDD' },
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>
          {!isLast && (
            <Pressable onPress={handleDone} style={styles.skipBtn}>
              <Text style={styles.skipText}>Skip</Text>
            </Pressable>
          )}
          <Pressable
            onPress={handleNext}
            style={[styles.nextBtn, { backgroundColor: slides[currentIndex].accent }]}
          >
            <Text style={styles.nextText}>{isLast ? '🙏  Begin Journey' : 'Next  →'}</Text>
          </Pressable>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#FFF8F0' },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  glow: {
    position: 'absolute',
    top: 80,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  emoji: { fontSize: 56 },
  subtitle: {
    fontSize: 13,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 16,
  },
  dividerLine: {
    width: 50,
    height: 3,
    borderRadius: 2,
    marginBottom: 20,
    opacity: 0.6,
  },
  description: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    color: '#555',
    fontStyle: 'italic',
  },
  featureRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 28,
    justifyContent: 'center',
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  featureLabel: { fontSize: 12, fontWeight: '700' },
  controls: {
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
    paddingHorizontal: 32,
    backgroundColor: 'transparent',
  },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  dotActive: { width: 24 },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skipBtn: { padding: 12 },
  skipText: { color: '#999', fontSize: 15, fontWeight: '600' },
  nextBtn: {
    flex: 1,
    marginLeft: 16,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextText: { color: '#FFF', fontSize: 17, fontWeight: '800', letterSpacing: 0.5 },
});
