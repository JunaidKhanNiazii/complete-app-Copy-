import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ChevronLeft, Search, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';

export default function AdminFeedback() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [searchQuery, setSearchQuery] = useState('');
    const [feedbackData, setFeedbackData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchFeedback();
    }, []);

    const fetchFeedback = async () => {
        try {
            const response = await axios.get(`${BACKEND_URL}/feedback`);
            if (response.data.success) {
                setFeedbackData(response.data.feedback);
            }
        } catch (error) {
            console.error('Fetch feedback error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchFeedback();
    };

    const filteredData = feedbackData.filter(item =>
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#f59e0b'; // Amber
            case 'reviewed': return '#3b82f6'; // Blue
            case 'resolved': return '#10b981'; // Emerald
            default: return '#64748b';
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        const date = new Date(timestamp);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const renderItem = ({ item }) => (
        <View style={[styles.card, {
            backgroundColor: isDark ? '#1e293b' : '#ffffff',
            borderColor: isDark ? '#334155' : '#e2e8f0'
        }]}>
            <View style={styles.cardHeader}>
                <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]}>
                        <User size={16} color={isDark ? '#cbd5e1' : '#64748b'} />
                    </View>
                    <View>
                        <Text style={[styles.userName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                            {item.userName || 'Anonymous'}
                        </Text>
                        <Text style={[styles.userEmail, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {item.userEmail || 'No email'}
                        </Text>
                        <Text style={[styles.date, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {formatDate(item.createdAt)}
                        </Text>
                    </View>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                        {item.status || 'pending'}
                    </Text>
                </View>
            </View>

            <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                {item.title}
            </Text>
            <Text style={[styles.cardDescription, { color: isDark ? '#cbd5e1' : '#475569' }]}>
                {item.description}
            </Text>
            
            {item.type && (
                <View style={[styles.typeBadge, { backgroundColor: isDark ? '#0f172a' : '#f8fafc' }]}>
                    <Text style={[styles.typeText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        Type: {item.type}
                    </Text>
                </View>
            )}
        </View>
    );

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={isDark ? '#fff' : '#0f172a'} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#0f172a' }]}>
                    User Feedback ({feedbackData.length})
                </Text>
                <View style={{ width: 24 }} />
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <View style={[styles.searchBar, {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0'
                }]}>
                    <Search size={20} color={isDark ? '#94a3b8' : '#64748b'} />
                    <TextInput
                        style={[styles.searchInput, { color: isDark ? '#fff' : '#0f172a' }]}
                        placeholder="Search feedback..."
                        placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.skeletonContainer}>
                    {[1, 2, 3, 4, 5].map((_, index) => (
                        <View
                            key={index}
                            style={[styles.card, {
                                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                borderColor: isDark ? '#334155' : '#e2e8f0'
                            }]}
                        >
                            <View style={styles.cardHeader}>
                                <View style={styles.userInfo}>
                                    <View style={[styles.avatar, { backgroundColor: isDark ? '#334155' : '#e2e8f0' }]} />
                                    <View>
                                        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 100, height: 14 }]} />
                                        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 140, height: 12, marginTop: 4 }]} />
                                        <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 80, height: 11, marginTop: 4 }]} />
                                    </View>
                                </View>
                                <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: 60, height: 20, borderRadius: 8 }]} />
                            </View>
                            <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: '80%', height: 16, marginBottom: 8 }]} />
                            <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: '100%', height: 14 }]} />
                            <View style={[styles.skeletonText, { backgroundColor: isDark ? '#334155' : '#e2e8f0', width: '90%', height: 14, marginTop: 4 }]} />
                        </View>
                    ))}
                </View>
            ) : (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Ionicons name="chatbubble" size={48} color={isDark ? '#334155' : '#cbd5e1'} />
                            <Text style={[styles.emptyText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                {searchQuery ? 'No feedback found' : 'No feedback yet'}
                            </Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        marginBottom: 8,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    refreshButton: {
        padding: 8,
        marginRight: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    listContent: {
        padding: 20,
        gap: 16,
        paddingTop: 0,
    },
    card: {
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    userName: {
        fontSize: 14,
        fontWeight: '700',
    },
    userEmail: {
        fontSize: 12,
        marginTop: 2,
    },
    date: {
        fontSize: 11,
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    cardDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 60,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
    },
    typeBadge: {
        marginTop: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        alignSelf: 'flex-start',
    },
    typeText: {
        fontSize: 11,
        fontWeight: '600',
    },
});
