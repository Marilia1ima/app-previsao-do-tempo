import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Keyboard, StatusBar, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function App() {
  const [cidade, setCidade] = useState('Fortaleza');
  const [busca, setBusca] = useState('');
  const [dados, setDados] = useState(null);

  async function buscarClima(cidadeNome = cidade) {
    try {
      const response = await fetch(`https://api.hgbrasil.com/weather?key=3f63e20f&city_name=${cidadeNome}`);
      const json = await response.json();
      setDados(json.results);
      setCidade(cidadeNome);
      setBusca('');
      Keyboard.dismiss();
    } catch (error) {
      console.error('Erro ao buscar dados da API:', error);
    }
  }

  useEffect(() => {
    buscarClima();
  }, []);

  const previsaoHoras = [
    { hora: '15:00', temp: '29°C', icone: '🌤️' },
    { hora: '16:00', temp: '26°C', icone: '⛅' },
    { hora: '17:00', temp: '24°C', icone: '☁️' },
    { hora: '18:00', temp: '23°C', icone: '🌧️' },
  ];

  return (
    <LinearGradient colors={['#1e3c72', '#2a5298']} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        <TextInput
          style={styles.input}
          placeholder="Digite a cidade"
          placeholderTextColor="#ccc"
          value={busca}
          onChangeText={setBusca}
          onSubmitEditing={() => buscarClima(busca)}
        />

        {dados && (
          <>
            <Text style={styles.cidade}>
              {dados.city}, {dados.city_name.includes(',') ? dados.city_name.split(',')[1] : 'BR'}
            </Text>

            <Text style={styles.icone}>🌤️</Text>

            <Text style={styles.temperatura}>{dados.temp}°</Text>
            <Text style={styles.maxmin}>
              Max: {dados.forecast[0].max}°   Min: {dados.forecast[0].min}°
            </Text>

            <View style={styles.infoBox}>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>💧</Text>
                <Text style={styles.infoText}>{dados.humidity}%</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>🌬️</Text>
                <Text style={styles.infoText}>{dados.wind_speedy}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoIcon}>☁️</Text>
                <Text style={styles.infoText}>{dados.cloudiness || 'N/A'}</Text>
              </View>
            </View>

            <Text style={styles.today}>Today</Text>

            <FlatList
              data={previsaoHoras}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.lista}
              contentContainerStyle={{ gap: 16, paddingHorizontal: 10 }}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardHora}>{item.hora}</Text>
                  <Text style={styles.cardTemp}>{item.temp}</Text>
                  <Text style={styles.cardIcone}>{item.icone}</Text>
                </View>
              )}
            />

            <View style={styles.nextForecast}>
              <Text style={styles.nextTitle}>Next Forecast</Text>
              <View style={styles.nextCard}>
                <Text style={styles.nextDay}>{dados.forecast[1].weekday}</Text>
                <Text style={styles.nextIcon}>🌦️</Text>
                <Text style={styles.nextTemp}>
                  {dados.forecast[1].min}° / {dados.forecast[1].max}°
                </Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  input: {
    width: '90%',
    backgroundColor: '#ffffff20',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: '#fff',
    marginBottom: 20,
    borderColor: '#fff',
    borderWidth: 1,
  },
  cidade: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '600',
  },
  icone: {
    fontSize: 64,
    marginBottom: 10,
  },
  temperatura: {
    fontSize: 64,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  maxmin: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginBottom: 30,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 20,
    color: '#fff',
  },
  infoText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 16,
  },
  today: {
    fontSize: 20,
    color: '#fff',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
  lista: {
    width: '100%',
    marginBottom: 30,
  },
  card: {
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 12,
    alignItems: 'center',
    width: 95,
    height: 140,
    justifyContent: 'space-between',
  },
  cardHora: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  cardTemp: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  cardIcone: {
    fontSize: 26,
    marginTop: 4,
  },
  nextForecast: {
    width: '90%',
    marginTop: 10,
  },
  nextTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 10,
  },
  nextCard: {
    backgroundColor: '#ffffff20',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  nextDay: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 8,
    fontWeight: '500',
  },
  nextIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  nextTemp: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500',
  },
});

