import type { CapacitorConfig } from '@capacitor/cli';

// D-01: appId locked for Play Store registration — do NOT change
// D-02, D-03: appName matches PWA short_name
// D-10: webDir must be 'build' — SvelteKit adapter-static outputs to build/, not dist/
const config: CapacitorConfig = {
  appId: 'io.alchemica.app',
  appName: 'Alchemica',
  webDir: 'build',

  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: '#0d1b2e',  // matches vite.config.ts theme_color
      androidScaleType: 'CENTER_CROP',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0d1b2e',
      overlaysWebView: true,
    },
    AdMob: {
      // Test App ID — replace with real ID from admob.google.com before Play Store submission
      appIdAndroid: 'ca-app-pub-3940256099942544~3347511713',
      isTesting: true,
    },
  },
};

export default config;
