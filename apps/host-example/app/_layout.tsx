/* eslint-disable @typescript-eslint/no-require-imports */
import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { setup } from "react-native-remotely";

export const unstable_settings = {
    anchor: "(tabs)",
};

setup({
    shared: {
        react: require("react"),
        "react-native": require("react-native"),
        "react/jsx-runtime": require("react/jsx-runtime"),
        "@expo/vector-icons": require("@expo/vector-icons"),
        "expo-router": require("expo-router"),
        "expo-linking": require("expo-linking"),
        "expo-splash-screen": require("expo-splash-screen"),
        "expo-status-bar": require("expo-status-bar"),
        "expo-symbols": require("expo-symbols"),
        "expo-system-ui": require("expo-system-ui"),
        "expo-web-browser": require("expo-web-browser"),
        "react-native-gesture-handler": require("react-native-gesture-handler"),
        "react-native-reanimated": require("react-native-reanimated"),
        "expo-image": require("expo-image"),
    },
});

export default function RootLayout() {
    const colorScheme = useColorScheme();

    return (
        <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: "modal", title: "Modal" }} />
            </Stack>
            <StatusBar style="auto" />
        </ThemeProvider>
    );
}
