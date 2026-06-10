import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Edit, Filter, Mail, Plus, Search, Trash2, User } from 'lucide-react-native';
import { MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';

export default function AdminMembers() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BACKEND_URL}/users`);
            setUsers(response.data.users);
            if (searchQuery) {
                const filtered = response.data.users.filter((user: any) =>
                    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    user.username?.toLowerCase().includes(searchQuery.toLowerCase())
                );
                setFilteredUsers(filtered);
            } else {
                setFilteredUsers(response.data.users);
            }
            setTotalCount(response.data.totalCount);
        } catch (error: any) {
            console.error('Fetch error:', error.response?.data || error.message);
            Alert.alert('Error', 'Failed to fetch users. Is the backend running?');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        const filtered = users.filter(user =>
            user.name?.toLowerCase().includes(text.toLowerCase()) ||
            user.email?.toLowerCase().includes(text.toLowerCase()) ||
            user.username?.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleDelete = (userId: any, username: string) => {
        Alert.alert(
            'Delete User',
            `Are you sure you want to delete ${username}? This will also remove images from GitHub.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        setLoading(true);
                        try {
                            await axios.delete(`${BACKEND_URL}/users/${userId}`);
                            Alert.alert('Success', 'User deleted successfully');
                            fetchUsers();
                        } catch (error: any) {
                            Alert.alert('Error', 'Failed to delete user');
                        } finally {
                            setLoading(false);
                        }
                    }
                }
            ]
        );
    };

    const handleUpdate = async () => {
        if (!editingUser.name || !editingUser.email) {
            Alert.alert('Error', 'Name and Email are required');
            return;
        }

        setLoading(true);
        try {
            await axios.put(`${BACKEND_URL}/users/${editingUser.userId}`, {
                name: editingUser.name,
                email: editingUser.email,
                phone: editingUser.phone,
                username: editingUser.username,
                password: editingUser.password,
                joinDate: editingUser.joinDate,
                images: editingUser.images
            });
            Alert.alert('Success', 'User updated successfully');
            setEditModalVisible(false);
            fetchUsers();
        } catch (error: any) {
            Alert.alert('Error', 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>Members</Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>Total: {totalCount} Users</Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => router.push('/register')}
                        style={[styles.addButton, { backgroundColor: '#2563eb' }]}
                    >
                        <Plus size={20} color="#ffffff" />
                    </TouchableOpacity>
                </View>

                <View style={[styles.searchBar, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }]}>
                    <Search size={20} color="#64748b" />
                    <TextInput
                        placeholder="Search by name or email..."
                        placeholderTextColor="#94a3b8"
                        style={[styles.searchInput, { color: isDark ? '#ffffff' : '#0f172a' }]}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                    <Pressable style={styles.filterButton}>
                        <Filter size={20} color="#2563eb" />
                    </Pressable>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#2563eb" style={{ marginTop: 50 }} />
                ) : (
                    <FlatList
                        data={filteredUsers}
                        keyExtractor={(item) => item.userId.toString()}
                        contentContainerStyle={styles.scrollContent}
                        ListEmptyComponent={
                            <Text style={[styles.emptyText, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                                No users found
                            </Text>
                        }
                        renderItem={({ item, index }) => (
                            <MotiView
                                from={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 50 }}
                                style={[
                                    styles.card,
                                    { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                                ]}
                            >
                                <View style={[styles.avatarContainer, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                                    {item.images && item.images[0] ? (
                                        <Image source={{ uri: item.images[0] }} style={styles.avatarImage} />
                                    ) : (
                                        <User size={24} color="#2563eb" />
                                    )}
                                </View>
                                <View style={styles.infoContainer}>
                                    <Text style={[styles.memberName, { color: isDark ? '#ffffff' : '#0f172a' }]}>{item.name}</Text>
                                    <View style={styles.emailRow}>
                                        <Mail size={12} color="#64748b" />
                                        <Text style={[styles.emailText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                            {item.email}
                                        </Text>
                                    </View>
                                    <Text style={[styles.usernameText, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                                        @{item.username}
                                    </Text>
                                </View>
                                <View style={styles.actionsContainer}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setEditingUser(item);
                                            setEditModalVisible(true);
                                        }}
                                        style={[styles.actionButton, { backgroundColor: isDark ? '#0f172a' : '#eff6ff' }]}
                                    >
                                        <Edit size={18} color="#2563eb" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => handleDelete(item.userId, item.username)}
                                        style={[styles.actionButton, { backgroundColor: isDark ? '#0f172a' : '#fef2f2' }]}
                                    >
                                        <Trash2 size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </MotiView>
                        )}
                    />
                )}
            </View>

            {/* Edit Modal */}
            <Modal visible={editModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>Edit User</Text>
                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Name"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={editingUser?.name}
                                onChangeText={text => setEditingUser({ ...editingUser, name: text })}
                            />
                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Email"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={editingUser?.email}
                                onChangeText={text => setEditingUser({ ...editingUser, email: text })}
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Username"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={editingUser?.username}
                                onChangeText={text => setEditingUser({ ...editingUser, username: text })}
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={[styles.modalInput, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Phone"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={editingUser?.phone}
                                onChangeText={text => setEditingUser({ ...editingUser, phone: text })}
                                keyboardType="phone-pad"
                            />

                            <Text style={[styles.sectionLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>Profile Images</Text>
                            <View style={styles.imageGrid}>
                                {editingUser?.images?.map((img: string | null, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.imageSlot, {
                                            backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                            borderColor: isDark ? '#334155' : '#e2e8f0'
                                        }]}
                                        onPress={async () => {
                                            const result = await ImagePicker.launchImageLibraryAsync({
                                                mediaTypes: ['images'],
                                                quality: 0.5,
                                                base64: true,
                                                allowsEditing: true,
                                                aspect: [1, 1],
                                            });

                                            if (!result.canceled && result.assets[0].base64) {
                                                const newImages = [...editingUser.images];
                                                newImages[index] = `data:image/jpeg;base64,${result.assets[0].base64}`;
                                                setEditingUser({ ...editingUser, images: newImages });
                                            }
                                        }}
                                    >
                                        {img ? (
                                            <Image source={{ uri: img }} style={styles.previewImage} />
                                        ) : (
                                            <Ionicons name="add" size={30} color={isDark ? '#64748b' : '#94a3b8'} />
                                        )}
                                        <View style={styles.slotBadge}>
                                            <Text style={styles.slotBadgeText}>{index + 1}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, {
                                        backgroundColor: isDark ? '#0f172a' : '#f1f5f9'
                                    }]}
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text style={[styles.cancelButtonText, { color: isDark ? '#94a3b8' : '#64748b' }]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#2563eb' }]}
                                    onPress={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>Update</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 16,
        marginBottom: 24,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 12,
        fontSize: 16,
    },
    filterButton: {
        marginLeft: 8,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    card: {
        padding: 16,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    avatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    infoContainer: {
        flex: 1,
    },
    memberName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    emailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    emailText: {
        fontSize: 12,
        marginLeft: 4,
    },
    usernameText: {
        fontSize: 11,
        marginTop: 2,
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        borderRadius: 24,
        padding: 24,
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 24,
        textAlign: 'center',
    },
    modalInput: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    sectionLabel: {
        fontSize: 14,
        fontWeight: '700',
        textTransform: 'uppercase',
        marginBottom: 12,
        marginTop: 8,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 12,
        marginBottom: 20,
    },
    imageSlot: {
        width: '47%',
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderStyle: 'dashed',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    slotBadge: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#2563eb',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slotBadgeText: {
        color: 'white',
        fontSize: 11,
        fontWeight: '800',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButtonText: {
        fontWeight: '800',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '800',
        textTransform: 'uppercase',
    },
});
