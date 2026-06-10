import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { ChevronLeft, Send } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

import { BACKEND_URL } from '../../app.config.env';

export default function MemberFeedback() {
    const { theme } = useTheme();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                setUserData(JSON.parse(data));
            }
        } catch (error) {
            console.error('Load user data error:', error);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim() || !description.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axios.post(`${BACKEND_URL}/feedback`, {
                userId: userData?.userId || null,
                userName: userData?.name || "Anonymous",
                userEmail: userData?.email || "",
                title: title.trim(),
                description: description.trim(),
                type: "general"
            });

            if (response.data.success) {
                Alert.alert("Success", "Thank you for your feedback! We will review it shortly.", [
                    { 
                        text: "OK", 
                        onPress: () => {
                            setTitle('');
                            setDescription('');
                            router.back();
                        }
                    }
                ]);
            }
        } catch (error) {
            console.error('Submit feedback error:', error);
            Alert.alert("Error", "Failed to submit feedback. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color={isDark ? '#fff' : '#0f172a'} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: isDark ? '#fff' : '#0f172a' }]}>Feedback</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={[styles.iconCircle, { backgroundColor: isDark ? 'rgba(37, 99, 235, 0.2)' : '#eff6ff' }]}>
                        <Ionicons name="chatbubble" size={48} color="#2563eb" />
                    </View>
                    <Text style={[styles.description, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                        We value your opinion. Please let us know how we can improve your experience.
                    </Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Topic</Text>
                        <TextInput
                            style={[styles.input, {
                                backgroundColor: isDark ? '#0f172a' : '#fff',
                                borderColor: isDark ? '#1e293b' : '#e2e8f0',
                                color: isDark ? '#fff' : '#0f172a'
                            }]}
                            placeholder="e.g., App Crash, Feature Request"
                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.label, { color: isDark ? '#e2e8f0' : '#1e293b' }]}>Description</Text>
                        <TextInput
                            style={[styles.textArea, {
                                backgroundColor: isDark ? '#0f172a' : '#fff',
                                borderColor: isDark ? '#1e293b' : '#e2e8f0',
                                color: isDark ? '#fff' : '#0f172a'
                            }]}
                            placeholder="Tell us more about it..."
                            placeholderTextColor={isDark ? '#64748b' : '#94a3b8'}
                            multiline
                            numberOfLines={6}
                            textAlignVertical="top"
                            value={description}
                            onChangeText={setDescription}
                        />
                    </View>

                    <Pressable
                        onPress={handleSubmit}
                        disabled={isSubmitting}
                        style={({ pressed }) => [
                            styles.submitButton,
                            { opacity: pressed || isSubmitting ? 0.8 : 1 }
                        ]}
                    >
                        {isSubmitting ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <Text style={styles.submitButtonText}>Submit Feedback</Text>
                                <Send size={20} color="#fff" style={{ marginLeft: 8 }} />
                            </>
                        )}
                    </Pressable>
                </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        padding: 24,
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    textArea: {
        height: 140,
        borderWidth: 1,
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
    },
    submitButton: {
        flexDirection: 'row',
        height: 56,
        backgroundColor: '#2563eb',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#2563eb',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
