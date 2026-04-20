import { createStackNavigator } from '@react-navigation/stack'
import AssetDetailScreen from '../screens/main/AssetDetailScreen'
import AssetListScreen from '../screens/main/AssetListScreen'
import type { AssetsStackParams } from './types'

const Stack = createStackNavigator<AssetsStackParams>()

export default function AssetsNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, cardStyle: { backgroundColor: '#FBF8F1' } }}>
      <Stack.Screen name="AssetList" component={AssetListScreen} />
      <Stack.Screen name="AssetDetail" component={AssetDetailScreen} />
    </Stack.Navigator>
  )
}
