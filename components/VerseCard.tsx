import React from 'react';
import { View, Text, StyleSheet, Platform, Share, TouchableOpacity } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';
import { getDivineAdvice } from '@/utils/wisdom';

interface VerseCardProps {
  shloka: string;
  translation: string;
  english: string;
  connection: string;
  chapter: number;
  verse: number;
  alwaysExpanded?: boolean;
}

export const VerseCard: React.FC<VerseCardProps> = ({ 
  shloka, 
  translation, 
  english, 
  connection: originalConnection, 
  chapter, 
  verse, 
  alwaysExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(alwaysExpanded);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { readVerses, toggleProgress } = useProgress();
  const { fontSize, hapticsEnabled, language } = useSettings();
  const { colors } = useTheme();

  // Use the wisdom engine to generate bilingual advice
  const advice = React.useMemo(() => {
    const rawAdvice = getDivineAdvice({ shloka, translation, english, connection: originalConnection, chapter, verse, mood: '' });
    if (language === 'hi') return { ...rawAdvice, english: '' };
    if (language === 'en') return { ...rawAdvice, hindi: '' };
    return rawAdvice;
  }, [shloka, translation, english, originalConnection, chapter, verse, language]);

  const verseId = `${chapter}:${verse}`;
  const bookmarked = isBookmarked(verseId);
  const isRead = readVerses.includes(verseId);

  const handleExpand = () => {
    if (alwaysExpanded) return;
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState && Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleMarkRead = () => {
    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    toggleProgress(verseId);
  };

  const handleShare = async () => {
    if (Platform.OS !== 'web' && hapticsEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    try {
      const shareMessage = 
        `✨ *Srimad Bhagavad Gita* ✨\n` +
        `📖 *Chapter ${chapter}, Verse ${verse}*\n\n` +
        `🕉️ *Shloka:*\n${shloka}\n\n` +
        `📝 *English:*\n${english}\n\n` +
        `🇮🇳 *Hindi:*\n${translation}\n\n` +
        `🙏 *Krishna's Advice (Hindi):*\n${advice.hindi}\n\n` +
        `🇬🇧 *Advice (English):*\n${advice.english}\n\n` +
        `— Shared via Dharma App 🪷`;

      await Share.share({
        message: shareMessage,
        title: `Gita ${chapter}:${verse}`,
      });
    } catch (e) {}
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Text style={[styles.verseNumber, { color: colors.primary }]}>
          Verse {chapter}.{verse}
        </Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => toggleBookmark(verseId)} style={styles.iconButton}>
            <Ionicons 
              name={bookmarked ? "bookmark" : "bookmark-outline"} 
              size={22} 
              color={bookmarked ? "#FF9500" : colors.textSecondary} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
            <Ionicons name="share-outline" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.shlokaContainer}>
        <Text style={[styles.shlokaText, { color: colors.primary, fontSize: fontSize + 2 }]}>
          {shloka}
        </Text>
      </View>

      {!alwaysExpanded && (
        <TouchableOpacity 
          style={styles.expandButton}
          onPress={handleExpand}
        >
          <Text style={[styles.expandButtonText, { color: colors.primary }]}>
            {isExpanded ? "Show Less" : "Read Translation & Advice"}
          </Text>
          <Ionicons 
            name={isExpanded ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={colors.primary} 
          />
        </TouchableOpacity>
      )}

      {(isExpanded || alwaysExpanded) && (
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.contentSection}>
            {(language === 'en' || language === 'both') && (
              <>
                <Text style={styles.sectionLabel}>English Meaning</Text>
                <Text style={[styles.meaningText, { color: colors.text, fontSize: fontSize }]}>
                  {english}
                </Text>
              </>
            )}
          </View>

          <View style={styles.contentSection}>
            {(language === 'hi' || language === 'both') && (
              <>
                <Text style={styles.sectionLabel}>Hindi Anuvadan</Text>
                <Text style={[styles.meaningText, { color: colors.text, fontSize: fontSize }]}>
                  {translation}
                </Text>
              </>
            )}
          </View>

          <View style={[styles.adviceCard, { backgroundColor: colors.primary + '15' }]}>
            <View style={styles.adviceHeader}>
              <Ionicons name="sparkles" size={18} color={colors.primary} />
              <Text style={[styles.adviceTitle, { color: colors.primary }]}>Krishna's Advice</Text>
            </View>
            
            {(language === 'hi' || language === 'both') && advice?.hindi ? (
              <Text style={[styles.adviceTextHi, { color: colors.text, fontSize: fontSize + 1, marginBottom: (language === 'both' && advice?.english) ? 12 : 0 }]}>
                {advice.hindi}
              </Text>
            ) : null}
            
            {language === 'both' && advice?.hindi && advice?.english && (
              <View style={[styles.adviceDivider, { backgroundColor: colors.primary + '30' }]} />
            )}
            
            {(language === 'en' || language === 'both') && advice?.english ? (
              <Text style={[styles.adviceTextEn, { color: colors.text, fontSize: fontSize }]}>
                {advice.english}
              </Text>
            ) : null}
          </View>

          <TouchableOpacity 
            style={[styles.readButton, isRead ? styles.readButtonActive : { backgroundColor: colors.primary }]}
            onPress={handleMarkRead}
          >
            <Ionicons 
              name={isRead ? "checkmark-circle" : "checkmark-circle-outline"} 
              size={20} 
              color="white" 
            />
            <Text style={styles.readButtonText}>
              {isRead ? "Completed" : "Mark as Read"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  verseNumber: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  headerActions: {
    flexDirection: 'row',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  shlokaContainer: {
    marginBottom: 15,
  },
  shlokaText: {
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 32,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    marginTop: 10,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 5,
  },
  contentSection: {
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  meaningText: {
    lineHeight: 24,
  },
  adviceCard: {
    marginTop: 25,
    padding: 18,
    borderRadius: 16,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  adviceTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  adviceTextHi: {
    lineHeight: 26,
    fontWeight: '600',
  },
  adviceDivider: {
    height: 1,
    marginVertical: 12,
  },
  adviceTextEn: {
    lineHeight: 22,
    fontStyle: 'italic',
    opacity: 0.85,
  },
  readButton: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  readButtonActive: {
    backgroundColor: '#4CAF50',
  },
  readButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 8,
  },
});
