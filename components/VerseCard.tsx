import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform, Share } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Typography } from '@/constants/theme';
import { Bookmark, BookmarkCheck, CheckCircle, Share2 } from 'lucide-react-native';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useProgress } from '@/hooks/useProgress';
import { useSettings } from '@/context/SettingsContext';
import { useTheme } from '@/context/ThemeContext';

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
  shloka, translation, english, connection, chapter, verse, alwaysExpanded = false 
}) => {
  const [isExpanded, setIsExpanded] = React.useState(alwaysExpanded);
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const { readVerses, toggleProgress } = useProgress();
  const { fontSize } = useSettings();
  const { colors } = useTheme();
  const verseId = `${chapter}:${verse}`;
  const bookmarked = isBookmarked(verseId);
  const isRead = readVerses.includes(verseId);

  React.useEffect(() => {
    if (alwaysExpanded) setIsExpanded(true);
  }, [alwaysExpanded]);

  const handleExpand = () => {
    if (alwaysExpanded) return;
    const nextState = !isExpanded;
    setIsExpanded(nextState);
    if (nextState && !isRead) {
      toggleProgress(verseId);
    }
  };

  const handleMarkRead = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    toggleProgress(verseId);
  };

  const handleBookmark = (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    toggleBookmark(verseId);
  };

  const handleShare = async (e: any) => {
    e.stopPropagation();
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    try {
      const shareMessage = 
        `✨ *Srimad Bhagavad Gita* ✨\n` +
        `📖 *Chapter ${chapter}, Verse ${verse}*\n\n` +
        `🕉️ *Shloka:*\n${shloka}\n\n` +
        `📝 *English:*\n${english}\n\n` +
        `🇮🇳 *Hindi Translation:*\n${translation}\n\n` +
        `🙏 *Krishna's Advice:*\n${connection}\n\n` +
        `— Shared via *Dharma App* 🪷`;

      await Share.share({
        message: shareMessage,
        title: `Gita ${chapter}:${verse}`,
      });
    } catch (e) {}
  };

  return (
    <View style={[
      styles.card, 
      { backgroundColor: colors.white, borderColor: colors.border },
      alwaysExpanded && [styles.cardFlat, { borderColor: colors.saffron + '44' }]
    ]}>
      <View style={styles.cardHeader}>
        <Text style={[styles.meta, { color: colors.gray }]}>Chapter {chapter}, Verse {verse}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Pressable onPress={handleShare} style={styles.readBtn}>
            <Share2 size={18} color={colors.gray} />
          </Pressable>
          <Pressable onPress={handleMarkRead} style={styles.readBtn}>
            <CheckCircle 
              size={20} 
              color={isRead ? '#4CAF50' : colors.gray} 
              fill={isRead ? '#4CAF50' : 'transparent'} 
            />
          </Pressable>
          <Pressable onPress={handleBookmark} style={styles.bookmarkBtn}>
            {bookmarked ? (
              <BookmarkCheck size={20} color={colors.saffron} fill={colors.saffron} />
            ) : (
              <Bookmark size={20} color={colors.gray} />
            )}
          </Pressable>
        </View>
      </View>
      <Text style={[styles.shloka, { color: colors.royalBlue, fontSize: fontSize + 2 }]}>{shloka}</Text>
      <View style={[styles.divider, { backgroundColor: colors.saffron }]} />
      
      <Text style={[styles.hinglish, { color: colors.royalBlue, fontSize: fontSize + 1 }]}>{english}</Text>
      
      {isExpanded && (
        <View style={styles.expandedContent}>
          <Text style={[styles.hindiTitle, { color: colors.saffron }]}>Hindi Translation</Text>
          <Text style={[styles.translation, { color: colors.text, fontSize: fontSize }]}>{translation}</Text>
          
          <View style={[styles.connectionSection, { borderTopColor: colors.border }]}>
            <Text style={[styles.connectionTitle, { color: colors.saffron }]}>Krishna's Advice</Text>
            <Text style={[styles.connectionText, { color: colors.text, fontSize: fontSize - 1 }]}>{connection}</Text>
          </View>
        </View>
      )}

      {!alwaysExpanded && (
        <Pressable 
          onPress={handleExpand}
          style={({ hovered }) => [
            styles.expandButton,
            { backgroundColor: colors.lightGray },
            hovered && Platform.OS === 'web' && { backgroundColor: colors.border }
          ]}
        >
          <Text style={[styles.expandButtonText, { color: colors.royalBlue }]}>
            {isExpanded ? 'Hide Details' : 'Explore More'}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardFlat: {
    shadowOpacity: 0,
    elevation: 0,
    borderWidth: 1.5,
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bookmarkBtn: { padding: 6, marginLeft: 4 },
  readBtn: { padding: 6, marginRight: 4 },
  meta: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase' },
  shloka: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    fontStyle: Typography.sanskrit.fontStyle,
    marginBottom: 12,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    width: '40%',
    alignSelf: 'center',
    marginVertical: 12,
    opacity: 0.3,
  },
  translation: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: Typography.hinglish.fontFamily,
  },
  hinglish: {
    fontSize: 17,
    lineHeight: 26,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  hindiTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  connectionSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  expandedContent: { marginTop: 16 },
  connectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  connectionText: {
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  expandButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  expandButtonText: {
    fontWeight: '600',
    fontSize: 13,
  },
});
