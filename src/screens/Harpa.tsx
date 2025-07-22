import React from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import harpa from '../../assets/harpa.json';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = { Harpa: undefined; Cifra: { id: number } };
type NavProp = NativeStackNavigationProp<RootStackParamList, 'Harpa'>;

export default function Harpa() {
  const navigation = useNavigation<NavProp>();
  const renderItem = ({ item }: { item: { id: number; name: string } }) => (
    <Pressable
      style={({ pressed }) => [
        styles.item,
        pressed && styles.itemPressed,
      ]}
      android_ripple={{ color: '#eee' }}
      onPress={() => navigation.navigate('Cifra', { id: item.id })}
    >
      <View style={styles.numeroContainer}>
        <Text style={styles.numero}>{item.id}</Text>
      </View>
      <Text style={styles.titulo} numberOfLines={1}>
        {item.name}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={harpa}
        keyExtractor={item => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 52,
    backgroundColor: '#f6f7f9',
  },
  listContent: {
    padding: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginVertical: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 10,
    // Sombra iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    // Elevação Android
    elevation: 2,
  },
  itemPressed: {
    opacity: 0.7,
  },
  numeroContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  numero: {
    fontWeight: '700',
    fontSize: 16,
    color: '#2a9df4',
  },
  titulo: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
});
