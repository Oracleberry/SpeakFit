import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

interface Word {
  id: string;
  word: string;
  meaning: string;
  example?: string;
}

function VocabularyScreen() {
  const [word, setWord] = useState('');
  const [meaning, setMeaning] = useState('');
  const [example, setExample] = useState('');
  const [savedWords, setSavedWords] = useState<Word[]>([]);

  const handleAddWord = () => {
    if (!word.trim() || !meaning.trim()) {
      Alert.alert('エラー', '単語と意味を入力してください');
      return;
    }

    const newWord: Word = {
      id: Date.now().toString(),
      word: word.trim(),
      meaning: meaning.trim(),
      example: example.trim() || undefined,
    };

    setSavedWords([newWord, ...savedWords]);
    setWord('');
    setMeaning('');
    setExample('');
    Alert.alert('成功', '単語を登録しました');
  };

  const handleDeleteWord = (id: string) => {
    Alert.alert(
      '確認',
      'この単語を削除しますか?',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: () => {
            setSavedWords(savedWords.filter(w => w.id !== id));
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>単語を登録</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>単語</Text>
            <TextInput
              style={styles.input}
              value={word}
              onChangeText={setWord}
              placeholder="例: apple"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>意味</Text>
            <TextInput
              style={styles.input}
              value={meaning}
              onChangeText={setMeaning}
              placeholder="例: りんご"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>例文 (任意)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={example}
              onChangeText={setExample}
              placeholder="例: I like apples."
              placeholderTextColor="#999"
              multiline
              numberOfLines={3}
            />
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddWord}
          >
            <Ionicons name="add-circle-outline" size={24} color="#fff" />
            <Text style={styles.addButtonText}>登録する</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>
            登録済みの単語 ({savedWords.length})
          </Text>

          {savedWords.length === 0 ? (
            <Text style={styles.emptyText}>
              まだ単語が登録されていません
            </Text>
          ) : (
            savedWords.map(item => (
              <View key={item.id} style={styles.wordCard}>
                <View style={styles.wordContent}>
                  <Text style={styles.wordText}>{item.word}</Text>
                  <Text style={styles.meaningText}>{item.meaning}</Text>
                  {item.example && (
                    <Text style={styles.exampleText}>{item.example}</Text>
                  )}
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteWord(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={24} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  addButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  listContainer: {
    padding: 20,
  },
  listTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 20,
  },
  wordCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  wordContent: {
    flex: 1,
  },
  wordText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  meaningText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  exampleText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  deleteButton: {
    padding: 8,
  },
});

export default VocabularyScreen;
