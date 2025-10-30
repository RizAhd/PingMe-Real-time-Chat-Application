import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import "../../global.css";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { useTheme } from "../theme/ThemeProvider";
import { FloatingLabelInput } from "react-native-floating-label-input";
import { useState, useRef, useEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import { validateFirstName, validateLastName } from "../util/Validation";

type SignUpProps = NativeStackNavigationProp<RootStack, "SignUpScreen">;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpProps>();
  const { applied } = useTheme();
  
  const { userData, setUserData } = useUserRegistration();
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState({ firstName: false, lastName: false });

  // Enhanced Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const messageBubble1 = useRef(new Animated.Value(0)).current;
  const messageBubble2 = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const typingDots = useRef([new Animated.Value(0), new Animated.Value(0), new Animated.Value(0)]).current;

  useEffect(() => {
    // Logo animation with rotation and scale
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Message bubble animations
    Animated.stagger(200, [
      Animated.spring(messageBubble1, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.spring(messageBubble2, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Content animations
    Animated.parallel([
      Animated.timing(slideUp, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous animations
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Typing dots animation
    typingDots.forEach((dot, index) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ])
      ).start();
    });
  }, []);

  const handleContinue = () => {
    setLoading(true);
    
    let validFirstName = validateFirstName(userData.firstName);
    let validLastName = validateLastName(userData.lastName);
    
    if (validFirstName) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Please check your first name",
        textBody: validFirstName,
        autoClose: 4000,
      });
    } else if (validLastName) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Please check your last name",
        textBody: validLastName,
        autoClose: 4000,
      });
    } else {
      navigation.navigate("ContactScreen");
    }
    
    setLoading(false);
  };

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        behavior={Platform.OS === "android" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "android" ? 60 : 60}
        style={{
          flex: 1,
          backgroundColor: applied === "light" ? "#f0f4f8" : "#0a0f1c",
        }}
      >
        {/* Enhanced Chat-themed Background */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: applied === "light" ? 
            'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #ffffff 100%)' : 
            'linear-gradient(135deg, #0c4a6e 0%, #1e3a8a 50%, #1e293b 100%)',
        }} />
        
        {/* Animated Chat Bubbles in Background */}
        <Animated.View style={{
          position: 'absolute',
          top: '15%',
          left: '10%',
          opacity: messageBubble1,
          transform: [{ scale: messageBubble1 }],
        }}>
          <View style={{
            width: 40,
            height: 30,
            backgroundColor: applied === "light" ? 'rgba(59, 130, 246, 0.1)' : 'rgba(96, 165, 250, 0.1)',
            borderRadius: 18,
            borderBottomLeftRadius: 4,
          }} />
        </Animated.View>

        <Animated.View style={{
          position: 'absolute',
          top: '25%',
          right: '15%',
          opacity: messageBubble2,
          transform: [{ scale: messageBubble2 }],
        }}>
          <View style={{
            width: 35,
            height: 25,
            backgroundColor: applied === "light" ? 'rgba(34, 197, 94, 0.1)' : 'rgba(74, 222, 128, 0.1)',
            borderRadius: 16,
            borderBottomRightRadius: 4,
          }} />
        </Animated.View>

        {/* Typing Indicator */}
        <View style={{
          position: 'absolute',
          top: '35%',
          left: '50%',
          transform: [{ translateX: -25 }],
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: applied === "light" ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
          borderBottomLeftRadius: 4,
        }}>
          <Text style={{
            fontSize: 10,
            color: applied === "light" ? '#64748b' : '#94a3b8',
            marginRight: 4,
          }}>
            typing
          </Text>
          {typingDots.map((dot, index) => (
            <Animated.View
              key={index}
              style={{
                width: 4,
                height: 4,
                backgroundColor: applied === "light" ? '#3b82f6' : '#60a5fa',
                borderRadius: 2,
                marginHorizontal: 1,
                opacity: dot,
                transform: [{ scale: dot.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.5, 1]
                })}],
              }}
            />
          ))}
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: 16,
          }}
          showsVerticalScrollIndicator={false}
        >
          <StatusBar hidden />
          
          {/* Enhanced Header with Animated Chat Logo */}
          <View style={{ alignItems: 'center', marginBottom: 32 }}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              {/* Animated Logo Container */}
              <Animated.View style={{
                transform: [
                  { scale: logoScale },
                  { rotate: rotateInterpolate }
                ],
                marginBottom: 8,
              }}>
                <View style={{
                  width: 60,
                  height: 60,
                  backgroundColor: '#2563eb',
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: '#2563eb',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.3,
                  shadowRadius: 16,
                  elevation: 8,
                }}>
                  {/* Chat Icon Animation */}
                  <View style={{
                    width: 24,
                    height: 18,
                    borderWidth: 2,
                    borderColor: 'white',
                    borderRadius: 8,
                    borderBottomLeftRadius: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <View style={{
                      width: 8,
                      height: 2,
                      backgroundColor: 'white',
                      borderRadius: 1,
                      position: 'absolute',
                      bottom: 3,
                      left: 3,
                    }} />
                  </View>
                </View>
              </Animated.View>

              {/* PingMe Text with Chat Theme */}
              <Animated.View style={{
                opacity: fadeIn,
                transform: [{ translateY: slideUp }],
              }}>
                <Text style={{
                  fontFamily: 'System',
                  fontWeight: '900',
                  fontSize: 32,
                  color: '#2563eb',
                  letterSpacing: -0.8,
                  textShadowColor: 'rgba(37, 99, 235, 0.3)',
                  textShadowOffset: { width: 0, height: 2 },
                  textShadowRadius: 4,
                  marginBottom: 4,
                }}>
                  PingMe
                </Text>
              </Animated.View>
            </View>
            
            <Animated.View style={{
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}>
              <Text style={{
                fontFamily: 'System',
                fontWeight: '700',
                fontSize: 20,
                color: applied === "light" ? '#1f2937' : '#f1f5f9',
                marginBottom: 2,
                letterSpacing: -0.3,
              }}>
                Join the Conversation
              </Text>
              
              <Text style={{
                fontFamily: 'System',
                fontWeight: '400',
                fontSize: 12,
                color: applied === "light" ? '#6b7280' : '#94a3b8',
                letterSpacing: 0.3,
              }}>
                Start chatting with friends and family
              </Text>
            </Animated.View>
          </View>

          {/* Form Container with Chat Theme */}
          <Animated.View style={{
            opacity: fadeIn,
            transform: [{ translateY: slideUp }],
            backgroundColor: applied === "light" ? 'rgba(255, 255, 255, 0.95)' : 'rgba(30, 41, 59, 0.95)',
            borderRadius: 16,
            padding: 20,
            borderWidth: 1,
            borderColor: applied === "light" ? 'rgba(226, 232, 240, 0.8)' : 'rgba(51, 65, 85, 0.6)',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 4,
          }}>
            
            {/* Input Fields */}
            <View style={{ marginBottom: 16 }}>
              {/* First Name */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{
                  color: applied === "light" ? '#374151' : '#e5e7eb',
                  fontSize: 12,
                  fontWeight: '600',
                  marginBottom: 6,
                  letterSpacing: 0.5,
                }}>
                  👤 FIRST NAME
                </Text>
                <Animated.View style={{
                  transform: [{ scale: pulseAnim }],
                  borderWidth: 2,
                  borderColor: isFocused.firstName ? '#2563eb' : (applied === "light" ? '#e2e8f0' : '#475569'),
                  borderRadius: 12,
                  backgroundColor: applied === "light" ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                  overflow: 'hidden',
                }}>
                  <FloatingLabelInput
                    label=""
                    value={userData.firstName}
                    onChangeText={(text) => setUserData(prev => ({ ...prev, firstName: text }))}
                    onFocus={() => setIsFocused(prev => ({ ...prev, firstName: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, firstName: false }))}
                    containerStyles={{
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderWidth: 0,
                      minHeight: 44,
                    }}
                    inputStyles={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: applied === "light" ? '#1f2937' : '#f1f5f9',
                    }}
                  />
                </Animated.View>
              </View>

              {/* Last Name */}
              <View>
                <Text style={{
                  color: applied === "light" ? '#374151' : '#e5e7eb',
                  fontSize: 12,
                  fontWeight: '600',
                  marginBottom: 6,
                  letterSpacing: 0.5,
                }}>
                  👥 LAST NAME
                </Text>
                <Animated.View style={{
                  transform: [{ scale: pulseAnim }],
                  borderWidth: 2,
                  borderColor: isFocused.lastName ? '#2563eb' : (applied === "light" ? '#e2e8f0' : '#475569'),
                  borderRadius: 12,
                  backgroundColor: applied === "light" ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                  overflow: 'hidden',
                }}>
                  <FloatingLabelInput
                    label=""
                    value={userData.lastName}
                    onChangeText={(text) => setUserData(prev => ({ ...prev, lastName: text }))}
                    onFocus={() => setIsFocused(prev => ({ ...prev, lastName: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, lastName: false }))}
                    containerStyles={{
                      paddingHorizontal: 14,
                      paddingVertical: 12,
                      borderWidth: 0,
                      minHeight: 44,
                    }}
                    inputStyles={{
                      fontSize: 14,
                      fontWeight: '500',
                      color: applied === "light" ? '#1f2937' : '#f1f5f9',
                    }}
                  />
                </Animated.View>
              </View>
            </View>

            {/* Progress Indicator */}
            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'center', 
              alignItems: 'center',
              marginBottom: 20,
              gap: 4
            }}>
              <View style={{ 
                width: 24, 
                height: 3, 
                backgroundColor: '#2563eb', 
                borderRadius: 2,
              }} />
              <View style={{ 
                width: 3, 
                height: 3, 
                backgroundColor: '#d1d5db', 
                borderRadius: 2,
              }} />
              <View style={{ 
                width: 3, 
                height: 3, 
                backgroundColor: '#d1d5db', 
                borderRadius: 2,
              }} />
              <View style={{ 
                width: 3, 
                height: 3, 
                backgroundColor: '#d1d5db', 
                borderRadius: 2,
              }} />
            </View>

            {/* Buttons */}
            <View>
              {/* CONTINUE Button */}
              <Pressable
                onPress={handleContinue}
                disabled={loading}
                style={{
                  backgroundColor: loading ? '#93c5fd' : '#2563eb',
                  height: 48,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 24,
                  marginBottom: 12,
                  shadowColor: '#2563eb',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={{
                    fontSize: 15,
                    fontWeight: '700',
                    color: '#ffffff',
                    letterSpacing: 0.5,
                  }}>
                    💬 START CHATTING
                  </Text>
                )}
              </Pressable>

              {/* SIGN IN Button */}
              <Pressable
                onPress={() => navigation.navigate("SignInScreen")}
                style={{
                  height: 44,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 22,
                  borderWidth: 1.5,
                  borderColor: '#2563eb',
                }}
              >
                <Text style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: '#2563eb',
                  letterSpacing: 0.3,
                }}>
                  Already have an account? Sign In
                </Text>
              </Pressable>
            </View>

            {/* Footer */}
            <View style={{ marginTop: 16, alignItems: 'center' }}>
              <Text style={{
                color: applied === "light" ? '#9ca3af' : '#6b7280',
                fontSize: 10,
                textAlign: 'center',
                lineHeight: 14,
                letterSpacing: 0.2,
              }}>
                By continuing, you agree to our{' '}
                <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Terms</Text> and{' '}
                <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Privacy</Text>
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}