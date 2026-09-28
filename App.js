import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import CustomerNavigator from './src/navigation/CustomerNavigator';
import MerchantNavigator from './src/navigation/MerchantNavigator';
import { useContext } from 'react';

function DefaultApp() {
  const { userToken, userRole } = useContext(AuthContext);
  if (!userToken) {
    return <AuthNavigator />;
  }
  if (userRole === 'merchant') {
    return <MerchantNavigator />;
  } else {
    return <CustomerNavigator />;
  }
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <NavigationContainer>
          <DefaultApp />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
