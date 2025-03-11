import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [appReady, setAppReady] = useState(false);

    useEffect(() => {
        async function prepare() {
            try {
                await new Promise((resolve) => setTimeout(resolve, 50));
            } catch (e) {
                console.warn(e);
            } finally {
                setAppReady(true);
                await SplashScreen.hideAsync();
            }
        }

        prepare();
    }, []);

    if (!appReady) {
        return <View className="flex-1 bg-primary " />;
    }

    return (
        // Use background color here to prevent White flashing screen while routing
        <View style={{backgroundColor: "#1E0822", flex: 1}}>
            <StatusBar hidden={true} />
            <Stack>
                <Stack.Screen
                    name="(tabs)"
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="movie/[id]"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>
        </View>
    );
}
