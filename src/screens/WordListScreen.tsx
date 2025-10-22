// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   TextInput,
//   View,
//   Text,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   ActivityIndicator,
// } from 'react-native';
// import {
//   addDoc,
//   collection,
//   getDocs,
//   query,
//   orderBy,
//   deleteDoc,
//   doc,
// } from 'firebase/firestore';
// import { db } from '../firebaseConfig';
// import Ionicons from 'react-native-vector-icons/Ionicons';


// interface WordData {
//   id: string;
//   text: string;
//   ipa: string;
//   meaning: string;
//   createdAt: any;
// }

// export default function PracticeScreen() {
//   const [word, setWord] = useState('');
//   const [words, setWords] = useState<WordData[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   useEffect(() => {
//     fetchWords();
//   }, []);

//   const fetchWords = async () => {
//     try {
//       const q = query(collection(db, 'words'), orderBy('createdAt', 'desc'));
//       const snapshot = await getDocs(q);
//       const data = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       })) as WordData[];
//       setWords(data);
//     } catch (e) {
//       console.error('❌ 取得失敗:', e);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAddWord = async () => {
//     const trimmed = word.trim();
//     if (!trimmed) {
//       Alert.alert('入力エラー', '単語を入力してください');
//       return;
//     }

//     try {
//       setSubmitting(true);
//       const [ipa, meaning] = await Promise.all([
//         getIPA(trimmed),
//         getMeaning(trimmed),
//       ]);

//       await addDoc(collection(db, 'words'), {
//         text: trimmed,
//         ipa,
//         meaning,
//         createdAt: new Date(),
//       });

//       Alert.alert('✅ 登録成功', `${trimmed} を追加しました`);
//       setWord('');
//       fetchWords();
//     } catch (e: any) {
//       console.error('❌ 書き込み失敗:', e);
//       Alert.alert('登録失敗', e.message || 'エラーが発生しました');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteWord = async (id: string) => {
//     try {
//       await deleteDoc(doc(db, 'words', id));
//       fetchWords();
//     } catch (e) {
//       console.error('❌ 削除失敗:', e);
//       Alert.alert('削除失敗', 'もう一度お試しください');
//     }
//   };

//   const getIPA = async (word: string): Promise<string | null> => {
//     try {
//       const words = word.trim().split(/\s+/);
//       const ipaParts = await Promise.all(
//         words.map(async (w) => {
//           const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${w}`);
//           const data = await res.json();
//           return data[0]?.phonetics?.find((p: any) => p.text)?.text ?? null;
//         })
//       );
//       return ipaParts.filter(Boolean).join(' ');
//     } catch {
//       return null;
//     }
//   };

//   const getMeaning = async (word: string): Promise<string | null> => {
//     try {
//       const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
//       const data = await res.json();
//       return data[0]?.meanings?.[0]?.definitions?.[0]?.definition ?? null;
//     } catch {
//       return null;
//     }
//   };

//   return (
//     <KeyboardAvoidingView
//       style={styles.container}
//       behavior={Platform.select({ ios: 'padding', android: undefined })}
//     >
//       <Text style={styles.title}>英単語を入力して登録</Text>

//       <View style={styles.inputRow}>
//         <TextInput
//           style={styles.input}
//           placeholder="例: hello"
//           value={word}
//           onChangeText={setWord}
//           editable={!submitting}
//         />
//         <TouchableOpacity onPress={handleAddWord} disabled={submitting}>
//           <Ionicons name="add-circle" size={48} color={submitting ? '#ccc' : '#2f95dc'} />
//         </TouchableOpacity>
//       </View>

//       {loading ? (
//         <ActivityIndicator size="large" color="#2f95dc" />
//       ) : (
//         <ScrollView contentContainerStyle={styles.wordList}>
//           {words.map((item) => (
//             <View key={item.id} style={styles.wordRow}>
//               <View style={styles.wordInfo}>
//                 <Text style={styles.wordText}>{item.text}</Text>
//                 {item.ipa && <Text style={styles.ipaText}>{item.ipa}</Text>}
//               </View>
//               <TouchableOpacity onPress={() => handleDeleteWord(item.id)}>
//                 <Ionicons name="remove-circle" size={28} color="#e74c3c" />
//               </TouchableOpacity>
//             </View>
//           ))}
//         </ScrollView>
//       )}
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     marginBottom: 16,
//     textAlign: 'center',
//   },
//   inputRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginBottom: 20,
//     gap: 8,
//   },
//   input: {
//     flex: 1,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 8,
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     fontSize: 18,
//   },
//   wordList: {
//     paddingBottom: 60,
//   },
//   wordRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingVertical: 10,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//   },
//   wordInfo: {
//     flexDirection: 'column',
//     flex: 1,
//   },
//   wordText: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   ipaText: {
//     fontSize: 16,
//     fontStyle: 'italic',
//     color: '#555',
//   },
// });
