import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';

export default function AdminDashboard() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [stats, setStats] = useState({
        totalMembers: 0,
        activeToday: 0,
        totalWorkouts: 0,
        recentMembers: 0
    });
    const [adminData, setAdminData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadAdminData();
        fetchDashboardStats();
    }, []);

    const loadAdminData = async () => {
        try {
            const data = await AsyncStorage.getItem('adminData');
            if (data) {
                setAdminData(JSON.parse(data));
            }
        } catch (error) {
            console.error('Load admin data error:', error);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/admin/dashboard/stats`);
            if (response.data.success) {
                setStats(response.data.stats);
            }
        } catch (error: any) {
            console.error('Fetch stats error:', error.response?.data || error.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchDashboardStats();
    };

    const goToProfile = () => {
        router.push('/(admin)/profile');
    };

    const getCurrentDate = () => {
        const date = new Date();
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const statsData = [
        { title: 'Total Members', value: stats.totalMembers.toString(), icon: 'people', change: `+${stats.recentMembers}`, color: '#2563eb' },
        { title: 'Active Today', value: stats.activeToday.toString(), icon: 'pulse', change: 'Today', color: '#3b82f6' },
        { title: 'Total Workouts', value: stats.totalWorkouts.toString(), icon: 'trending-up', change: 'All time', color: '#10b981' },
    ];

    if (loading) {
        return (
            <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* Header Skeleton */}
                    <View style={styles.topHeader}>
                        <View>
                            <Text style={[styles.logo, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                FIT<Text style={{ color: '#2563eb' }}>ZONE</Text>
                            </Text>
                            <Text style={[styles.tagline, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                Admin Dashboard
                            </Text>
                        </View>
                        <View style={[styles.profileImage, { backgroundColor: isDark ? '#1e293b' : '#e2e8f0' }]} />
                    </View>

                    {/* Date Section Skeleton */}
                    <View style={styles.dateSection}>
                        <Text style={[styles.welcomeText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                            Overview
                        </Text>
                        <View style={[styles.dateBadge, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                            <Ionicons name="calendar" size={14} color={isDark ? '#94a3b8' : '#64748b'} />
                            <Text style={[styles.dateText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                {getCurrentDate()}
                            </Text>
                        </View>
                    </View>

                    {/* Stats Grid Skeleton */}
                    <View style={styles.statsGrid}>
                        {[1, 2, 3].map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.statCard,
                                    { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                                ]}
                            >
                                <View style={[styles.iconBox, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]}>
                                    <View style={{ width: 20, height: 20 }} />
                                </View>
                                <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 40, height: 24 }]} />
                                <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 60, height: 12, marginTop: 4 }]} />
                                <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 40, height: 12, marginTop: 8 }]} />
                            </View>
                        ))}
                    </View>

                    {/* Quick Actions */}
                    <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        QUICK MANAGEMENT
                    </Text>
                    <View style={styles.actionGrid}>
                        {[1, 2, 3, 4].map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.actionCard,
                                    { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                                ]}
                            >
                                <View style={[styles.actionIcon, { backgroundColor: isDark ? '#0f172a' : '#eff6ff' }]}>
                                    <View style={{ width: 24, height: 24 }} />
                                </View>
                                <View style={styles.actionInfo}>
                                    <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 80, height: 16 }]} />
                                    <View style={{ width: 16, height: 16 }} />
                                </View>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <ScrollView 
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2563eb" />
                }
            >
                {/* Header with FITZONE Logo and Admin Pic */}
                <View style={styles.topHeader}>
                    <View>
                        <Text style={[styles.logo, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                            FIT<Text style={{ color: '#2563eb' }}>ZONE</Text>
                        </Text>
                        <Text style={[styles.tagline, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            Admin Dashboard
                        </Text>
                    </View>
                    <Pressable onPress={goToProfile} style={styles.profileButton}>
                        <Image
                            source={{ 
                                uri: adminData?.profileImage || 'https://i.pravatar.cc/150?img=68' 
                            }}
                            style={styles.profileImage}
                        />
                    </Pressable>
                </View>

                {/* Welcome / Date Section */}
                <View style={styles.dateSection}>
                    <Text style={[styles.welcomeText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                        Overview
                    </Text>
                    <View style={[styles.dateBadge, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <Ionicons name="calendar" size={14} color={isDark ? '#94a3b8' : '#64748b'} />
                        <Text style={[styles.dateText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {getCurrentDate()}
                        </Text>
                    </View>
                </View>

                {/* Stats Grid */}
                <View style={styles.statsGrid}>
                    {statsData.map((stat, index) => (
                        <View
                            key={index}
                            style={[
                                styles.statCard,
                                { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                            ]}
                        >
                            <View style={[styles.iconBox, { backgroundColor: `${stat.color}15` }]}>
                                <Ionicons name={stat.icon} size={20} color={stat.color} />
                            </View>
                            <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                {stat.value}
                            </Text>
                            <Text style={[styles.statTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                {stat.title}
                            </Text>
                            <View style={styles.changeBadge}>
                                <Text style={[styles.changeText, { color: stat.color }]}>
                                    {stat.change}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Quick Actions */}
                <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                    QUICK MANAGEMENT
                </Text>
                <View style={styles.actionGrid}>
                    <ActionButton
                        icon="people"
                        title="Members"
                        path="/(admin)/members"
                        isDark={isDark}
                        router={router}
                    />
                    <ActionButton
                        icon="trending-up"
                        title="Analytics"
                        path="/(admin)/analytics"
                        isDark={isDark}
                        router={router}
                    />
                    <ActionButton
                        icon="chatbubble"
                        title="Feedback"
                        path="/(admin)/feedback"
                        isDark={isDark}
                        router={router}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const ActionButton = ({ icon, title, path, isDark, router }: any) => (
    <Pressable
        onPress={() => router.push(path)}
        style={[
            styles.actionCard,
            { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
        ]}
    >
        <View style={[styles.actionIcon, { backgroundColor: isDark ? '#0f172a' : '#eff6ff' }]}>
            <Ionicons name={icon} size={24} color="#2563eb" />
        </View>
        <View style={styles.actionInfo}>
            <Text style={[styles.actionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                {title}
            </Text>
            <Ionicons name="arrow-up-right" size={16} color={isDark ? '#64748b' : '#94a3b8'} />
        </View>
    </Pressable>
);

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
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 20,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    logo: {
        fontSize: 28,
        fontWeight: '900',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    profileButton: {
        padding: 2,
    },
    profileImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#2563eb',
    },
    dateSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    welcomeText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    dateBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 999,
        gap: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    dateText: {
        fontSize: 12,
        fontWeight: '600',
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    statCard: {
        width: '31%',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
    },
    iconBox: {
        padding: 10,
        borderRadius: 14,
        marginBottom: 12,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 2,
    },
    statTitle: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 8,
        textAlign: 'center',
    },
    changeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    changeText: {
        fontSize: 10,
        fontWeight: '700',
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 16,
        marginLeft: 4,
    },
    actionGrid: {
        gap: 12,
    },
    actionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    actionIcon: {
        padding: 12,
        borderRadius: 16,
        marginRight: 16,
    },
    actionInfo: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '700',
    },
    skeletonText: {
        borderRadius: 4,
        opacity: 0.3,
    },
});
