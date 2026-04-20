import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Pressable, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import ChatScreen from '../screens/main/ChatScreen'
import DashboardScreen from '../screens/main/DashboardScreen'
import { colors } from '../theme/tokens'
import AssetsNavigator from './AssetsNavigator'
import OutlookNavigator from './OutlookNavigator'
import type { MainTabParams } from './types'
import { HomeIcon, ChatIcon, GridIcon, CalendarIcon } from '../components/TabIcons'

const Tab = createBottomTabNavigator<MainTabParams>()

export default function MainTabNavigator() {
  const insets = useSafeAreaInsets()

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 56 + insets.bottom,
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          paddingTop: 10,
          paddingBottom: insets.bottom,
        },
        tabBarActiveTintColor: colors.ink,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontFamily: 'Inter_400Regular',
          fontSize: 10,
          marginTop: 3,
        },
        tabBarButton: (props) => <Pressable {...(props as any)} android_ripple={null} />,
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        options={{ tabBarIcon: ({ color }) => <HomeIcon color={color} /> }}
      />
      <Tab.Screen
        name="Ask"
        component={ChatScreen}
        options={{ tabBarIcon: ({ color }) => <ChatIcon color={color} /> }}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsNavigator}
        options={{ tabBarIcon: ({ color }) => <GridIcon color={color} /> }}
      />
      <Tab.Screen
        name="Outlook"
        component={OutlookNavigator}
        options={{ tabBarLabel: 'Outlook', tabBarIcon: ({ color }) => <CalendarIcon color={color} /> }}
      />
    </Tab.Navigator>
  )
}
