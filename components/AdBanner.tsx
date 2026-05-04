import React from 'react';
import { View, Platform } from 'react-native';

// Use a safe import for native ads
let BannerAd: any = null;
let BannerAdSize: any = null;
let TestIds: any = null;

if (Platform.OS !== 'web') {
  try {
    const Ads = require('react-native-google-mobile-ads');
    BannerAd = Ads.BannerAd;
    BannerAdSize = Ads.BannerAdSize;
    TestIds = Ads.TestIds;
  } catch (e) {
    console.log('Ads module not found (normal in Expo Go)');
  }
}

const adUnitId = __DEV__
  ? (TestIds?.ADAPTIVE_BANNER || 'test')
  : Platform.OS === 'android'
    ? 'ca-app-pub-9527281344063943/3919523732' 
    : 'ca-app-pub-xxxxxxxxxxxxxxxx/xxxxxxxxxx';

export const AdBanner = () => {
  if (Platform.OS === 'web' || !BannerAd) {
    return <View style={{ height: 0 }} />;
  }

  return (
    <View style={{ alignItems: 'center', marginVertical: 10, minHeight: 50 }}>
      <BannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};
