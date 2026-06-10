import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Bell, ChevronRight, Dumbbell, Flame, TrendingUp } from 'lucide-react-native';
import { MotiText, MotiView } from 'moti';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    ImageBackground,
    NativeSyntheticEvent,
    NativeScrollEvent,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACKEND_URL } from '../../app.config.env';
import { useTheme } from '../../src/context/ThemeContext';

const { width: W } = Dimensions.get('window');

// ── MOTIVATIONAL QUOTES ──────────────────────────────────────────────
const QUOTES = [
    "Push your limits. 💪",
    "Every rep counts. 🔥",
    "No pain, no gain.",
    "Be stronger than yesterday. ⚡",
    "Sweat is just fat crying. 😤",
];

// ── HERO CAROUSEL SLIDES ─────────────────────────────────────────────
const SLIDES = [
    {
        uri: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=90',
        label: 'Real-Time Pose Detection',
        sub: 'MoveNet — 17 Joint Tracking',
    },
    {
        uri: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=900&q=90',
        label: 'Live Squat Analysis',
        sub: 'Depth & Knee Alignment',
    },
    {
        uri: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=90',
        label: 'Bicep Curl Form Check',
        sub: 'Elbow Angle Monitoring',
    },
    {
        uri: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=90',
        label: 'Push-Up Rep Counter',
        sub: 'Chest-to-Ground Depth',
    },
];

// ── FIXED POPULAR EXERCISES ──────────────────────────────────────────
const POPULAR = [
    { name: 'Bicep Curls', color: '#5B8AF5', img: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400&q=80' },
    { name: 'Lateral Raise', color: '#E07B6A', img: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80' },
    { name: 'Squat', color: '#4CAF93', img: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80' },
    { name: 'Push Up', color: '#9B72CF', img: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80' },
];

export default function MemberDashboard() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>(null);
    const [stats, setStats] = useState({ totalSets: 0, totalReps: 0, streak: 7 });
    const [quoteIdx, setQuoteIdx] = useState(0);
    const [slideIdx, setSlideIdx] = useState(0);
    const carouselRef = useRef<FlatList>(null);
    const autoSlide = useRef<NodeJS.Timeout>();

    // ── Load data ──
    useEffect(() => { loadData(); }, []);

    const loadData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const user = JSON.parse(data);
                setUserData(user);
                const uid = user.userId || user.id;
                if (uid) await fetchStats(uid);
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const fetchStats = async (userId: any) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const res = await axios.get(
                `${BACKEND_URL}/workouts/user/${userId}?startDate=${today}&endDate=${today}`
            );
            if (res.data.success && res.data.workouts.length > 0) {
                const ws = res.data.workouts;
                const totalReps = ws.reduce((s: number, w: any) => s + (w.totalReps || 0), 0);
                const totalSets = ws.reduce((s: number, w: any) => s + (w.exercises?.length || 0), 0);
                setStats({ totalSets, totalReps, streak: 7 });
            }
        } catch (e) { console.error(e); }
    };

    // ── Quote cycle ──
    useEffect(() => {
        const t = setInterval(() => setQuoteIdx(i => (i + 1) % QUOTES.length), 3500);
        return () => clearInterval(t);
    }, []);

    // ── Auto-slide carousel ──
    useEffect(() => {
        autoSlide.current = setInterval(() => {
            setSlideIdx(i => {
                const next = (i + 1) % SLIDES.length;
                carouselRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 3500);
        return () => clearInterval(autoSlide.current);
    }, []);

    const onCarouselScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
        const idx = Math.round(e.nativeEvent.contentOffset.x / W);
        setSlideIdx(idx);
        clearInterval(autoSlide.current);
        autoSlide.current = setInterval(() => {
            setSlideIdx(i => {
                const next = (i + 1) % SLIDES.length;
                carouselRef.current?.scrollToIndex({ index: next, animated: true });
                return next;
            });
        }, 3500);
    };

    const getGreeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good Morning';
        if (h < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return (
            <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f3f4f6' }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f3f4f6' }]}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* ── TOP BAR ── */}
                <View style={styles.topBar}>
                    <Pressable onPress={() => router.push('/(member)/profile')} style={styles.avatarWrapper}>
                        <Image
                            source={{ uri: userData?.images?.[0] || 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.avatar}
                        />
                        <View style={styles.onlineDot} />
                    </Pressable>
                    <View style={styles.greetBlock}>
                        <Text style={[styles.greetSmall, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
                            {getGreeting()}
                        </Text>
                        <Text style={[styles.greetName, { color: isDark ? '#ffffff' : '#111827' }]}>
                            {userData?.name?.split(' ')[0] || 'Member'} 👋
                        </Text>
                    </View>
                    <Pressable style={[styles.bellBtn, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <Bell size={20} color={isDark ? '#94a3b8' : '#374151'} />
                    </Pressable>
                </View>

                {/* ── ANIMATED MOTIVATIONAL QUOTE ── */}
                <MotiView
                    from={{ opacity: 0, translateY: 10 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 700 }}
                    style={[styles.quoteBanner, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}
                >
                    <MotiText
                        key={quoteIdx}
                        from={{ opacity: 0, translateY: 12 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 600 }}
                        style={[styles.quoteText, { color: isDark ? '#facc15' : '#1d4ed8' }]}
                    >
                        {QUOTES[quoteIdx]}
                    </MotiText>
                    <Text style={[styles.quoteSub, { color: isDark ? '#64748b' : '#9ca3af' }]}>
                        Keep going. You're doing great!
                    </Text>
                </MotiView>

                {/* ── HERO IMAGE CAROUSEL ── */}
                <View style={styles.carouselSection}>
                    <Text style={[styles.sectionLabel, { color: isDark ? '#ffffff' : '#111827' }]}>
                        Today Workouts ({stats.totalSets || '—'})
                    </Text>

                    <FlatList
                        ref={carouselRef}
                        data={SLIDES}
                        horizontal
                        pagingEnabled
                        snapToInterval={W - 40}
                        decelerationRate="fast"
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={onCarouselScroll}
                        keyExtractor={(_, i) => i.toString()}
                        renderItem={({ item }) => (
                            <ImageBackground
                                source={{ uri: item.uri }}
                                style={styles.slide}
                                imageStyle={styles.slideImage}
                            >
                                <LinearGradient
                                    colors={['transparent', 'rgba(0,0,0,0.78)']}
                                    style={styles.slideGradient}
                                >
                                    <View style={styles.slideBottom}>
                                        <View style={styles.jointBadge}>
                                            <Text style={styles.jointBadgeText}>🦾 17 Joint Tracking</Text>
                                        </View>
                                        <Text style={styles.slideTitle}>{item.label}</Text>
                                        <Text style={styles.slideSub}>{item.sub}</Text>
                                    </View>
                                </LinearGradient>
                            </ImageBackground>
                        )}
                    />

                    {/* Dot indicators */}
                    <View style={styles.dotsRow}>
                        {SLIDES.map((_, i) => (
                            <MotiView
                                key={i}
                                animate={{
                                    width: i === slideIdx ? 24 : 7,
                                    backgroundColor: i === slideIdx ? '#2563eb' : '#cbd5e1',
                                }}
                                transition={{ type: 'timing', duration: 300 }}
                                style={styles.dot}
                            />
                        ))}
                    </View>
                </View>

                {/* ── POPULAR EXERCISES ── */}
                <View style={styles.sectionRow}>
                    <Text style={[styles.sectionLabel, { color: isDark ? '#ffffff' : '#111827' }]}>
                        Popular Exercise
                    </Text>
                    <Pressable onPress={() => router.push('/(member)/tutorials')}>
                        <Text style={styles.seeAll}>See all</Text>
                    </Pressable>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.exRow}>
                    {POPULAR.map((ex, i) => (
                        <MotiView
                            key={i}
                            from={{ opacity: 0, translateY: 24 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 500, delay: i * 80 }}
                            style={styles.exCard}
                        >
                            <ImageBackground
                                source={{ uri: ex.img }}
                                style={styles.exImage}
                                imageStyle={styles.exImageStyle}
                            >
                                <LinearGradient
                                    colors={['transparent', ex.color + 'dd']}
                                    style={StyleSheet.absoluteFill}
                                />
                            </ImageBackground>
                            <Text style={styles.exName} numberOfLines={2}>{ex.name}</Text>
                        </MotiView>
                    ))}
                </ScrollView>

                {/* ── STATS ROW ── */}
                <View style={styles.statsRow}>
                    <StatChip icon={Dumbbell} label="Exercises" value={stats.totalSets} color="#2563eb" isDark={isDark} />
                    <StatChip icon={TrendingUp} label="Total Reps" value={stats.totalReps} color="#059669" isDark={isDark} />
                    <StatChip icon={Flame} label="Streak" value={stats.streak} color="#dc2626" isDark={isDark} />
                </View>

                {/* ── QUICK LINKS ── */}
                <View style={[styles.quickLinks, { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
                    {[
                        { label: '📊 View Detailed Reports', route: '/(member)/reports' },
                        { label: '🎥 Browse Tutorials', route: '/(member)/tutorials' },
                        { label: '💬 Give Feedback', route: '/(member)/feedback' },
                    ].map((item, i) => (
                        <View key={i}>
                            {i > 0 && <View style={[styles.divider, { backgroundColor: isDark ? '#1e293b' : '#e5e7eb' }]} />}
                            <Pressable style={styles.quickLink} onPress={() => router.push(item.route as any)}>
                                <Text style={[styles.quickLinkText, { color: isDark ? '#ffffff' : '#111827' }]}>
                                    {item.label}
                                </Text>
                                <ChevronRight size={18} color="#2563eb" />
                            </Pressable>
                        </View>
                    ))}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

function StatChip({ icon: Icon, label, value, color, isDark }: any) {
    return (
        <View style={[styles.statChip, { backgroundColor: isDark ? '#0f172a' : '#ffffff', borderColor: isDark ? '#1e293b' : '#e5e7eb' }]}>
            <View style={[styles.statChipIcon, { backgroundColor: color + '20' }]}>
                <Icon size={18} color={color} />
            </View>
            <Text style={[styles.statChipValue, { color }]}>{value}</Text>
            <Text style={[styles.statChipLabel, { color: isDark ? '#94a3b8' : '#6b7280' }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingBottom: 40, paddingTop: 8 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

    // Top bar
    topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 12 },
    avatarWrapper: { position: 'relative' },
    avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#2563eb' },
    onlineDot: { position: 'absolute', bottom: 1, right: 1, width: 12, height: 12, borderRadius: 6, backgroundColor: '#22c55e', borderWidth: 2, borderColor: '#fff' },
    greetBlock: { flex: 1 },
    greetSmall: { fontSize: 12, fontWeight: '500' },
    greetName: { fontSize: 20, fontWeight: '800' },
    bellBtn: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },

    // Quote banner
    quoteBanner: { borderRadius: 18, padding: 18, marginBottom: 22, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
    quoteText: { fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
    quoteSub: { fontSize: 13, fontWeight: '500' },

    // Carousel
    carouselSection: { marginBottom: 24 },
    sectionLabel: { fontSize: 18, fontWeight: '800', marginBottom: 12 },
    slide: { width: W - 40, height: 230, borderRadius: 22, overflow: 'hidden', marginRight: 12 },
    slideImage: { borderRadius: 22 },
    slideGradient: { flex: 1, justifyContent: 'flex-end', padding: 18 },
    slideBottom: { gap: 4 },
    jointBadge: { backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14, alignSelf: 'flex-start', marginBottom: 4 },
    jointBadgeText: { color: '#ffffff', fontSize: 11, fontWeight: '700' },
    slideTitle: { color: '#ffffff', fontSize: 22, fontWeight: '900' },
    slideSub: { color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '500' },
    dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
    dot: { height: 7, borderRadius: 4 },

    // Section row
    sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    seeAll: { fontSize: 14, fontWeight: '600', color: '#2563eb' },

    // Exercise cards
    exRow: { paddingRight: 8, gap: 14 },
    exCard: { width: 120, borderRadius: 20, overflow: 'hidden' },
    exImage: { width: '100%', height: 100 },
    exImageStyle: { borderRadius: 16 },
    exName: { fontSize: 13, fontWeight: '700', padding: 10, color: '#ffffff', position: 'absolute', bottom: 0, left: 0, right: 0, textAlign: 'center' },

    // Stat chips
    statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 20 },
    statChip: { flex: 1, borderRadius: 18, borderWidth: 1, padding: 14, alignItems: 'center', gap: 4 },
    statChipIcon: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
    statChipValue: { fontSize: 22, fontWeight: '900' },
    statChipLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

    // Quick links
    quickLinks: { borderRadius: 20, borderWidth: 1, overflow: 'hidden' },
    quickLink: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 18 },
    quickLinkText: { fontSize: 15, fontWeight: '600' },
    divider: { height: 1 },
});
