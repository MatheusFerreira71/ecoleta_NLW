import React, { useState, useEffect } from 'react';
import { View, Image, ImageBackground, StyleSheet, Text } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import { UF } from '../../UF';
import Axios from 'axios';
import { Cidade } from '../../Cidade';

interface SelectItems {
  label: string,
  value: string
}
const Home = () => {
  const navigation = useNavigation();

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      city: selectedCity,
      uf: selectedUF
    });
  }

  const [ufs, setUfs] = useState<SelectItems[]>([]);
  const [cities, setCities] = useState<SelectItems[]>([]);
  const [selectedUF, setSelectedUf] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const handleSelectUf = (value: string) => {
    setSelectedUf(value);
    setSelectedCity('0');
  }

  const handleSelectCity = (value: string) => {
    setSelectedCity(value);
  }

  useEffect(() => {
    Axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
      const ufInitials = response.data.map(initial => {
        return { label: initial.sigla, value: initial.sigla }
      });
      setUfs(ufInitials.sort((a, b) => {

        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }));
    })
  }, []);

  useEffect(() => {
    Axios.get<Cidade[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
      const citiesNames = response.data.map(initial => {
        return { label: initial.nome, value: initial.nome }
      });
      setCities(citiesNames.sort((a, b) => {

        if (a.label > b.label) {
          return 1;
        }
        if (a.label < b.label) {
          return -1;
        }
        // a must be equal to b
        return 0;
      }));
    })
  }, [selectedUF]);

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
        <Text style={styles.description}>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</Text>
      </View>

      <View style={styles.footer}>
        <RNPickerSelect
          onValueChange={(value) => handleSelectUf(value)}
          items={ufs}
          placeholder={{ label: "Selecione sua UF", value: '0' }}
        />
        <RNPickerSelect
          onValueChange={(value) => handleSelectCity(value)}
          items={cities}
          placeholder={{ label: "Selecione sua Cidade", value: '0' }}
        />
        <RectButton
          style={styles.button}
          onPress={handleNavigateToPoints}
          enabled={(selectedUF === '0' || selectedCity === '0') ? false : true}
        >
          <View style={styles.buttonIcon}>
            <Text>
              <Icon name="arrow-right" color="#fff" size={24} />
            </Text>
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 24,
    fontSize: 16,
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;