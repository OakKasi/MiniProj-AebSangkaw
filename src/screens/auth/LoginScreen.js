import React, { useContext, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import { AuthContext } from "../../context/AuthContext";
import { loginApi } from "../../services/authApi";

export const LoginScreen = ({ navigation }) => {
    const { login } = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginApi(username, password);
            const userRole = response.role;
            login(userRole, username);
        } catch (error) {
            console.log('Error', error);
            Alert.alert('Error', 'เข้าสู่ระบบไม่สำเร็จ');
        }
    }
    return (
        <LinearGradient
            colors={['#e8faea', '#ffe5ec', '#e8faea']}
            style={styles.container}
        >
            <View style={styles.imageposition}>
                <Image
                    source={require('./../../data/image/LOGO.png')}
                    style={{ width: 300, height: 300 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    placeholderTextColor="#a0a0a0"
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#a0a0a0"
                    secureTextEntry={true}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                />
            </View>
            <TouchableOpacity
                style={[styles.forgotButton]}
                onPress={() => navigation.navigate('ForgotPassword')}
            >
                <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
            <View style={styles.LoginButtom}>
                <TouchableOpacity
                    style={[styles.LoginButtom, styles.pillButton]}
                    onPress={(handleLogin)}
                >
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.LoginButtom, styles.pillButton]}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.LoginButtom, styles.pillButton]}
                onPress={() => login('merchant')}
            >
                <Text style={styles.buttonText}>Login.Dev</Text>
            </TouchableOpacity>

            <StatusBar style="auto" />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 30,
        position: 'absolute',
        top: 50,
        fontWeight: 'bold',
    },
    TL: {
        position: 'absolute',
        top: 50,
        left: 20,
        fontSize: 26
    },
    LoginButtom: {
        gap: 5,
        flexDirection: 'row',
        marginTop: 20,

    },

    pillButton: {
        backgroundColor: '#fd8888',
        paddingVertical: 15,
        paddingHorizontal: 70,
        borderRadius: 50,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    buttonText1: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    pillButton1: {
        backgroundColor: '#d99cf5ff',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 50,
        marginTop: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
    },
    forgotButton: {
        alignSelf: 'flex-end',
        marginRight: '8%',
        marginTop: -20,
        marginBottom: 2,
    },

    forgotText: {
        color: '#777777',
        fontSize: 14,
        fontWeight: '500',
        textDecorationLine: 'underline',
    },
    inputContainer: {
        width: '85%',
        marginBottom: 15,
        marginTop: 15,
    },
    input: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        marginBottom: 15,
        fontSize: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    imageposition: {
        padding: 10,
    },

});