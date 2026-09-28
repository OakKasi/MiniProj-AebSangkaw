import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { COLORS, SPACING } from '../../data/theam';

export const Header = ({ title, subtitle }) => {
    const { role, userRole, login, logout } = useContext(AuthContext);
    const toggleRole = () => {
        if (userRole === 'customer') {
            login('merchant');
        } else {
            login('customer');
        }
    }

    let badgeStyle;
    if (userRole === 'merchant') {
        badgeStyle = styles.merchantBadge
    } else {
        badgeStyle = styles.userBadge
    }

    let roleText;
    if (userRole === 'merchant') {
        roleText = 'แม่ค้า'
    } else {
        roleText = 'ลูกค้า'
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{title}</Text>
                    {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                </View>

                {/* Toggle Switcher for UI Demo */}
                <TouchableOpacity
                    style={[
                        styles.roleBadge, badgeStyle

                    ]}
                    onPress={toggleRole}
                    activeOpacity={0.8}
                >
                    <Text style={styles.roleText}>
                        {roleText}
                    </Text>
                    <Text style={styles.roleSubtext}>กดเพื่อสลับโหมด</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: COLORS.card,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm + 4,
    },
    titleContainer: {
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    roleBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
    },
    userBadge: {
        backgroundColor: COLORS.primaryLight,
    },
    merchantBadge: {
        backgroundColor: COLORS.secondaryLight,
    },
    roleText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    roleSubtext: {
        fontSize: 9,
        color: COLORS.textSecondary,
    },
});
