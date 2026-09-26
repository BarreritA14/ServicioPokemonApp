import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider } from '../src/context/FavoritesContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#f5f5f5' },
            headerTitleStyle: { fontWeight: '700' },
          }}
        />
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
