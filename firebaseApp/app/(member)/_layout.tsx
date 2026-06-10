import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useTheme } from '../../src/context/ThemeContext';

export default function MemberLayout() {
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
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="reports"
                options={{
                    title: 'Reports',
                    tabBarIcon: ({ color }) => <Ionicons name="document-text" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="levels"
                options={{
                    title: 'Levels',
                    tabBarIcon: ({ color }) => <Ionicons name="trophy" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="tutorials"
                options={{
                    title: 'Learn',
                    tabBarIcon: ({ color }) => <Ionicons name="play" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="ai-assistant"
                options={{
                    title: 'AI',
                    tabBarIcon: ({ color }) => <Ionicons name="chatbubble" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <Ionicons name="person" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="feedback"
                options={{
                    href: null,
                }}
            />
        </Tabs>
    );
}