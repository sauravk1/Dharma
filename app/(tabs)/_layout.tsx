import { Tabs, useRouter, usePathname } from 'expo-router';
import React from 'react';
import { Platform, View, Text, StyleSheet, Pressable, useWindowDimensions } from 'react-native';
import { Home, BookOpen, MessageCircle, Bookmark, User, Settings } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function TabLayout() {
  const { width } = useWindowDimensions();
  const { colors } = useTheme();
  const isWeb = Platform.OS === 'web';
  const showSidebar = isWeb && width > 800;
  const router = useRouter();
  const pathname = usePathname();

  const Sidebar = () => (
    <View style={[styles.sidebar, { backgroundColor: colors.white, borderRightColor: colors.border }]}>
      <View style={styles.sidebarHeader}>
        <Text style={[styles.sidebarTitle, { color: colors.royalBlue }]}>Dharma</Text>
        <View style={{ marginTop: 20 }}>
          <ThemeToggle />
        </View>
      </View>
      <View style={styles.sidebarNav}>
        {[
          { name: 'Home', path: '/', icon: Home },
          { name: 'Krishna Chat', path: '/chat', icon: MessageCircle },
          { name: 'Sampoorna Gita', path: '/explore', icon: BookOpen },
          { name: 'Bookmarks', path: '/bookmarks', icon: Bookmark },
          { name: 'Settings', path: '/settings', icon: Settings },
        ].map((item) => {
          const isActive = pathname === item.path;
          return (
            <Pressable
              key={item.path}
              onPress={() => router.push(item.path as any)}
              style={[
                styles.navItem, 
                isActive && [styles.navItemActive, { backgroundColor: colors.royalBlue }]
              ]}
            >
              <item.icon size={24} color={isActive ? "#FFF" : colors.royalBlue} />
              <Text style={[
                styles.navText, 
                { color: colors.royalBlue },
                isActive && { color: "#FFF" }
              ]}>{item.name}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, flexDirection: 'row', backgroundColor: colors.sacredSilk }}>
      {showSidebar && <Sidebar />}
      <View style={{ flex: 1 }}>
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: colors.royalBlue,
            tabBarInactiveTintColor: colors.gray,
            headerShown: !showSidebar,
            headerStyle: {
              backgroundColor: colors.white,
            },
            headerTitleStyle: {
              color: colors.royalBlue,
              fontWeight: 'bold',
            },
            headerRight: () => (
              <View style={{ marginRight: 15, marginTop: Platform.OS === 'web' ? 0 : -8 }}>
                <ThemeToggle />
              </View>
            ),
            tabBarStyle: showSidebar ? { display: 'none' } : {
              backgroundColor: colors.white,
              borderTopColor: colors.border,
              ...Platform.select({
                web: { height: 60, paddingBottom: 10 },
                ios: { height: 90 },
                android: { height: 70, paddingBottom: 10 }
              })
            },
          }}>
          <Tabs.Screen
            name="index"
            options={{
              title: 'Home',
              tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="chat"
            options={{
              title: 'Krishna Chat',
              tabBarIcon: ({ color, size }) => <MessageCircle size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="explore"
            options={{
              title: 'Sampoorna Gita',
              tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="bookmarks"
            options={{
              title: 'Saved',
              tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
            }}
          />
          <Tabs.Screen
            name="about"
            options={{
              href: null, // This hides the tab completely from the bar
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              title: 'Settings',
              tabBarIcon: ({ color, size }) => <Settings size={size} color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 280,
    borderRightWidth: 1,
    padding: 24,
  },
  sidebarHeader: {
    marginBottom: 40,
  },
  sidebarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  sidebarNav: {
    flex: 1,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  navItemActive: {},
  navText: {
    marginLeft: 16,
    fontSize: 16,
    fontWeight: '600',
  },
});
