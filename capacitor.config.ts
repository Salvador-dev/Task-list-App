import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.appTasks',
  appName: 'Task-list App',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
