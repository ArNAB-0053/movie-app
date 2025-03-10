import {View, Text, ActivityIndicator, Image, FlatList} from 'react-native'
import React, {useEffect, useState} from 'react'
import useFetch from "@/services/useFetch";
import {fetchMovies} from "@/services/api";
import {images} from "@/constants/images";
import {icons} from "@/constants/icons";
import MovieCard from "@/components/movie-card";
import SearchBar from "@/components/search-bar";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const {
        data: movies,
        loading,
        error,
        refetch: loadMovies,
        reset
    } = useFetch(()=>fetchMovies({
        query: searchQuery
    }), false)

    const handleSearch = (text: string) => {
        setSearchQuery(text);
    };

    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (searchQuery.trim()) {
                await loadMovies();
            } else {
                reset();
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery]);


    return (
        <View className="flex-1 bg-primary">
            <Image
                source={images.bgg}
                className="flex-1 absolute w-full z-0"
                resizeMode="cover"
            />

            <FlatList
                className="px-5"
                data={movies as Movie[]}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MovieCard {...item} />}
                numColumns={3}
                columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 16,
                    marginVertical: 16,
                }}
                contentContainerStyle={{ paddingBottom: 100 }}
                ListHeaderComponent={
                    <>
                        <Image source={icons.logo} className="w-[12rem] h-[12rem] shadow-md shadow-zinc-300 mt-20 mx-auto " />
                        <View className="flex-row items-center justify-center mb-5">
                            <Text className="text-light-200 text-center italic">Lights. Camera.</Text>
                            <Text className="text-purple-400 text-center font-bold"> Popcorn!</Text>
                        </View>

                        <View className="my-5">
                            <SearchBar
                                placeholder="Search for a movie"
                                value={searchQuery}
                                onChangeText={handleSearch}
                            />
                        </View>

                        {loading && (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                                className="my-3"
                            />
                        )}

                        {error && (
                            <Text className="text-red-500 px-5 my-3">
                                Error: {error.message}
                            </Text>
                        )}

                        {!loading &&
                            !error &&
                            searchQuery.trim() &&
                            movies?.length! > 0 && (
                                <Text className="text-xl text-white font-bold">
                                    Search Results for{" "}
                                    <Text className="text-accent">{searchQuery}</Text>
                                </Text>
                            )}
                    </>
                }
                ListEmptyComponent={
                    !loading && !error ? (
                        <View className="mt-10 px-5">
                            <Text className="text-center text-gray-500">
                                {searchQuery.trim()
                                    ? "No movies found"
                                    : "Start typing to search for movies"}
                            </Text>
                        </View>
                    ) : null
                }
            />
        </View>
    )
}
export default Search
