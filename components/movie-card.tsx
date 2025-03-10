import { Link } from "expo-router";
import { Text, Image, TouchableOpacity, View } from "react-native";
import { icons } from "@/constants/icons";

const MovieCard = ({
                       id,
                       poster_path,
                       title,
                       vote_average,
                       release_date,
                       adult,
                   }: Movie) => {
    return (
        <Link href={`/movie/${id}`} asChild>
            <TouchableOpacity className="w-[30%] space-y-2">
                <View className="relative">
                    <Image
                        source={{
                            uri: poster_path
                                ? `https://image.tmdb.org/t/p/w500${poster_path}`
                                : "https://placehold.co/600x400/1a1a1a/FFFFFF.png",
                        }}
                        className="w-full h-52 rounded-lg"
                        resizeMode="cover"
                    />

                    {adult && (
                        <View className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-lg">
                            <Text className="text-xs font-bold text-white">18+</Text>
                        </View>
                    )}
                </View>

                <Text className="text-sm font-bold text-light-300 mt-1" numberOfLines={1}>
                    {title}
                </Text>

                <View className="flex-row items-center gap-x-2">
                    <Image source={icons.star} className="size-4 tint-yellow-400" />
                    <Text className="text-xs text-light-300 font-bold">
                        {(vote_average).toFixed(1)}
                    </Text>
                </View>

                <View className="flex-row items-center justify-between">
                    <Text className="text-xs text-light-400 font-medium">
                        {release_date?.split("-")[0]}
                    </Text>
                    <Text className="text-xs font-medium text-light-400 uppercase">
                        Movie
                    </Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

export default MovieCard;
