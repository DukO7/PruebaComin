import * as Linking from 'expo-linking';

const prefix = Linking.createURL('/');

const linking = {
  prefixes: [prefix],
  config: {
    screens: {
        Pasarela: 'Pasarela',
      
    },
  },
};

export default linking;
