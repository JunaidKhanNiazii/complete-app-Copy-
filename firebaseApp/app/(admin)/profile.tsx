import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Building2, Lock, LogOut, Moon, Sun, User } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';

export default function AdminProfile() {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    const [adminData, setAdminData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);

    // Edit form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [gymName, setGymName] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState('');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Password visibility
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            const data = await AsyncStorage.getItem('adminData');
            if (data) {
                const admin = JSON.parse(data);
                setAdminData(admin);
                setName(admin.name || '');
                setEmail(admin.email || '');
                setPhone(admin.phone || '');
                setGymName(admin.gymName || '');
                setAddress(admin.address || '');
                setProfileImage(admin.profileImage || '');
            }
        } catch (error) {
            console.error('Load admin data error:', error);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled && result.assets[0].base64) {
            setProfileImage(`data:image/jpeg;base64,${result.assets[0].base64}`);
        }
    };

    const handleUpdateProfile = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Name and email are required');
            return;
        }

        setLoading(true);
        try {
            await axios.put(`${BACKEND_URL}/admin/profile/${adminData.adminId}`, {
                name,
                email,
                phone,
                gymName,
                address,
                profileImage
            });

            // Update local storage
            const updatedAdmin = {
                ...adminData,
                name,
                email,
                phone,
                gymName,
                address,
                profileImage
            };
            await AsyncStorage.setItem('adminData', JSON.stringify(updatedAdmin));
            setAdminData(updatedAdmin);

            Alert.alert('Success', 'Profile updated successfully');
            setEditModalVisible(false);
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Error', 'All fields are required');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Error', 'New passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await axios.put(`${BACKEND_URL}/admin/password/${adminData.adminId}`, {
                currentPassword,
                newPassword
            });

            Alert.alert('Success', 'Password changed successfully');
            setPasswordModalVisible(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.error || 'Failed to change password');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Logout',
            'Are you sure you want to logout?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Logout',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.removeItem('adminData');
                        router.replace('/(auth)/role-selection');
                    }
                }
            ]
        );
    };

    if (!adminData) {
        return (
            <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#2563eb" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                    Admin Settings
                </Text>

                {/* Profile Card */}
                <View style={[styles.profileCard, {
                    backgroundColor: isDark ? '#1e293b' : '#ffffff',
                    borderColor: isDark ? '#334155' : '#e2e8f0'
                }]}>
                    <Image
                        source={{ uri: adminData.profileImage || 'https://i.pravatar.cc/150?img=68' }}
                        style={styles.profileImage}
                    />
                    <Text style={[styles.profileName, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                        {adminData.name}
                    </Text>
                    <Text style={[styles.profileEmail, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        {adminData.email}
                    </Text>
                    <Text style={[styles.profileRole, { color: '#2563eb' }]}>
                        Administrator
                    </Text>
                </View>

                {/* Settings Options */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        ACCOUNT SETTINGS
                    </Text>

                    <Pressable
                        onPress={() => setEditModalVisible(true)}
                        style={[styles.option, {
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0'
                        }]}
                    >
                        <View style={styles.optionLeft}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                                <User size={20} color="#2563eb" />
                            </View>
                            <Text style={[styles.optionText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                Edit Profile
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                    </Pressable>

                    <Pressable
                        onPress={() => setPasswordModalVisible(true)}
                        style={[styles.option, {
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0'
                        }]}
                    >
                        <View style={styles.optionLeft}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(37, 99, 235, 0.1)' }]}>
                                <Lock size={20} color="#2563eb" />
                            </View>
                            <Text style={[styles.optionText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                Change Password
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color={isDark ? '#64748b' : '#94a3b8'} />
                    </Pressable>
                </View>

                {/* Appearance */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        APPEARANCE
                    </Text>

                    <View style={[styles.option, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0'
                    }]}>
                        <View style={styles.optionLeft}>
                            <View style={[styles.optionIcon, { backgroundColor: isDark ? 'rgba(251, 191, 36, 0.1)' : 'rgba(59, 130, 246, 0.1)' }]}>
                                {isDark ? (
                                    <Moon size={20} color="#fbbf24" />
                                ) : (
                                    <Sun size={20} color="#3b82f6" />
                                )}
                            </View>
                            <View>
                                <Text style={[styles.optionText, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                    {isDark ? 'Dark Mode' : 'Light Mode'}
                                </Text>
                                <Text style={[styles.optionSubtext, { color: isDark ? '#64748b' : '#94a3b8' }]}>
                                    {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: '#cbd5e1', true: '#2563eb' }}
                            thumbColor={isDark ? '#ffffff' : '#f1f5f9'}
                        />
                    </View>
                </View>

                {/* Danger Zone */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        DANGER ZONE
                    </Text>

                    <Pressable
                        onPress={handleLogout}
                        style={[styles.option, {
                            backgroundColor: isDark ? '#1e293b' : '#ffffff',
                            borderColor: isDark ? '#334155' : '#e2e8f0'
                        }]}
                    >
                        <View style={styles.optionLeft}>
                            <View style={[styles.optionIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                                <LogOut size={20} color="#ef4444" />
                            </View>
                            <Text style={[styles.optionText, { color: '#ef4444' }]}>
                                Logout
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#ef4444" />
                    </Pressable>
                </View>

                {/* Gym Info */}
                {adminData.gymName && (
                    <View style={[styles.infoCard, {
                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                        borderColor: isDark ? '#334155' : '#e2e8f0'
                    }]}>
                        <Building2 size={20} color="#2563eb" />
                        <View style={styles.infoContent}>
                            <Text style={[styles.infoLabel, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                Gym Name
                            </Text>
                            <Text style={[styles.infoValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                {adminData.gymName}
                            </Text>
                        </View>
                    </View>
                )}
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal visible={editModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                                Edit Profile
                            </Text>

                            <TouchableOpacity onPress={pickImage} style={styles.imagePickerButton}>
                                <Image
                                    source={{ uri: profileImage || 'https://i.pravatar.cc/150?img=68' }}
                                    style={styles.modalProfileImage}
                                />
                                <View style={styles.imagePickerOverlay}>
                                    <Ionicons name="camera" size={24} color="#ffffff" />
                                </View>
                            </TouchableOpacity>

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Name"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={name}
                                onChangeText={setName}
                            />

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Email"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Phone"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Gym Name"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={gymName}
                                onChangeText={setGymName}
                            />

                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0'
                                }]}
                                placeholder="Address"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={address}
                                onChangeText={setAddress}
                                multiline
                                numberOfLines={3}
                            />

                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={[styles.modalButton, {
                                        backgroundColor: isDark ? '#0f172a' : '#f1f5f9'
                                    }]}
                                    onPress={() => setEditModalVisible(false)}
                                >
                                    <Text style={[styles.cancelButtonText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.modalButton, { backgroundColor: '#2563eb' }]}
                                    onPress={handleUpdateProfile}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color="white" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal visible={passwordModalVisible} animationType="slide" transparent={true}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <Text style={[styles.modalTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>
                            Change Password
                        </Text>

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0',
                                    paddingRight: 50
                                }]}
                                placeholder="Current Password"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={currentPassword}
                                onChangeText={setCurrentPassword}
                                secureTextEntry={!showCurrentPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                <Ionicons
                                    name={showCurrentPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={isDark ? '#64748b' : '#94a3b8'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0',
                                    paddingRight: 50
                                }]}
                                placeholder="New Password"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={newPassword}
                                onChangeText={setNewPassword}
                                secureTextEntry={!showNewPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowNewPassword(!showNewPassword)}
                            >
                                <Ionicons
                                    name={showNewPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={isDark ? '#64748b' : '#94a3b8'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.passwordInputContainer}>
                            <TextInput
                                style={[styles.input, {
                                    backgroundColor: isDark ? '#0f172a' : '#f8fafc',
                                    color: isDark ? '#ffffff' : '#0f172a',
                                    borderColor: isDark ? '#334155' : '#e2e8f0',
                                    paddingRight: 50
                                }]}
                                placeholder="Confirm New Password"
                                placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                                    size={20}
                                    color={isDark ? '#64748b' : '#94a3b8'}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, {
                                    backgroundColor: isDark ? '#0f172a' : '#f1f5f9'
                                }]}
                                onPress={() => setPasswordModalVisible(false)}
                            >
                                <Text style={[styles.cancelButtonText, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, { backgroundColor: '#2563eb' }]}
                                onPress={handleChangePassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.saveButtonText}>Change Password</Text>
                                )}
                            </TouchableOpacity>
                        </View>
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    profileCard: {
        padding: 24,
        borderRadius: 24,
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: 24,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 3,
        borderColor: '#2563eb',
    },
    profileName: {
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
    },
    profileEmail: {
        fontSize: 14,
        marginBottom: 8,
    },
    profileRole: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        marginBottom: 12,
    },
    optionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    optionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    optionText: {
        fontSize: 16,
        fontWeight: '700',
    },
    optionSubtext: {
        fontSize: 12,
        marginTop: 2,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: '700',
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
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: '900',
        marginBottom: 24,
        textAlign: 'center',
    },
    imagePickerButton: {
        alignSelf: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    modalProfileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    imagePickerOverlay: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2563eb',
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    passwordInputContainer: {
        position: 'relative',
        marginBottom: 0,
    },
    eyeIcon: {
        position: 'absolute',
        right: 16,
        top: 16,
        padding: 4,
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
