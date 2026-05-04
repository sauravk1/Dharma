import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { Sparkles } from 'lucide-react-native';

interface ChatBubbleProps {
  message: string;
  isKrishna?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isKrishna = true }) => {
  const { colors } = useTheme();
  const { fontSize } = useSettings();

  return (
    <View style={[styles.container, isKrishna ? styles.krishnaContainer : styles.userContainer]}>
      {isKrishna && (
        <View style={styles.avatarRow}>
          <View style={[styles.avatarCircle, { backgroundColor: colors.saffron }]}>
            <Text style={{ fontSize: 16 }}>🪶</Text>
          </View>
          <Text style={[styles.sender, { color: colors.saffron }]}>Krishna Ji</Text>
        </View>
      )}
      <View style={[
        styles.bubble, 
        isKrishna 
          ? [styles.krishnaBubble, { backgroundColor: colors.white, borderColor: colors.saffron + '33' }] 
          : [styles.userBubble, { backgroundColor: colors.royalBlue }]
      ]}>
        {isKrishna && (
          <Sparkles size={12} color={colors.saffron} style={styles.sparkleIcon} />
        )}
        <Text style={[styles.text, isKrishna ? { color: colors.royalBlue } : { color: '#FFF' }, { fontSize, lineHeight: fontSize * 1.5 }]}>
          {message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    maxWidth: '85%',
  },
  krishnaContainer: {
    alignSelf: 'flex-start',
    paddingLeft: 10,
  },
  userContainer: {
    alignSelf: 'flex-end',
    paddingRight: 10,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 2,
  },
  avatarCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  sender: {
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  bubble: {
    padding: 14,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 1,
    position: 'relative',
  },
  krishnaBubble: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  sparkleIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
});
