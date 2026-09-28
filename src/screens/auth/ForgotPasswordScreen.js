import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";

export const ForgotPasswordScreen = ({ navigation }) => {
    const [emailOrPhone, setEmailOrPhone] = useState('');

    return (
        <LinearGradient
            colors={['#e8faea', '#ffe5ec', '#e8faea']}
            style={styles.container}
        >
            <View style={styles.imageposition}>
                <Image
                    source={require('./../../data/image/LOGO.png')}
                    style={{ width: 250, height: 250 }}
                />
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email / Phone number"
                    placeholderTextColor="#a0a0a0"
                    value={emailOrPhone}
                    onChangeText={setEmailOrPhone}
                />
            </View>

            <View style={styles.buttonGroup}>
                <TouchableOpacity
                    style={styles.pillButton}
                    onPress={() => {
                        navigation.goBack();
                    }}
                >
                    <Text style={styles.buttonText}>Send</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.pillButtonSecondary}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonTextSecondary}>Back</Text>
                </TouchableOpacity>
            </View>

            <StatusBar style="auto" />
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    inputContainer: { width: '85%', marginTop: 15, marginBottom: 15 },
    input: {
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderRadius: 25,
        fontSize: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    buttonGroup: { gap: 10, marginTop: 15 },
    pillButton: {
        backgroundColor: '#fd8888',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 50,
        elevation: 5,
    },
    buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
    pillButtonSecondary: {
        backgroundColor: '#efabc2',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 50,
        elevation: 5,
    },
    buttonTextSecondary: { color: '#000000', fontSize: 16, fontWeight: '600', textAlign: 'center' },
    imageposition: { padding: 10 },
});
