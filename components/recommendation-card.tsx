import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { icons } from '@/constants/icons';
import { BlurView } from 'expo-blur';
import { Link } from 'expo-router';

interface Movie {
    id: number;
    poster_path: string;
    title: string;
    vote_average: number;
    release_date: string;
    adult: boolean;
    name?: string;
}

const RecommendationCard = ({
                                id,
                                poster_path,
                                title,
                                vote_average,
                                release_date,
                                adult,
                                name,
                            }: Movie) => {
    return (
        <Link href={`/movie/${id}`} push asChild>
            <TouchableOpacity
                className="w-[150px] mr-6 mb-8"
                style={styles.cardShadow}
                accessible
                accessibilityRole="button"
                accessibilityLabel={`View details for ${title || name}`}
            >
                {/* Card Container with Subtle Border */}
                <View className="rounded-2xl overflow-hidden border border-secondary">
                    {/* Movie Poster with Gradient Overlay */}
                    <View className="relative">
                        <Image
                            source={{
                                uri: poster_path
                                    ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                    : 'https://placehold.co/600x400/1a1a1a/FFFFFF.png',
                            }}
                            className="w-full h-[170px]"
                            resizeMode="cover"
                            accessibilityIgnoresInvertColors
                        />

                        {/* Gradient Overlay */}
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.9)']}
                            className="absolute bottom-0 left-0 right-0 h-24"
                        />

                        {/* 18+ Indicator - Refined */}
                        {adult && (
                            <View className="absolute top-3 right-3 bg-red-500 rounded-md px-2 py-1">
                                <Text className="text-white font-bold text-xs">18+</Text>
                            </View>
                        )}

                        {/* Rating */}
                        <View className="absolute bottom-3 right-3 flex-row items-center bg-black/60 px-2 py-1 rounded-full">
                            <Image source={icons.star} className="w-4 h-4" accessibilityIgnoresInvertColors />
                            <Text className="text-yellow-400 font-bold text-md ml-1">
                                {vote_average.toFixed(1)}
                            </Text>
                        </View>
                    </View>

                    {/* Info Section with Blur Background */}
                    <BlurView intensity={80} tint="dark" className="p-3">
                        {/* Movie Title */}
                        <Text className="text-base font-bold text-white" numberOfLines={1}>
                            {title || name}
                        </Text>

                        {/* Year */}
                        <View className="flex-row items-center mt-1">
                            <View className="h-1 w-1 rounded-full bg-gray-400 mr-2" />
                            <Text className="text-xs text-gray-300">
                                {release_date?.split('-')[0] || 'Coming Soon'}
                            </Text>
                        </View>
                    </BlurView>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: '#5a0fc8',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
});

export default RecommendationCard;