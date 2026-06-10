import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Camera, ChevronRight, Edit2, History, Lock, LogOut, Mail, Moon, Save, Sun, User } from 'lucide-react-native';
import { AnimatePresence, MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';

export default function MemberProfile() {
    const { theme, toggleTheme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';

    // State for Personal Info
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [userData, setUserData] = useState(null);
    const [workoutStats, setWorkoutStats] = useState({ days: 0, workouts: 0 });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        images: []
    });

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const user = JSON.parse(data);
                setUserData(user);

                // Support both old and new user structures
                const userIdValue = user.userId || user.id;

                setFormData({
                    name: user.name || '',
                    email: user.email || '',
                    phone: user.phone || '',
                    password: '',
                    images: Array.isArray(user.images) ? user.images : []
                });

                // Calculate days since joined
                if (user.joinDate) {
                    const joinDate = new Date(user.joinDate);
                    const today = new Date();
                    const diffTime = Math.abs(today - joinDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setWorkoutStats(prev => ({ ...prev, days: diffDays }));
                } else if (user.createdAt) {
                    // Fallback to createdAt if joinDate doesn't exist
                    const joinDate = new Date(user.createdAt);
                    const today = new Date();
                    const diffTime = Math.abs(today - joinDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setWorkoutStats(prev => ({ ...prev, days: diffDays }));
                }

                // Fetch workout count
                if (userIdValue) {
                    fetchWorkoutCount(userIdValue);
                }
            }
        } catch (error) {
            console.error('Load user data error:', error);
        }
    };

    const fetchWorkoutCount = async (userId) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/workouts/user/${userId}`);
            if (response.data.success) {
                setWorkoutStats(prev => ({
                    ...prev,
                    workouts: response.data.count || 0
                }));
            }
        } catch (error) {
            console.error('Fetch workout count error:', error);
        }
    };

    const pickImage = async (index) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            base64: true,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (!result.canceled && result.assets[0].base64) {
            const newImages = [...formData.images];
            newImages[index] = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setFormData({ ...formData, images: newImages });
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email) {
            Alert.alert('Error', 'Name and email are required');
            return;
        }

        setIsLoading(true);
        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            };

            if (formData.password) {
                updateData.password = formData.password;
            }

            if (formData.images.length > 0) {
                updateData.images = formData.images;
            }

            const response = await axios.put(
                `${BACKEND_URL}/member/profile/${userData.userId || userData.id}`,
                updateData
            );

            if (response.data.success) {
                // Update local storage
                const updatedUser = {
                    ...userData,
                    ...updateData,
                    images: response.data.images || formData.images
                };
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
                setUserData(updatedUser);

                Alert.alert("Success", "Profile updated successfully!");
                setIsEditing(false);
                setFormData({ ...formData, password: '' });
            }
        } catch (error) {
            console.error('Update profile error:', error);
            Alert.alert("Error", "Failed to update profile");
        } finally {
            setIsLoading(false);
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
                        await AsyncStorage.removeItem('userData');
                        router.replace('/(auth)/role-selection');
                    }
                }
            ]
        );
    };

    const ProfileOption = ({ icon: Icon, title, value, onPress, isSwitch, switchValue, onSwitchToggle, color }) => (
        <TouchableOpacity
            onPress={onPress}
            disabled={isSwitch}
            activeOpacity={0.7}
            style={[styles.optionCard, {
                backgroundColor: isDark ? '#1e293b' : '#ffffff',
                borderColor: isDark ? '#334155' : '#e2e8f0'
            }]}
        >
            <View style={[styles.iconContainer, { backgroundColor: `${color || '#2563eb'}15` }]}>
                <Icon size={20} color={color || '#2563eb'} />
            </View>
            <View style={styles.optionTextContainer}>
                <Text style={[styles.optionTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>{title}</Text>
                {value && <Text style={[styles.optionSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>{value}</Text>}
            </View>
            {isSwitch ? (
                <Switch
                    value={switchValue}
                    onValueChange={onSwitchToggle}
                    trackColor={{ false: '#334155', true: '#2563eb' }}
                    thumbColor="#ffffff"
                />
            ) : (
                <ChevronRight size={20} color={isDark ? '#475569' : '#cbd5e1'} />
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>

                {/* Profile Header */}
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    style={styles.header}
                >
                    <View style={styles.avatarContainer}>
                        <Image
                            source={{ uri: formData.images && formData.images[0] ? formData.images[0] : 'https://i.pravatar.cc/150?img=12' }}
                            style={styles.avatar}
                        />
                        <TouchableOpacity style={styles.editBadge} onPress={() => setIsEditing(!isEditing)}>
                            <Edit2 size={12} color="#fff" />
                        </TouchableOpacity>
                    </View>
                    <Text style={[styles.name, { color: isDark ? '#ffffff' : '#0f172a' }]}>{formData.name}</Text>
                    <Text style={styles.membership}>Premium Member</Text>
                </MotiView>

                {/* Stats Row - Real Data */}
                <View style={styles.statsRow}>
                    <MotiView from={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} delay={100}
                        style={[styles.statCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <History size={20} color="#2563eb" />
                        <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>{workoutStats.days}</Text>
                        <Text style={styles.statLabel}>Days</Text>
                    </MotiView>
                    <MotiView from={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} delay={200}
                        style={[styles.statCard, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <Ionicons name="trophy" size={20} color="#3b82f6" />
                        <Text style={[styles.statValue, { color: isDark ? '#ffffff' : '#0f172a' }]}>{workoutStats.workouts}</Text>
                        <Text style={styles.statLabel}>Workouts</Text>
                    </MotiView>
                </View>

                {/* Editable Personal Info Section */}
                <AnimatePresence>
                    {isEditing && (
                        <MotiView
                            from={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={[styles.editForm, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }]}
                        >
                            <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b', marginBottom: 16 }]}>EDIT PROFILE</Text>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#475569' }]}>Full Name</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
                                    <User size={16} color={isDark ? '#64748b' : '#94a3b8'} />
                                    <TextInput
                                        value={formData.name}
                                        onChangeText={(t) => setFormData({ ...formData, name: t })}
                                        style={[styles.input, { color: isDark ? '#ffffff' : '#0f172a' }]}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#475569' }]}>Email Address</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
                                    <Mail size={16} color={isDark ? '#64748b' : '#94a3b8'} />
                                    <TextInput
                                        value={formData.email}
                                        onChangeText={(t) => setFormData({ ...formData, email: t })}
                                        style={[styles.input, { color: isDark ? '#ffffff' : '#0f172a' }]}
                                        keyboardType="email-address"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#475569' }]}>New Password</Text>
                                <View style={[styles.inputContainer, { backgroundColor: isDark ? '#0f172a' : '#f1f5f9' }]}>
                                    <Lock size={16} color={isDark ? '#64748b' : '#94a3b8'} />
                                    <TextInput
                                        value={formData.password}
                                        onChangeText={(t) => setFormData({ ...formData, password: t })}
                                        placeholder="Leave blank to keep current"
                                        placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                                        secureTextEntry
                                        style={[styles.input, { color: isDark ? '#ffffff' : '#0f172a' }]}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={[styles.label, { color: isDark ? '#cbd5e1' : '#475569' }]}>Profile Images (4 images)</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                                    {[0, 1, 2, 3].map((index) => (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => pickImage(index)}
                                            style={{
                                                width: 70,
                                                height: 70,
                                                borderRadius: 12,
                                                backgroundColor: isDark ? '#0f172a' : '#f1f5f9',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {formData.images[index] ? (
                                                <Image source={{ uri: formData.images[index] }} style={{ width: '100%', height: '100%' }} />
                                            ) : (
                                                <Camera size={24} color={isDark ? '#64748b' : '#94a3b8'} />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            <TouchableOpacity
                                onPress={handleSave}
                                disabled={isLoading}
                                style={styles.saveButton}
                            >
                                {isLoading ? <ActivityIndicator color="#fff" /> : (
                                    <>
                                        <Text style={styles.saveButtonText}>Save Changes</Text>
                                        <Save size={16} color="#fff" />
                                    </>
                                )}
                            </TouchableOpacity>
                        </MotiView>
                    )}
                </AnimatePresence>

                <Text style={[styles.sectionTitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>SETTINGS</Text>

                <ProfileOption
                    icon={theme === 'dark' ? Moon : Sun}
                    title="Dark Mode"
                    value="Switch between dark and light themes"
                    isSwitch={true}
                    switchValue={theme === 'dark'}
                    onSwitchToggle={toggleTheme}
                />



                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.logoutButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)' }]}
                >
                    <View style={styles.logoutIcon}>
                        <LogOut size={20} color="#f43f5e" />
                    </View>
                    <Text style={styles.logoutText}>Log Out</Text>
                </TouchableOpacity>
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
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 16,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#2563eb',
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#2563eb',
        padding: 8,
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#020617', // Match dark bg roughly, or adjust dynamically if needed inside component style
    },
    name: {
        fontSize: 24,
        fontWeight: '800',
        marginBottom: 4,
    },
    membership: {
        color: '#2563eb',
        fontWeight: '700',
        fontSize: 14,
        letterSpacing: 0.5,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
        marginBottom: 32,
    },
    statCard: {
        alignItems: 'center',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 20,
        minWidth: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    statValue: {
        fontSize: 20,
        fontWeight: '800',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 10,
        color: '#64748b',
        fontWeight: '700',
        textTransform: 'uppercase',
        marginTop: 2,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        marginBottom: 12,
        marginLeft: 4,
    },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginBottom: 12,
        borderRadius: 20,
        borderWidth: 1,
    },
    iconContainer: {
        padding: 10,
        borderRadius: 14,
        marginRight: 16,
    },
    optionTextContainer: {
        flex: 1,
    },
    optionTitle: {
        fontWeight: '700',
        fontSize: 16,
        marginBottom: 2,
    },
    optionSubtitle: {
        fontSize: 12,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        marginTop: 24,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 20,
    },
    logoutIcon: {
        backgroundColor: '#f43f5e',
        padding: 8,
        borderRadius: 12,
        marginRight: 16,
    },
    logoutText: {
        color: '#f43f5e',
        fontWeight: '800',
        fontSize: 16,
    },
    editForm: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 32,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        marginBottom: 8,
        marginLeft: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 50,
        borderRadius: 14,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 14,
        fontWeight: '500',
    },
    saveButton: {
        backgroundColor: '#2563eb',
        height: 50,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
        gap: 8,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    saveButtonText: {
        color: '#ffffff',
        fontWeight: '700',
        fontSize: 15,
    },
});
