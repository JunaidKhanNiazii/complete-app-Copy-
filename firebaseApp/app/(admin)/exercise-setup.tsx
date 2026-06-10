import { Dumbbell, Edit2, FolderPlus, MoreVertical, Plus } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

export default function AdminExerciseSetup() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [activeTab, setActiveTab] = useState('Categories');

    const [categories, setCategories] = useState([
        { id: 1, name: 'Shoulder', count: 5, status: 'Active' },
        { id: 2, name: 'Back', count: 8, status: 'Active' },
        { id: 3, name: 'Chest', count: 6, status: 'Active' },
        { id: 4, name: 'Legs', count: 12, status: 'Active' },
    ]);

    const [exercises, setExercises] = useState([
        { id: 1, name: 'Shoulder Press', category: 'Shoulder', status: 'Active' },
        { id: 2, name: 'Lateral Raises', category: 'Shoulder', status: 'Active' },
        { id: 3, name: 'Lat Pulldown', category: 'Back', status: 'Active' },
        { id: 4, name: 'Deadlift', category: 'Back', status: 'Active' },
    ]);

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>Exercise Setup</Text>
                    <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>Configure system detection</Text>
                </View>
                <Pressable style={styles.addButton}>
                    <Plus size={20} color="white" />
                    <Text style={styles.addButtonText}>Add</Text>
                </Pressable>
            </View>

            <View style={[styles.tabContainer, { backgroundColor: isDark ? '#1e293b' : '#f1f5f9' }]}>
                {['Categories', 'Exercises'].map((tab) => (
                    <Pressable
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tab,
                            activeTab === tab && { backgroundColor: isDark ? '#0f172a' : '#ffffff', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }
                        ]}
                    >
                        <Text style={[
                            styles.tabText,
                            { color: activeTab === tab ? '#2563eb' : (isDark ? '#94a3b8' : '#64748b') }
                        ]}>
                            {tab}
                        </Text>
                    </Pressable>
                ))}
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {activeTab === 'Categories' ? (
                    categories.map((cat, idx) => (
                        <MotiView
                            key={cat.id}
                            from={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 100 }}
                            style={[
                                styles.card,
                                { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                            ]}
                        >
                            <View style={styles.itemLeft}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                                    <FolderPlus size={24} color="#2563eb" />
                                </View>
                                <View>
                                    <Text style={[styles.itemName, { color: isDark ? '#ffffff' : '#0f172a' }]}>{cat.name}</Text>
                                    <Text style={[styles.itemDetail, { color: isDark ? '#94a3b8' : '#64748b' }]}>{cat.count} Exercises Ready</Text>
                                </View>
                            </View>
                            <Pressable>
                                <MoreVertical size={20} color={isDark ? '#475569' : '#cbd5e1'} />
                            </Pressable>
                        </MotiView>
                    ))
                ) : (
                    exercises.map((ex, idx) => (
                        <MotiView
                            key={ex.id}
                            from={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 100 }}
                            style={[
                                styles.card,
                                { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                            ]}
                        >
                            <View style={styles.itemLeft}>
                                <View style={[styles.iconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                    <Dumbbell size={24} color="#3b82f6" />
                                </View>
                                <View>
                                    <Text style={[styles.itemName, { color: isDark ? '#ffffff' : '#0f172a' }]}>{ex.name}</Text>
                                    <Text style={styles.categoryTag}>{ex.category}</Text>
                                </View>
                            </View>
                            <View style={styles.itemRight}>
                                <View style={styles.statusBadge}>
                                    <Text style={styles.statusText}>Active</Text>
                                </View>
                                <Pressable>
                                    <Edit2 size={18} color="#64748b" />
                                </Pressable>
                            </View>
                        </MotiView>
                    ))
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 16,
        marginBottom: 24,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 14,
    },
    addButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    tabContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginBottom: 24,
        padding: 4,
        borderRadius: 16,
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderRadius: 12,
    },
    tabText: {
        fontWeight: '700',
        fontSize: 14,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    card: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBox: {
        padding: 12,
        borderRadius: 16,
        marginRight: 16,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    itemDetail: {
        fontSize: 12,
    },
    categoryTag: {
        fontSize: 10,
        fontWeight: '900',
        textTransform: 'uppercase',
        color: '#2563eb',
        letterSpacing: 1,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        marginRight: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#10b981',
        textTransform: 'uppercase',
    },
});
