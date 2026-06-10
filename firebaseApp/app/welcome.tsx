import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { useEffect, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FitnessImages } from '../src/constants/images';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const slides = [
    {
        id: 1,
        title: 'Welcome to',
        appName: 'FITZONE',
        description: 'Get ready to embark on a journey of real-time fitness challenges, social interactions, and rewarding experiences.',
        image: FitnessImages.hero.workout,
    },
    {
        id: 2,
        title: 'Track Your',
        appName: 'PROGRESS',
        description: 'Monitor your workouts, track your exercises, and see your improvements in real-time with our smart gym monitoring system.',
        image: FitnessImages.hero.strength,
    },
    {
        id: 3,
        title: 'Achieve Your',
        appName: 'GOALS',
        description: "Let's start creating your profile and setting up your first challenge! Your fitness journey begins now.",
        image: FitnessImages.hero.motivation,
    },
];

export default function WelcomeScreen() {
    const router = useRouter();
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        checkFirstTime();
    }, []);

    const checkFirstTime = async () => {
        try {
            const hasSeenWelcome = await AsyncStorage.getItem('hasSeenWelcome');
            if (hasSeenWelcome === 'true') {
                // User has seen welcome before, go to role selection
                router.replace('/(auth)/role-selection');
            }
        } catch (error) {
            console.error('Check first time error:', error);
        }
    };

    const handleNext = async () => {
        if (currentSlide < slides.length - 1) {
            setCurrentSlide(currentSlide + 1);
        } else {
            // Mark as seen and navigate to role selection
            await AsyncStorage.setItem('hasSeenWelcome', 'true');
            router.replace('/(auth)/role-selection');
        }
    };

    const handleSkip = async () => {
        await AsyncStorage.setItem('hasSeenWelcome', 'true');
        router.replace('/(auth)/role-selection');
    };

    const slide = slides[currentSlide];

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            {/* Background Image with Gradient */}
            <View style={styles.imageContainer}>
                <MotiView
                    key={slide.id}
                    from={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: 'timing', duration: 800 }}
                    style={StyleSheet.absoluteFill}
                >
                    <Image
                        source={{ uri: slide.image }}
                        style={styles.backgroundImage}
                        resizeMode="cover"
                    />
                </MotiView>
                <LinearGradient
                    colors={['rgba(15, 23, 42, 0.3)', 'rgba(15, 23, 42, 0.8)', 'rgba(15, 23, 42, 0.95)']}
                    style={styles.gradient}
                />
            </View>

            {/* Content */}
            <View style={styles.content}>
                {/* Skip Button */}
                {currentSlide < slides.length - 1 && (
                    <MotiView
                        from={{ opacity: 0, translateY: -20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 300 }}
                        style={styles.skipContainer}
                    >
                        <Pressable onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip</Text>
                        </Pressable>
                    </MotiView>
                )}

                {/* Text Content */}
                <View style={styles.textContainer}>
                    <MotiView
                        key={`title-${slide.id}`}
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 600, delay: 200 }}
                    >
                        <Text style={styles.title}>{slide.title}</Text>
                        <Text style={styles.appName}>{slide.appName}</Text>
                    </MotiView>

                    <MotiView
                        key={`desc-${slide.id}`}
                        from={{ opacity: 0, translateY: 30 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ type: 'timing', duration: 600, delay: 400 }}
                    >
                        <Text style={styles.description}>{slide.description}</Text>
                    </MotiView>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Pagination Dots */}
                    <View style={styles.pagination}>
                        {slides.map((_, index) => (
                            <MotiView
                                key={index}
                                animate={{
                                    width: currentSlide === index ? 32 : 8,
                                    backgroundColor: currentSlide === index ? '#facc15' : '#475569',
                                }}
                                transition={{ type: 'timing', duration: 300 }}
                                style={styles.dot}
                            />
                        ))}
                    </View>

                    {/* Next Button */}
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', delay: 600 }}
                    >
                        <Pressable
                            onPress={handleNext}
                            style={({ pressed }) => [
                                styles.nextButton,
                                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] },
                            ]}
                        >
                            <LinearGradient
                                colors={['#facc15', '#eab308']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.nextButtonGradient}
                            >
                                <Text style={styles.nextButtonText}>
                                    {currentSlide === slides.length - 1 ? "Let's Start" : '→'}
                                </Text>
                            </LinearGradient>
                        </Pressable>
                    </MotiView>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0f172a',
    },
    imageContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    backgroundImage: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
    gradient: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    content: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 40,
    },
    skipContainer: {
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    skipButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    skipText: {
        color: '#cbd5e1',
        fontSize: 16,
        fontWeight: '600',
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginTop: -60,
    },
    title: {
        fontSize: 28,
        fontWeight: '400',
        color: '#ffffff',
        textAlign: 'center',
        marginBottom: 8,
    },
    appName: {
        fontSize: 42,
        fontWeight: '900',
        color: '#facc15',
        textAlign: 'center',
        marginBottom: 24,
        letterSpacing: 2,
    },
    description: {
        fontSize: 15,
        fontWeight: '400',
        color: '#cbd5e1',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 10,
    },
    bottomSection: {
        alignItems: 'center',
        gap: 28,
        marginBottom: 20,
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center',
    },
    dot: {
        height: 8,
        borderRadius: 4,
    },
    nextButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        shadowColor: '#facc15',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 12,
    },
    nextButtonGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        fontSize: 30,
        fontWeight: '900',
        color: '#0f172a',
    },
});
