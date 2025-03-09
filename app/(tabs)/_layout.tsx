import {View, Text, ImageBackground, Image} from 'react-native'
import React from 'react'
import {Tabs} from "expo-router";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";

const TabIcon = ({icon, name, focused}: {
    icon: string,
    name: string
    focused: boolean
}) => {
    if (focused) {
        return (
            <ImageBackground
                source={images.highlight}
                className="flex flex-1 flex-row items-center justify-center min-w-[112px] min-h-16 mt-4 rounded-full overflow-hidden"
            >
                <Image source={icon} tintColor="#151312" className="size-5" />
                <Text className="text-secondary font-semibold ml-2 text-base">{name}</Text>
            </ImageBackground>
        )
    }
    return (
        <View className="justify-center size-full items-center mt-4 rounded-full">
            <Image source={icon} tintColor="#A8B5DB" className="size-5" />
            {/*<Text className="text-secondary font-semibold ml-2 text-base">{name}</Text>*/}
        </View>
    )
}

const _Layout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: false,
                tabBarItemStyle: {
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                },
                tabBarStyle: {
                    backgroundColor: "#0F0D23",
                    borderRadius: 50,
                    marginHorizontal: 20,
                    marginBottom: 36,
                    height: 52,
                    position: "absolute",
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#0F0D23",
                },
            }}
        >
            <Tabs.Screen
                name={'index'}
                options={{
                    title: 'Home',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.home}
                            name="Home"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name={'search'}
                options={{
                    title: 'Search',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.search}
                            name="Search"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name={'saved'}
                options={{
                    tabBarLabel: 'Saved',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.save}
                            name="Saved"
                            focused={focused}
                        />
                    )
                }}
            />
            <Tabs.Screen
                name={'profile'}
                options={{
                    tabBarLabel: 'Profile',
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.person}
                            name="Profile"
                            focused={focused}
                        />
                    )
                }}
            />
        </Tabs>
    )
}
export default _Layout
