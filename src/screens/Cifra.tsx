import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground,
  View,
  TouchableOpacity,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import harpa from '../../assets/harpa.json';

type RootStackParamList = { Harpa: undefined; Cifra: { id: number } };
type CifraRouteProp = RouteProp<RootStackParamList, 'Cifra'>;

const chordRegex = /\b([A-G](?:#|b)?m?(?:[0-9])?(?:\/[A-G](?:#|b)?)?)\b/g;
const CHORDS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const EQUIV: Record<string, string> = {
  'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#',
  'C#': 'C#', 'D#': 'D#', 'F#': 'F#', 'G#': 'G#', 'A#': 'A#'
};
const FLAT_EQUIV: Record<string, string> = {
  'A#': 'Bb'
};

function transposeChord(chord: string, shift: number): string {
  const m = chord.match(/^([A-G](?:#|b)?)(.*?)(?:\/([A-G](?:#|b)?))?$/);
  if (!m) return chord;
  let [, root, suffix = '', bass] = m;
  const normRoot = EQUIV[root] || root;
  const rootIdx = CHORDS.indexOf(normRoot);
  if (rootIdx < 0) return chord;
  const newRootRaw = CHORDS[(rootIdx + shift + 12) % 12];
  const newRoot = FLAT_EQUIV[newRootRaw] || newRootRaw;
  let newBass = '';
  if (bass) {
    const normBass = EQUIV[bass] || bass;
    const bassIdx = CHORDS.indexOf(normBass);
    if (bassIdx >= 0) {
      const newBassRaw = CHORDS[(bassIdx + shift + 12) % 12];
      newBass = '/' + (FLAT_EQUIV[newBassRaw] || newBassRaw);
    }
  }
  return newRoot + suffix + newBass;
}

function detectKey(cifra: string[]): string | null {
  for (const line of cifra) {
    const match = line.match(chordRegex);
    if (match && match.length > 0) {
      const firstChord = match[0];
      const rootMatch = firstChord.match(/^([A-G](#|b)?)/);
      if (rootMatch) {
        const root = rootMatch[0];
        return EQUIV[root] || root;
      }
    }
  }
  return null;
}

export default function Cifra({ route }: { route: CifraRouteProp }) {
  const hymn = harpa.find(h => h.id === route.params.id);
  const [transpose, setTranspose] = useState(0);

  if (!hymn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Hino não encontrado.</Text>
      </SafeAreaView>
    );
  }

  if (!hymn.cifra || hymn.cifra.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyState}>
          <ImageBackground
            source={require('../../assets/not_found.png')}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </SafeAreaView>
    );
  }

  const originalKey = detectKey(hymn.cifra) || 'C';
  const [selectedKey, setSelectedKey] = useState(originalKey);

  const handleKeyChange = (newKey: string) => {
    const index = CHORDS.indexOf(originalKey);
    const newIndex = CHORDS.indexOf(EQUIV[newKey] || newKey);
    const diff = newIndex - index;
    setTranspose(diff);
    setSelectedKey(newKey);
  };

  const renderLine = (line: string, index: number) => {
    const parts = line.split(chordRegex);
    return (
      <Text key={index} style={styles.line}>
        {parts.map((part, i) => {
          const isChord = part.match(chordRegex);
          const transposed = isChord ? transposeChord(part, transpose) : part;
          return (
            <Text key={i} style={isChord ? styles.chord : undefined}>
              {transposed}
            </Text>
          );
        })}
      </Text>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>{hymn.name}</Text>

          <View style={styles.headerContent}>
             
             <View style={styles.autoScrollContent}>
                <Text></Text>
             </View>
            {/* Troca de Tom */}
            <View style={styles.transposeButtons}>
              <TouchableOpacity onPress={() => {
                const newT = transpose - 1;
                setTranspose(newT);
                const index = CHORDS.indexOf(originalKey);
                const newKey = CHORDS[(index + newT + 12) % 12];
                setSelectedKey(FLAT_EQUIV[newKey] || newKey);
              }}>
                <Text style={styles.transposeButton}>–</Text>
              </TouchableOpacity>

              <View style={styles.pickerWrapper}>
                <Text style={styles.transposeLabel}>Tom: {selectedKey}</Text>
                <Picker
                  selectedValue={selectedKey}
                  onValueChange={handleKeyChange}
                  style={styles.inlinePicker}
                  mode="dropdown"
                >
                  {CHORDS.map(key => (
                    <Picker.Item
                      key={key}
                      label={FLAT_EQUIV[key] || key}
                      value={FLAT_EQUIV[key] || key}
                    />
                  ))}
                </Picker>
              </View>

              <TouchableOpacity onPress={() => {
                const newT = transpose + 1;
                setTranspose(newT);
                const index = CHORDS.indexOf(originalKey);
                const newKey = CHORDS[(index + newT + 12) % 12];
                setSelectedKey(FLAT_EQUIV[newKey] || newKey);
              }}>
                <Text style={styles.transposeButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {hymn.cifra.map(renderLine)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { paddingVertical: 20, paddingHorizontal: 8 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  line: {
    fontFamily: 'monospace',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  chord: {
    fontWeight: 'bold',
    color: '#2a9df4',
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: { flex: 1 },
  image: {
    width: '100%',
    padding: 16,
    height: '100%',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 12,
  },
  autoScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  transposeButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  transposeButton: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2a9df4',
    paddingHorizontal: 12,
  },
  transposeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  pickerWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  inlinePicker: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    color: 'black',
    backgroundColor: 'transparent',
    opacity: 0,
  },
});
