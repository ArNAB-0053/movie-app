import {View, Text, Image, TouchableOpacity, Modal, StyleSheet, StatusBar, Pressable, Linking} from "react-native";
import React, { useState } from "react";
import YoutubePlayer from "react-native-youtube-iframe";

interface Video {
    key: string; // YouTube video key
    name: string;
    site: string;
    type: string;
}

const VideoCard = ({ video }: { video: Video }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [trailer, setTrailer] = useState(false);
    if (video.type === "Trailer") {

    }

    const isYouTube = video.site === "YouTube";
    const thumbnailUrl = isYouTube
        ? `https://img.youtube.com/vi/${video.key}/hqdefault.jpg`
        : "https://via.placeholder.com/320x180.png?text=No+Thumbnail";
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.key}`;

    return (
        <>
            {/* Video Thumbnail Card */}
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.container}>
                <Image source={{ uri: thumbnailUrl }} style={styles.thumbnail} />
                <Text className="mt-5 font-bold text-white mb-4" numberOfLines={1}>
                    {video.name}
                </Text>
            </TouchableOpacity>

            {/* Bottom Sheet Modal */}
            <Modal visible={modalVisible} animationType="slide" transparent statusBarTranslucent>
                <Pressable style={styles.modalBackground} >
                    <View style={styles.modalContainer}>
                        <View className="w-full flex items-start justify-center" >
                            <Text className="mt-5 font-bold text-white mb-4 w-[75%]" numberOfLines={2}>
                                {video.name}
                            </Text>

                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                className="absolute right-0 bg-accent rounded-full px-8 py-3 flex flex-row items-center justify-center z-50"
                            >
                                <Text className="text-white text-center font-bold text-sm">Close</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="w-full h-[220px] rounded-2xl overflow-hidden mt-4">
                            <YoutubePlayer
                                height={220}
                                play={true}
                                videoId={video.key}
                                webViewStyle={{ opacity: 0.99 }} // Fix some rendering issues
                                initialPlayerParams={{
                                    controls: false,
                                    modestbranding: true,
                                    showinfo: 0,
                                    rel: false,
                                    playsinline: 1,
                                }}
                            />
                        </View>

                        <TouchableOpacity
                            onPress={() => Linking.openURL(youtubeUrl)}
                            className="absolute bottom-5 w-[95%] bg-red-600 rounded-lg px-4 py-3 mt-3"
                        >
                            <Text className="text-white text-center font-bold">Watch on YouTube</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        width: 240,
        marginRight: 12,
        alignItems: "center",
    },
    thumbnail: {
        width: 240,
        height: 150,
        borderRadius: 10,
        objectFit: "cover",
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0)",
        justifyContent: "flex-end",
        alignItems: "center",
        position: "absolute",
        height: "100%",
        width: "100%",
        top: 0,
    },
    modalContainer: {
        width: "100%",
        height: "45%",
        backgroundColor: "#221F3D",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
        alignItems: "center",
    },
});

export default VideoCard;
