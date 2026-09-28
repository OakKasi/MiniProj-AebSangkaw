import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, RefreshControl, Modal } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { LinearGradient } from "expo-linear-gradient";
import { Header } from '../../components/common/Header';
import { colors } from '../../data/theam';

export const DashboardScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [peakTime, setPeakTime] = useState(0);



    const fetchOrders = async () => {
        try {
            const response = await fetch("http://10.0.2.2:8000/api/orders/");
            const data = await response.json();
            setOrders(data);
        } catch (error) {
            console.error("Error fetching orders:", error);
        }
    }

    useEffect(() => {
        fetchOrders();
        // ดึงข้อมูลออเดอร์อัตโนมัติทุกๆ 4 วินาที เพื่อให้แม่เห็นทันทีเวลาลูกค้าจ่ายเงิน
        const interval = setInterval(() => {
            fetchOrders();
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const handleConfirmPaid = async (orderId) => {
        try {
            await fetch(`http://10.0.2.2:8000/api/orders/${orderId}/status?status=paid`, {
                method: 'PUT',
            });
            fetchOrders();
        } catch (error) {
            console.error("Error confirming paid:", error);
        }
    };

    const handleCompleteOrder = async (orderId) => {
        try {
            await fetch(`http://10.0.2.2:8000/api/orders/${orderId}/status?status=completed`, {
                method: 'PUT',
            });
            fetchOrders();
        } catch (error) {
            console.error("Error update status:", error);
        }
    }

    const handleDeleteOrder = async (orderId) => {
        try {
            await fetch(`http://10.0.2.2:8000/api/orders/${orderId}/`, {
                method: 'DELETE',
            });
            fetchOrders();
        } catch (error) {
            console.error("Error deleting Order:")
        }
    }
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchOrders();
        setRefreshing(false);
    };
    return (
        <LinearGradient colors={['#e8faea', '#ffe5ec', '#e8faea']} style={styles.Gradient}>
            <Header title="หน้าแม่ - จัดการออเดอร์" subtitle="รายการคำสั่งซื้อ" />
            <View style={styles.container}>
                <View style={styles.row}>
                    <TouchableOpacity style={styles.logoutbuttom} onPress={() => setModalVisible(true)}>
                        <Text style={styles.logoutbuttomtext}>ตั้งเวลา</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.logoutbuttom} onPress={logout}>
                        <Text style={styles.logoutbuttomtext}>Logout</Text>
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>ตั้งค่าเวลา</Text>


                            <View style={{ marginVertical: 10, marginHorizontal: 10 }}>
                                <TouchableOpacity style={styles.logoutbuttom} onPress={() => setPeakTime(15)}>
                                    <Text style={styles.logoutbuttomtext}>ตั้งเวลา 15 นาที</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.logoutbuttom} onPress={() => setPeakTime(20)}>
                                    <Text style={styles.logoutbuttomtext}>ตั้งเวลา 20 นาที</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.logoutbuttom} onPress={() => setPeakTime(30)}>
                                    <Text style={styles.logoutbuttomtext}>ตั้งเวลา 30 นาที</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.logoutbuttom} onPress={() => setPeakTime(60)}>
                                    <Text style={styles.logoutbuttomtext}>ตั้งเวลา 60 นาที</Text>
                                </TouchableOpacity>
                                <Text style={styles.modalTitle}>เวลา : {peakTime} นาที</Text>
                            </View>

                            <View style={[{ flexDirection: 'row', gap: 10 }]}>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}> บันทึกเวลา</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.closeButton}
                                    onPress={() => setModalVisible(false)}
                                >
                                    <Text style={styles.closeButtonText}>ปิด</Text>
                                </TouchableOpacity>

                            </View>
                        </View>
                    </View>
                </Modal>
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.id.toString()}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    ListEmptyComponent={<Text style={styles.emptyText}>ยังไม่มีออเดอร์</Text>}
                    renderItem={({ item }) => {
                        const isPending = item.status === 'pending';
                        const isPaid = item.status === 'paid';
                        const isCompleted = item.status === 'completed';

                        return (
                            <View style={[
                                styles.orderCard,
                                isPaid && { borderLeftWidth: 5, borderLeftColor: '#4CAF50' },
                                isPending && { borderLeftWidth: 5, borderLeftColor: '#FF9800' }
                            ]}>
                                <View style={styles.orderHeader}>
                                    <Text style={styles.orderId}>ออเดอร์ #{item.id}</Text>
                                    <View style={[
                                        styles.statusBadge,
                                        isPaid && { backgroundColor: '#E8F5E9' },
                                        isPending && { backgroundColor: '#FFF3E0' },
                                        isCompleted && { backgroundColor: '#EEEEEE' }
                                    ]}>
                                        <Text style={[
                                            styles.statusBadgeText,
                                            isPaid && { color: '#2E7D32' },
                                            isPending && { color: '#E65100' },
                                            isCompleted && { color: '#757575' }
                                        ]}>
                                            {isPaid ? "🟢 ชำระเงินแล้ว" : isPending ? "🟡 รอชำระเงิน" : "⚪ ทำเสร็จแล้ว"}
                                        </Text>
                                    </View>
                                </View>
                                <Text style={styles.orderText}>ยอดรวม: {item.total_price} บาท</Text>
                                <Text style={styles.orderText}>ประเภท: {item.order_type}</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, gap: 8 }}>
                                    {isPending && (
                                        <TouchableOpacity
                                            style={styles.pillButtonConfirm}
                                            onPress={() => handleConfirmPaid(item.id)}
                                        >
                                            <Text style={styles.pillButtonText}>ยืนยันรับเงิน</Text>
                                        </TouchableOpacity>
                                    )}
                                    {!isCompleted && (
                                        <TouchableOpacity
                                            style={styles.pillButton}
                                            onPress={() => handleCompleteOrder(item.id)}
                                        >
                                            <Text style={styles.pillButtonText}>ทำเสร็จ</Text>
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.pillButtonDelete}
                                        onPress={() => handleDeleteOrder(item.id)}
                                    >
                                        <Text style={styles.pillButtonText}>ลบ</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }}
                />
            </View>
        </LinearGradient>
    );
};
const styles = StyleSheet.create({
    Gradient: { flex: 1 },
    container: { flex: 1, padding: 16 },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    logoutbuttom: {
        alignSelf: 'flex-end',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#fe9ccb',
        marginBottom: 10,
    },
    logoutbuttomtext: { color: '#ffffff', fontWeight: 'bold' },
    emptyText: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#888' },
    orderCard: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        elevation: 3,
    },
    orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    orderId: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    statusBadgeText: {
        fontSize: 13,
        fontWeight: 'bold',
    },
    orderText: { fontSize: 14, color: '#555', marginTop: 2 },
    pillButtonConfirm: {
        backgroundColor: '#FFA000',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
    },
    pillButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
    },
    pillButtonDelete: {
        backgroundColor: '#fa7b7bff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 50,
        elevation: 4,
    },
    buttonText: { color: '#ffffff', fontSize: 16, fontWeight: '600', textAlign: 'center' },
    pillButtonText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold', textAlign: 'center' }, modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#ffffff',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333333',
    },
    closeButton: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 50,
        backgroundColor: colors.surface,
    },
    closeButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});