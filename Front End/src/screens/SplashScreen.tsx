import { useEffect } from "react";
import { StatusBar } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  withSequence,
  withRepeat,
  Easing,
  interpolate,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useTheme } from "../theme/ThemeProvider";
import { useWebSocketPing } from "../socket/UseWebSocketPing";

type Props = NativeStackNavigationProp<RootStack, "SplashScreen">;

// Simple Chat Icon Component
const ChatIcon = ({ color }: { color: string }) => (
  <div className="relative items-center justify-center w-16 h-16">
    {/* Chat Bubble */}
    <div 
      className="absolute w-12 h-12 rounded-full"
      style={{ backgroundColor: color }}
    />
    {/* Lightning Bolt */}
    <div className="relative w-16 h-16 items-center justify-center">
      <div 
        style={{ backgroundColor: 'white' }}
        className="absolute w-2 h-4 -rotate-12 -translate-y-1"
      />
      <div 
        style={{ backgroundColor: 'white' }}
        className="absolute w-2 h-3 rotate-12 translate-y-2"
      />
    </div>
  </div>
);

export default function SplashScreen() {
  const navigation = useNavigation<Props>();
  const { applied } = useTheme();
  useWebSocketPing(60000);

  // Animation values
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const iconOpacity = useSharedValue(0);
  const ringScale = useSharedValue(0);
  const ringOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const loadingProgress = useSharedValue(0);
  const loadingDot1 = useSharedValue(0);
  const loadingDot2 = useSharedValue(0);
  const loadingDot3 = useSharedValue(0);
  const backgroundGlow = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Continuous pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // Phase 1: Logo entrance (0-1s)
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.34, 1.56, 0.64, 1),
    });
    logoOpacity.value = withTiming(1, { duration: 600 });
    
    // Icon reveal
    iconScale.value = withDelay(400, withTiming(1, {
      duration: 600,
      easing: Easing.out(Easing.back(1.5)),
    }));
    iconOpacity.value = withDelay(400, withTiming(1, { duration: 400 }));

    // Phase 2: Ring expansion (1-1.5s)
    ringScale.value = withDelay(1000, withTiming(2.2, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    }));
    ringOpacity.value = withDelay(1000, 
      withSequence(
        withTiming(0.6, { duration: 400 }),
        withTiming(0, { duration: 600 })
      )
    );

    // Phase 3: Text reveal (1.5-2s)
    textOpacity.value = withDelay(1500, withTiming(1, { duration: 500 }));

    // Phase 4: Loading progress (2-3.5s)
    loadingProgress.value = withDelay(2000, withTiming(100, {
      duration: 1500,
      easing: Easing.inOut(Easing.ease),
    }));

    // Phase 5: Pulsing dots (2.5-3.8s)
    loadingDot1.value = withDelay(2500, 
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        3,
        true
      )
    );

    loadingDot2.value = withDelay(2700, 
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        3,
        true
      )
    );

    loadingDot3.value = withDelay(2900, 
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 400, easing: Easing.inOut(Easing.ease) })
        ),
        3,
        true
      )
    );

    // Background glow pulse
    backgroundGlow.value = withDelay(3200, 
      withSequence(
        withTiming(1, { duration: 300 }),
        withTiming(0, { duration: 300 })
      )
    );

    // Smooth navigation after 4 seconds
    const timer = setTimeout(() => {
      navigation.replace("SignUpScreen");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigation]);

  // Animated styles
  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [
      { scale: logoScale.value * pulseScale.value }
    ],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  const ringStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const loadingBarStyle = useAnimatedStyle(() => ({
    width: `${loadingProgress.value}%`,
  }));

  const dot1Style = useAnimatedStyle(() => ({
    opacity: loadingDot1.value,
    transform: [{ scale: interpolate(loadingDot1.value, [0, 1], [0.8, 1.2]) }],
  }));

  const dot2Style = useAnimatedStyle(() => ({
    opacity: loadingDot2.value,
    transform: [{ scale: interpolate(loadingDot2.value, [0, 1], [0.8, 1.2]) }],
  }));

  const dot3Style = useAnimatedStyle(() => ({
    opacity: loadingDot3.value,
    transform: [{ scale: interpolate(loadingDot3.value, [0, 1], [0.8, 1.2]) }],
  }));

  const backgroundStyle = useAnimatedStyle(() => ({
    opacity: interpolate(backgroundGlow.value, [0, 1], [0.1, 0.2]),
  }));

  const isLight = applied === "light";
  const primaryBlue = isLight ? "#007AFF" : "#5AC8FA";
  const backgroundColor = isLight ? "#F9F9F9" : "#0A0A0A";
  const textColor = isLight ? "#1D1D1F" : "#FFFFFF";

  return (
    <SafeAreaView 
      className="flex-1 justify-center items-center overflow-hidden"
      style={{ backgroundColor }}
    >
      <StatusBar 
        barStyle={isLight ? "dark-content" : "light-content"} 
        backgroundColor={backgroundColor}
        translucent
      />

      {/* Animated Background Glow */}
      <Animated.View 
        style={[backgroundStyle, {
          backgroundColor: primaryBlue,
        }]}
        className="absolute inset-0"
      />

      {/* Main Content */}
      <Animated.View className="items-center justify-center w-full px-8">
        
        {/* Logo Container */}
        <Animated.View style={logoStyle} className="items-center justify-center mb-8">
          {/* Outer Ring */}
          <Animated.View 
            className="absolute w-48 h-48 rounded-full border-4"
            style={[
              ringStyle,
              {
                borderColor: primaryBlue,
              }
            ]}
          />
          
          {/* Main Circular Logo */}
          <Animated.View 
            className="w-32 h-32 rounded-full items-center justify-center shadow-2xl"
            style={{
              backgroundColor: primaryBlue,
              shadowColor: primaryBlue,
              shadowOffset: { width: 0, height: 16 },
              shadowOpacity: 0.5,
              shadowRadius: 32,
              elevation: 20,
            }}
          >
            {/* Chat Icon */}
            <Animated.View style={iconStyle} className="items-center justify-center">
              {/* Chat Bubble */}
              <Animated.View 
                className="w-20 h-20 rounded-full absolute"
                style={{ backgroundColor: 'white', opacity: 0.9 }}
              />
              {/* Lightning Bolt */}
              <Animated.View className="relative w-16 h-16 items-center justify-center">
                <Animated.View 
                  style={{ backgroundColor: primaryBlue }}
                  className="absolute w-3 h-6 -rotate-12 -translate-y-1 rounded-sm"
                />
                <Animated.View 
                  style={{ backgroundColor: primaryBlue }}
                  className="absolute w-3 h-4 rotate-12 translate-y-2 rounded-sm"
                />
              </Animated.View>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* App Name & Slogan */}
        <Animated.View style={textStyle} className="items-center mb-12">
          <Animated.Text 
            className="text-5xl font-black mb-4 tracking-tight"
            style={{ color: textColor }}
          >
            PingMe
          </Animated.Text>
          <Animated.Text 
            className="text-xl font-medium opacity-80 tracking-wide"
            style={{ color: textColor }}
          >
            Tap. Ping. Chat.
          </Animated.Text>
        </Animated.View>

        {/* Progress Bar */}
        <Animated.View 
          className="w-64 h-2 bg-gray-300 rounded-full mb-6 overflow-hidden"
          style={{ opacity: 0.7 }}
        >
          <Animated.View 
            style={[loadingBarStyle, {
              backgroundColor: primaryBlue,
            }]}
            className="h-full rounded-full shadow-lg"
          />
        </Animated.View>

        {/* Animated Loading Dots */}
        <Animated.View className="flex-row space-x-3 mb-12">
          <Animated.View 
            style={[dot1Style, {
              backgroundColor: primaryBlue,
            }]}
            className="w-3 h-3 rounded-full shadow-md"
          />
          <Animated.View 
            style={[dot2Style, {
              backgroundColor: primaryBlue,
            }]}
            className="w-3 h-3 rounded-full shadow-md"
          />
          <Animated.View 
            style={[dot3Style, {
              backgroundColor: primaryBlue,
            }]}
            className="w-3 h-3 rounded-full shadow-md"
          />
        </Animated.View>

        {/* Status Text */}
        <Animated.View style={textStyle} className="items-center">
          <Animated.Text 
            className="text-sm font-medium mb-1 opacity-70"
            style={{ color: textColor }}
          >
            Preparing your experience...
          </Animated.Text>
        </Animated.View>
      </Animated.View>

      {/* Footer Info */}
      <Animated.View 
        style={textStyle} 
        className="absolute bottom-10 items-center"
      >
        <Animated.Text 
          className="text-xs font-medium mb-1 opacity-50"
          style={{ color: textColor }}
        >
          POWERED BY: {process.env.EXPO_PUBLIC_APP_OWNER}
        </Animated.Text>
        <Animated.Text 
          className="text-xs font-medium opacity-50"
          style={{ color: textColor }}
        >
          VERSION: {process.env.EXPO_PUBLIC_APP_VERSION}
        </Animated.Text>
      </Animated.View>
    </SafeAreaView>
  );
}