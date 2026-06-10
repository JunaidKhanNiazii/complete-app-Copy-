import axios from 'axios';
import { BarChart3, TrendingUp, Users } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';
const screenWidth = Dimensions.get('window').width;

export default function AdminAnalytics() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const [period, setPeriod] = useState('7');
    const [analytics, setAnalytics] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchAnalytics();
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/admin/analytics?period=${period}`);
            if (response.data.success) {
                setAnalytics(response.data.analytics);
            }
        } catch (error: any) {
            console.error('Fetch analytics error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchAnalytics();
    };

    const chartConfig = {
        backgroundColor: isDark ? '#1e293b' : '#ffffff',
        backgroundGradientFrom: isDark ? '#1e293b' : '#ffffff',
        backgroundGradientTo: isDark ? '#1e293b' : '#ffffff',
        decimalPlaces: 0,
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(100, 116, 139, ${opacity})`,
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#2563eb',
        },
    };

    const dailyData = analytics?.dailyData || [];
    const topExercises = analytics?.topExercises || [];

    // Prepare chart data
    const chartData = {
        labels: dailyData.slice(-7).map((d: any) => {
            const date = new Date(d.date);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        }),
        datasets: [
            {
                data: dailyData.slice(-7).map((d: any) => d.activeUsers || 0),
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
                }
            >
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                            Analytics
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            Real-time Statistics
                        </Text>
                    </View>
                </View>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    {['7', '14', '30'].map((p) => (
                        <Pressable
                            key={p}
                            onPress={() => setPeriod(p)}
                            style={[
                                styles.periodButton,
                                {
                                    backgroundColor: period === p ? '#2563eb' : (isDark ? '#1e293b' : '#ffffff'),
                                    borderColor: period === p ? '#2563eb' : (isDark ? '#334155' : '#e2e8f0'),
                                }
                            ]}
                        >
                            <Text style={[
                                styles.periodText,
                                { color: period === p ? '#ffffff' : (isDark ? '#94a3b8' : '#64748b') }
                            ]}>
                                {p} Days
                            </Text>
                        </Pressable>
                    ))}
                </View>

                {/* Active Users Chart */}
                {loading ? (
                    <View style={[styles.chartCard, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0'
                    }]}>
                        <View style={styles.chartHeader}>
                            <View style={[styles.skeletonCircle, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />
                            <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 140, height: 16 }]} />
                        </View>
                        <View style={[styles.skeletonChart, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />
                    </View>
                ) : dailyData.length > 0 ? (
                    <View style={[styles.chartCard, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0'
                    }]}>
                        <View style={styles.chartHeader}>
                            <Users size={20} color="#2563eb" />
                            <Text style={[styles.chartTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                Active Users Trend
                            </Text>
                        </View>
                        <LineChart
                            data={chartData}
                            width={screenWidth - 80}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                            withInnerLines={false}
                            withOuterLines={true}
                            withVerticalLabels={true}
                            withHorizontalLabels={true}
                        />
                    </View>
                ) : null}

                {/* Top Exercises */}
                <View style={styles.sectionHeader}>
                    <BarChart3 size={20} color="#2563eb" />
                    <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                        Top Exercises
                    </Text>
                </View>

                {loading ? (
                    <>
                        {[1, 2, 3, 4, 5].map((_, index) => (
                            <View
                                key={index}
                                style={[styles.exerciseCard, {
                                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                            >
                                <View style={[styles.exerciseRank, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]}>
                                    <View style={{ width: 14, height: 14 }} />
                                </View>
                                <View style={styles.exerciseInfo}>
                                    <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 120, height: 16, marginBottom: 4 }]} />
                                    <View style={styles.exerciseStats}>
                                        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 80, height: 12 }]} />
                                        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 60, height: 12 }]} />
                                        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 70, height: 12 }]} />
                                    </View>
                                </View>
                                <View style={[styles.skeletonCircle, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />
                            </View>
                        ))}
                    </>
                ) : topExercises.length > 0 ? (
                    topExercises.map((exercise: any, index: number) => (
                        <View
                            key={index}
                            style={[styles.exerciseCard, {
                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                borderColor: isDark ? '#334155' : '#e2e8f0'
                            }]}
                        >
                            <View style={styles.exerciseRank}>
                                <Text style={styles.rankText}>#{index + 1}</Text>
                            </View>
                            <View style={styles.exerciseInfo}>
                                <Text style={[styles.exerciseName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                    {exercise.name}
                                </Text>
                                <View style={styles.exerciseStats}>
                                    <Text style={[styles.exerciseStat, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                        {exercise.count} workouts
                                    </Text>
                                    <Text style={[styles.exerciseStat, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                        • {exercise.totalSets} sets
                                    </Text>
                                    <Text style={[styles.exerciseStat, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                        • {exercise.totalReps} reps
                                    </Text>
                                </View>
                            </View>
                            <TrendingUp size={20} color="#2563eb" />
                        </View>
                    ))
                ) : (
                    <View style={[styles.emptyCard, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0'
                    }]}>
                        <Text style={[styles.emptyText, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                            No exercise data available yet
                        </Text>
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
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
        marginTop: 4,
    },
    periodSelector: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 24,
    },
    periodButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
    },
    periodText: {
        fontSize: 14,
        fontWeight: '700',
    },
    chartCard: {
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 24,
    },
    chartHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    exerciseCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    exerciseRank: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    rankText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '900',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 4,
    },
    exerciseStats: {
        flexDirection: 'row',
        gap: 8,
    },
    exerciseStat: {
        fontSize: 12,
        fontWeight: '600',
    },
    emptyCard: {
        padding: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 14,
        fontWeight: '600',
    },
    skeletonText: {
        borderRadius: 4,
        opacity: 0.3,
    },
    skeletonCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        opacity: 0.3,
    },
    skeletonChart: {
        width: '100%',
        height: 220,
        borderRadius: 16,
        opacity: 0.3,
        marginVertical: 8,
    },
});
