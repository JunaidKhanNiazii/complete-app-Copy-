import { AlertCircle, Bell, Clock, Info, UserPlus, UserX } from 'lucide-react-native';
import { MotiView } from 'moti';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../src/context/ThemeContext';

const mockAlerts = [
    { id: 1, type: 'Unknown', title: 'Unknown Person Detected', time: '10:42 AM', date: 'Today', urgency: 'High' },
    { id: 2, type: 'Face', title: 'Unrecognized Face in Area 2', time: '09:15 AM', date: 'Today', urgency: 'High' },
    { id: 3, type: 'Entry', title: 'New Guest Entry: Member ID #24', time: '08:30 AM', date: 'Today', urgency: 'Normal' },
    { id: 4, type: 'Anomaly', title: 'Attendance Anomaly Detected', time: 'Yesterday', date: '6:30 PM', urgency: 'Low' },
    { id: 5, type: 'System', title: 'AI Monitoring System Active', time: 'Yesterday', date: '5:00 PM', urgency: 'Low' },
];

export default function AdminAlerts() {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const getAlertIcon = (type) => {
        switch (type) {
            case 'Unknown': return { icon: UserX, color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.1)' };
            case 'Face': return { icon: AlertCircle, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
            case 'Entry': return { icon: UserPlus, color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
            default: return { icon: Info, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' };
        }
    };

    return (
        <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: isDark ? '#020617' : '#f8fafc' }]}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.sectionLabel}>Security</Text>
                        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#0f172a' }]}>System Alerts</Text>
                    </View>
                    <View style={styles.bellContainer}>
                        <Bell size={24} color="#f43f5e" fill="#f43f5e" />
                        <View style={[styles.bellBadge, { borderColor: isDark ? '#020617' : '#f8fafc' }]} />
                    </View>
                </View>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {mockAlerts.map((alert, idx) => {
                        const { icon: Icon, color, bg } = getAlertIcon(alert.type);
                        return (
                            <MotiView
                                key={alert.id}
                                from={{ opacity: 0, translateY: 10 }}
                                animate={{ opacity: 1, translateY: 0 }}
                                transition={{ delay: idx * 100 }}
                                style={[
                                    styles.card,
                                    { backgroundColor: isDark ? '#1e293b' : '#ffffff', borderColor: isDark ? '#334155' : '#e2e8f0' }
                                ]}
                            >
                                <View style={[styles.iconBox, { backgroundColor: bg }]}>
                                    <Icon size={24} color={color} />
                                </View>
                                <View style={styles.infoContainer}>
                                    <Text style={[styles.alertTitle, { color: isDark ? '#ffffff' : '#0f172a' }]} numberOfLines={1}>{alert.title}</Text>
                                    <View style={styles.metaRow}>
                                        <Clock size={12} color="#71717a" />
                                        <Text style={styles.metaText}>{alert.time} • {alert.date}</Text>
                                    </View>
                                </View>
                                <View style={[styles.urgencyBadge, { backgroundColor: alert.urgency === 'High' ? '#f43f5e' : (alert.urgency === 'Normal' ? '#10b981' : '#64748b') }]}>
                                    <Text style={styles.urgencyText}>{alert.urgency}</Text>
                                </View>
                            </MotiView>
                        );
                    })}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 16,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    sectionLabel: {
        fontSize: 12,
        color: '#64748b',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
    },
    bellContainer: {
        backgroundColor: 'rgba(244, 63, 94, 0.1)',
        padding: 12,
        borderRadius: 999,
        position: 'relative',
    },
    bellBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 10,
        height: 10,
        backgroundColor: '#f43f5e',
        borderRadius: 5,
        borderWidth: 2,
    },
    scrollContent: {
        paddingBottom: 80,
    },
    card: {
        padding: 20,
        borderRadius: 24,
        borderWidth: 1,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    iconBox: {
        padding: 12,
        borderRadius: 16,
        marginRight: 16,
    },
    infoContainer: {
        flex: 1,
        marginRight: 12,
    },
    alertTitle: {
        fontWeight: 'bold',
        fontSize: 15,
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaText: {
        fontSize: 10,
        marginLeft: 4,
        textTransform: 'uppercase',
        fontWeight: '800',
        color: '#64748b',
    },
    urgencyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    urgencyText: {
        fontSize: 8,
        fontWeight: '900',
        color: 'white',
        textTransform: 'uppercase',
    },
});
