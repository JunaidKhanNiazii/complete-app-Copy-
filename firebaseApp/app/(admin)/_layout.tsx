import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';

export default function AdminLayout() {
    const { theme } = useTheme();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme === 'dark' ? '#0a0a0a' : '#ffffff',
                    borderTopColor: theme === 'dark' ? '#1f1f1f' : '#eeeeee',
                    height: 85,
                    paddingBottom: 25,
                    paddingTop: 10,
                },
                tabBarActiveTintColor: '#2563eb',
                tabBarInactiveTintColor: theme === 'dark' ? '#71717a' : '#a1a1aa',
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Admin',
                    tabBarIcon: ({ color }) => <Ionicons name="grid" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="members"
                options={{
                    title: 'Users',
                    tabBarIcon: ({ color }) => <Ionicons name="people" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: 'Stats',
                    tabBarIcon: ({ color }) => <Ionicons name="bar-chart" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="feedback"
                options={{
                    title: 'Feedback',
                    tabBarIcon: ({ color }) => <Ionicons name="chatbubble" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="alerts"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color }) => <Ionicons name="notifications" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Admin',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="exercise-setup"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}