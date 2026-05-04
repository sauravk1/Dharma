import { ResponsiveContainer } from '@/components/ResponsiveContainer';
import { useTheme } from '@/context/ThemeContext';
import { ExternalLink, Info, Mail, MessageCircle, User } from 'lucide-react-native';
import React from 'react';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';

export default function AboutScreen() {
  const { colors } = useTheme();
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ResponsiveContainer>
      <View style={styles.container}>
        {/* Header Card */}
        <View style={[styles.headerCard, { backgroundColor: colors.white, borderColor: colors.border }]}>
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.royalBlue, borderColor: colors.cream }]}>
            <User size={40} color="#FFF" />
          </View>

          <Text style={[styles.name, { color: colors.royalBlue }]}>Saurav Kumar</Text>

          <Text style={[styles.bio, { color: colors.gray }]}>
            Expert architecting universal bridges between the depth of ancient wisdom and the precision of modern technology.
          </Text>

          <View style={styles.socialGrid}>
            <Pressable
              onPress={() => openLink('mailto:ksaurav325@gmail.com')}
              style={[styles.socialBtn, { backgroundColor: colors.sacredSilk, borderColor: colors.border }]}
            >
              <Mail size={18} color={colors.royalBlue} />
              <Text style={[styles.socialLabel, { color: colors.text }]}>Email</Text>
            </Pressable>

            <Pressable
              onPress={() => openLink('https://www.linkedin.com/in/saurav-kmr?utm_source=share_via&utm_content=profile&utm_medium=member_ios')}
              style={[styles.socialBtn, styles.linkedinBtn, { backgroundColor: colors.sacredSilk }]}
            >
              <ExternalLink size={18} color="#0077B5" />
              <Text style={[styles.socialLabel, { color: '#0077B5' }]}>LinkedIn</Text>
            </Pressable>

            <Pressable
              onPress={() => openLink('https://www.instagram.com/chauhan__saurav?igsh=MTJicTB1OXJ5cHdjNg%3D%3D&utm_source=qr')}
              style={[styles.socialBtn, { backgroundColor: colors.sacredSilk, borderColor: colors.border }]}
            >
              <MessageCircle size={18} color="#E1306C" />
              <Text style={[styles.socialLabel, { color: colors.text }]}>Instagram</Text>
            </Pressable>
          </View>
        </View>

        {/* Vision Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Info size={20} color={colors.saffron} />
            <Text style={[styles.sectionTitle, { color: colors.royalBlue }]}>The Vision</Text>
          </View>
          <View style={[styles.visionCard, { backgroundColor: colors.white, borderLeftColor: colors.saffron }]}>
            <Text style={[styles.visionText, { color: colors.text }]}>
              Dharma is built with a vision to make the sacred wisdom of the Bhagavad Gita accessible to everyone, everywhere.
              By combining high-performance technology with timeless spiritual insights, we aim to provide a guiding light in the modern world.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: colors.gray }]}>Designed & Developed with ❤️ in India (भारत)</Text>
          <Text style={[styles.devName, { color: colors.saffron }]}>Saurav Kumar</Text>
        </View>
      </View>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 20 },
  headerCard: {
    borderRadius: 24,
    padding: 30,
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
    marginBottom: 20,
    borderWidth: 4,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  bio: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 30, fontStyle: 'italic' },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  linkedinBtn: {
    borderColor: '#0077B5',
  },
  socialLabel: { fontSize: 13, fontWeight: 'bold', marginLeft: 8 },
  section: { marginTop: 40 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  visionCard: {
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  visionText: { fontSize: 15, lineHeight: 22 },
  footer: { marginTop: 60, alignItems: 'center', paddingBottom: 20 },
  footerText: { fontSize: 16, fontWeight: '700' },
  devName: { fontSize: 14, fontWeight: '900', marginTop: 6, letterSpacing: 2, textTransform: 'uppercase' },
});
