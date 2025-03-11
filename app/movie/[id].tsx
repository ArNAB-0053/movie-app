import {
    View,
    Text,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity, FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import {fetchMovieDetails, fetchRecommendedMovies} from "@/services/api";
import useFetch from "@/services/useFetch";
import Svg, { Circle } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedProps, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import TrendingCard from "@/components/trending-card";
import MovieCard from "@/components/movie-card";
import RecommendationCard from "@/components/recommendation-card";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface MovieInfoProps {
    label: string;
    value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
    <View className="flex-col items-start justify-center mt-5">
        <Text className="text-light-200 font-semibold text-md">{label}</Text>
        <Text className="text-light-100 font-normal text-sm mt-2">
            {value || "N/A"}
        </Text>
    </View>
);

const RatingCircle = ({ rating }: { rating: number }) => {
    const percentage = rating * 10;
    const radius = 24;
    const strokeWidth = 5;
    const circumference = 2 * Math.PI * radius;

    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withTiming(circumference * (1 - percentage / 100), {
            duration: 1000,
        });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: progress.value,
    }));

    return (
        <View className="absolute bottom-5 left-5 flex items-center justify-center">
            <Svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth}>
                <Circle
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    stroke="#dadada"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <AnimatedCircle
                    cx={radius + strokeWidth / 2}
                    cy={radius + strokeWidth / 2}
                    r={radius}
                    stroke="#C866DC"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                />
            </Svg>
            <Text className="absolute text-white font-bold text-lg">{Math.floor(percentage)}%</Text>
        </View>
    );
};


const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: movie, loading } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    const { data: recommendedMovies, loading: rLoading } = useFetch(() =>
        fetchRecommendedMovies(id as string)
    );

    if (loading)
        return (
            <SafeAreaView className="bg-primary flex-1">
                <ActivityIndicator />
            </SafeAreaView>
        );

    return (
        <View className="bg-primary flex-1">
            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                <View>
                    <Image
                        source={{
                            uri: `https://image.tmdb.org/t/p/w500${movie?.backdrop_path || movie?.poster_path}`,
                        }}
                        className="w-full h-[20rem] "
                        resizeMode="cover"
                    />

                    <View className="w-full h-[20rem] bg-black/40 absolute top-0 left-0"/>

                    <View className="absolute top-1/2 right-5 rounded-2xl w-48 h-72 shadow-xl overflow-hidden shadow-zinc-300">
                        <Image
                            source={{
                                uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
                            }}
                            className="w-full h-full"
                            resizeMode="stretch"
                        />
                    </View>

                    {/* Circle Percentage */}
                    <RatingCircle rating={movie?.vote_average ?? 0} />
                </View>

                <View className="mt-5 flex-col px-5 w-[55%] ">
                    <Text className="text-white font-bold text-4xl ">{movie?.title}</Text>
                    <View className="flex-row items-center gap-x-1 mt-3">
                        <Text className="text-light-200 text-sm">
                            {movie?.release_date?.split("-")[0]} •
                        </Text>
                        <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
                    </View>
                    <View className="flex-row items-center py-1 rounded-md gap-x-1 mt-2">
                        <Image source={icons.star} className="size-4" />

                        <Text className="text-white font-bold text-sm">
                            {movie?.vote_average.toFixed(1) ?? 0}/10
                        </Text>

                        <Text className="text-light-200 text-sm">
                            ({movie?.vote_count} votes)
                        </Text>
                    </View>
                </View>

                <View className="flex-col items-start justify-center mt-6 px-5">
                    <TouchableOpacity className="my-5 flex-row items-center justify-center  px-5 w-full rounded-full bg-gray-50 ">
                        <Text className="text-xl font-black">Watch Now</Text>
                        <View className="size-14 flex items-center justify-center">
                            <Image
                                source={icons.play}
                                className="w-6 h-7 ml-1"
                                resizeMode="stretch"
                            />
                        </View>
                    </TouchableOpacity>
                    <MovieInfo label="Overview" value={movie?.overview} />
                    <MovieInfo
                        label="Genres"
                        value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
                    />

                    <View className="flex flex-row justify-between w-1/2">
                        <MovieInfo
                            label="Budget"
                            value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
                        />
                        <MovieInfo
                            label="Revenue"
                            value={`$${Math.round(
                                (movie?.revenue ?? 0) / 1_000_000
                            )} million`}
                        />
                    </View>

                    <MovieInfo
                        label="Production Companies"
                        value={
                            movie?.production_companies?.map((c) => c.name).join(" • ") ||
                            "N/A"
                        }
                    />

                    <Text className="text-light-200 font-normal mt-5 mb-2 text-md">Recommended Movies</Text>

                    <FlatList
                        data={recommendedMovies}
                        renderItem={({ item, index }) => (
                            <RecommendationCard {...item} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal={true}
                        className="mt-2"
                        initialNumToRender={3}
                    />
                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}
            >
                <Image
                    source={icons.arrow}
                    className="size-5 mr-1 mt-0.5 rotate-180"
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">Go Back</Text>
            </TouchableOpacity>
        </View>
    );
};

export default Details;