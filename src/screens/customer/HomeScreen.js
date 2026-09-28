import React, { useState, useContext , useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert, Modal, TouchableOpacity, ScrollView, FlatList, Image } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { LinearGradient } from "expo-linear-gradient";
import { PHOTO, MENU_IMAGES } from '../../data/data';
import { colors } from '../../data/theam';
import { Header } from '../../components/common/Header';

export const HomeScreen = ({ navigation }) => {
    const { logout } = useContext(AuthContext);

    const [menus, setMenus] = useState([]);
    const [toppings, setToppings] = useState([]);   
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const [selectedToppings, setSelectedToppings] = useState([]);
    const { addToCart , cart , getTotalPrice } = useContext(CartContext);

    const toggleTopping = (topping)=>{
        const toppingExit = selectedToppings.find((t) => t.id === topping.id)
        if(toppingExit){
            setSelectedToppings(selectedToppings.filter(t=>t.id!==topping.id));
        }else{
            setSelectedToppings([...selectedToppings,topping]);
        }
    }
    const calculateTotal = ()=>{
        const bprice = selectedItem?.price || 0;
        const toppingTotal = selectedToppings.reduce((sum,t)=>sum + (t.price || 0), 0)
        return bprice + toppingTotal; 
    }
    const handleSelectMenu = (item) => {
        setSelectedItem(item);
        setSelectedToppings([]);
        setModalVisible(true);
    };

    const handleAddToCart = () =>{
        if (!selectedItem) return;
        const itemToAdd={
            id: selectedItem.id,
            title: selectedItem.name,
            name: selectedItem.name,
            price: calculateTotal(),
            toppings: selectedToppings,
            quantity:1
        };
        addToCart(itemToAdd);
        setModalVisible(false);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, toppingRes] = await Promise.all([
                    fetch("http://10.0.2.2:8000/api/menus"),
                    fetch("http://10.0.2.2:8000/api/toppings")
                ]);
                if (menuRes.ok) {
                    const menuData = await menuRes.json();
                    if (Array.isArray(menuData)) setMenus(menuData);
                }
                if (toppingRes.ok) {
                    const toppingData = await toppingRes.json();
                    if (Array.isArray(toppingData)) setToppings(toppingData);
                }
            } catch (err) {
                console.error("Error fetching menus and toppings:", err);
            }
        };
        fetchData();
    }, []);
    return (
        <LinearGradient
            colors={['#e8faea', '#ffe5ec', '#e8faea']}
            style={[styles.Gradient]}
        >
            <Header
                title="ร้านข้าวแม่ อาหารตามสั่ง"
                subtitle="มารับที่ร้าน หรือ ส่งป้อมยามก็อร่อย"
            />


            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <FlatList
                    style={{ width: '100%' }}
                    data={menus}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    scrollEnabled={false}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.list}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.card}>
                                <TouchableOpacity onPress={() => handleSelectMenu(item)}>
                                    <Image 
                                        style={styles.image} 
                                        source={MENU_IMAGES[item.image_key] || require('../../data/image/LOGO.png')} 
                                    />
                                    <Text style={styles.imageText}>{item.name}</Text>
                                    <Text style={{ textAlign: 'center', color: '#666', fontSize: 13, marginBottom: 8 }}>{item.price} บาท</Text>
                                </TouchableOpacity>

                            </View>

                        )
                    }}
                />
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
                            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>ราคารวม: {calculateTotal()} บาท</Text>
                        <View style={{ marginVertical: 10, width: '100%' }}>
                                <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>เลือกท็อปปิ้งเพิ่มเติม:</Text>
                                {toppings.map((topping) => {
                                    const isSelected = selectedToppings.some(t => t.id === topping.id);
                                    return (
                                        <TouchableOpacity
                                            key={topping.id}
                                            style={{
                                                padding: 8,
                                                marginVertical: 4,
                                                backgroundColor: isSelected ? '#fe9ccb' : '#f0f0f0',
                                                borderRadius: 8,
                                            }}
                                            onPress={() => toggleTopping(topping)}
                                        >
                                            <Text style={{ color: isSelected ? '#fff' : '#333' }}>
                                                {topping.name || topping.toppings_name} (+{topping.price} บาท)
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        <View style={{flexDirection:'row',gap:5}}>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress = {()=>{
                                    handleAddToCart();
                                    setModalVisible(false);
                                }}
                            >
                                <Text style={styles.closeButtonText}>ยืนยัน</Text>
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
                <View style={styles.bottomRow}>
                    <TouchableOpacity
                        style={styles.logoutbuttom}
                        onPress={() => navigation.navigate('User')}
                    >
                        <Text style={styles.logoutbuttomtext}>กลับหน้า User</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.logoutbuttom}
                        onPress={logout}
                    >
                        <Text style={styles.logoutbuttomtext}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
            {cart.length > 0 && (
                <TouchableOpacity
                    style={styles.cartFloatingBar}
                    onPress={() => navigation.navigate('Cart')}
                >
                    <Text style={styles.cartFloatingText}>
                        🛒 {cart.length} รายการ
                    </Text>
                    <Text style={styles.cartFloatingText}>
                        ดูตะกร้า ({getTotalPrice()} ฿) ➔
                    </Text>
                </TouchableOpacity>
            )}
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    scrollView: { flex: 1 },
    Gradient: { flex: 1 },
    container: { flex: 1, padding: 16 },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    logoutbuttom: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 50,
        backgroundColor: '#fe9ccb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutbuttomtext: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    scrollContent: {
        padding: 20,
    },
    row: {
        justifyContent: 'space-between',
    },
    list:
    {
        paddingVertical: 10,
    },
    card: {
        width: '48%',
        marginBottom: 14,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        overflow: 'hidden',
        alignSelf: 'flex-start'
    },
    image: {
        width: '100%',
        height: 200,
    },
    imageText: {
        padding: 8,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333333',
    }, modalOverlay: {
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
    confirmButton: {
        marginTop: 15,
        paddingVertical: 12,
        paddingHorizontal: 35,
        borderRadius: 50,
        backgroundColor:'#4CAF50',
    },
    closeButtonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    addToCartButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 25,
        marginTop: 10,
    },
    addToCartText: {
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    cartFloatingBar: {
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: '#fe9ccb',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
    },
    cartFloatingText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
