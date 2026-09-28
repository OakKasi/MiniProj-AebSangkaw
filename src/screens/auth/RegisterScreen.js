
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, Image, View, TextInput, TouchableOpacity, BackHandler, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { registerApi } from '../../services/authApi';

export const RegisterScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmpassword, setConfirmpassword] = useState('');
    const [phonenumber, setPhonenumber] = useState('');

    const handleRegister = async() =>{
        if (!username || !password || !phonenumber) {
            Alert.alert("ผิดพลาด","ข้อมูลผิด");
            return;
        }
        if (password !== confirmpassword) {
            Alert.alert("ผิดพลาด","พาสเวิร์ดไม่ตรงกัน");
            return;
        }
        try {
            await registerApi(username,password,phonenumber);
            Alert.alert("สำเร็จ",'สมัครสำเร็จ')
            navigation.navigate("Login")
        } catch (error) {
            Alert.alert("ผิดพลาด",'ข้อมูลผิดพลาดหรือซ้ำในระบบ')
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
                <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#a0a0a0"
                    secureTextEntry={true}
                    value={confirmpassword}
                    onChangeText={(text) => setConfirmpassword(text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Number"
                    placeholderTextColor="#a0a0a0"
                    keyboardType="phone-pad"
                    value={phonenumber}
                    onChangeText={(text) => setPhonenumber(text)}
                />
            </View>
            <View style={styles.LoginButtom}>
                <TouchableOpacity
                    style={styles.pillButton}
                    onPress={(handleRegister)}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.pillButtonSecondary}
                    onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.buttonTextSecondary}>Back</Text>
                </TouchableOpacity>
            </View>


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
        fontSize: 36,
        position: 'absolute',
        top: 50,
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
        marginTop: 25,

    },

    pillButton: {
        backgroundColor: '#fd8888',
        paddingVertical: 15,
        paddingHorizontal: 40,
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
        backgroundColor: '#efabc2',
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
    RegisterButtom: {
        gap: 5,
        flexDirection: 'row',
        marginTop: 25,

    },
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
