import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function UserScreen() {
  const { user, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoPlayEnabled, setAutoPlayEnabled] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'ログアウト',
      'ログアウトしてもよろしいですか？',
      [
        {
          text: 'キャンセル',
          style: 'cancel',
        },
        {
          text: 'ログアウト',
          style: 'destructive',
          onPress: logout,
        },
      ],
      { cancelable: true }
    );
  };

  const SettingItem = ({
    icon,
    title,
    subtitle,
    showSwitch,
    switchValue,
    onSwitchChange,
    onPress,
    showChevron,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    showSwitch?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    onPress?: () => void;
    showChevron?: boolean;
  }) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={showSwitch}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon as any} size={24} color="#007AFF" style={styles.settingIcon} />
        <View style={styles.settingTextContainer}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {showSwitch && (
        <Switch
          value={switchValue}
          onValueChange={onSwitchChange}
          trackColor={{ false: '#E0E0E0', true: '#007AFF' }}
        />
      )}
      {showChevron && (
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* ユーザー情報セクション */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person-circle" size={80} color="#007AFF" />
        </View>
        <Text style={styles.username}>{user}</Text>
        <Text style={styles.userEmail}>user@example.com</Text>
      </View>

      {/* 学習統計 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>練習日数</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>学習単語</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>78%</Text>
          <Text style={styles.statLabel}>平均正解率</Text>
        </View>
      </View>

      {/* 設定セクション */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>学習設定</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="notifications"
            title="通知"
            subtitle="練習のリマインダーを受け取る"
            showSwitch
            switchValue={notificationsEnabled}
            onSwitchChange={setNotificationsEnabled}
          />
          <SettingItem
            icon="volume-high"
            title="音声"
            subtitle="発音ガイドの音声を再生"
            showSwitch
            switchValue={soundEnabled}
            onSwitchChange={setSoundEnabled}
          />
          <SettingItem
            icon="play"
            title="自動再生"
            subtitle="単語を選択時に自動で音声再生"
            showSwitch
            switchValue={autoPlayEnabled}
            onSwitchChange={setAutoPlayEnabled}
          />
        </View>
      </View>

      {/* アカウント設定 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>アカウント</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="person"
            title="プロフィール編集"
            showChevron
            onPress={() => Alert.alert('プロフィール編集', '開発中の機能です')}
          />
          <SettingItem
            icon="lock-closed"
            title="パスワード変更"
            showChevron
            onPress={() => Alert.alert('パスワード変更', '開発中の機能です')}
          />
          <SettingItem
            icon="language"
            title="言語設定"
            subtitle="日本語"
            showChevron
            onPress={() => Alert.alert('言語設定', '開発中の機能です')}
          />
        </View>
      </View>

      {/* その他 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>その他</Text>
        <View style={styles.settingsGroup}>
          <SettingItem
            icon="help-circle"
            title="ヘルプ・サポート"
            showChevron
            onPress={() => Alert.alert('ヘルプ', '開発中の機能です')}
          />
          <SettingItem
            icon="information-circle"
            title="アプリについて"
            subtitle="バージョン 1.0.0"
            showChevron
            onPress={() => Alert.alert('Speak Fit', 'バージョン 1.0.0')}
          />
          <SettingItem
            icon="document-text"
            title="利用規約"
            showChevron
            onPress={() => Alert.alert('利用規約', '開発中の機能です')}
          />
          <SettingItem
            icon="shield-checkmark"
            title="プライバシーポリシー"
            showChevron
            onPress={() => Alert.alert('プライバシーポリシー', '開発中の機能です')}
          />
        </View>
      </View>

      {/* ログアウトボタン */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out" size={20} color="#fff" style={styles.logoutIcon} />
        <Text style={styles.logoutButtonText}>ログアウト</Text>
      </TouchableOpacity>

      <View style={styles.bottomPadding} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatarContainer: {
    marginBottom: 15,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 14,
    color: '#888',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingVertical: 20,
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  settingsGroup: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E0E0E0',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#333',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 12,
    color: '#888',
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#FF3B30',
    marginHorizontal: 16,
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 40,
  },
});
