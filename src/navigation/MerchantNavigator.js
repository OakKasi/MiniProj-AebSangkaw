import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DashboardScreen } from "../screens/merchant/index";
const Stack = createNativeStackNavigator();

export default function MerchantNavigator() {
    return (
        <Stack.Navigator>
            {/* </Stack.Navigator>  <Stack.Navigator screenOptions={{ headerShown: false }}> */}

            <Stack.Screen name="Dashboard" component={DashboardScreen} />

        </Stack.Navigator>

    );
}
