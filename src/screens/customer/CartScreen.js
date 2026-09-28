import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { CartContext } from '../../context/CartContext';
import { LinearGradient } from "expo-linear-gradient";
import { colors } from '../../data/theam';
import { AuthContext } from '../../context/AuthContext';

export const CartScreen = ({ navigation }) => {
    const { cart, addToCart, updateQuantity, getTotalPrice, removeFromCart, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const [pickupTime, setPickupTime] = useState("");
    const [pickupType, setPickupType] = useState("รับหน้าร้าน");
    const [loading, setLoading] = useState(false);

    const handleCheckOut = async () => {
        if (cart.length === 0) return;
        setLoading(true);
        try {
            const payload = {
                user_id: user?.id || 1,
                total_price: getTotalPrice(),
                order_type: pickupType,
                items: cart.map(item => ({
                    menu_id: parseInt(item.id),
                    quantity: item.quantity,
                    price: item.price
                }))
            };
            const response = await fetch("http://10.0.2.2:8000/api/orders/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (!response.ok) {
                Alert.alert("ผิดพลาด", data.detail || "ไม่สามารถส่งออเดอร์ได้");
                setLoading(false);
                return;
            }

            Alert.alert("สำเร็จ", `ส่งออเดอร์ #${data.order_id} เรียบร้อยแล้ว!`);
            clearCart();
            navigation.navigate('Home');
        } catch (error) {
            console.error("Error submitting order:", error);
            Alert.alert("ผิดพลาด", "เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {cart.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>🛒 ตะกร้าสินค้ายังว่างอยู่</Text>
                </View>
            ) : (
                <>
                    <FlatList
                        data={cart}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.cartItem}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.itemTitle}>{item.title}</Text>
                                    {item.toppings && item.toppings.length > 0 && (
                                        <Text style={styles.toppingText}>
                                            + {item.toppings.map(t => t.name || t.toppings_name).join(', ')}
                                        </Text>
                                    )}
                                    <Text style={styles.itemPrice}>{item.price * item.quantity} ฿</Text>
                                </View>

                                {/* ปุ่มปรับจำนวน + / - */}
                                <View style={styles.quantityContainer}>
                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => updateQuantity(item.id, -1)}
                                    >
                                        <Text style={styles.qtyBtnText}>-</Text>
                                    </TouchableOpacity>

                                    <Text style={styles.qtyText}>{item.quantity}</Text>

                                    <TouchableOpacity
                                        style={styles.qtyBtn}
                                        onPress={() => updateQuantity(item.id, 1)}
                                    >
                                        <Text style={styles.qtyBtnText}>+</Text>
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={() => removeFromCart(item.id)}
                                    style={styles.deleteBtn}
                                >
                                    <Text style={{ color: 'red', fontWeight: 'bold' }}>ลบ</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                    <View style={{ padding: 15 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>เลือกจุดรับอาหาร:</Text>
                        <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>
                            ขณะนี้รับที่ <Text style={{ color: '#fe9ccb' }}>{pickupType}</Text>
                        </Text>

                        <View style={{ flexDirection: 'row', gap: 10 }}>

                            <TouchableOpacity
                                style={[
                                    styles.optionBtn,
                                    pickupType === 'หน้าร้าน' && styles.optionBtnActive
                                ]}
                                onPress={() => setPickupType('รับหน้าร้าน')}
                            >
                                <Text>รับหน้าร้าน</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.optionBtn,
                                    pickupType === 'ป้อมยาม' && styles.optionBtnActive
                                ]}
                                onPress={() => setPickupType('รับป้อมยาม')}
                            >
                                <Text>วางป้อมยาม</Text>
                            </TouchableOpacity>



                        </View>
                    </View>

                    <View style={styles.footer}>
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>ราคารวมทั้งหมด:</Text>
                            <Text style={styles.totalPrice}>{getTotalPrice()} บาท</Text>
                        </View>
                        <TouchableOpacity style={styles.checkoutBtn} onPress={handleCheckOut}>
                            <Text style={styles.checkoutText}>สั่งซื้ออาหาร</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>


    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 18, color: '#888' },
    cartItem: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        elevation: 2
    },
    itemTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    toppingText: { fontSize: 13, color: '#666', marginTop: 2 },
    itemPrice: { fontSize: 15, fontWeight: 'bold', color: '#fe9ccb', marginTop: 4 },
    quantityContainer: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 12 },
    qtyBtn: { backgroundColor: '#eee', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    qtyBtnText: { fontSize: 16, fontWeight: 'bold' },
    qtyText: { fontSize: 16, marginHorizontal: 8, fontWeight: 'bold' },
    deleteBtn: { marginLeft: 8 },
    footer: { padding: 16, backgroundColor: '#fff', borderRadius: 16, elevation: 4 },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
    totalLabel: { fontSize: 18, fontWeight: 'bold' },
    totalPrice: { fontSize: 20, fontWeight: 'bold', color: '#fe9ccb' },
    checkoutBtn: { backgroundColor: '#4CAF50', paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
    checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    optionBtn: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#eee' },
    optionBtnActive: { backgroundColor: '#fe9ccb' },
});
