import { View, Text, StyleSheet } from 'react-native';

export default function Listas() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Minhas Listas de Louvor 📝</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});
