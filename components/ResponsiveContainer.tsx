import React from 'react';
import { View, StyleSheet, useWindowDimensions, Platform, ScrollView } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  scrollable?: boolean;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({ children, scrollable = true }) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isLargeScreen = width > 800;

  const content = (
    <View style={[
      styles.content,
      isLargeScreen && [styles.largeScreenContent, { 
        borderColor: colors.border, 
        backgroundColor: colors.white 
      }],
      { minHeight: '100%' }
    ]}>
      {children}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.sacredSilk }]}>
      {scrollable ? (
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={Platform.OS === 'web'}
        >
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 16,
  },
  largeScreenContent: {
    maxWidth: 1200,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
});
