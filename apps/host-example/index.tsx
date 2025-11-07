import { ScrollView, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";

interface Movie {
    id: number;
    title: string;
    year: number;
    runtime: number;
    genres: string[];
    director: string;
    actors: string;
    plot: string;
    posterUrl: string;
}

export default function Index() {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMovies();
    }, []);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            // Using a free movie API
            const response = await fetch("https://api.sampleapis.com/movies/animation");
            if (!response.ok) {
                throw new Error("Failed to fetch movies");
            }
            const data = await response.json();
            setMovies(data.slice(0, 20)); // Limit to 20 movies
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Loading movies...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centerContainer}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Movies</Text>
            {movies.map((movie) => (
                <View key={movie.id} style={styles.movieCard}>
                    <Text style={styles.movieTitle}>{movie.title}</Text>
                    <Text style={styles.movieYear}>Year: {movie.year}</Text>
                    {movie.runtime && <Text style={styles.movieInfo}>Runtime: {movie.runtime} min</Text>}
                    {movie.director && <Text style={styles.movieInfo}>Director: {movie.director}</Text>}
                    {movie.plot && (
                        <Text style={styles.moviePlot} numberOfLines={3}>
                            {movie.plot}
                        </Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#000",
    },
    movieCard: {
        backgroundColor: "#f5f5f5",
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    movieTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#000",
    },
    movieYear: {
        fontSize: 16,
        color: "#666",
        marginBottom: 4,
    },
    movieInfo: {
        fontSize: 14,
        color: "#666",
        marginBottom: 4,
    },
    moviePlot: {
        fontSize: 14,
        color: "#333",
        marginTop: 8,
        lineHeight: 20,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#ff0000",
    },
});
