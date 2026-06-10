import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Activity } from 'lucide-react-native';
import { MotiText, MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../src/context/ThemeContext';

export default function AppSplash() {
    const router = useRouter();
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        checkFirstLaunch();
    }, []);

    const checkFirstLaunch = async () => {
        try {
            const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
            const userData = await AsyncStorage.getItem('userData');
            const adminData = await AsyncStorage.getItem('adminData');

            const timer = setTimeout(() => {
                SplashScreen.hideAsync();

                if (userData) {
                    router.replace('/(member)/dashboard');
                } else if (adminData) {
                    router.replace('/(admin)/dashboard');
                } else if (hasSeenWelcome === 'true') {
                    router.replace('/(auth)/role-selection');
                } else {
                    router.replace('/welcome');
                }
            }, 1000);

            return () => clearTimeout(timer);
        } catch (error) {
            console.error('Check first launch error:', error);
            setTimeout(() => {
                SplashScreen.hideAsync();
                router.replace('/welcome');
            }, 3000);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <MotiView
                from={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 1500 }}
                style={styles.content}
            >
                <MotiView
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                    }}
                    transition={{
                        loop: true,
                        duration: 2000,
                        type: 'timing',
                    }}
                    style={styles.iconContainer}
                >
                    <Activity size={80} color="#2563eb" />
                </MotiView>

                <MotiText
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: 500, duration: 1000 }}
                    style={styles.title}
                >
                    FITZONE
                </MotiText>

                <MotiText
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1500, duration: 1000 }}
                    style={[styles.subtitle, { color: isDark ? '#94a3b8' : '#64748b' }]}
                >
                    Smart Fitness. Real Results.
                </MotiText>
            </MotiView>

            <MotiView
                from={{ width: 0 }}
                animate={{ width: 200 }}
                transition={{ delay: 1000, duration: 2500, type: 'timing' }}
                style={styles.progressBar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        padding: 32,
        borderRadius: 999,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        marginTop: 24,
        color: '#2563eb',
        letterSpacing: 4,
    },
    subtitle: {
        fontSize: 18,
        marginTop: 8,
        letterSpacing: 2,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#2563eb',
        position: 'absolute',
        bottom: 80,
        borderRadius: 999,
    },
});
