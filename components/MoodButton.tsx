import React from 'react';
import { Text, StyleSheet, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface MoodButtonProps {
  mood: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export const MoodButton: React.FC<MoodButtonProps> = ({ mood, onPress, icon }) => {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';
  const buttonWidth = width > 800 ? '23%' : '48%';

  return (
    <Pressable 
      onPress={onPress}
      style={({ hovered, pressed }) => [
        styles.button,
        { 
          width: buttonWidth as any,
          backgroundColor: colors.white,
          borderColor: colors.border
        },
        hovered && isWeb && [styles.buttonHovered, { backgroundColor: colors.cream, borderColor: colors.saffron }],
        pressed && styles.buttonPressed
      ]}
    >
      {icon}
      <Text style={[styles.text, { color: colors.royalBlue }]}>{mood}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonHovered: {
    transform: [{ translateY: -2 }],
  },
  buttonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
  },
});
