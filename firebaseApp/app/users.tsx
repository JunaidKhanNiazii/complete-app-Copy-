import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { BACKEND_URL } from '../app.config.env';

export default function UserManagement() {
    const [users, setUsers] = useState<any[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editModalVisible, setEditModalVisible] = useState(false);

    const router = useRouter();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            console.log("Fetching users from:", `${BACKEND_URL}/users`);
            const response = await axios.get(`${BACKEND_URL}/users`);
            console.log("Fetched users:", response.data.users.length);
            setUsers(response.data.users);
            // Apply search filter to new data if query exists
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
                images: editingUser.images // Send current images (mix of URLs and base64)
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

    const renderUserItem = ({ item }: { item: any }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userDetails}>ID: {item.userId} | @{item.username}</Text>
                <Text style={styles.userDetails}>{item.email}</Text>
                {item.phone && <Text style={styles.userDetails}>{item.phone}</Text>}
            </View>
            <View style={styles.actions}>
                <TouchableOpacity
                    onPress={() => {
                        setEditingUser(item);
                        setEditModalVisible(true);
                    }}
                    style={styles.actionButton}
                >
                    <Ionicons name="create-outline" size={24} color="#4285F4" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleDelete(item.userId, item.username)}
                    style={styles.actionButton}
                >
                    <Ionicons name="trash-outline" size={24} color="#EA4335" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>FITZONE ADMIN</Text>
            </View>

            <View style={styles.statCard}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Total Members</Text>
                    <Text style={styles.statValue}>{totalCount}</Text>
                </View>
                {searchQuery !== '' && (
                    <View style={styles.statDivider} />
                )}
                {searchQuery !== '' && (
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Found</Text>
                        <Text style={styles.statValue}>{filteredUsers.length}</Text>
                    </View>
                )}
            </View>

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by name, email or username..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4285F4" style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={filteredUsers}
                    renderItem={renderUserItem}
                    keyExtractor={item => item.userId.toString()}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No users found</Text>
                    }
                />
            )}

            {/* Edit Modal */}
            <Modal
                visible={editModalVisible}
                animationType="slide"
                transparent={true}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={styles.modalTitle}>Edit User</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Name"
                                value={editingUser?.name}
                                onChangeText={text => setEditingUser({ ...editingUser, name: text })}
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Email"
                                value={editingUser?.email}
                                onChangeText={text => setEditingUser({ ...editingUser, email: text })}
                                keyboardType="email-address"
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Username"
                                value={editingUser?.username}
                                onChangeText={text => setEditingUser({ ...editingUser, username: text })}
                                autoCapitalize="none"
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Password"
                                value={editingUser?.password}
                                onChangeText={text => setEditingUser({ ...editingUser, password: text })}
                                secureTextEntry
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Phone"
                                value={editingUser?.phone}
                                onChangeText={text => setEditingUser({ ...editingUser, phone: text })}
                                keyboardType="phone-pad"
                            />
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Join Date (YYYY-MM-DD)"
                                value={editingUser?.joinDate}
                                onChangeText={text => setEditingUser({ ...editingUser, joinDate: text })}
                            />
                            <Text style={[styles.modalTitle, { marginTop: 10 }]}>Profile Images</Text>
                            <View style={styles.imageGrid}>
                                {editingUser?.images?.map((img: string | null, index: number) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.imageSlot}
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
                                            <Ionicons name="add" size={30} color="#ccc" />
                                        )}
                                        <View style={styles.slotBadge}>
                                            <Text style={styles.slotBadgeText}>{index + 1}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.cancelButton]}
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text style={styles.cancelButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, styles.saveButton]}
                                    onPress={handleUpdate}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>Update User</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#121212',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 24,
        gap: 15,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
    },
    statCard: {
        backgroundColor: '#1E1E1E',
        marginHorizontal: 20,
        padding: 24,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
        gap: 20,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statDivider: {
        width: 1,
        height: '80%',
        backgroundColor: '#333',
    },
    statLabel: {
        color: '#888',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    statValue: {
        color: '#4285F4',
        fontSize: 32,
        fontWeight: '900',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        marginHorizontal: 20,
        paddingHorizontal: 15,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#333',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        height: 56,
        fontSize: 16,
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    userCard: {
        backgroundColor: '#1E1E1E',
        padding: 20,
        borderRadius: 16,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A2A2A',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 18,
        fontWeight: '800',
        color: '#FFF',
        marginBottom: 6,
    },
    userDetails: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    actions: {
        flexDirection: 'row',
        gap: 12,
    },
    actionButton: {
        padding: 10,
        backgroundColor: '#2A2A2A',
        borderRadius: 10,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 50,
        color: '#555',
        fontSize: 16,
        fontWeight: '600',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        borderWidth: 1,
        borderColor: '#333',
        maxHeight: '85%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        color: '#FFF',
        marginBottom: 24,
        textAlign: 'center',
        letterSpacing: 1,
    },
    modalInput: {
        backgroundColor: '#121212',
        padding: 18,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        color: '#FFF',
        borderWidth: 1,
        borderColor: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 24,
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
        backgroundColor: '#121212',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#333',
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
        backgroundColor: 'rgba(66, 133, 244, 0.8)',
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
    modalButton: {
        flex: 1,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#2A2A2A',
    },
    cancelButtonText: {
        color: '#888',
        fontWeight: '800',
    },
    saveButton: {
        backgroundColor: '#4285F4',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: '800',
        textTransform: 'uppercase',
    },
});
