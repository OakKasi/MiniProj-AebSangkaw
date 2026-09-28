import { Platform, StatusBar } from "react-native";
export const colors = {
    surface: '#fe9ccb',
    bg: 'rgb(0, 0, 0)',
    border: '#000000',
    text: '#ffffff',
    muted: '#e2a1a9',
    cyan: '#000000',
    beart: '#f77ba1',
}
export const COLORS = {
    primary: '#FF6B35', 
    primaryLight: '#FFECE5',
    secondary: '#004E64', 
    secondaryLight: '#E6F4F8',
    accent: '#25C998', 
    accentLight: '#E8F9F4',
    warning: '#FFB800', 
    background: '#F8F9FA',
    card: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    textLight: '#94A3B8',
    border: '#E2E8F0',
    danger: '#EF4444',
};

export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const TOP_INSET = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 44;      
