import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowRight, Lock, Mail } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BACKEND_URL } from '../../app.config.env';
import { FitnessImages } from '../../src/constants/images';
import { useTheme } from '../../src/context/ThemeContext';

export default function LoginMember() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            console.log('Attempting login for:', email.trim());

            const response = await axios.post(`${BACKEND_URL}/member/login`, {
                email: email.trim(),
                password: password
            });

            console.log('Login response:', response.data);

            if (response.data.success) {
                await AsyncStorage.setItem('userData', JSON.stringify(response.data.user));
                console.log('User data stored successfully');

                router.replace('/(member)/dashboard');
            }
        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            const errorMsg = error.response?.data?.error || 'Invalid credentials';
            Alert.alert('Login Failed', errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleGuest = () => {
        router.replace('/(member)/dashboard');
    };

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: FitnessImages.hero.strength }}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            <LinearGradient
                colors={
                    isDark
                        ? ['rgba(2, 6, 23, 0.3)', 'rgba(2, 6, 23, 0.7)', 'rgba(2, 6, 23, 0.95)']
                        : ['rgba(248, 250, 252, 0.3)', 'rgba(248, 250, 252, 0.7)', 'rgba(248, 250, 252, 0.95)']
                }
                style={styles.gradient}
            />

            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 800, delay: 200 }}
                            style={styles.header}
                        >
                            <Text style={[styles.title, { color: isDark ? '#ffffff' : '#18181b' }]}>
                                Welcome Back
                            </Text>
                            <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                                Access your automated fitness data
                            </Text>
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ duration: 800, delay: 400 }}
                        >
                            <View style={styles.form}>
                                <View style={[
                                    styles.input,
                                    {
                                        backgroundColor: isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                                        borderColor: isDark ? '#27272a' : '#e4e4e7',
                                    }
                                ]}>
                                    <Mail size={20} color="#2563eb" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Email"
                                        placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                                        style={[styles.inputText, { color: isDark ? '#ffffff' : '#18181b' }]}
                                        value={email}
                                        onChangeText={setEmail}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                    />
                                </View>

                                <View style={[
                                    styles.input,
                                    {
                                        backgroundColor: isDark ? 'rgba(24, 24, 27, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                                        borderColor: isDark ? '#27272a' : '#e4e4e7',
                                    }
                                ]}>
                                    <Lock size={20} color="#2563eb" style={styles.inputIcon} />
                                    <TextInput
                                        placeholder="Password"
                                        placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
                                        style={[styles.inputText, { color: isDark ? '#ffffff' : '#18181b' }]}
                                        value={password}
                                        onChangeText={setPassword}
                                        secureTextEntry={!showPassword}
                                    />
                                    <TouchableOpacity
                                        onPress={() => setShowPassword(!showPassword)}
                                        style={styles.eyeButton}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            size={20}
                                            color={isDark ? '#71717a' : '#a1a1aa'}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <TouchableOpacity
                                    onPress={handleLogin}
                                    activeOpacity={0.8}
                                    disabled={loading}
                                    style={styles.button}
                                >
                                    <Text style={styles.buttonText}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </Text>
                                    <ArrowRight size={20} color="white" />
                                </TouchableOpacity>
                            </View>
                        </MotiView>

                        <TouchableOpacity
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <Text style={[styles.backText, { color: isDark ? '#71717a' : '#a1a1aa' }]}>
                                ← Go Back
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
    },
    safeArea: {
        flex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 200,
        paddingBottom: 40,
        justifyContent: 'flex-end',
    },
    logoSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#2563eb',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    logoText: {
        fontSize: 32,
        fontWeight: '900',
        color: 'white',
    },
    brandName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#2563eb',
    },
    header: {
        marginBottom: 32,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
        textAlign: 'center',
    },
    form: {
        gap: 16,
    },
    input: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        padding: 16,
        borderRadius: 16,
    },
    inputIcon: {
        marginRight: 12,
    },
    inputText: {
        flex: 1,
        fontSize: 16,
    },
    eyeButton: {
        padding: 4,
        marginLeft: 8,
    },
    button: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 24,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '700',
    },
    guestButton: {
        marginTop: 20,
        alignItems: 'center',
    },
    guestText: {
        fontSize: 15,
    },
    guestLink: {
        color: '#2563eb',
        fontWeight: '700',
    },
    backButton: {
        marginTop: 32,
        alignItems: 'center',
    },
    backText: {
        fontSize: 15,
        fontWeight: '600',
    },
});
