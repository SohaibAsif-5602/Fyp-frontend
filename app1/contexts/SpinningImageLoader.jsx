import React, { useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet, Image } from 'react-native';

const SpinningImageLoader = ({ source, size = 100, duration = 2000 }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animation: Rotate the image
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    // Cleanup animation on unmount
    return () => spinAnimation.stop();
  }, [duration, spinValue]);

  // Map the spinValue to a rotation value
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={source}
        style={[styles.image, { width: size, height: size, transform: [{ rotate: spin }] }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    resizeMode: 'contain',
  },
});

export default SpinningImageLoader;
