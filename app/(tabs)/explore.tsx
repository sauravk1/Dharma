import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, Platform, Pressable, FlatList, Modal } from 'react-native';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useGitaData, Verse } from '@/hooks/useGitaData';
import { VerseCard } from '@/components/VerseCard';
import { Search, ChevronRight, ArrowLeft, CheckCircle, BookOpen } from 'lucide-react-native';
import { useProgress } from '@/hooks/useProgress';
import { useTheme } from '@/context/ThemeContext';

const CHAPTERS = [
  { id: 1, title: "Arjuna Vishada Yoga", summary: "Arjun's Dilemma - The confusion before the war." },
  { id: 2, title: "Sankhya Yoga", summary: "Transcendental Knowledge - Soul, Duty, and Wisdom." },
  { id: 3, title: "Karma Yoga", summary: "Path of Action - Doing your duty without attachment." },
  { id: 4, title: "Jnana Karma Sanyasa Yoga", summary: "Path of Knowledge and Discipline." },
  { id: 5, title: "Karma Sanyasa Yoga", summary: "Action with Detachment." },
  { id: 6, title: "Dhyana Yoga", summary: "Path of Meditation - Controlling the mind." },
  { id: 7, title: "Jnana Vijnana Yoga", summary: "Knowledge of the Ultimate Truth." },
  { id: 8, title: "Akshara Brahma Yoga", summary: "The Path to the Eternal." },
  { id: 9, title: "Raja Vidya Guhya Yoga", summary: "The Most Confidential Knowledge." },
  { id: 10, title: "Vibhuti Yoga", summary: "The Infinite Glories of Krishna." },
  { id: 11, title: "Vishwarupa Darshana Yoga", summary: "The Universal Form of God." },
  { id: 12, title: "Bhakti Yoga", summary: "The Path of Devotion." },
  { id: 13, title: "Kshetra Kshetrajna Vibhaga Yoga", summary: "The Field and the Knower." },
  { id: 14, title: "Gunatraya Vibhaga Yoga", summary: "The Three Modes of Nature." },
  { id: 15, title: "Purushottama Yoga", summary: "The Supreme Divine Person." },
  { id: 16, title: "Daivasura Sampad Vibhaga Yoga", summary: "Divine and Demoniac Natures." },
  { id: 17, title: "Shraddhatraya Vibhaga Yoga", summary: "The Three Types of Faith." },
  { id: 18, title: "Moksha Sanyasa Yoga", summary: "Final Liberation - The Essence of Gita." },
];

export default function ExploreScreen() {
  const { data } = useGitaData();
  const { progressPercentage, readCount, totalVerses } = useProgress();
  const { colors } = useTheme();
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReadingMode, setIsReadingMode] = useState(false);

  const filteredVerses = useMemo(() => {
    let result = data;
    if (selectedChapter) {
      result = result.filter(v => v.chapter === selectedChapter);
    }
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter((v) => 
        v.translation.toLowerCase().includes(lowerQuery) || 
        v.shloka.toLowerCase().includes(lowerQuery) ||
        v.connection.toLowerCase().includes(lowerQuery)
      );
    }
    return result;
  }, [searchQuery, data, selectedChapter]);

  const renderChapter = ({ item }: { item: typeof CHAPTERS[0] }) => (
    <Pressable 
      style={({ hovered }) => [
        styles.chapterCard, 
        { backgroundColor: colors.white, borderColor: colors.border },
        hovered && Platform.OS === 'web' && { borderColor: colors.saffron, backgroundColor: colors.sacredSilk }
      ]}
      onPress={() => setSelectedChapter(item.id)}
    >
      <View style={[styles.chapterNumberCircle, { backgroundColor: colors.royalBlue }]}>
        <Text style={styles.chapterNumberText}>{item.id}</Text>
      </View>
      <View style={styles.chapterInfo}>
        <Text style={[styles.chapterTitle, { color: colors.royalBlue }]}>{item.title}</Text>
        <Text style={[styles.chapterSummary, { color: colors.gray }]} numberOfLines={2}>{item.summary}</Text>
      </View>
      <ChevronRight size={20} color={colors.gray} />
    </Pressable>
  );

  const renderVerse = ({ item }: { item: Verse }) => (
    <VerseCard 
      shloka={item.shloka}
      translation={item.translation}
      english={item.english}
      connection={item.connection}
      chapter={item.chapter}
      verse={item.verse}
      alwaysExpanded={isReadingMode}
    />
  );

  return (
    <ResponsiveContainer scrollable={false}>
      {!isReadingMode && (
        <View style={[styles.header, { backgroundColor: colors.cream }]}>
          {selectedChapter ? (
            <View style={styles.chapterHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Pressable onPress={() => setSelectedChapter(null)} style={styles.backBtn}>
                  <ArrowLeft size={24} color={colors.royalBlue} />
                </Pressable>
                <View>
                  <Text style={[styles.headerSubtitle, { color: colors.saffron }]}>Chapter {selectedChapter}</Text>
                  <Text style={[styles.headerTitle, { color: colors.royalBlue }]}>{CHAPTERS.find(c => c.id === selectedChapter)?.title}</Text>
                </View>
              </View>
              <Pressable 
                onPress={() => setIsReadingMode(true)}
                style={[styles.readingModeBtn, { borderColor: colors.saffron }]}
              >
                <BookOpen size={16} color={colors.saffron} />
                <Text style={[styles.readingModeText, { color: colors.saffron }]}>Reading Mode</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.mainHeader}>
              <View>
                <Text style={[styles.headerTitle, { color: colors.royalBlue }]}>Sampoorna Gita</Text>
                <Text style={[styles.headerSubtitle, { color: colors.saffron }]}>Chapterwise Reading</Text>
              </View>
              <View style={styles.progressSection}>
                <View style={styles.progressInfo}>
                  <CheckCircle size={14} color={colors.saffron} style={{ marginRight: 6 }} />
                  <Text style={[styles.progressText, { color: colors.royalBlue }]}>{readCount} / {totalVerses} Mastered</Text>
                </View>
                <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: 'hidden' }}>
                  <View style={{ height: '100%', backgroundColor: colors.saffron, width: `${Math.max(progressPercentage, 2)}%` }} />
                </View>
              </View>
            </View>
          )}

          {!selectedChapter && (
            <View style={[styles.searchContainer, { backgroundColor: colors.white, borderColor: colors.border }]}>
              <Search size={20} color={colors.gray} style={styles.searchIcon} />
              <TextInput 
                style={[styles.searchInput, { color: colors.royalBlue }]}
                placeholder="Search in all verses..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={colors.gray}
              />
            </View>
          )}
        </View>
      )}

      <Modal 
        visible={isReadingMode} 
        animationType="slide" 
        onRequestClose={() => setIsReadingMode(false)}
      >
        <View style={[styles.fullscreenContainer, { backgroundColor: colors.sacredSilk }]}>
          <View style={[styles.readingHeader, { backgroundColor: colors.white, borderBottomColor: colors.border }]}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.readingTitle, { color: colors.royalBlue }]} numberOfLines={1}>
                Chapter {selectedChapter}: {CHAPTERS.find(c => c.id === selectedChapter)?.title}
              </Text>
              <Text style={[styles.readingCount, { color: colors.saffron }]}>{filteredVerses.length} Verses in Focus</Text>
            </View>
            <Pressable 
              onPress={() => setIsReadingMode(false)}
              style={[styles.exitBtn, { backgroundColor: colors.saffron }]}
            >
              <Text style={styles.exitBtnText}>Exit Reading</Text>
            </Pressable>
          </View>

          <FlatList
            data={filteredVerses}
            renderItem={renderVerse}
            keyExtractor={item => `${item.chapter}:${item.verse}`}
            contentContainerStyle={styles.readingListContent}
            showsVerticalScrollIndicator={Platform.OS === 'web'}
          />
        </View>
      </Modal>

      <View style={{ flex: 1 }}>
        {!selectedChapter && !searchQuery ? (
          <FlatList
            data={CHAPTERS}
            renderItem={renderChapter}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <FlatList
            data={filteredVerses}
            renderItem={renderVerse}
            keyExtractor={item => `${item.chapter}:${item.verse}`}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.gray }]}>No verses found.</Text>
              </View>
            }
          />
        )}
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  header: { paddingVertical: 16, zIndex: 10, paddingHorizontal: 20 },
  mainHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end' },
  progressSection: { width: 140, marginBottom: 4 },
  progressInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  progressText: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  headerSubtitle: { fontSize: 14, fontWeight: 'bold', textTransform: 'uppercase' },
  chapterHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { marginRight: 16, padding: 4 },
  readingModeBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8, 
    paddingHorizontal: 12, 
    borderRadius: 20, 
    borderWidth: 1,
    gap: 8
  },
  readingModeText: { fontSize: 12, fontWeight: 'bold' },
  fullscreenContainer: { flex: 1 },
  readingHeader: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  readingTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, marginRight: 16 },
  readingCount: { fontSize: 12, marginTop: 2 },
  exitBtn: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20 },
  exitBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 12 },
  readingListContent: { paddingTop: 24 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, borderWidth: 1, height: 48, marginTop: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, ...Platform.select({ web: { outlineStyle: 'none' } as any }) },
  listContent: { paddingBottom: 24, paddingHorizontal: 20, paddingTop: 16 },
  chapterCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, marginBottom: 12, borderWidth: 1 },
  chapterNumberCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  chapterNumberText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 18, fontWeight: 'bold' },
  chapterSummary: { fontSize: 13, marginTop: 2 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 16, textAlign: 'center' },
});
