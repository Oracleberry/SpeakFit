import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { Recorder, Player } from 'react-native-audio-toolkit';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Tts from 'react-native-tts';

const IPA_DATA = [
  // 母音 (Vowels)
  { type: 'vowel', ipa: '/iː/', example: 'see', description: '長いイー' },
  { type: 'vowel', ipa: '/ɪ/', example: 'sit', description: '短いイ' },
  { type: 'vowel', ipa: '/e/', example: 'set', description: 'エ' },
  { type: 'vowel', ipa: '/æ/', example: 'cat', description: 'アェ' },
  { type: 'vowel', ipa: '/ɑː/', example: 'father', description: '長いアー' },
  { type: 'vowel', ipa: '/ʌ/', example: 'cup', description: '短いア' },
  { type: 'vowel', ipa: '/ɒ/', example: 'hot', description: 'オ' },
  { type: 'vowel', ipa: '/ɔː/', example: 'law', description: '長いオー' },
  { type: 'vowel', ipa: '/ʊ/', example: 'foot', description: '短いウ' },
  { type: 'vowel', ipa: '/uː/', example: 'food', description: '長いウー' },
  { type: 'vowel', ipa: '/ɜː/', example: 'bird', description: '巻き舌のアー' },
  {
    type: 'vowel',
    ipa: '/ə/',
    example: 'ago',
    description: '曖昧なア（シュワ）',
  },
  { type: 'vowel', ipa: '/eɪ/', example: 'day', description: 'エイ' },
  { type: 'vowel', ipa: '/aɪ/', example: 'my', description: 'アイ' },
  { type: 'vowel', ipa: '/ɔɪ/', example: 'boy', description: 'オイ' },
  { type: 'vowel', ipa: '/aʊ/', example: 'now', description: 'アウ' },
  { type: 'vowel', ipa: '/əʊ/', example: 'go', description: 'オウ' },
  { type: 'vowel', ipa: '/ɪə/', example: 'here', description: 'イア' },
  { type: 'vowel', ipa: '/eə/', example: 'there', description: 'エア' },
  { type: 'vowel', ipa: '/ʊə/', example: 'tour', description: 'ウア' },

  // 子音 (Consonants)
  { type: 'consonant', ipa: '/p/', example: 'pen', description: '無声音のパ' },
  { type: 'consonant', ipa: '/b/', example: 'bed', description: '有声音のバ' },
  { type: 'consonant', ipa: '/t/', example: 'top', description: '無声音のタ' },
  { type: 'consonant', ipa: '/d/', example: 'dog', description: '有声音のダ' },
  { type: 'consonant', ipa: '/k/', example: 'key', description: '無声音のカ' },
  { type: 'consonant', ipa: '/g/', example: 'go', description: '有声音のガ' },
  { type: 'consonant', ipa: '/f/', example: 'fish', description: '無声音のフ' },
  { type: 'consonant', ipa: '/v/', example: 'van', description: '有声音のヴ' },
  {
    type: 'consonant',
    ipa: '/θ/',
    example: 'think',
    description: '無声音のス（舌歯）',
  },
  {
    type: 'consonant',
    ipa: '/ð/',
    example: 'this',
    description: '有声音のズ（舌歯）',
  },
  { type: 'consonant', ipa: '/s/', example: 'sun', description: '無声音のス' },
  { type: 'consonant', ipa: '/z/', example: 'zoo', description: '有声音のズ' },
  {
    type: 'consonant',
    ipa: '/ʃ/',
    example: 'she',
    description: '無声音のシュ',
  },
  {
    type: 'consonant',
    ipa: '/ʒ/',
    example: 'vision',
    description: '有声音のジュ',
  },
  { type: 'consonant', ipa: '/h/', example: 'he', description: '無声音のハ' },
  {
    type: 'consonant',
    ipa: '/tʃ/',
    example: 'check',
    description: '無声音のチ',
  },
  {
    type: 'consonant',
    ipa: '/dʒ/',
    example: 'just',
    description: '有声音のヂュ',
  },
  { type: 'consonant', ipa: '/m/', example: 'man', description: 'マ行' },
  { type: 'consonant', ipa: '/n/', example: 'no', description: 'ナ行' },
  { type: 'consonant', ipa: '/ŋ/', example: 'sing', description: 'ング' },
  {
    type: 'consonant',
    ipa: '/l/',
    example: 'leg',
    description: 'ラ行（舌先）',
  },
  {
    type: 'consonant',
    ipa: '/r/',
    example: 'red',
    description: 'ラ行（巻き舌）',
  },
  { type: 'consonant', ipa: '/j/', example: 'yes', description: 'ヤ行' },
  { type: 'consonant', ipa: '/w/', example: 'we', description: 'ワ行' },
];

const WHISPER_API_URL =
  'https://whisper-api-807946521207.asia-northeast1.run.app/transcribe';

interface CharEval {
  char: string;
  correct: boolean | null;
}
interface DiffResult {
  word: string;
  correct: boolean;
  similarity: number;
  chars: CharEval[];
}

console.log("aaaaa")
const normalize = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '');

export default function HomeScreen() {
const recorder = useRef(new Recorder('path_to_audio_file')).current;
const player = useRef(new Player('path_to_audio_file')).current;
  const [selected, setSelected] = useState(IPA_DATA[0]);
  const [status, setStatus] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const recordingRef = useRef<string | null>(null);

const handleRecordingToggle = async () => {
    if (isRecording) {
      // 録音停止
      const result = await recorder.stop();
      recorder.removeRecordBackListener();
      setIsRecording(false);
      isRecordingRef.current = false;
      setStatus('録音停止');

      // Whisper API に送信
      const transcribed = await transcribeWithWhisper(result);
      const diffed = await getDiffTextIPA(selected.example, transcribed);

      setDiffResult(diffed);

      const correctCount = diffed.reduce(
        (acc, d) => acc + d.chars.filter(c => c.correct).length,
        0,
      );
      const totalCount = diffed.reduce((acc, d) => acc + d.chars.length, 0);
      const percent =
        totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

      setAccuracy(percent);
      setStatus('');
    } else {
      setStatus('録音中...');
      setIsRecording(true);
      isRecordingRef.current = true;
      await safeStopTts();
      const path = 'path_to_audio_file'; // 録音するファイルのパス
      await recorder.prepare((err:any) => {
        if (err) {
          console.error('録音準備エラー:', err);
        } else {
          recorder.record();
        }
      });
      recordingRef.current = path;
      // 3秒後に自動停止
      setTimeout(async () => {
        if (isRecordingRef.current) {
          await handleRecordingToggle();
        }
      }, 3000);
    }
  };

  const transcribeWithWhisper = async (uri: string): Promise<string> => {
    const formData = new FormData();
    formData.append('file', {
      uri,
      name: 'recording.m4a',
      type: 'audio/m4a',
    } as unknown as Blob);

    const res = await fetch(WHISPER_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('転送エラー');
    const data = await res.json();
    return data.text;
  };

  const getDiffTextIPA = async (
    correct: string,
    spoken: string,
  ): Promise<DiffResult[]> => {
    const nCorrect = normalize(correct).replace(/\s+/g, '');
    const nSpoken = normalize(spoken).replace(/\s+/g, '');

    const chars: CharEval[] = nCorrect.split('').map((char, i) => {
      const match = nSpoken[i]?.toLowerCase() === char.toLowerCase();
      return { char, correct: !!match };
    });

    const correctCount = chars.filter(c => c.correct).length;
    const similarity = correctCount / nCorrect.length;

    return [{ word: correct, correct: similarity >= 0.6, similarity, chars }];
  };

  const safeStopTts = async () => {
    try {
      await Tts.stop();
    } catch (e) {
      console.warn('Tts.stop() failed:', e);
    }
  };

  const playTargetPhrase = async () => {
    try {
      await safeStopTts(); // 前の再生を停止
      await new Promise(resolve => setTimeout(resolve, 300)); // 少し待つ

      // Tts.setDefaultRate(0.5);
      Tts.setDefaultPitch(1.1);
      Tts.setDefaultLanguage('en-US');

      Tts.speak(selected.example);
    } catch (error) {
      console.error('再生エラー:', error);
      setStatus('音が鳴りませんでした');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.wordContainer}>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 40 }}
          >
            {(diffResult[0]?.chars || selected.example.split('')).map(
              (charObj: any, i: number) => (
                <Text
                  key={i}
                  style={{
                    fontSize: 32,
                    fontWeight: '700',
                    color:
                      typeof charObj === 'string'
                        ? '#2c3e50'
                        : charObj.correct
                        ? '#2ecc71'
                        : '#e74c3c',
                  }}
                >
                  {typeof charObj === 'string' ? charObj : charObj.char}
                </Text>
              ),
            )}
          </View>
          <Text style={styles.ipaText}>IPA: {selected.ipa}</Text>
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={playTargetPhrase}
          >
            <FontAwesome name="volume-up" size={20} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlButton,
              isRecording ? styles.stop : styles.start,
            ]}
            onPress={handleRecordingToggle}
          >
            <FontAwesome
              name={isRecording ? 'stop' : 'microphone'}
              size={20}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.accuracyInline}>
        🎯 {accuracy !== null ? `${accuracy}%` : '--%'}
      </Text>

      <FlatList
        style={{ flexGrow: 0, height: 500 }}
        data={IPA_DATA}
        keyExtractor={item => item.example}
        numColumns={4}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.rowWrapper}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.gridItem,
              selected.example === item.example && styles.selectedItem,
            ]}
            onPress={() => {
              setSelected(item);
              setDiffResult([]);
              setAccuracy(null);
              setStatus('');
            }}
          >
            <Text style={styles.gridText}>{item.example}</Text>
            <Text style={styles.gridIPA}>{item.ipa}</Text>
          </TouchableOpacity>
        )}
      />

      {status ? <Text style={{ marginTop: 10 }}>{status}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#f6f9fc',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 10,
  },
  wordContainer: {
    alignItems: 'center',
    marginRight: 12,
    width: 160,
  },
  ipaText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 0,
  },
  buttonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlButton: {
    backgroundColor: '#34495e',
    padding: 10,
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  start: {
    backgroundColor: '#2980b9',
  },
  stop: {
    backgroundColor: '#c0392b',
  },
  accuracyInline: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2ecc71',
    alignSelf: 'center',
    marginBottom: 16,
  },
  gridContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowWrapper: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  gridItem: {
    width: 75,
    height: 75,
    backgroundColor: '#ecf0f1',
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  selectedItem: {
    backgroundColor: '#3498db',
    borderColor: '#2980b9',
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#2c3e50',
  },
  gridIPA: {
    fontSize: 12,
    color: '#7f8c8d',
  },
});
