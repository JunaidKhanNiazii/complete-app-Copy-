import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

// Replace with your backend URL (Use your machine's local IP)
import { BACKEND_URL } from '../app.config.env';

export default function Register() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [phone, setPhone] = useState('');
    const [images, setImages] = useState<(string | null)[]>([null, null, null, null]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const pickImage = async (index?: number) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'Camera roll permission is required to pick images.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.5,
            base64: true,
            allowsMultipleSelection: true,
            selectionLimit: 4,
        });

        if (!result.canceled && result.assets) {
            const newImages = [...images];
            result.assets.forEach((asset, i) => {
                if (asset.base64 && (index !== undefined ? i === 0 : i < 4)) {
                    const targetIndex = index !== undefined ? index : i;
                    if (targetIndex < 4) {
                        newImages[targetIndex] = `data:image/jpeg;base64,${asset.base64}`;
                    }
                }
            });
            setImages(newImages);
        }
    };

    const handleRegister = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }

        if (!name.trim()) {
            Alert.alert('Error', 'Please enter your full name');
            return;
        }

        if (!email.trim() || !email.includes('@')) {
            Alert.alert('Error', 'Please enter a valid email');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (images.some(img => img === null)) {
            Alert.alert('Error', 'Please select 4 images');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                `${BACKEND_URL}/register`,
                {
                    username: username.trim(),
                    name: name.trim(),
                    email: email.trim(),
                    password: password,
                    phone: phone.trim(),
                    images: images,   // array of 4 base64 data URIs
                },
                {
                    timeout: 60000, // 60s timeout — GitHub uploads can be slow
                }
            );

            if (response.data.success) {
                Alert.alert(
                    'Success! 🎉',
                    `Account created!\n\nImages uploaded to GitHub:\ngithub.com/JunaidKhanNiazii/faces/${username.trim()}`,
                    [{ text: 'OK', onPress: () => router.replace('/') }]
                );
            }
        } catch (error: any) {
            console.error('Registration failed:', error.response?.data || error.message);
            const msg = error.response?.data?.error || error.message || 'Failed to register user';
            Alert.alert('Registration Failed', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.header}>
                <Text style={styles.title}>FITZONE</Text>
                <Text style={styles.subtitle}>Join the Elite. Create Your Account.</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                >
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={24}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry={!showPassword}
                />
            </View>

            <TextInput
                style={styles.input}
                placeholder="Phone (Optional)"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />

            <TouchableOpacity
                style={styles.batchSelectButton}
                onPress={() => pickImage()}
            >
                <Ionicons name="images" size={20} color="white" />
                <Text style={styles.batchSelectText}>Select 4 Photos at Once</Text>
            </TouchableOpacity>

            <View style={styles.imageGrid}>
                {images.map((img, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.imageSlot}
                        onPress={() => pickImage(index)}
                    >
                        {img ? (
                            <>
                                <Image source={{ uri: img }} style={styles.image} />
                                {/* Checkmark overlay to show image is selected */}
                                <View style={styles.checkOverlay}>
                                    <Text style={styles.checkText}>✓</Text>
                                </View>
                            </>
                        ) : (
                            <View style={styles.placeholder}>
                                <Text style={styles.placeholderText}>+</Text>
                                <Text style={styles.placeholderSubtext}>Image {index + 1}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                ))}
            </View>

            {/* Progress indicator */}
            <Text style={styles.progressText}>
                {images.filter(Boolean).length} / 4 images selected
            </Text>

            <TouchableOpacity
                style={[styles.registerButton, loading && styles.disabledButton]}
                onPress={handleRegister}
                disabled={loading}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="white" />
                        <Text style={styles.loadingText}>Uploading to GitHub...</Text>
                    </View>
                ) : (
                    <Text style={styles.registerButtonText}>Register</Text>
                )}
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#121212',
        padding: 24,
        paddingTop: 60,
    },
    backButton: {
        marginBottom: 20,
    },
    backButtonText: {
        fontSize: 16,
        color: '#4285F4',
        fontWeight: '700',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 2,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
        marginTop: 8,
    },
    input: {
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        padding: 18,
        fontSize: 16,
        color: '#FFF',
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#333',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginBottom: 16,
        paddingRight: 10,
        borderWidth: 1,
        borderColor: '#333',
    },
    passwordInput: {
        flex: 1,
        padding: 18,
        fontSize: 16,
        color: '#FFF',
    },
    eyeIcon: {
        padding: 5,
    },
    batchSelectButton: {
        backgroundColor: '#34A85322',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#34A85344',
    },
    batchSelectText: {
        color: '#34A853',
        fontWeight: 'bold',
        fontSize: 16,
    },
    imageGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    imageSlot: {
        width: '48%',
        aspectRatio: 1,
        backgroundColor: '#1E1E1E',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#333',
        borderStyle: 'dashed',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    checkOverlay: {
        position: 'absolute',
        top: 8,
        right: 8,
        backgroundColor: '#4285F4',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    placeholder: {
        alignItems: 'center',
    },
    placeholderText: {
        fontSize: 32,
        color: '#4285F4',
        fontWeight: 'bold',
    },
    placeholderSubtext: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
    progressText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
        marginBottom: 24,
    },
    registerButton: {
        backgroundColor: '#4285F4',
        padding: 20,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#4285F4',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 10,
    },
    disabledButton: {
        backgroundColor: '#4285F444',
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    loadingText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});