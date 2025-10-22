import * as React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Ionicons from 'react-native-vector-icons/Ionicons'; // アイコンライブラリのインポート
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import Practice from './src/screens/Practice';
import UserScreen from './src/screens/UserScreen';
import VocabularyScreen from './src/screens/VocabularyScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// 各画面のスタックナビゲーションを作成
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerTitle: 'ホーム' }}
      />
    </Stack.Navigator>
  );
}

function PracticeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Practice"
        component={Practice}
        options={{ headerTitle: '練習' }}
      />
    </Stack.Navigator>
  );
}

function VocabularyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Vocabulary"
        component={VocabularyScreen}
        options={{ headerTitle: '単語帳' }}
      />
    </Stack.Navigator>
  );
}

function UserStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="User"
        component={UserScreen}
        options={{ headerTitle: 'ユーザー' }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            headerShown: false,
            tabBarLabel: 'ホーム',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="PracticeTab"
          component={PracticeStack}
          options={{
            headerShown: false,
            tabBarLabel: '練習',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-mic" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="VocabularyTab"
          component={VocabularyStack}
          options={{
            headerShown: false,
            tabBarLabel: '単語帳',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="UserTab"
          component={UserStack}
          options={{
            headerShown: false,
            tabBarLabel: 'ユーザー',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="ios-person" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  );
}

function AppNavigator() {
  const { isLoggedIn } = useAuth();
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {isLoggedIn ? <MainTabs /> : <LoginScreen />}
    </NavigationContainer>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}

export default App;
