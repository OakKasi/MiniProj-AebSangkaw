import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, FlatList, RefreshControl } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from '../../data/theam';
import { Header } from '../../components/common/Header';

export const UserScreen = ({ navigation }) => {
    const { logout, username } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [balance] = useState(450);
    const [showBalance, setShowBalance] = useState(false);

    const [walletModalVisible, setWalletModalVisible] = useState(false);
    const [orderModalVisible, setOrderModalVisible] = useState(false);

    const displayName = username && username.trim() !== '' ? username : 'User';
    const { user } = useContext(AuthContext);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const userId = user?.id || 1;
        try {
            const response = await fetch(`http://10.0.2.2:8000/api/orders/user/${userId}`);
            const data = await response.json();
            if (response.ok) {

                setOrders(data);
            } else {
                console.error("Fetch  failed", data);
            }

        } catch (error) {
            console.error("Error fetch", error);
        }
    }
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };


    return (
        <LinearGradient colors={['#e8faea', '#ffe5ec', '#e8faea']} style={styles.Gradient}>
            <Header title="หน้าผู้ใช้" subtitle="ข้อมูลส่วนตัว" />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.profileCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {displayName.charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.profileDetails}>
                        <Text style={styles.userName}>{displayName}</Text>
                        <Text style={styles.userRole}>สถานะ: ลูกค้า</Text>
                    </View>
                </View>

                <View style={styles.walletCard}>
                    <View style={styles.walletHeader}>
                        <Text style={styles.walletTitle}>กระเป๋าเงิน (Wallet)</Text>
                        <TouchableOpacity
                            onPress={() => setShowBalance(!showBalance)}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.toggleText}>
                                {showBalance ? 'ซ่อนยอดเงิน' : 'แตะเพื่อดูยอดเงิน'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.balanceBox}
                        onPress={() => setShowBalance(!showBalance)}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.balanceText, !showBalance && styles.balanceBlurred]}>
                            {showBalance ? `฿ ${balance.toFixed(2)}` : '••••••'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => setWalletModalVisible(true)}
                    >
                        <Text style={styles.actionBtnText}>จัดการกระเป๋าเงิน / เติมเงิน</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.menuContainer}>
                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => navigation.navigate('Home')}
                    >
                        <Text style={styles.menuTitle}>สั่งอาหาร (Order Food)</Text>
                        <Text style={styles.menuSub}>เลือกดูรายการอาหารตามสั่งของร้าน</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.menuCard}
                        onPress={() => setOrderModalVisible(true)}
                    >
                        <Text style={styles.menuTitle}>ดูออร์เดอร์ (My Orders)</Text>
                        <Text style={styles.menuSub}>ตรวจสอบสถานะและประวัติการสั่งซื้อ</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.logoutContainer}>
                    <TouchableOpacity style={styles.logoutbuttom} onPress={logout}>
                        <Text style={styles.logoutbuttomtext}>ออกจากระบบ (Logout)</Text>
                    </TouchableOpacity>
                </View>

                <Modal
                    visible={walletModalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>จัดการกระเป๋าเงิน</Text>
                            <Text style={styles.modalSubtitle}>
                                ยอดเงิน: {showBalance ? `฿ ${balance.toFixed(2)}` : '••••••'}
                            </Text>

                            <View style={styles.emptyPlaceholder}>
                                <Text style={styles.emptyPlaceholderText}>
                                    ทำไม่ทันคับ
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setWalletModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal visible={orderModalVisible} animationType="slide" transparent={true}>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>รายการออร์เดอร์</Text>
                            <FlatList
                                style={{ width: '100%' }}
                                contentContainerStyle={{ paddingBottom: 8 }}
                                data={orders}
                                keyExtractor={(item) => item.id.toString()}
                                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                                ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีออเดอร์</Text>}
                                ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
                                renderItem={({ item }) => (
                                    <View style={styles.orderCard}>
                                        <View style={styles.orderHeader}>
                                            <Text style={styles.orderId}>ออเดอร์ #{item.id}</Text>
                                            <Text style={styles.orderStatus}>{item.status}</Text>
                                        </View>
                                        <Text style={styles.orderText}>ยอดรวม: {item.total_price} บาท</Text>
                                        <Text style={styles.orderText}>ประเภท: {item.order_type}</Text>
                                    </View>
                                )}
                            />
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setOrderModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>ปิด</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    Gradient: { flex: 1 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16 },

    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#ffe5ec',
        borderWidth: 1.5,
        borderColor: '#fe9ccb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fe9ccb',
    },
    profileDetails: { flex: 1 },
    userName: { fontSize: 18, fontWeight: 'bold', color: '#333333' },
    userRole: { fontSize: 13, color: '#777777', marginTop: 3 },


    walletCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        marginBottom: 16,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    walletHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    walletTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
    toggleText: { fontSize: 12, color: '#fe9ccb', fontWeight: 'bold' },
    balanceBox: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    balanceText: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fe9ccb',
        letterSpacing: 1,
    },
    balanceBlurred: {
        letterSpacing: 4,
        color: '#aaaaaa',
    },
    actionBtn: {
        backgroundColor: '#fe9ccb',
        paddingVertical: 11,
        borderRadius: 25,
        alignItems: 'center',
    },
    actionBtnText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },


    menuContainer: { gap: 12, marginBottom: 20 },
    menuCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 3,
    },
    menuTitle: { fontSize: 16, fontWeight: 'bold', color: '#333333' },
    menuSub: { fontSize: 12, color: '#777777', marginTop: 4 },

    logoutContainer: { alignItems: 'center', marginTop: 10 },
    logoutbuttom: {
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 50,
        backgroundColor: '#fe9ccb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutbuttomtext: { fontSize: 14, color: '#ffffff', fontWeight: 'bold' },

    // Modals
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        maxHeight: '75%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 22,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 6, color: '#333333' },
    modalSubtitle: { fontSize: 14, color: '#fe9ccb', fontWeight: 'bold', marginBottom: 14 },
    emptyPlaceholder: {
        width: '100%',
        paddingVertical: 35,
        backgroundColor: '#fafafa',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
    },
    emptyPlaceholderText: {
        fontSize: 13,
        color: '#999999',
    },
    closeButton: {
        marginTop: 12,
        paddingVertical: 10,
        paddingHorizontal: 35,
        borderRadius: 50,
        backgroundColor: colors.surface,
    },
    closeButtonText: { fontSize: 14, fontWeight: 'bold', color: '#ffffff' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#888' },
    orderCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    orderStatus: { fontSize: 14, fontWeight: 'bold', color: '#4CAF50' },
    orderText: { fontSize: 14, color: '#555', marginTop: 2 },
});
