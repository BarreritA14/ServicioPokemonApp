import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FavoritesProvider } from '../src/context/FavoritesContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <FavoritesProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#0b1020' },
            headerTintColor: '#f8fafc',
            headerTitleStyle: { fontWeight: '700', color: '#f8fafc' },
            contentStyle: { backgroundColor: '#0b1020' },
          }}
        />
      </FavoritesProvider>
    </SafeAreaProvider>
  );
}
