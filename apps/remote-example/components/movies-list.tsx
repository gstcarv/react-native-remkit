import { ScrollView, Text, View, StyleSheet, ActivityIndicator, Image, Platform } from "react-native";
import { useState, useEffect } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Movie {
    id: number;
    title: string;
    posterURL?: string;
    imdbId?: string;
}

export default function MoviesList() {
    const insets = useSafeAreaInsets();
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
            setMovies(data); // Limit to 20 movies
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color="#0a7ea4" />
                    <Text style={styles.loadingText}>Loading movies...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.centerContainer}>
                    <Text style={styles.errorText}>Error: {error}</Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>🎬 Movies</Text>
                    <Text style={styles.subtitle}>{movies.length} movies found</Text>
                </View>
                {movies.map((movie) => (
                    <View key={movie.id} style={styles.movieCard}>
                        {movie.posterURL ? (
                            <Image source={{ uri: movie.posterURL }} style={styles.poster} resizeMode="cover" />
                        ) : (
                            <View style={styles.posterPlaceholder}>
                                <Text style={styles.posterPlaceholderText}>🎬</Text>
                            </View>
                        )}
                        <View style={styles.movieContent}>
                            <Text style={styles.movieTitle}>{movie.title || "Untitled Movie"}</Text>
                            {movie.imdbId && (
                                <View style={styles.imdbContainer}>
                                    <Text style={styles.imdbLabel}>IMDB:</Text>
                                    <Text style={styles.imdbId}>{movie.imdbId}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f7fa",
    },
    scrollView: {
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    centerContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f7fa",
    },
    header: {
        marginBottom: 28,
        paddingTop: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: "800",
        marginBottom: 6,
        color: "#0f172a",
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 15,
        color: "#64748b",
        fontWeight: "600",
        letterSpacing: 0.2,
    },
    movieCard: {
        backgroundColor: "#ffffff",
        borderRadius: 20,
        marginBottom: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        ...Platform.select({
            ios: {
                shadowColor: "#0f172a",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: {
                elevation: 6,
            },
        }),
    },
    poster: {
        width: "100%",
        height: 280,
        backgroundColor: "#e2e8f0",
    },
    posterPlaceholder: {
        width: "100%",
        height: 280,
        backgroundColor: "#e2e8f0",
        justifyContent: "center",
        alignItems: "center",
    },
    posterPlaceholderText: {
        fontSize: 64,
    },
    movieContent: {
        padding: 20,
    },
    movieTitle: {
        fontSize: 24,
        fontWeight: "800",
        color: "#0f172a",
        lineHeight: 32,
        letterSpacing: -0.4,
        marginBottom: 12,
    },
    imdbContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f8fafc",
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#e2e8f0",
    },
    imdbLabel: {
        fontSize: 13,
        fontWeight: "700",
        color: "#64748b",
        marginRight: 8,
    },
    imdbId: {
        fontSize: 13,
        fontWeight: "600",
        color: "#0a7ea4",
        fontFamily: Platform.select({
            ios: "ui-monospace",
            android: "monospace",
            default: "monospace",
        }),
    },
    loadingText: {
        marginTop: 16,
        fontSize: 17,
        color: "#64748b",
        fontWeight: "600",
        letterSpacing: 0.3,
    },
    errorText: {
        fontSize: 17,
        color: "#ef4444",
        fontWeight: "600",
        textAlign: "center",
        paddingHorizontal: 20,
        lineHeight: 24,
    },
});
