import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ChatBubbleProps {
  message: string;
  isKrishna?: boolean;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, isKrishna = true }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, isKrishna ? styles.krishnaContainer : styles.userContainer]}>
      {isKrishna && <Text style={[styles.sender, { color: colors.saffron }]}>Krishna</Text>}
      <View style={[
        styles.bubble, 
        isKrishna ? [styles.krishnaBubble, { backgroundColor: colors.white, borderColor: colors.saffron + '33' }] : [styles.userBubble, { backgroundColor: colors.royalBlue }]
      ]}>
        <Text style={[styles.text, isKrishna ? { color: colors.royalBlue } : { color: '#FFF' }]}>
          {isKrishna ? `Dost, Krishna kehte hain... \n\n${message}` : message}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    maxWidth: '92%',
  },
  krishnaContainer: {
    alignSelf: 'flex-start',
  },
  userContainer: {
    alignSelf: 'flex-end',
  },
  sender: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 12,
    marginBottom: 4,
  },
  bubble: {
    padding: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  krishnaBubble: {
    borderTopLeftRadius: 4,
    borderWidth: 1,
  },
  userBubble: {
    borderTopRightRadius: 4,
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
});
