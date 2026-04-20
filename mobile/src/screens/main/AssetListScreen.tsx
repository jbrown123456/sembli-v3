import { View, Text } from 'react-native'
import { colors } from '../../theme/tokens'

export default function AssetListScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontFamily: 'Inter_600SemiBold', color: colors.ink }}>Assets</Text>
    </View>
  )
}
