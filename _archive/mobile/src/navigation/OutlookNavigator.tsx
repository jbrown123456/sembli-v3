import { createStackNavigator } from '@react-navigation/stack'
import InviteScreen from '../screens/main/InviteScreen'
import TimelineScreen from '../screens/main/TimelineScreen'
import type { OutlookStackParams } from './types'

const Stack = createStackNavigator<OutlookStackParams>()

export default function OutlookNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FBF8F1' } }}>
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="Invite" component={InviteScreen} />
    </Stack.Navigator>
  )
}
