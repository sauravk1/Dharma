import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Moon, Sun } from 'lucide-react-native';

export const ThemeToggle = () => {
  const { theme, toggleTheme, colors } = useTheme();

  return (
    <Pressable 
      onPress={toggleTheme} 
      style={({ pressed }) => [
        styles.toggle, 
        { 
          backgroundColor: colors.white, 
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1
        }
      ]}
    >
      {theme === 'light' ? (
        <Moon size={20} color={colors.royalBlue} />
      ) : (
        <Sun size={20} color={colors.saffron} />
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  toggle: {
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
