import React, { useCallback, useRef, useMemo } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import {
  Gesture,
  GestureDetector,
} from "react-native-gesture-handler";
import { colors } from "@/lib/theme";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MAX_TRANSLATE_Y = SCREEN_HEIGHT * 0.9;
const DISMISS_THRESHOLD = SCREEN_HEIGHT * 0.3;

interface SheetProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoint?: number;
}

export function Sheet({ visible, onClose, children, snapPoint = 0.5 }: SheetProps) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const context = useSharedValue(0);

  const snapTo = useMemo(() => SCREEN_HEIGHT * (1 - snapPoint), [snapPoint]);

  const handleClose = useCallback(() => {
    translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  }, [onClose, translateY]);

  const gesture = useMemo(
    () =>
      Gesture.Pan()
        .onStart(() => {
          context.value = translateY.value;
        })
        .onUpdate((e) => {
          const newY = context.value + e.translationY;
          translateY.value = Math.max(newY, snapTo - 50);
        })
        .onEnd((e) => {
          if (e.translationY > DISMISS_THRESHOLD) {
            translateY.value = withTiming(SCREEN_HEIGHT, { duration: 300 }, () => {
              runOnJS(onClose)();
            });
          } else {
            translateY.value = withSpring(snapTo, {
              damping: 20,
              stiffness: 300,
            });
          }
        }),
    [context, onClose, snapTo, translateY]
  );

  React.useEffect(() => {
    if (visible) {
      translateY.value = withSpring(snapTo, {
        damping: 20,
        stiffness: 300,
      });
    }
  }, [visible, snapTo, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: withTiming(visible ? 0.5 : 0, { duration: 200 }),
  }));

  if (!visible) return null;

  return (
    <View style={StyleSheet.absoluteFill}>
      <TouchableWithoutFeedback onPress={handleClose}>
        <Animated.View style={[styles.backdrop, backdropStyle]} />
      </TouchableWithoutFeedback>
      <GestureDetector gesture={gesture}>
        <Animated.View style={[styles.sheet, animatedStyle]}>
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: colors.ink,
  },
  sheet: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.paper,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 34,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 10,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.stroke,
    alignSelf: "center",
    marginVertical: 12,
  },
});
