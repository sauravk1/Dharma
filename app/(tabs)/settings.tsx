import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/context/ThemeContext';
import { useSettings } from '@/context/SettingsContext';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useProgress } from '@/hooks/useProgress';
import { ResponsiveContainer } from '@/components/ResponsiveContainer';

export default function SettingsScreen() {
  const { colors, theme, toggleTheme } = useTheme();
  const { 
    fontSize, 
    updateFontSize, 
    language,
    updateLanguage,
    hapticsEnabled, 
    toggleHaptics, 
    remindersEnabled, 
    toggleReminders,
    resetSettings
  } = useSettings();

  const { clearBookmarks } = useBookmarks();
  const { clearProgress } = useProgress();

  const handleClearData = () => {
    Alert.alert(
      "Clear All Data?",
      "This will permanently delete all your bookmarks, reading progress, and reset settings to default. This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Clear Everything", style: "destructive", onPress: async () => {
          try {
            await clearBookmarks();
            await clearProgress();
            await resetSettings();
            Alert.alert("Success", "All app data has been cleared.");
          } catch (e) {
            Alert.alert("Error", "Failed to clear some data.");
          }
        }}
      ]
    );
  };

  return (
    <ResponsiveContainer>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        
        {/* Appearance Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Appearance</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name={theme === 'dark' ? "moon" : "sunny"} size={20} color={colors.primary} />
                </View>
                <Text style={[styles.rowText, { color: colors.text }]}>Dark Mode</Text>
              </View>
              <Switch 
                value={theme === 'dark'} 
                onValueChange={toggleTheme}
                trackColor={{ false: "#767577", true: colors.primary }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.column}>
              <View style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                    <Ionicons name="text" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.rowText, { color: colors.text }]}>Font Size ({fontSize})</Text>
                </View>
              </View>
              <View style={styles.fontSizeControls}>
                {[14, 16, 18, 20, 22].map((size) => (
                  <TouchableOpacity 
                    key={size}
                    onPress={() => updateFontSize(size)}
                    style={[
                      styles.sizeButton, 
                      { borderColor: fontSize === size ? colors.primary : colors.border },
                      fontSize === size && { backgroundColor: colors.primary + '10' }
                    ]}
                  >
                    <Text style={{ color: fontSize === size ? colors.primary : colors.text, fontSize: 14 }}>A</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Application Language</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="language" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.rowText, { color: colors.text }]}>Selected Language</Text>
              </View>
            </View>
            <View style={styles.languageControls}>
              {[
                { id: 'hi', label: 'Hindi', icon: 'ॐ' },
                { id: 'en', label: 'English', icon: 'A' },
                { id: 'both', label: 'Bilingual', icon: 'A/ॐ' }
              ].map((lang) => (
                <TouchableOpacity 
                  key={lang.id}
                  onPress={() => updateLanguage(lang.id as any)}
                  style={[
                    styles.langButton, 
                    { borderColor: language === lang.id ? colors.primary : colors.border },
                    language === lang.id && { backgroundColor: colors.primary + '10' }
                  ]}
                >
                  <Text style={[styles.langIcon, { color: language === lang.id ? colors.primary : colors.gray }]}>{lang.icon}</Text>
                  <Text style={[styles.langLabel, { color: language === lang.id ? colors.primary : colors.gray }]}>{lang.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Preferences</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="notifications" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.rowText, { color: colors.text }]}>Daily 7 AM Wisdom</Text>
              </View>
              <Switch 
                value={remindersEnabled} 
                onValueChange={toggleReminders}
                trackColor={{ false: "#767577", true: colors.primary }}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.row}>
              <View style={styles.rowLeft}>
                <View style={[styles.iconBox, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="pulse" size={20} color={colors.primary} />
                </View>
                <Text style={[styles.rowText, { color: colors.text }]}>Haptic Feedback</Text>
              </View>
              <Switch 
                value={hapticsEnabled} 
                onValueChange={toggleHaptics}
                trackColor={{ false: "#767577", true: colors.primary }}
              />
            </View>
          </View>
        </View>

        {/* Privacy Policy Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Privacy Policy</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 18 }]}>
            <Text style={[styles.privacyHeading, { color: colors.text }]}>1. Data Collection</Text>
            <Text style={[styles.privacyText, { color: colors.gray }]}>
              Dharma is designed as a "No-Data-Collection" app. We do not require account registration, and we do not collect your name, email, or contact information.
            </Text>

            <Text style={[styles.privacyHeading, { color: colors.text }]}>2. Local Storage</Text>
            <Text style={[styles.privacyText, { color: colors.gray }]}>
              All your spiritual progress, including bookmarks, read verses, and Krishna Chat history, is stored exclusively on your device using local storage. This data never leaves your phone.
            </Text>

            <Text style={[styles.privacyHeading, { color: colors.text }]}>3. Third-Party Services</Text>
            <Text style={[styles.privacyText, { color: colors.gray }]}>
              We use standard services like Google AdMob to display advertisements and Expo for app functionality. These services may collect anonymous device identifiers to provide their services.
            </Text>

            <Text style={[styles.privacyHeading, { color: colors.text }]}>4. User Rights</Text>
            <Text style={[styles.privacyText, { color: colors.gray }]}>
              You have complete control over your data. You can delete all locally stored information at any time using the "Reset" button below.
            </Text>

            <TouchableOpacity 
              style={[styles.resetButton, { backgroundColor: '#FF3B3010', borderColor: '#FF3B3030' }]} 
              onPress={handleClearData}
            >
              <Ionicons name="trash" size={18} color="#FF3B30" />
              <Text style={styles.resetButtonText}>Reset All App Data</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal Disclaimer Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Legal Disclaimer</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 18 }]}>
            <Text style={[styles.privacyText, { color: colors.gray }]}>
              The content provided in Dharma is for informational purposes only. The spiritual advice is an interpretation and should not be taken as professional advice. Use this app as a tool for self-reflection and personal growth.
            </Text>
          </View>
        </View>

        {/* Developer Profile Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>Developer</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 20, alignItems: 'center' }]}>
            <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primary, borderColor: colors.white }]}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
            <Text style={[styles.devName, { color: colors.primary }]}>Saurav Kumar</Text>
            <Text style={[styles.devBio, { color: colors.gray }]}>
              Architecting universal bridges between ancient wisdom and modern technology.
            </Text>
            
            <View style={styles.socialGrid}>
              <TouchableOpacity 
                onPress={() => Linking.openURL('mailto:ksaurav325@gmail.com')}
                style={[styles.socialBtn, { borderColor: colors.border }]}
              >
                <Ionicons name="mail" size={18} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => Linking.openURL('https://www.linkedin.com/in/saurav-kmr')}
                style={[styles.socialBtn, { borderColor: '#0077B5' }]}
              >
                <Ionicons name="logo-linkedin" size={18} color="#0077B5" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => Linking.openURL('https://www.instagram.com/chauhan__saurav')}
                style={[styles.socialBtn, { borderColor: '#E1306C' }]}
              >
                <Ionicons name="logo-instagram" size={18} color="#E1306C" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.versionText, { color: colors.gray }]}>Dharma v1.0.0 (Stable Build)</Text>
          <Text style={[styles.footerTag, { color: colors.primary }]}>Designed for Peace 🕉️</Text>
        </View>
      </ScrollView>
    </ResponsiveContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 13, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10, marginLeft: 4 },
  card: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  column: { padding: 15 },
  iconBox: { width: 34, height: 34, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  rowText: { fontSize: 15, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#eee', marginHorizontal: 15 },
  fontSizeControls: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, gap: 8 },
  sizeButton: { flex: 1, height: 40, borderRadius: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  privacyHeading: { fontSize: 14, fontWeight: '700', marginBottom: 4, marginTop: 10 },
  privacyText: { fontSize: 13, lineHeight: 19 },
  resetButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 20 },
  resetButtonText: { color: '#FF3B30', fontSize: 14, fontWeight: '700', marginLeft: 8 },
  footer: { alignItems: 'center', marginTop: 20 },
  versionText: { fontSize: 12, fontWeight: '600' },
  footerTag: { fontSize: 11, fontWeight: '700', marginTop: 4, textTransform: 'uppercase', letterSpacing: 1 },
  avatarPlaceholder: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  devName: { fontSize: 20, fontWeight: 'bold', marginBottom: 6 },
  devBio: { fontSize: 13, textAlign: 'center', lineHeight: 18, marginBottom: 16, paddingHorizontal: 10 },
  socialGrid: { flexDirection: 'row', gap: 12 },
  socialBtn: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, justifyContent: 'center', alignItems: 'center' },
  languageControls: { flexDirection: 'row', gap: 8, padding: 15, paddingTop: 0 },
  langButton: { flex: 1, paddingVertical: 12, alignItems: 'center', borderRadius: 12, borderWidth: 1 },
  langIcon: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  langLabel: { fontSize: 12, fontWeight: '700' },
});
