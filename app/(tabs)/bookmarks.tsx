import React, { useMemo } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useGitaData } from '@/hooks/useGitaData';
import { useBookmarks } from '@/hooks/useBookmarks';
import { VerseCard } from '@/components/VerseCard';
import { Bookmark } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

export default function BookmarksScreen() {
  const { data } = useGitaData();
  const { bookmarks } = useBookmarks();
  const { colors } = useTheme();

  const bookmarkedVerses = useMemo(() => {
    return data.filter(v => bookmarks.includes(`${v.chapter}:${v.verse}`));
  }, [data, bookmarks]);

  return (
    <ResponsiveContainer scrollable={false}>
      <View style={[styles.header, { backgroundColor: colors.cream }]}>
        <Text style={[styles.headerTitle, { color: colors.royalBlue }]}>Saved Gyan</Text>
        <Text style={[styles.headerSubtitle, { color: colors.saffron }]}>{bookmarkedVerses.length} verses bookmarked</Text>
      </View>

      <View style={{ flex: 1 }}>
        {bookmarkedVerses.length > 0 ? (
          <FlatList
            data={bookmarkedVerses}
            renderItem={({ item }) => (
              <VerseCard 
                shloka={item.shloka}
                translation={item.translation}
                english={item.english}
                connection={item.connection}
                chapter={item.chapter}
                verse={item.verse}
              />
            )}
            keyExtractor={item => `${item.chapter}:${item.verse}`}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Bookmark size={60} color={colors.gray} style={{ opacity: 0.3, marginBottom: 20 }} />
            <Text style={[styles.emptyTitle, { color: colors.royalBlue }]}>No bookmarks yet</Text>
            <Text style={[styles.emptyText, { color: colors.gray }]}>
              Gita ke shlokas ko bookmark karein taaki aap unhe baad mein padh sakein.
            </Text>
          </View>
        )}
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
});
