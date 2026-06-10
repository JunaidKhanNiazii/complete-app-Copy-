import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BarChart2, Calendar, ChevronDown, ChevronUp, Clock, Dumbbell, TrendingUp } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

const { width } = Dimensions.get('window');
import { BACKEND_URL } from '../../app.config.env';

export default function MemberReports() {
    const { theme } = useTheme();
    const [expanded, setExpanded] = useState(null);
    const [timeFilter, setTimeFilter] = useState('Weekly');
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingWorkouts, setLoadingWorkouts] = useState(true);
    const [userData, setUserData] = useState(null);
    const [statsData, setStatsData] = useState(null);
    const [workoutsData, setWorkoutsData] = useState([]);

    const isDark = theme === 'dark';

    useEffect(() => {
        loadUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            setLoadingStats(true);
            setLoadingWorkouts(true);
            fetchWorkoutStats();
            fetchWorkouts();
        }
    }, [timeFilter, userData]);

    // Auto-expand first date when workouts load
    useEffect(() => {
        if (workoutsData.length > 0 && !expanded) {
            const dates = Object.keys(groupedWorkouts).sort().reverse();
            if (dates.length > 0) {
                setExpanded(dates[0]);
            }
        }
    }, [workoutsData]);

    const loadUserData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const user = JSON.parse(data);
                setUserData(user);
            }
        } catch (error) {
            console.error('Load user data error:', error);
        }
    };

    const fetchWorkoutStats = async () => {
        if (!userData) return;

        setLoadingStats(true);
        try {
            const periodMap = {
                'Daily': 'daily',
                'Weekly': 'weekly',
                'Monthly': 'monthly'
            };

            const response = await axios.get(
                `${BACKEND_URL}/workouts/stats/${userData.userId || userData.id}?period=${periodMap[timeFilter] || 'weekly'}`
            );

            if (response.data.success) {
                setStatsData(response.data.stats);
            }
        } catch (error) {
            console.error('Fetch stats error:', error);
        } finally {
            setLoadingStats(false);
        }
    };

    const fetchWorkouts = async () => {
        if (!userData) return;

        try {
            // Calculate date range based on filter
            const endDate = new Date();
            const startDate = new Date();

            if (timeFilter === 'Daily') {
                // For daily, get today's date only
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(23, 59, 59, 999);
            } else if (timeFilter === 'Weekly') {
                startDate.setDate(endDate.getDate() - 7);
                startDate.setHours(0, 0, 0, 0);
            } else if (timeFilter === 'Monthly') {
                startDate.setDate(endDate.getDate() - 30);
                startDate.setHours(0, 0, 0, 0);
            }

            const startDateStr = startDate.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            console.log(`[Reports] Fetching workouts for ${timeFilter}`);
            console.log(`[Reports] Date range: ${startDateStr} to ${endDateStr}`);
            console.log(`[Reports] User ID: ${userData.userId || userData.id}`);

            const response = await axios.get(
                `${BACKEND_URL}/workouts/user/${userData.userId || userData.id}?startDate=${startDateStr}&endDate=${endDateStr}`
            );

            console.log(`[Reports] API Response:`, response.data);

            if (response.data.success) {
                const workouts = response.data.workouts || [];
                console.log(`[Reports] Found ${workouts.length} workouts for ${timeFilter}`);
                console.log(`[Reports] Workout dates:`, workouts.map(w => w.date));
                setWorkoutsData(workouts);
            } else {
                console.log(`[Reports] API returned success: false`);
                setWorkoutsData([]);
            }
        } catch (error) {
            console.error('[Reports] Fetch workouts error:', error);
            console.error('[Reports] Error details:', error.response?.data || error.message);
            setWorkoutsData([]);
        }
    };

    const toggleExpand = (category) => {
        setExpanded(expanded === category ? null : category);
    };

    // Group workouts by date for display
    const groupedWorkouts = workoutsData.reduce((acc, workout) => {
        const date = workout.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(workout);
        return acc;
    }, {});

    // Auto-expand first date when workouts load or filter changes
    useEffect(() => {
        if (workoutsData.length > 0) {
            const dates = Object.keys(groupedWorkouts).sort().reverse();
            if (dates.length > 0) {
                setExpanded(dates[0]);
            }
        } else {
            setExpanded(null);
        }
    }, [workoutsData, timeFilter]);

    // Prepare chart data for weekly view
    const getChartData = () => {
        // Generate last 7 days
        const last7Days = [];
        const today = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            last7Days.push(date.toISOString().split('T')[0]);
        }

        // Get labels (day initials)
        const labels = last7Days.map(dateStr => {
            const d = new Date(dateStr);
            return ['S', 'M', 'T', 'W', 'T', 'F', 'S'][d.getDay()];
        });

        // Get data from statsData or default to 0
        const data = last7Days.map(dateStr => {
            if (statsData && statsData.workoutsByDate && statsData.workoutsByDate[dateStr]) {
                return statsData.workoutsByDate[dateStr].exercises || 0;
            }
            return 0;
        });

        // Ensure at least one non-zero value for chart to render properly
        const hasData = data.some(val => val > 0);
        if (!hasData) {
            data[data.length - 1] = 0.1; // Add tiny value to show chart structure
        }

        console.log('[Reports] Chart data:', { labels, data, last7Days });

        return {
            labels,
            datasets: [{
                data,
                color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
                strokeWidth: 3
            }]
        };
    };

    const getFilterLabel = () => {
        return timeFilter.charAt(0).toUpperCase() + timeFilter.slice(1);
    };

    if (loadingStats && !statsData) {
        return (
            <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
                <ReportSkeleton isDark={isDark} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>ANALYTICS</Text>
                    <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>{timeFilter} Report</Text>
                </View>

                {/* Filter Tabs */}
                <View style={[styles.filterContainer, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                    {['Daily', 'Weekly', 'Monthly'].map((filter) => {
                        const isActive = timeFilter === filter;
                        return (
                            <Pressable
                                key={filter}
                                onPress={() => setTimeFilter(filter)}
                                style={[
                                    styles.filterButton,
                                    isActive && { backgroundColor: isDark ? '#0f172a' : '#eff6ff' }
                                ]}
                            >
                                <Text style={[
                                    styles.filterText,
                                    { color: isActive ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b') }
                                ]}>
                                    {filter}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>

                {/* LINE CHART FOR WEEKLY REPORT */}
                {timeFilter === 'Weekly' && statsData && (
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        style={[styles.chartCard, {
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0'
                        }]}
                    >
                        <View style={styles.chartHeader}>
                            <Text style={[styles.chartTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>Weekly Activity</Text>
                            <TrendingUp size={20} color="#10b981" />
                        </View>

                        <LineChart
                            data={getChartData()}
                            width={width - 80} // Card padding compensation
                            height={180}
                            yAxisLabel=""
                            yAxisSuffix=""
                            chartConfig={{
                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                backgroundGradientFrom: isDark ? '#1e293b' : '#ffffff',
                                backgroundGradientTo: isDark ? '#1e293b' : '#ffffff',
                                decimalPlaces: 0,
                                color: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(15, 23, 42, ${opacity})`,
                                labelColor: (opacity = 1) => isDark ? `rgba(148, 163, 184, ${opacity})` : `rgba(100, 116, 139, ${opacity})`,
                                style: {
                                    borderRadius: 16
                                },
                                propsForDots: {
                                    r: "4",
                                    strokeWidth: "2",
                                    stroke: "#2563eb"
                                },
                                propsForBackgroundLines: {
                                    strokeDasharray: '', // solid lines
                                    stroke: isDark ? '#334155' : '#e2e8f0',
                                    strokeWidth: 1
                                }
                            }}
                            bezier
                            style={{
                                marginVertical: 8,
                                borderRadius: 16,
                                paddingRight: 40 // Fix for right label cut-off
                            }}
                            withVerticalLines={false}
                        />

                        <View style={styles.chartLegend}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendDot, { backgroundColor: '#2563eb' }]} />
                                <Text style={[styles.legendText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                    Exercises per day
                                </Text>
                            </View>
                        </View>
                    </MotiView>
                )}

                {/* Report Categories List - Real Data */}
                {Object.keys(groupedWorkouts).length > 0 ? (
                    Object.keys(groupedWorkouts).sort().reverse().map((date, index) => {
                        const workoutsForDate = groupedWorkouts[date];
                        const isExpanded = expanded === date;

                        // Format date for display
                        const dateObj = new Date(date);
                        const formattedDate = dateObj.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                        });

                        return (
                            <View
                                key={`${timeFilter}-${date}-${index}`}
                                style={[styles.categoryCard, {
                                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                            >
                                <Pressable
                                    onPress={() => toggleExpand(date)}
                                    style={styles.categoryHeader}
                                >
                                    <View style={styles.categoryHeaderLeft}>
                                        <View style={styles.iconContainer}>
                                            <Calendar size={18} color="#2563eb" />
                                        </View>
                                        <View>
                                            <Text style={[styles.categoryTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                                {formattedDate}
                                            </Text>
                                            <Text style={[styles.categorySubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                                {workoutsForDate.length} workout{workoutsForDate.length > 1 ? 's' : ''}
                                            </Text>
                                        </View>
                                    </View>
                                    {isExpanded ?
                                        <ChevronUp size={20} color={isDark ? '#94a3b8' : '#64748b'} /> :
                                        <ChevronDown size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                                    }
                                </Pressable>

                                {isExpanded && (
                                    <View style={styles.exerciseList}>
                                        {workoutsForDate.map((workout, wIdx) => (
                                            <View key={wIdx}>
                                                {workout.exercises && workout.exercises.map((ex, exIdx) => (
                                                    <View
                                                        key={`${wIdx}-${exIdx}`}
                                                        style={[styles.exerciseCard, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}
                                                    >
                                                        <Text style={[styles.exerciseName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                                            {ex.name}
                                                        </Text>
                                                        <View style={styles.statsRow}>
                                                            <StatItem
                                                                icon={TrendingUp}
                                                                label="Reps"
                                                                value={ex.reps || 0}
                                                                isDark={isDark}
                                                                color="#3b82f6"
                                                            />
                                                            <StatItem
                                                                icon={Clock}
                                                                label="Time"
                                                                value={ex.time || '-'}
                                                                isDark={isDark}
                                                                color="#2563eb"
                                                            />
                                                            <StatItem
                                                                icon={Dumbbell}
                                                                label="Duration"
                                                                value={workout.totalDuration || '-'}
                                                                isDark={isDark}
                                                            />
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        ))}
                                    </View>
                                )}
                            </View>
                        );
                    })
                ) : (
                    <View style={[styles.emptyState, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <Dumbbell size={48} color={isDark ? '#475569' : '#cbd5e1'} />
                        <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            No workouts found for this period
                        </Text>
                        <Text style={[styles.emptySubtext, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                            Start tracking your workouts to see reports here
                        </Text>
                    </View>
                )}

                {/* Summary Section */}
                <View style={[styles.summaryCard, {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0'
                }]}>
                    <View style={styles.summaryHeader}>
                        <View>
                            <Text style={[styles.summaryTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>Performance Summary</Text>
                            <Text style={[styles.summarySubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>{timeFilter} Overview</Text>
                        </View>
                        <BarChart2 size={24} color="#2563eb" />
                    </View>

                    <View style={styles.summaryBoxes}>
                        <SummaryBox
                            title="Workouts"
                            value={statsData?.totalWorkouts || 0}
                            isDark={isDark}
                            color="#3b82f6"
                        />
                        <SummaryBox
                            title="Total Sets"
                            value={statsData?.totalSets || 0}
                            isDark={isDark}
                            color="#2563eb"
                        />
                        <SummaryBox
                            title="Exercises"
                            value={statsData?.totalExercises || 0}
                            isDark={isDark}
                        />
                    </View>

                    {statsData && statsData.totalWorkouts > 0 && (
                        <View style={[styles.insightBanner, { backgroundColor: isDark ? 'rgba(249, 115, 22, 0.1)' : '#fff7ed' }]}>
                            <TrendingUp size={16} color="#f97316" />
                            <Text style={[styles.insightText, { color: '#f97316' }]}>
                                Great progress this {timeFilter.toLowerCase()}! Keep it up! 💪
                            </Text>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const StatItem = ({ icon: Icon, label, value, isDark, color }) => (
    <View style={styles.statItem}>
        <Icon size={14} color={color || (isDark ? '#94a3b8' : '#64748b')} />
        <Text style={[styles.statLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>{label}</Text>
        <Text style={[styles.statValue, { color: color || (isDark ? '#ffffff' : '#0f172a') }]}>{value}</Text>
    </View>
);

const SummaryBox = ({ title, value, isDark, color }) => (
    <View style={[styles.summaryBox, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
        <Text style={[styles.summaryBoxTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>{title}</Text>
        <Text style={[styles.summaryBoxValue, { color: color || (isDark ? '#ffffff' : '#0f172a') }]}>{value}</Text>
    </View>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    header: {
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
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        padding: 4,
        borderRadius: 16,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        borderRadius: 12,
    },
    filterText: {
        fontWeight: '700',
        fontSize: 14,
    },
    chartCard: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 24,
        overflow: 'hidden',
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    chartLegend: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: 'rgba(148, 163, 184, 0.1)',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 12,
        fontWeight: '600',
    },
    categoryCard: {
        marginBottom: 16,
        borderRadius: 24,
        borderWidth: 1,
        overflow: 'hidden',
    },
    categoryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
    },
    categoryHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categorySubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    iconContainer: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        padding: 8,
        borderRadius: 999,
        marginRight: 12,
    },
    categoryTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    exerciseList: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    exerciseCard: {
        marginBottom: 12,
        padding: 16,
        borderRadius: 16,
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 12,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        marginTop: 4,
    },
    statValue: {
        fontSize: 13,
        fontWeight: '700',
        marginTop: 2,
    },
    summaryCard: {
        padding: 24,
        borderRadius: 32,
        borderWidth: 1,
        marginBottom: 40,
    },
    summaryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    summaryTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    summarySubtitle: {
        fontSize: 12,
        marginTop: 2,
    },
    summaryBoxes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    summaryBox: {
        flex: 1,
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        marginHorizontal: 4,
    },
    summaryBoxTitle: {
        fontSize: 10,
        textTransform: 'uppercase',
        fontWeight: '700',
        marginBottom: 6,
    },
    summaryBoxValue: {
        fontSize: 18,
        fontWeight: '900',
    },
    insightBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        gap: 12,
    },
    insightText: {
        fontSize: 12,
        fontWeight: '700',
        flex: 1,
    },
    emptyState: {
        padding: 40,
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '700',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
    },
});

const ReportSkeleton = ({ isDark }) => {
    const baseColor = isDark ? '#1e293b' : '#e2e8f0';

    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
            {/* Header Skeleton */}
            <View style={styles.header}>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                    style={{ width: 80, height: 16, backgroundColor: baseColor, borderRadius: 4, marginBottom: 8 }}
                />
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                    style={{ width: 150, height: 36, backgroundColor: baseColor, borderRadius: 8 }}
                />
            </View>

            {/* Filter Tabs Skeleton */}
            <View style={[styles.filterContainer, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
                {[1, 2, 3].map((i) => (
                    <MotiView
                        key={i}
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing', duration: 1000, loop: true }}
                        style={[styles.filterButton, { backgroundColor: baseColor, marginHorizontal: 4, height: 40 }]}
                    />
                ))}
            </View>

            {/* Chart Card Skeleton */}
            <MotiView
                from={{ opacity: 0.5 }}
                animate={{ opacity: 1 }}
                transition={{ type: 'timing', duration: 1000, loop: true }}
                style={[styles.chartCard, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: baseColor, height: 260 }]}
            >
                <View style={[styles.chartHeader, { marginBottom: 20 }]}>
                    <View style={{ width: 120, height: 24, backgroundColor: baseColor, borderRadius: 4 }} />
                    <View style={{ width: 24, height: 24, backgroundColor: baseColor, borderRadius: 12 }} />
                </View>
                <View style={{ flex: 1, backgroundColor: baseColor, borderRadius: 16 }} />
            </MotiView>

            {/* Category Cards Skeleton */}
            {[1, 2].map((i) => (
                <MotiView
                    key={`cat-${i}`}
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                    style={[styles.categoryCard, { backgroundColor: isDark ? '#0f172a' : '#f8fafc', borderColor: baseColor, height: 80, padding: 20 }]}
                >
                    <View style={styles.categoryHeaderLeft}>
                        <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: baseColor, marginRight: 12 }} />
                        <View>
                            <View style={{ width: 100, height: 20, backgroundColor: baseColor, borderRadius: 4, marginBottom: 6 }} />
                            <View style={{ width: 60, height: 14, backgroundColor: baseColor, borderRadius: 4 }} />
                        </View>
                    </View>
                </MotiView>
            ))}
        </ScrollView>
    );
};
