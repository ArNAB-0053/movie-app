import React from "react";
import { FlatList, Text, View } from "react-native";
import TrendingCard from "@/components/trending-card";

interface TrendingMoviesProps {
    movies: Movie[];
    trending?: boolean;
}

const TrendingMovies: React.FC<TrendingMoviesProps> = ({ movies, trending = false }) => {
    return (
        <View className="mt-5">
            {trending && (
                <Text className="text-lg text-white font-bold mb-3">🔥 Trending Now</Text>
            )}

            <FlatList
                data={movies.slice(0, 10)} // Ensure only 10 items are displayed
                renderItem={({ item }) => <TrendingCard  />}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 10 }}
            />
        </View>
    );
};

export default TrendingMovies;
