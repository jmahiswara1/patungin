import { useCallback } from "react";
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";

export function useDoodleDraw() {
  const progress = useSharedValue(0);

  const start = useCallback(() => {
    progress.value = withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return { progress, start, animatedStyle };
}

export function useDoodleFloat() {
  const progress = useSharedValue(0);

  const start = useCallback(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [0, -6]),
      },
    ],
  }));

  return { progress, start, animatedStyle };
}

export function useDoodleWiggle() {
  const progress = useSharedValue(0);

  const start = useCallback(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 750,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(-1, {
          duration: 750,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 750,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        rotate: `${interpolate(progress.value, [-1, 0, 1], [-1.5, 0, 1.5])}deg`,
      },
    ],
  }));

  return { progress, start, animatedStyle };
}

export function useDoodleBounce() {
  const progress = useSharedValue(0);

  const start = useCallback(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1250,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1250,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(progress.value, [0, 1], [0, -8]),
      },
      {
        scale: interpolate(progress.value, [0, 1], [1, 1.02]),
      },
    ],
  }));

  return { progress, start, animatedStyle };
}

export function useDoodlePulse() {
  const progress = useSharedValue(0);

  const start = useCallback(() => {
    progress.value = withRepeat(
      withSequence(
        withTiming(1, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      false
    );
  }, [progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.4, 0.7]),
    transform: [
      {
        scale: interpolate(progress.value, [0, 1], [1, 1.05]),
      },
    ],
  }));

  return { progress, start, animatedStyle };
}

export function useRevealAnimation() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(24);

  const start = useCallback(
    (delay = 0) => {
      opacity.value = withTiming(1, {
        duration: 350,
        easing: Easing.out(Easing.ease),
      });
      translateY.value = withTiming(0, {
        duration: 350,
        easing: Easing.bezier(0.2, 0.9, 0.3, 1.05),
      });
    },
    [opacity, translateY]
  );

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return { start, animatedStyle };
}

export const playfulEase = Easing.bezier(0.2, 0.9, 0.3, 1.05);

export function formatCurrency(amount: number): string {
  return `Rp${amount.toLocaleString("id-ID")}`;
}
