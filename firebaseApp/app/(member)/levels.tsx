import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACKEND_URL } from '../../app.config.env';
import { useTheme } from '../../src/context/ThemeContext';

const { width } = Dimensions.get('window');

export default function Levels() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [gamification, setGamification] = useState(null);
    const [allLevels, setAllLevels] = useState({});
    const [userId, setUserId] = useState(null);
    const [checking, setChecking] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                setUserId(user.userId);
                await fetchLevelData(user.userId);
            }
        } catch (error) {
            console.error('Load user data error:', error);
        }
    };

    const fetchLevelData = async (uid) => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_URL}/member/level`, {
                params: { userId: uid }
            });

            if (response.data.success) {
                setGamification(response.data.gamification);
                setAllLevels(response.data.allLevels);
            }
        } catch (error) {
            console.error('Fetch level data error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (userId) {
            fetchLevelData(userId);
        }
    };

    const checkLatestWorkout = async () => {
        if (!userId) return;

        try {
            setChecking(true);

            // Fetch latest workout
            const workoutResponse = await axios.get(`${BACKEND_URL}/member/${userId}/workouts`);

            if (workoutResponse.data.success && workoutResponse.data.workouts.length > 0) {
                const latestWorkout = workoutResponse.data.workouts[0];

                // Check if it completes current level
                const checkResponse = await axios.post(`${BACKEND_URL}/member/level/check`, {
                    userId: userId,
                    exercises: latestWorkout.exercises
                });

                if (checkResponse.data.success) {
                    if (checkResponse.data.levelComplete) {
                        Alert.alert(
                            '🎉 Level Complete!',
                            checkResponse.data.message,
                            [{ text: 'Awesome!', onPress: () => fetchLevelData(userId) }]
                        );
                    } else {
                        Alert.alert(
                            'Keep Going!',
                            checkResponse.data.message
                        );
                    }
                }
            } else {
                Alert.alert('No Workouts', 'Complete a workout first to check your progress!');
            }
        } catch (error) {
            console.error('Check workout error:', error);
            Alert.alert('Error', 'Failed to check progress. Please try again.');
        } finally {
            setChecking(false);
        }
    };

    const renderLevelCard = (levelNum, levelData, index) => {
        const isCurrentLevel = gamification?.currentLevel === levelNum;
        const isCompleted = gamification?.currentLevel > levelNum;
        const isLocked = gamification?.currentLevel < levelNum;

        const exercises = Object.entries(levelData.exercises);

        return (
            <MotiView
                key={levelNum}
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 100, duration: 500 }}
                style={styles.levelCardContainer}
            >
                <View style={[
                    styles.levelCard,
                    {
                        backgroundColor: isDark ? '#18181b' : '#ffffff',
                        borderColor: isCurrentLevel ? '#2563eb' : (isDark ? '#27272a' : '#e4e4e7'),
                        borderWidth: isCurrentLevel ? 2 : 1,
                    }
                ]}>
                    {/* Level Header */}
                    <View style={styles.levelHeader}>
                        <View style={styles.levelTitleRow}>
                            <View style={[
                                styles.levelIcon,
                                {
                                    backgroundColor: isCompleted ? '#10b981' : isCurrentLevel ? '#2563eb' : (isDark ? '#27272a' : '#e4e4e7')
                                }
                            ]}>
                                {isCompleted ? (
                                    <Ionicons name="trophy" size={20} color="#ffffff" />
                                ) : isLocked ? (
                                    <Ionicons name="lock-closed" size={20} color={isDark ? '#71717a' : '#a1a1aa'} />
                                ) : (
                                    <Ionicons name="trophy" size={20} color="#ffffff" />
                                )}
                            </View>
                            <View style={styles.levelInfo}>
                                <Text style={[styles.levelTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>
                                    Level {levelNum}
                                </Text>
                                <Text style={[styles.levelBadge, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                                    {levelData.badge}
                                </Text>
                            </View>
                            <View style={styles.pointsBadge}>
                                <Text style={styles.pointsText}>{levelData.points} pts</Text>
                            </View>
                        </View>
                    </View>

                    {/* Level Requirements */}
                    <View style={styles.requirementsContainer}>
                        <Text style={[styles.requirementsTitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                            Requirements:
                        </Text>
                        {exercises.map(([exerciseName, reps]) => (
                            <View key={exerciseName} style={styles.requirementRow}>
                                <Ionicons name="chevron-forward" size={16} color="#2563eb" />
                                <Text style={[styles.requirementText, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
                                    {exerciseName}: {reps} reps
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Status Badge */}
                    {isCompleted && (
                        <View style={styles.completedBadge}>
                            <Text style={styles.completedText}>✓ Completed</Text>
                        </View>
                    )}
                    {isCurrentLevel && (
                        <View style={styles.currentBadge}>
                            <Text style={styles.currentText}>Current Level</Text>
                        </View>
                    )}
                    {isLocked && (
                        <View style={styles.lockedBadge}>
                            <Text style={styles.lockedText}>🔒 Locked</Text>
                        </View>
                    )}
                </View>
            </MotiView>
        );
    };

    if (loading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
                <LevelSkeleton isDark={isDark} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
                }
            >
                {/* Header Stats */}
                <View style={styles.headerContainer}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 600 }}
                        style={[
                            styles.statsCard,
                            {
                                backgroundColor: isDark ? '#18181b' : '#ffffff',
                                borderColor: isDark ? '#27272a' : '#e4e4e7',
                            }
                        ]}
                    >
                        <View style={styles.statsRow}>
                            <View style={styles.statItem}>
                                <Ionicons name="trending-up" size={24} color="#2563eb" />
                                <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#18181b' }]}>
                                    Level {gamification?.currentLevel || 1}
                                </Text>
                                <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                                    Current Level
                                </Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Ionicons name="trophy" size={24} color="#f59e0b" />
                                <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#18181b' }]}>
                                    {gamification?.totalPoints || 0}
                                </Text>
                                <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                                    Total Points
                                </Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.statItem}>
                                <Ionicons name="trophy" size={24} color="#10b981" />
                                <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#18181b' }]}>
                                    {gamification?.completedLevels?.length || 0}
                                </Text>
                                <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                                    Completed
                                </Text>
                            </View>
                        </View>
                    </MotiView>

                    {/* Check Progress Button */}
                    <TouchableOpacity
                        onPress={checkLatestWorkout}
                        disabled={checking}
                        style={[
                            styles.checkButton,
                            {
                                backgroundColor: '#2563eb',
                                opacity: checking ? 0.6 : 1
                            }
                        ]}
                    >
                        {checking ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <>
                                <Ionicons name="refresh" size={20} color="#ffffff" />
                                <Text style={styles.checkButtonText}>Check Latest Workout</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {/* All Levels */}
                <View style={styles.levelsContainer}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>
                        All Levels
                    </Text>
                    {Object.entries(allLevels).map(([levelNum, levelData], index) =>
                        renderLevelCard(parseInt(levelNum), levelData, index)
                    )}
                </View>

                <View style={{ height: 40 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
    },
    headerContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    statsCard: {
        borderRadius: 20,
        borderWidth: 1,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 40,
        backgroundColor: '#e4e4e7',
    },
    levelsContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 16,
    },
    levelCardContainer: {
        marginBottom: 16,
    },
    levelCard: {
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    levelHeader: {
        marginBottom: 12,
    },
    levelTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    levelIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    levelInfo: {
        flex: 1,
    },
    levelTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    levelBadge: {
        fontSize: 14,
        marginTop: 2,
    },
    pointsBadge: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    pointsText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '700',
    },
    requirementsContainer: {
        marginTop: 8,
    },
    requirementsTitle: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    requirementRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    requirementText: {
        fontSize: 14,
        marginLeft: 4,
    },
    completedBadge: {
        marginTop: 12,
        backgroundColor: '#10b981',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    completedText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    currentBadge: {
        marginTop: 12,
        backgroundColor: '#2563eb',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    currentText: {
        color: '#ffffff',
        fontSize: 12,
        fontWeight: '700',
    },
    lockedBadge: {
        marginTop: 12,
        backgroundColor: 'rgba(113, 113, 122, 0.2)',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    lockedText: {
        color: '#71717a',
        fontSize: 12,
        fontWeight: '700',
    },
    checkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        marginTop: 16,
        gap: 8,
    },
    checkButtonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    },
});

const LevelSkeleton = ({ isDark }) => {
    const baseColor = isDark ? '#27272a' : '#e4e4e7';
    const cardColor = isDark ? '#18181b' : '#ffffff';

    return (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
            <View style={styles.headerContainer}>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                    style={[styles.statsCard, { backgroundColor: cardColor, borderColor: baseColor, height: 100 }]}
                >
                    <View style={styles.statsRow}>
                        {[1, 2, 3].map(i => (
                            <View key={i} style={styles.statItem}>
                                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: baseColor, marginBottom: 8 }} />
                                <View style={{ width: 40, height: 24, backgroundColor: baseColor, borderRadius: 4, marginBottom: 4 }} />
                                <View style={{ width: 60, height: 14, backgroundColor: baseColor, borderRadius: 4 }} />
                            </View>
                        ))}
                    </View>
                </MotiView>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                    style={{ height: 50, borderRadius: 16, backgroundColor: baseColor, marginTop: 16 }}
                />
            </View>

            <View style={styles.levelsContainer}>
                <MotiView
                    from={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: 'timing', duration: 1000, loop: true }}
                    style={{ width: 100, height: 24, backgroundColor: baseColor, borderRadius: 4, marginBottom: 16 }}
                />

                {[1, 2, 3].map(i => (
                    <MotiView
                        key={`level-${i}`}
                        from={{ opacity: 0.5 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: 'timing', duration: 1000, loop: true }}
                        style={[styles.levelCard, { backgroundColor: cardColor, borderColor: baseColor, marginBottom: 16, height: 160 }]}
                    >
                        <View style={styles.levelHeader}>
                            <View style={styles.levelTitleRow}>
                                <View style={[styles.levelIcon, { backgroundColor: baseColor }]} />
                                <View style={styles.levelInfo}>
                                    <View style={{ width: 80, height: 20, backgroundColor: baseColor, borderRadius: 4, marginBottom: 6 }} />
                                    <View style={{ width: 120, height: 16, backgroundColor: baseColor, borderRadius: 4 }} />
                                </View>
                                <View style={{ width: 60, height: 30, backgroundColor: baseColor, borderRadius: 12 }} />
                            </View>
                        </View>
                        <View style={{ marginTop: 16 }}>
                            <View style={{ width: 100, height: 14, backgroundColor: baseColor, borderRadius: 4, marginBottom: 8 }} />
                            <View style={{ width: 140, height: 16, backgroundColor: baseColor, borderRadius: 4, marginBottom: 4 }} />
                            <View style={{ width: 130, height: 16, backgroundColor: baseColor, borderRadius: 4 }} />
                        </View>
                    </MotiView>
                ))}
            </View>
        </ScrollView>
    );
};
