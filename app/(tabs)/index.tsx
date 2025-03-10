import {
    View,
    Text,
    ActivityIndicator,
    ScrollView,
    Image,
    FlatList,
} from "react-native";
import { useRouter } from "expo-router";

import { fetchMovies } from "@/services/api";

import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import useFetch from "@/services/useFetch";
import SearchBar from "@/components/search-bar";
import MovieCard from "@/components/movie-card";
import TrendingCard from "@/components/trending-card";

const Index = () => {
    const router = useRouter();

    const {
        data: movies,
        loading: moviesLoading,
        error: moviesError,
    } = useFetch(() => fetchMovies({ query: "", trending: false }));

    const {
        data: trending,
        loading: trendingLoading,
        error: trendingError,
    } = useFetch(() => fetchMovies({ query: "", trending: true }));

    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bgg}
                className="absolute w-full z-0"
                resizeMode="cover"
            />

            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
            >
                <Image source={icons.logo} className="w-[12rem] h-[12rem] shadow-md shadow-zinc-300 mt-20 mx-auto " />
                <View className="flex-row items-center justify-center mb-5">
                    <Text className="text-light-200 text-center italic">Lights. Camera.</Text>
                    <Text className="text-purple-400 text-center font-bold"> Popcorn!</Text>
                </View>
                {moviesLoading || trendingLoading ? (
                    <ActivityIndicator
                        size="large"
                        color="#0000ff"
                        className="mt-10 self-center"
                    />
                ) : moviesError || trendingError ? (
                    <Text>Error: {moviesError?.message}</Text>
                ) : (
                    <View className="flex-1 mt-5">
                        <SearchBar
                            onPress={() => {
                                router.push("/search");
                            }}
                            placeholder="Search for a movie"
                        />
                        <>
                            <Text className="text-lg text-white font-bold mt-5 mb-3  ">
                                Trending Movies
                            </Text>
                            <FlatList
                                data={trending}
                                renderItem={({ item, index }) => (
                                    <TrendingCard {...item} rank={index+1} />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                horizontal={true}
                                className="mt-2"
                                initialNumToRender={3}
                            />
                        </>
                        <>
                            <Text className="text-lg text-white font-bold mt-3 mb-3">
                                Latest Movies
                            </Text>

                            <FlatList
                                data={movies}
                                renderItem={({ item }) => (
                                    <MovieCard {...item} />
                                )}
                                keyExtractor={(item) => item.id.toString()}
                                numColumns={3}
                                columnWrapperStyle={{
                                    justifyContent: "flex-start",
                                    gap: 20,
                                    paddingRight: 5,
                                    marginBottom: 10,
                                }}
                                className="mt-2 pb-32"
                                scrollEnabled={false}
                            />
                        </>
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

export default Index;