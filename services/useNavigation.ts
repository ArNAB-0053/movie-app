import { useRouter } from 'expo-router';

const useNavigation = () => {
    const router = useRouter();

    const navigateToMovie = (id: string) => {
        console.log(`Navigating to: /movie/${id}`);
        router.push(`/movie/${id}`);
    };

    return { navigateToMovie };
};

export default useNavigation;