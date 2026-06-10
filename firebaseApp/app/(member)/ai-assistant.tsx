import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Bot, Send, Sparkles, Trash2 } from 'lucide-react-native';
import { MotiView, AnimatePresence } from 'moti';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';
import { BACKEND_URL } from '../../app.config.env';

const { width } = Dimensions.get('window');

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: number;
}

interface UserContext {
    userId: string | null;
    userName: string;
    experienceLevel: string;
    topExercises: string[];
    totalWorkouts: number;
}

export default function MemberAI() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const scrollViewRef = useRef<ScrollView>(null);

    const [userCtx, setUserCtx] = useState<UserContext>({
        userId: null,
        userName: 'Member',
        experienceLevel: 'Beginner',
        topExercises: [],
        totalWorkouts: 0,
    });

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // 1. Load context and then load messages
    useEffect(() => {
        const init = async () => {
            const userId = await loadUserContext();
            if (userId) {
                await loadChatHistory(userId);
            }
        };
        init();
    }, []);

    const loadUserContext = async () => {
        try {
            const data = await AsyncStorage.getItem('userData');
            if (data) {
                const user = JSON.parse(data);
                const userId = user.userId || user.id || null;
                const userName = user.name || user.username || 'Member';
                setUserCtx((prev) => ({ ...prev, userId, userName }));
                if (userId) fetchUserStats(userId);
                return userId;
            }
        } catch (e) {
            console.error('Error loading context:', e);
        }
        return null;
    };

    const loadChatHistory = async (userId: string) => {
        try {
            const history = await AsyncStorage.getItem(`chat_history_${userId}`);
            if (history) {
                const parsed = JSON.parse(history);
                if (parsed.length > 0) {
                    setMessages(parsed);
                    return;
                }
            }
            // Set default greeting if no history
            setMessages([{
                id: 1,
                text: `Hi ${userCtx.userName}! 👋 I'm your FitZone AI fitness coach.\n\nI know your workout history and can give you personalized advice. What would you like to work on today?`,
                sender: 'ai',
                timestamp: Date.now(),
            }]);
        } catch (e) {
            console.error('Error loading history:', e);
        }
    };

    const saveChatHistory = async (newMessages: Message[]) => {
        if (!userCtx.userId) return;
        try {
            await AsyncStorage.setItem(`chat_history_${userCtx.userId}`, JSON.stringify(newMessages));
        } catch (e) {
            console.error('Error saving history:', e);
        }
    };

    const clearChat = async () => {
        if (!userCtx.userId) return;
        setMessages([{
            id: Date.now(),
            text: "Chat history cleared. How else can I help you today?",
            sender: 'ai',
            timestamp: Date.now(),
        }]);
        await AsyncStorage.removeItem(`chat_history_${userCtx.userId}`);
    };

    const fetchUserStats = async (userId: string) => {
        try {
            const response = await axios.get(`${BACKEND_URL}/workouts/user/${userId}/stats`);
            if (response.data?.success) {
                const stats = response.data.stats || {};
                const totalWorkouts = stats.totalWorkouts || 0;
                const level = totalWorkouts > 30 ? 'Advanced' : totalWorkouts > 10 ? 'Intermediate' : 'Beginner';
                const topExercises = Object.keys(stats.exerciseFrequency || {}).slice(0, 5);
                setUserCtx((prev) => ({ ...prev, totalWorkouts, experienceLevel: level, topExercises }));
            }
        } catch (e) { /* ignore */ }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: inputText.trim(),
            sender: 'user',
            timestamp: Date.now(),
        };

        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        await saveChatHistory(updatedMessages);
        setInputText('');
        setIsLoading(true);

        try {
            const conversationHistory = updatedMessages.slice(-10).map((msg) => ({
                sender: msg.sender,
                text: msg.text,
            }));

            const response = await axios.post(`${BACKEND_URL}/ai/chat`, {
                message: userMessage.text,
                conversationHistory,
                userId: userCtx.userId,
                userName: userCtx.userName,
                experienceLevel: userCtx.experienceLevel,
                topExercises: userCtx.topExercises,
                totalWorkouts: userCtx.totalWorkouts,
            });

            if (response.data.success) {
                const aiMessage: Message = {
                    id: Date.now() + 1,
                    text: response.data.response,
                    sender: 'ai',
                    timestamp: Date.now(),
                };
                const finalMessages = [...updatedMessages, aiMessage];
                setMessages(finalMessages);
                await saveChatHistory(finalMessages);
            }
        } catch (e) {
            const errorMsg: Message = {
                id: Date.now() + 2,
                text: "I'm having trouble connecting to my brain. Please check your internet connection.",
                sender: 'ai',
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const suggestionChips = ['Analyze my progress', 'Leg day workout', 'Nutrition for fat loss', 'Proper deadlift form'];

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <LinearGradient
                colors={isDark ? ['#020617', '#0f172a'] : ['#f8fafc', '#f1f5f9']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: isDark ? '#1e293b' : '#e2e8f0', backgroundColor: 'transparent' }]}>
                <View style={styles.headerLeft}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]}>
                        <Bot size={24} color="#3b82f6" />
                    </View>
                    <View>
                        <Text style={[styles.headerTitle, { color: isDark ? '#ffffff' : '#0f172a' }]}>FitZone AI</Text>
                        <Text style={[styles.headerSubtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}>
                            {isLoading ? 'Typing...' : `${userCtx.experienceLevel} Coach`}
                        </Text>
                    </View>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={clearChat} style={styles.actionBtn}>
                        <Trash2 size={20} color={isDark ? '#475569' : '#94a3b8'} />
                    </TouchableOpacity>
                    <View style={styles.badge}>
                        <Sparkles size={14} color="#3b82f6" />
                    </View>
                </View>
            </View>

            {/* Messages */}
            <ScrollView
                ref={scrollViewRef}
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <AnimatePresence>
                    {messages.map((msg, i) => (
                        <MotiView
                            key={msg.id}
                            from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 300, delay: i === messages.length - 1 ? 0 : i * 50 }}
                            style={[
                                styles.messageContainer,
                                msg.sender === 'user' ? styles.userMessageContainer : styles.aiMessageContainer,
                            ]}
                        >
                            <View style={[
                                styles.messageBubble,
                                msg.sender === 'ai'
                                    ? [styles.aiMessage, { backgroundColor: isDark ? '#1e293b' : '#ffffff' }]
                                    : [styles.userMessage, { backgroundColor: '#3b82f6' }]
                            ]}>
                                <Text style={[styles.messageText, { color: msg.sender === 'ai' ? (isDark ? '#e2e8f0' : '#0f172a') : '#ffffff' }]}>
                                    {msg.text}
                                </Text>
                            </View>
                            <Text style={[styles.timestamp, { color: isDark ? '#475569' : '#94a3b8' }]}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </MotiView>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <MotiView from={{ opacity: 0, translateY: 5 }} animate={{ opacity: 1, translateY: 0 }} style={styles.aiMessageContainer}>
                        <View style={[styles.messageBubble, styles.aiMessage, { backgroundColor: isDark ? '#1e293b' : '#ffffff', flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 18, paddingHorizontal: 20 }]}>
                            {[0, 1, 2].map((dot) => (
                                <MotiView
                                    key={dot}
                                    from={{ opacity: 0.3, translateY: 0 }}
                                    animate={{ opacity: 1, translateY: -4 }}
                                    transition={{
                                        type: 'timing',
                                        duration: 600,
                                        loop: true,
                                        delay: dot * 200,
                                    }}
                                    style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: '#3b82f6'
                                    }}
                                />
                            ))}
                        </View>
                    </MotiView>
                )}

                {messages.length < 5 && !isLoading && (
                    <View style={styles.chipsContainer}>
                        {suggestionChips.map((chip) => (
                            <TouchableOpacity
                                key={chip}
                                onPress={() => setInputText(chip)}
                                style={[styles.chip, { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }]}
                            >
                                <Text style={[styles.chipText, { color: isDark ? '#94a3b8' : '#64748b' }]}>{chip}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </ScrollView>

            {/* Input Overlay */}
            <View style={[styles.inputArea, { backgroundColor: isDark ? '#020617' : '#ffffff', borderTopColor: isDark ? '#1e293b' : '#e2e8f0' }]}>
                <View style={[styles.inputWrapper, { backgroundColor: isDark ? '#1e293b' : '#f8fafc', borderColor: isDark ? '#334155' : '#e2e8f0' }]}>
                    <TextInput
                        placeholder="Talk to your coach..."
                        placeholderTextColor={isDark ? '#475569' : '#94a3b8'}
                        style={[styles.textInput, { color: isDark ? '#ffffff' : '#0f172a' }]}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity
                        onPress={sendMessage}
                        disabled={!inputText.trim() || isLoading}
                        style={[styles.sendButton, { backgroundColor: '#3b82f6', opacity: inputText.trim() && !isLoading ? 1 : 0.5 }]}
                    >
                        <Send size={18} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    iconContainer: { padding: 8, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(59,130,246,0.3)' },
    headerTitle: { fontSize: 18, fontWeight: '700' },
    headerSubtitle: { fontSize: 12 },
    headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    badge: { backgroundColor: 'rgba(59,130,246,0.1)', padding: 6, borderRadius: 8 },
    actionBtn: { padding: 4 },
    scrollView: { flex: 1 },
    scrollContent: { padding: 16 },
    messageContainer: { marginBottom: 16, maxWidth: '85%' },
    userMessageContainer: { alignSelf: 'flex-end' },
    aiMessageContainer: { alignSelf: 'flex-start' },
    messageBubble: { padding: 14, borderRadius: 20, borderWidth: 1, borderColor: 'transparent' },
    aiMessage: { borderBottomLeftRadius: 4, borderColor: 'rgba(148, 163, 184, 0.1)' },
    userMessage: { borderBottomRightRadius: 4 },
    messageText: { fontSize: 15, lineHeight: 22 },
    timestamp: { fontSize: 9, marginTop: 4, marginHorizontal: 4 },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
    chipText: { fontSize: 12, fontWeight: '500' },
    inputArea: { padding: 16, borderTopWidth: 1 },
    inputWrapper: { flexDirection: 'row', alignItems: 'center', padding: 6, borderRadius: 24, borderWidth: 1, gap: 8 },
    textInput: { flex: 1, paddingHorizontal: 12, fontSize: 15, maxHeight: 80 },
    sendButton: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
});
