import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform, Image, Pressable } from 'react-native';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useGitaData } from '@/hooks/useGitaData';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/context/ThemeContext';
import { VerseCard } from '@/components/VerseCard';
import { Sparkles, MessageCircle, Heart, Moon, Sun } from 'lucide-react-native';

const KRISHNA_SAYINGS = [
  "Focus on your work, not the result. Success will follow.",
  "You are what you believe you are.",
  "Change is the law of the universe.",
  "Self-control is the key to peace.",
  "Perform your duty with a calm mind.",
  "The mind is your best friend and your worst enemy.",
  "Whatever happened, happened for the good.",
  "Lust, anger, and greed are the three gates to self-destruction.",
  "A man is made by his belief. As he believes, so he is.",
  "Abandon all attachment to the results of action."
];

export default function HomeScreen() {
  const { randomVerse } = useGitaData();
  const { theme, toggleTheme, colors } = useTheme();
  const [saying, setSaying] = React.useState("");
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setSaying(KRISHNA_SAYINGS[Math.floor(Math.random() * KRISHNA_SAYINGS.length)]);
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 1000, easing: Easing.out(Easing.poly(4)), useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 20000, easing: Easing.linear, useNativeDriver: true })
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -12, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  return (
    <ResponsiveContainer>
      <View style={[styles.container, { backgroundColor: colors.sacredSilk }]}>
        <Animated.View style={[styles.divineGlow, { transform: [{ rotate: spin }] }]} />
        
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.devotionalHeader}>
            <Text style={[styles.sanskritMantra, { color: colors.saffron }]}>॥ श्री कृष्णः शरणं मम ॥</Text>
            <View style={styles.titleContainer}>
              <View style={[styles.ornamentLine, { backgroundColor: colors.saffron }]} />
              <Text style={[styles.mainGreeting, { color: colors.royalBlue }]}>Radhe Radhe</Text>
              <View style={[styles.ornamentLine, { backgroundColor: colors.saffron }]} />
            </View>
            <Text style={[styles.devotionalSubtitle, { color: colors.gray }]}>Universal Companion for Modern Living</Text>
          </View>

          <Animated.View style={[styles.altarSection, { transform: [{ translateY: floatAnim }] }]}>
            <View style={[styles.imageFrame, { backgroundColor: colors.white, shadowColor: colors.saffron }]}>
              <Image source={require('../../assets/krishna.png')} style={styles.sacredImage} resizeMode="cover" />
              <View style={styles.lotusBadge}>
                <Heart size={14} color="#FFF" fill="#FFF" />
              </View>
            </View>
            
            <View style={[styles.messageAltar, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <MessageCircle size={18} color={colors.saffron} />
              <Text style={[styles.messageText, { color: colors.royalBlue }]}>"{saying}"</Text>
            </View>
          </Animated.View>

          <View style={styles.gyanSection}>
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color={colors.saffron} />
              <Text style={[styles.sectionTitle, { color: colors.saffron }]}>Aaj Ka Divine Gyan</Text>
              <Sparkles size={20} color={colors.saffron} />
            </View>
            
            {randomVerse && (
              <View style={styles.cardContainer}>
                <VerseCard 
                  shloka={randomVerse.shloka}
                  translation={randomVerse.translation}
                  english={randomVerse.english}
                  connection={randomVerse.connection}
                  chapter={randomVerse.chapter}
                  verse={randomVerse.verse}
                />
              </View>
            )}
          </View>

          <View style={styles.footer}>
            <Text style={[styles.footerBlessing, { color: colors.royalBlue }]}>May Lord Krishna guide your path today and always.</Text>
          </View>
        </Animated.View>
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 10, alignItems: 'center' },
  themeToggle: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  divineGlow: {
    position: 'absolute',
    top: 50,
    width: 500,
    height: 500,
    backgroundColor: 'rgba(255, 152, 0, 0.08)',
    borderRadius: 250,
    ...Platform.select({ web: { filter: 'blur(100px)' } }),
  },
  content: { width: '100%', alignItems: 'center', zIndex: 10 },
  devotionalHeader: { alignItems: 'center', marginBottom: 30 },
  sanskritMantra: { fontSize: 16, fontWeight: 'bold', letterSpacing: 2, marginBottom: 8, opacity: 0.8 },
  titleContainer: { flexDirection: 'row', alignItems: 'center' },
  ornamentLine: { width: 40, height: 2, marginHorizontal: 15, opacity: 0.5 },
  mainGreeting: { fontSize: 42, fontWeight: '900', textShadowColor: 'rgba(26, 35, 126, 0.1)', textShadowOffset: { width: 0, height: 4 }, textShadowRadius: 6 },
  devotionalSubtitle: { fontSize: 14, fontWeight: '500', marginTop: 4, fontStyle: 'italic' },
  altarSection: { alignItems: 'center', marginBottom: 40 },
  imageFrame: { width: 220, height: 220, borderRadius: 110, padding: 8, shadowOffset: { width: 0, height: 15 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 10, position: 'relative' },
  sacredImage: { width: '100%', height: '100%', borderRadius: 110, borderWidth: 2, borderColor: '#eee' },
  lotusBadge: { position: 'absolute', bottom: 5, right: 30, backgroundColor: '#E91E63', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#FFF' },
  messageAltar: { marginTop: -20, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 5 }, shadowOpacity: 0.1, shadowRadius: 10, borderWidth: 1, maxWidth: '90%', zIndex: 30 },
  messageText: { fontSize: 14, fontWeight: '700', marginLeft: 10, fontStyle: 'italic', textAlign: 'center' },
  gyanSection: { width: '100%', maxWidth: 600 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 2, marginHorizontal: 12 },
  cardContainer: { width: '100%', shadowColor: '#1A237E', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 15 },
  footer: { marginTop: 40, marginBottom: 40, alignItems: 'center', paddingHorizontal: 30 },
  footerBlessing: { fontSize: 14, fontWeight: '600', textAlign: 'center', opacity: 0.8 },
});
