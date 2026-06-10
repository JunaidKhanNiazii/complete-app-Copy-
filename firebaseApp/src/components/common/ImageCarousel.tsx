import { LinearGradient } from 'expo-linear-gradient';
import React, { useRef } from 'react';
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { BorderRadius, Colors, Shadows, Typography } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.75;
const CARD_SPACING = 16;

interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  onPress?: () => void;
}

interface ImageCarouselProps {
  items: CarouselItem[];
  height?: number;
}

export const ImageCarousel: React.FC<ImageCarouselProps> = ({ 
  items, 
  height = 200 
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <ScrollView
      ref={scrollViewRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      snapToInterval={CARD_WIDTH + CARD_SPACING}
      decelerationRate="fast"
      contentContainerStyle={styles.scrollContent}
    >
      {items.map((item, index) => (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          style={({ pressed }) => [
            styles.card,
            { 
              width: CARD_WIDTH,
              marginLeft: index === 0 ? 20 : CARD_SPACING / 2,
              marginRight: index === items.length - 1 ? 20 : CARD_SPACING / 2,
              opacity: pressed ? 0.9 : 1,
            },
          ]}
        >
          <Image
            source={{ uri: item.image }}
            style={[styles.image, { height }]}
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.gradient}
          >
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              {item.subtitle && (
                <Text style={styles.subtitle} numberOfLines={1}>
                  {item.subtitle}
                </Text>
              )}
            </View>
          </LinearGradient>
        </Pressable>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingVertical: 8,
  },
  card: {
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    ...Shadows.large,
  },
  image: {
    width: '100%',
    backgroundColor: '#1e293b',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
  },
  textContainer: {
    padding: 16,
  },
  title: {
    ...Typography.h4,
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.caption,
    color: '#cbd5e1',
  },
});
