import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Typography } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

interface StatCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  change?: string;
  gradient?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  value,
  label,
  change,
  gradient = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;

  const CardWrapper = gradient ? LinearGradient : View;
  const gradientColors = isDark 
    ? [colors.card, colors.surface]
    : [colors.card, colors.cardElevated];

  return (
    <CardWrapper
      colors={gradient ? gradientColors : undefined}
      start={gradient ? { x: 0, y: 0 } : undefined}
      end={gradient ? { x: 1, y: 1 } : undefined}
      style={[
        styles.card,
        {
          backgroundColor: gradient ? undefined : colors.card,
          borderColor: colors.border,
        },
        Shadows.medium,
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: `${colors.primary}20` }]}>
        {icon}
      </View>
      
      <Text style={[styles.value, { color: colors.text }]}>
        {value}
      </Text>
      
      <Text style={[styles.label, { color: colors.textMuted }]}>
        {label}
      </Text>
      
      {change && (
        <View style={[styles.changeBadge, { backgroundColor: colors.success + '20' }]}>
          <Text style={[styles.changeText, { color: colors.success }]}>
            {change}
          </Text>
        </View>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.xl,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    minWidth: 110,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  value: {
    ...Typography.h3,
    marginBottom: 4,
  },
  label: {
    ...Typography.small,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  changeBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  changeText: {
    ...Typography.smallBold,
  },
});
