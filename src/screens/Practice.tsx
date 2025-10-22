import React, { useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Recorder, Player } from 'react-native-audio-toolkit';
import Tts from 'react-native-tts';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const WORD_LIST = [
  'hello',
  'goodbye',
  'thank you',
  'sorry',
  'yes',
  'no',
  'please',
  'baseball',
  'driver',
  'enough',
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

const normalize = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '');

export default function PracticeScreen() {
 const recorder = useRef(new Recorder('path_to_audio_file')).current; // `Recorder` インスタンス
  const player = useRef(new Player('path_to_audio_file')).current; // `Player` インスタンス

  const [status, setStatus] = useState('');
  const [diffResult, setDiffResult] = useState<DiffResult[]>([]);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const recordingRef = useRef<string | null>(null);
  const [targetPhrase, setTargetPhrase] = useState(WORD_LIST[0]);
  const [ipaList, setIpaList] = useState<(string | null)[]>([]);
  const [wordListIpa, setWordListIpa] = useState<(string | null)[]>([]);

  const handleRecordingToggle = async () => {
    if (isRecording) {
      // 録音停止
      const result = await recorder.stop();
      recorder.removeRecordBackListener();
      setIsRecording(false);
      isRecordingRef.current = false;
      setStatus('録音停止');

      const transcribed = await transcribeWithWhisper(result);
      const diffed = await getDiffTextIPA(targetPhrase, transcribed);

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
      await recorder.prepare((err) => {
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

      Tts.setDefaultPitch(1.1);
      Tts.setDefaultLanguage('en-US');

      Tts.speak(targetPhrase);
    } catch (error) {
      console.error('再生エラー:', error);
      setStatus('音が鳴りませんでした');
    }
  };

  const getIPA = async (word: string): Promise<string | null> => {
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );
      const data = await res.json();
      return data[0]?.phonetics?.find((p: any) => p.text)?.text ?? null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const results = await Promise.all(WORD_LIST.map(w => getIPA(w)));
      setWordListIpa(results);
    })();
  }, []);

  useEffect(() => {
    if (diffResult.length === 0) return;
    (async () => {
      const results = await Promise.all(
        diffResult.map(item => getIPA(item.word)),
      );
      setIpaList(results);
    })();
  }, [diffResult]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.wordContainer}>
          <View
            style={{ flexDirection: 'row', flexWrap: 'wrap', minHeight: 40 }}
          >
            {(diffResult[0]?.chars || targetPhrase.split('')).map(
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

          {ipaList[0] && <Text style={styles.ipaText}>IPA: {ipaList[0]}</Text>}
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

      <View style={{ marginTop: 12 }}>
        {accuracy !== null ? (
          <Text style={styles.accuracyInline}>🎯 {accuracy}%</Text>
        ) : (
          <Text style={styles.accuracyInline}>🎯 --%</Text>
        )}
      </View>

      <View style={styles.wordList}>
        {WORD_LIST.map((item, index) => (
          <TouchableOpacity
            key={item}
            style={styles.wordRow}
            onPress={() => {
              setTargetPhrase(item);
              setDiffResult([]);
              setAccuracy(null);
              setIpaList([]);
              recordingRef.current = null;
              setStatus('');
            }}
          >
            <Text style={styles.wordItem}>{item}</Text>
            <Text style={styles.wordIpa}>
              {wordListIpa[index] ? wordListIpa[index] : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {status ? <Text>{status}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    width: 200,
  },
  ipaText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
    marginTop: 4,
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
  },
  wordList: {
    marginTop: 20,
    width: '100%',
  },
  wordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  wordItem: {
    fontSize: 18,
  },
  wordIpa: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#888',
  },
});
