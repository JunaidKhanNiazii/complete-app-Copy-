import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { BorderRadius, Colors } from '../../constants/colors';
import { useTheme } from '../../context/ThemeContext';

interface YouTubePlayerProps {
  videoId: string;
  height?: number;
  autoplay?: boolean;
}

export const YouTubePlayerComponent: React.FC<YouTubePlayerProps> = ({
  videoId,
  height = 220,
  autoplay = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const colors = isDark ? Colors.dark : Colors.light;
  const [loading, setLoading] = useState(true);

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      {loading && (
        <View style={[styles.loadingContainer, { height }]}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
      <YoutubePlayer
        height={height}
        videoId={videoId}
        play={autoplay}
        onReady={() => setLoading(false)}
        webViewStyle={styles.webView}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  webView: {
    borderRadius: BorderRadius.lg,
  },
});
