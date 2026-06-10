import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, ShieldCheck, Users } from 'lucide-react-native';
import { MotiView } from 'moti';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRole } from '../../src/context/RoleContext';
import { useTheme } from '../../src/context/ThemeContext';

export default function RoleSelection() {
    const router = useRouter();
    const { setRole } = useRole();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const handleRoleSelect = (role: 'member' | 'admin') => {
        setRole(role);
        if (role === 'member') {
            router.push('/(auth)/login-member');
        } else {
            router.push('/(auth)/login-admin');
        }
    };

    const RoleCard = ({ title, description, icon: Icon, role, delay }: any) => (
        <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay, duration: 800, type: 'timing' }}
            style={styles.cardContainer}
        >
            <TouchableOpacity
                onPress={() => handleRoleSelect(role)}
                activeOpacity={0.8}
                style={[
                    styles.card,
                    {
                        backgroundColor: isDark ? 'rgba(24, 24, 27, 0.85)' : 'rgba(255, 255, 255, 0.9)',
                        borderColor: isDark ? '#27272a' : '#e4e4e7',
                    }
                ]}
            >
                <View style={styles.iconBox}>
                    <Icon size={32} color="#2563eb" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={[styles.cardTitle, { color: isDark ? '#ffffff' : '#18181b' }]}>
                        {title}
                    </Text>
                    <Text style={[styles.cardDescription, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                        {description}
                    </Text>
                </View>
                <ChevronRight size={24} color={isDark ? '#52525b' : '#a1a1aa'} />
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80' }}
                style={styles.backgroundImage}
                resizeMode="cover"
            />

            <LinearGradient
                colors={
                    isDark
                        ? ['rgba(2, 6, 23, 0.2)', 'rgba(2, 6, 23, 0.6)', 'rgba(2, 6, 23, 0.85)']
                        : ['rgba(248, 250, 252, 0.2)', 'rgba(248, 250, 252, 0.6)', 'rgba(248, 250, 252, 0.85)']
                }
                style={styles.gradient}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.content}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1000 }}
                        style={styles.header}
                    >
                        <Text style={styles.badge}>Welcome to FITZONE</Text>
                        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#18181b' }]}>
                            Select your role
                        </Text>
                        <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#71717a' }]}>
                            Choose how you want to use the smart gym companion.
                        </Text>
                    </MotiView>

                    <RoleCard
                        title="Gym Member"
                        description="View your workouts, progress, and AI forms."
                        icon={Users}
                        role="member"
                        delay={200}
                    />

                    <RoleCard
                        title="Admin / Trainer"
                        description="Manage exercises, members, and gym analytics."
                        icon={ShieldCheck}
                        role="admin"
                        delay={400}
                    />
                </View>
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
    content: {
        flex: 1,
        paddingHorizontal: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 48,
    },
    badge: {
        color: '#2563eb',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        textTransform: 'uppercase',
        marginBottom: 8,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
    },
    subtitle: {
        fontSize: 18,
        marginTop: 8,
    },
    cardContainer: {
        width: '100%',
        marginBottom: 24,
    },
    card: {
        borderWidth: 1,
        padding: 24,
        borderRadius: 24,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 4,
    },
    iconBox: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        padding: 16,
        borderRadius: 16,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    cardDescription: {
        fontSize: 14,
        marginTop: 4,
    },
});
