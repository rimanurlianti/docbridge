import { Compass, Search, Bookmark } from 'lucide-react-native';
import { Tabs } from 'expo-router';
import { StatusBar, type StatusBarStyle } from 'expo-status-bar';
import { useThemeColor } from 'heroui-native';
import * as Haptics from 'expo-haptics';
const statusBarStyle: StatusBarStyle = 'dark';
export default function TabLayout() {
  const [background, foreground, border, accent, muted] = useThemeColor([
    'background',
    'foreground',
    'border',
    'accent',
    'muted',
  ]);
  return (
    <>
      <StatusBar style={statusBarStyle} />
      <Tabs
        screenListeners={({ navigation, route }) => ({
          tabPress: () => {
            if (navigation.getState().routes[navigation.getState().index]?.key !== route.key)
              void Haptics.selectionAsync();
          },
        })}
        screenOptions={{
          headerShown: false,
          sceneStyle: { backgroundColor: background },
          tabBarStyle: {
            backgroundColor: background,
            borderTopColor: border,
            elevation: 0,
            shadowOpacity: 0,
            height: 78,
            paddingBottom: 16,
            paddingTop: 9,
          },
          tabBarActiveTintColor: accent,
          tabBarInactiveTintColor: muted,
          tabBarLabelStyle: { fontFamily: 'Inter_500Medium', fontSize: 12 },
          headerTintColor: foreground,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Navigate',
            tabBarIcon: ({ color, size }) => (
              <Compass color={color} size={size} strokeWidth={1.8} />
            ),
          }}
        />
        <Tabs.Screen
          name="find"
          options={{
            title: 'Find care',
            tabBarIcon: ({ color, size }) => <Search color={color} size={size} strokeWidth={1.8} />,
          }}
        />
        <Tabs.Screen
          name="plan"
          options={{
            title: 'My plan',
            tabBarIcon: ({ color, size }) => (
              <Bookmark color={color} size={size} strokeWidth={1.8} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
