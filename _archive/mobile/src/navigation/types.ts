import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native'
import type { StackScreenProps } from '@react-navigation/stack'

export type OnboardingStackParams = {
  Welcome: undefined
  Address: undefined
  FirstAsset: undefined
}

export type MainTabParams = {
  Home: undefined
  Ask: undefined
  Assets: NavigatorScreenParams<AssetsStackParams>
  Outlook: NavigatorScreenParams<OutlookStackParams>
}

export type AssetsStackParams = {
  AssetList: undefined
  AssetDetail: { assetId: string }
}

export type OutlookStackParams = {
  Timeline: undefined
  Invite: undefined
}

export type RootStackParams = {
  Onboarding: NavigatorScreenParams<OnboardingStackParams>
  Main: NavigatorScreenParams<MainTabParams>
}

export type RootStackScreenProps<T extends keyof RootStackParams> =
  StackScreenProps<RootStackParams, T>

export type OnboardingScreenProps<T extends keyof OnboardingStackParams> =
  CompositeScreenProps<
    StackScreenProps<OnboardingStackParams, T>,
    RootStackScreenProps<keyof RootStackParams>
  >

export type MainTabScreenProps<T extends keyof MainTabParams> =
  CompositeScreenProps<
    BottomTabScreenProps<MainTabParams, T>,
    RootStackScreenProps<keyof RootStackParams>
  >
