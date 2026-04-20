import { createStackNavigator } from '@react-navigation/stack'
import AddressScreen from '../screens/onboarding/AddressScreen'
import FirstAssetScreen from '../screens/onboarding/FirstAssetScreen'
import WelcomeScreen from '../screens/onboarding/WelcomeScreen'
import type { OnboardingStackParams } from './types'

const Stack = createStackNavigator<OnboardingStackParams>()

export default function OnboardingNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FBF8F1' } }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="FirstAsset" component={FirstAssetScreen} />
    </Stack.Navigator>
  )
}
