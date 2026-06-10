import { BookOpen, Play, Search, Tag, X } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from 'react-native-youtube-iframe';
import { useTheme } from '../../src/context/ThemeContext';

const tutorials = [
    {
        id: 1,
        title: 'Shoulder Press Form',
        category: 'Shoulder',
        duration: '5:21',
        difficulty: 'Beginner',
        videoId: 'qEwKCR5JCog', // ScottHermanFitness
        description: 'Keep your core tight and do not flare your elbows. This video shows the standard barbell shoulder press.'
    },
    {
        id: 2,
        title: 'Deadlift Technique',
        category: 'Back',
        duration: '8:45',
        difficulty: 'Advanced',
        videoId: 'op9kVnSso6Q', // Jeremy Ethier
        description: 'Keep your back straight and lift with your legs. Avoid rounding your lower back.'
    },
    {
        id: 3,
        title: 'Squat Depth Guide',
        category: 'Legs',
        duration: '6:30',
        difficulty: 'Intermediate',
        videoId: 'U5zrloYWwxw', // Squat University
        description: 'Ensure your hips go below your knees for full range of motion. Learn proper depth.'
    },
    {
        id: 4,
        title: 'Bench Press 101',
        category: 'Chest',
        duration: '7:15',
        difficulty: 'Beginner',
        videoId: 'vcBig73ojpE',
        description: 'Master the bench press with correct form and safety tips.'
    },
];

const categories = ['All', 'Shoulder', 'Back', 'Chest', 'Legs'];

export default function MemberTutorials() {
    const { theme } = useTheme();
    const [activeCategory, setActiveCategory] = useState('All');
    const [activeVideo, setActiveVideo] = useState(null);
    const [playing, setPlaying] = useState(false);

    const filteredTutorials = activeCategory === 'All'
        ? tutorials
        : tutorials.filter(t => t.category === activeCategory);

    const handlePlayVideo = (tutorial) => {
        setActiveVideo(tutorial);
        setPlaying(true);
    };

    const handleCloseVideo = () => {
        setPlaying(false);
        setActiveVideo(null);
    };

    const isDark = theme === 'dark';

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#0a0a0a' : '#fafafa' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.subtitle, { color: isDark ? '#71717a' : '#a1a1aa' }]}>LEARN & IMPROVE</Text>
                        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#18181b' }]}>Tutorials {activeVideo && "Playing"}</Text>
                    </View>
                    <View style={[styles.searchButton, { backgroundColor: isDark ? '#18181b' : '#ffffff' }]}>
                        <Search size={20} color="#2563eb" />
                    </View>
                </View>

                {/* Video Player Section */}
                {activeVideo && (
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.playerContainer}
                    >
                        <View style={styles.videoWrapper}>
                            <YoutubePlayer
                                height={220}
                                videoId={activeVideo.videoId}
                                play={playing}
                                onChangeState={(state) => {
                                    if (state === 'ended') {
                                        setPlaying(false);
                                    }
                                }}
                            />
                        </View>
                        <View style={[styles.playerDetails, { backgroundColor: isDark ? '#18181b' : '#ffffff' }]}>
                            <View style={{ flex: 1, marginRight: 16 }}>
                                <Text style={[styles.videoTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>{activeVideo.title}</Text>
                                <Text style={[styles.videoDescription, { color: isDark ? '#a1a1aa' : '#71717a' }]}>{activeVideo.description}</Text>
                            </View>
                            <TouchableOpacity onPress={handleCloseVideo} style={styles.closeButton}>
                                <X size={20} color="#ef4444" />
                            </TouchableOpacity>
                        </View>
                    </MotiView>
                )}

                {/* Categories */}
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
                    {categories.map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            onPress={() => setActiveCategory(cat)}
                            style={[
                                styles.categoryChip,
                                activeCategory === cat
                                    ? { backgroundColor: '#2563eb', borderColor: '#2563eb' }
                                    : { backgroundColor: isDark ? '#18181b' : '#ffffff', borderColor: isDark ? '#27272a' : '#e4e4e7' }
                            ]}
                        >
                            <Text style={[
                                styles.categoryText,
                                { color: activeCategory === cat ? '#ffffff' : (isDark ? '#a1a1aa' : '#71717a') }
                            ]}>
                                {cat}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* List */}
                <View style={styles.listContainer}>
                    {filteredTutorials.map((tutorial, idx) => (
                        <TouchableOpacity
                            key={tutorial.id}
                            activeOpacity={0.8}
                            onPress={() => handlePlayVideo(tutorial)}
                        >
                            <MotiView
                                from={{ opacity: 0, translateX: 20 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: idx * 100 }}
                                style={[
                                    styles.card,
                                    {
                                        backgroundColor: isDark ? '#18181b' : '#ffffff',
                                        borderColor: isDark ? '#27272a' : '#e4e4e7'
                                    }
                                ]}
                            >
                                <View style={styles.thumbnailContainer}>
                                    <Image
                                        source={{ uri: `https://img.youtube.com/vi/${tutorial.videoId}/hqdefault.jpg` }}
                                        style={styles.thumbnail}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.playOverlay}>
                                        <View style={styles.playButton}>
                                            <Play size={16} color="#2563eb" fill="#2563eb" />
                                        </View>
                                    </View>
                                    <View style={styles.durationBadge}>
                                        <Text style={styles.durationText}>{tutorial.duration}</Text>
                                    </View>
                                </View>

                                <View style={styles.cardContent}>
                                    <View style={styles.cardHeader}>
                                        <View style={styles.categoryBadge}>
                                            <Text style={styles.categoryBadgeText}>{tutorial.category}</Text>
                                        </View>
                                    </View>
                                    <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#18181b' }]} numberOfLines={2}>{tutorial.title}</Text>
                                    <View style={styles.cardFooter}>
                                        <Tag size={12} color="#71717a" style={{ marginRight: 4 }} />
                                        <Text style={[styles.difficultyText, { color: isDark ? '#71717a' : '#a1a1aa' }]}>{tutorial.difficulty}</Text>
                                    </View>
                                </View>
                            </MotiView>
                        </TouchableOpacity>
                    ))}
                </View>

                {filteredTutorials.length === 0 && (
                    <View style={styles.emptyState}>
                        <BookOpen size={48} color={isDark ? '#27272a' : '#e4e4e7'} />
                        <Text style={[styles.emptyText, { color: isDark ? '#52525b' : '#a1a1aa' }]}>No tutorials found.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    subtitle: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    title: {
        fontSize: 30,
        fontWeight: '700',
    },
    searchButton: {
        padding: 12,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    playerContainer: {
        marginBottom: 32,
        borderRadius: 24,
        overflow: 'hidden',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
    videoWrapper: {
        backgroundColor: '#000',
        height: 220,
        position: 'relative',
    },
    videoThumbnail: {
        width: '100%',
        height: 220,
    },
    playOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    playerDetails: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    videoTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 4,
    },
    videoDescription: {
        fontSize: 12,
    },
    closeButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: 8,
        borderRadius: 999,
    },
    categoriesScroll: {
        marginBottom: 24,
        flexGrow: 0,
    },
    categoryChip: {
        marginRight: 12,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 999,
        borderWidth: 1,
    },
    categoryText: {
        fontWeight: '700',
        fontSize: 14,
    },
    listContainer: {
        gap: 16,
    },
    card: {
        borderWidth: 1,
        borderRadius: 24,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    thumbnailContainer: {
        width: 100,
        height: 100,
        borderRadius: 16,
        overflow: 'hidden',
        position: 'relative',
        marginRight: 16,
        backgroundColor: '#000',
    },
    thumbnail: {
        width: '100%',
        height: '100%',
    },
    playOverlay: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    playButton: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: 8,
        borderRadius: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    durationBadge: {
        position: 'absolute',
        bottom: 6,
        right: 6,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
    },
    durationText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
    },
    cardHeader: {
        flexDirection: 'row',
        marginBottom: 6,
    },
    categoryBadge: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    categoryBadgeText: {
        color: '#2563eb',
        fontSize: 10,
        fontWeight: '800',
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    difficultyText: {
        fontSize: 12,
    },
    emptyState: {
        paddingVertical: 60,
        alignItems: 'center',
    },
    emptyText: {
        marginTop: 16,
        fontWeight: '600',
    },
});
