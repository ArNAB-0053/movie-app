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
import {fetchMovieDetails, fetchRecommendedMovies, fetchVideos, fetchVideosById} from "@/services/api";
import useFetch from "@/services/useFetch";
import Svg, { Circle } from "react-native-svg";
import Animated, { useSharedValue, useAnimatedProps, withTiming } from "react-native-reanimated";
import { useEffect } from "react";
import RecommendationCard from "@/components/recommendation-card";
import VideoCard from "@/components/video-card";

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

const Loading = () => {
    return (
        <SafeAreaView className="bg-primary flex-1">
            <ActivityIndicator />
        </SafeAreaView>
    )
}

const Details = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();

    const { data: movie, loading, refetch: refetchMovie } = useFetch(() =>
        fetchMovieDetails(id as string)
    );

    const { data: recommendedMovies, loading: rLoading, refetch: refetchRecommended } = useFetch(() =>
        fetchRecommendedMovies(id as string)
    );

    const { data: videos, loading: vLoading, refetch: refetchVideos } = useFetch(() =>
        fetchVideos(id as string)
    );

    useEffect(() => {
        refetchMovie();
        refetchRecommended();
        refetchVideos();
    }, [id as string]);

    if (loading)
        return (
            <Loading />
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

                    {vLoading ? (
                        <Loading />
                    ): (
                        <FlatList
                            data={videos
                                ?.filter(video => video.type === "Trailer") // only trailers
                                .sort((a, b) => {
                                    const dateA = new Date(a.published_at || "2000-01-01").getTime();
                                    const dateB = new Date(b.published_at || "2000-01-01").getTime();
                                    return dateB - dateA;
                                })
                                .slice(0, 5)}
                            renderItem={({ item }) => (
                                <VideoCard video={item} />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal={true}
                            className="mt-2"
                            initialNumToRender={3}
                            ListEmptyComponent={
                                <Text className="text-gray-300/70 italic text-sm -ml-0.5"> No videos available </Text>
                            }
                        />
                    )}

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

                    {rLoading ? (
                        <Loading />
                    ): (
                        <FlatList
                            data={recommendedMovies && recommendedMovies.slice(0,10)}
                            renderItem={({ item }) => (
                                <RecommendationCard {...item} />
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal={true}
                            className="mt-2"
                            initialNumToRender={3}
                            ListEmptyComponent={
                                 <Text className="text-gray-300/70 italic text-sm -ml-0.5"> No recommendation available </Text>
                            }
                        />
                    )}

                </View>
            </ScrollView>

            <TouchableOpacity
                className="absolute bottom-3 left-0 right-0 mx-5 ba bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
                onPress={router.back}
            >
                <Image
                    source={icons.home}
                    className="size-5 mr-2 "
                    tintColor="#fff"
                />
                <Text className="text-white font-semibold text-base">Go To Home</Text>
            </TouchableOpacity>
                <View className="bg-black/50 z-40 w-full h-10 absolute bottom-0 left-0 "></View>
        </View>
    );
};

export default Details;