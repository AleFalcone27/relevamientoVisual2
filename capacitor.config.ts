import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Relevamiento Visual',
  webDir: 'www',
    plugins: {
    SplashScreen: {
      launchShowDuration: 1000,
      launchAutoHide: false, 
      splashFullScreen: true,
      splashImmersive: true,
      androidScaleType: "CENTER_CROP",
      showSpinner: false
    }},
};

export default config;
