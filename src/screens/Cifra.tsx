import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  ImageBackground,
  View,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import harpa from '../../assets/harpa.json';

type RootStackParamList = { Harpa: undefined; Cifra: { id: number } };
type CifraRouteProp = RouteProp<RootStackParamList, 'Cifra'>;

const chordRegex = /\b([A-G](?:#|b)?m?(?:[0-9])?(?:\/[A-G](?:#|b)?)?)\b/g;

export default function Cifra({ route }: { route: CifraRouteProp }) {
  const hymn = harpa.find(h => h.id === route.params.id);

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

  const renderLine = (line: string, index: number) => {
    const parts = line.split(chordRegex);

    return (
      <Text key={index} style={styles.line}>
        {parts.map((part, i) => {
          const isChord = part.match(chordRegex);
          return (
            <Text key={i} style={isChord ? styles.chord : undefined}>
              {part}
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
          {hymn.cifra.map(renderLine)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)', // opcional
  },
  image: {
    width: '100%',
    padding: 16,
    height: '100%'
  },
  content: { 
    paddingVertical: 20, 
    paddingHorizontal: 8
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
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
  emptyState: {
    flex: 1
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
  }
});
