import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { router } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import { Button } from "@/components/ui";
import {
  UnderlineDoodle,
  SparkDoodle,
  CloudDoodle,
  StarburstDoodle,
  SquiggleLoopDoodle,
} from "@/components/doodles";
import { colors } from "@/lib/theme";
import { useAuthStore } from "@/stores/authStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function WelcomeScreen() {
  const { userId, setGuest } = useAuthStore();

  const titleOpacity = useSharedValue(0);
  const titleY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleY = useSharedValue(20);
  const buttonsOpacity = useSharedValue(0);
  const buttonsY = useSharedValue(20);
  const doodleOpacity = useSharedValue(0);
  const sparkRotation = useSharedValue(0);

  useEffect(() => {
    if (userId) {
      router.replace("/(tabs)");
      return;
    }

    titleOpacity.value = withDelay(200, withTiming(1, { duration: 500 }));
    titleY.value = withDelay(200, withTiming(0, { duration: 500, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) }));
    subtitleOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    subtitleY.value = withDelay(500, withTiming(0, { duration: 500, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) }));
    buttonsOpacity.value = withDelay(800, withTiming(1, { duration: 500 }));
    buttonsY.value = withDelay(800, withTiming(0, { duration: 500, easing: Easing.bezier(0.2, 0.9, 0.3, 1.05) }));
    doodleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
  }, [userId]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsY.value }],
  }));

  const doodleStyle = useAnimatedStyle(() => ({
    opacity: doodleOpacity.value,
  }));

  const handleGuest = async () => {
    await setGuest("Guest");
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.doodleLayer, doodleStyle]}>
        <CloudDoodle
          width={100}
          height={58}
          color={colors.ink}
          style={{ position: "absolute", top: 80, left: -20, opacity: 0.06 }}
        />
        <StarburstDoodle
          width={50}
          height={50}
          color={colors.blue}
          style={{ position: "absolute", top: 140, right: 30, opacity: 0.12 }}
        />
        <SquiggleLoopDoodle
          width={60}
          height={30}
          color={colors.ink}
          style={{ position: "absolute", bottom: 280, left: 40, opacity: 0.08 }}
        />
        <SparkDoodle
          width={36}
          height={36}
          color={colors.blue}
          style={{ position: "absolute", bottom: 320, right: 50, opacity: 0.15 }}
        />
      </Animated.View>

      <View style={styles.content}>
        <View style={styles.hero}>
          <Animated.Text style={[styles.title, titleStyle]}>
            patungin
          </Animated.Text>
          <UnderlineDoodle
            width={180}
            height={10}
            color={colors.blue}
            style={{ alignSelf: "center", marginTop: -4, marginBottom: 12 }}
          />
          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Split bill gampang,{"\n"}tanpa ribet
          </Animated.Text>
        </View>

        <Animated.View style={[styles.actions, buttonsStyle]}>
          <Button
            title="Mulai"
            onPress={handleGuest}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginBottom: 12 }}
          />
          <Button
            title="Login dengan Google"
            onPress={() => {}}
            variant="secondary"
            size="lg"
            fullWidth
            disabled
          />
          <Text style={styles.hint}>Login dengan Google segera hadir</Text>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  doodleLayer: {
    ...StyleSheet.absoluteFill,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingBottom: 60,
  },
  hero: {
    alignItems: "center",
    marginBottom: 60,
  },
  title: {
    fontFamily: "Caveat-Bold",
    fontSize: 64,
    color: colors.ink,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "Caveat-SemiBold",
    fontSize: 26,
    color: colors.inkMuted,
    textAlign: "center",
    lineHeight: 36,
  },
  actions: {
    alignItems: "center",
  },
  hint: {
    fontFamily: "Caveat-Regular",
    fontSize: 14,
    color: colors.inkFaint,
    marginTop: 8,
  },
});
