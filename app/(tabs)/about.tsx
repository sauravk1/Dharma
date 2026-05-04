import React from 'react';
import { View, Text, StyleSheet, Pressable, Linking, Platform, Alert } from 'react-native';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useTheme } from '@/context/ThemeContext';
import { useProgress } from '@/hooks/useProgress';
import { ExternalLink, Info, Mail, MessageCircle, User } from 'lucide-react-native';

export default function AboutScreen() {
  const { colors } = useTheme();
  const { readCount, totalVerses } = useProgress();

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary, borderColor: colors.cream }]}>
            <User size={40} color="#FFF" />
          </View>

          <Text style={[styles.name, { color: colors.primary }]}>Saurav Kumar</Text>

          <Text style={[styles.bio, { color: colors.gray }]}>
            Expert architecting universal bridges between the depth of ancient wisdom and the precision of modern technology.
          </Text>

          <View style={styles.socialGrid}>
            <Pressable
              onPress={() => openLink('mailto:ksaurav325@gmail.com')}
              style={[styles.socialBtn, { backgroundColor: colors.background, borderColor: colors.border }]}
            >
              <Mail size={18} color={colors.primary} />
              <Text style={[styles.socialLabel, { color: colors.text }]}>Email</Text>
            </Pressable>

            <Pressable
              onPress={() => openLink('https://www.linkedin.com/in/saurav-kmr')}
              style={[styles.socialBtn, { backgroundColor: colors.background, borderColor: '#0077B5' }]}
            >
              <ExternalLink size={18} color="#0077B5" />
              <Text style={[styles.socialLabel, { color: '#0077B5' }]}>LinkedIn</Text>
            </Pressable>

            <Pressable
              onPress={() => openLink('https://www.instagram.com/chauhan__saurav')}
              style={[styles.socialBtn, { backgroundColor: colors.background, borderColor: '#E1306C' }]}
            >
              <MessageCircle size={18} color="#E1306C" />
              <Text style={[styles.socialLabel, { color: '#E1306C' }]}>Instagram</Text>
            </Pressable>
          </View>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>The Vision</Text>
          </View>
          <View style={[styles.visionCard, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
            <Text style={[styles.visionText, { color: colors.text }]}>
              Dharma is built with a vision to make the sacred wisdom of the Bhagavad Gita accessible to everyone, everywhere.
              By combining high-performance technology with timeless spiritual insights, we aim to provide a guiding light in the modern world.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.gray }]}>Designed & Developed with ❤️ in India (भारत)</Text>
          <Text style={[styles.devName, { color: colors.primary }]}>Saurav Kumar</Text>
        </View>
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  headerCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: {
    padding: 16,
    borderRadius: 16,
    width: '100%',
  },
  cardIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold' },
  cardValue: { marginTop: 2 },
  bio: { fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 24, fontStyle: 'italic' },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  socialLabel: { fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  section: { marginTop: 32 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  visionCard: {
    padding: 20,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  visionText: { fontSize: 14, lineHeight: 22 },
  footer: { marginTop: 40, alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 14, fontWeight: '600' },
  devName: { fontSize: 12, fontWeight: 'bold', marginTop: 4, letterSpacing: 2, textTransform: 'uppercase' },
});
