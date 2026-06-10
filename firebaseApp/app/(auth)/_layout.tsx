import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="role-selection" />
            <Stack.Screen name="login-member" />
            <Stack.Screen name="login-admin" />
        </Stack>
    );
}
