import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CartScreen,HomeScreen, UserScreen } from "../screens/customer/index";

const Stack = createNativeStackNavigator();

export default function CustomerNavigator() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="User" component={UserScreen} />
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Cart" component={CartScreen} />
        </Stack.Navigator>
    );
}
