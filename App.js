import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Keyboard, ActivityIndicator } from 'react-native';

export default function App() {
  const [cidade, setCidade] = useState('Recife');
  const [busca, setBusca] = useState('');
  const [dados, setDados] = useState(null);
  const [carregando, setCarregando] = useState(false);

  async function buscarClima() {
    if (!busca.trim()) return;

    setCarregando(true);
    Keyboard.dismiss();

    try {
      const response = await fetch(`https://api.hgbrasil.com/weather?key=3f63e20f&city_name=${busca}`);
      const json = await response.json();
      setDados(json.results);
      setCidade(busca);
      setBusca('');
    } catch (error) {
      console.error("Erro ao buscar clima:", error);
    }

    setCarregando(false);
  }

  useEffect(() => {
    buscarClima(); // busca clima inicial (Recife)
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>☀️ Previsão do Tempo</Text>

      <TextInput
        style={styles.input}
        placeholder="Digite a cidade..."
        value={busca}
        onChangeText={setBusca}
      />

      <TouchableOpacity style={styles.botao} onPress={buscarClima}>
        <Text style={styles.textoBotao}>Buscar</Text>
      </TouchableOpacity>

      {carregando && <ActivityIndicator size="large" color="#00aaff" style={{ marginTop: 20 }} />}

      {dados && (
        <View style={styles.resultado}>
          <Text style={styles.info}>🌆 Cidade: {dados.city}</Text>
          <Text style={styles.info}>🌡️ Temperatura: {dados.temp}°C</Text>
          <Text style={styles.info}>🌤️ Condição: {dados.description}</Text>
          <Text style={styles.info}>💧 Umidade: {dados.humidity}%</Text>
          <Text style={styles.info}>🌬️ Vento: {dados.wind_speedy}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d0e8f2',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
    paddingHorizontal: 20
  },
  titulo: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333'
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  botao: {
    backgroundColor: '#00aaff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 10
  },
  textoBotao: {
    color: '#fff',
    fontSize: 16
  },
  resultado: {
    marginTop: 30,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5
  },
  info: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333'
  }
});
