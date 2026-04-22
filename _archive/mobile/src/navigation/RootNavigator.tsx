import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import MainTabNavigator from './MainTabNavigator'
import OnboardingNavigator from './OnboardingNavigator'
import type { RootStackParams } from './types'

const Stack = createStackNavigator<RootStackParams>()

// Temporary: always show onboarding first until auth is wired up
const isOnboarded = false

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FBF8F1' } }}>
        {isOnboarded ? (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingNavigator} />
            <Stack.Screen name="Main" component={MainTabNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
