import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useState, useRef, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
  Animated,
  Easing,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useUserRegistration } from "../components/UserContext";
import {
  ALERT_TYPE,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";
import { validateCountryCode, validatePhoneNo } from "../util/Validation";
import { useTheme } from "../theme/ThemeProvider";

type ContactProps = NativeStackNavigationProp<RootStack, "ContactScreen">;

export default function ContactScreen() {
  const navigation = useNavigation<ContactProps>();
  const { applied } = useTheme();

  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    name: "Sri Lanka",
    code: "LK", 
    callingCode: "+94",
    flag: "🇱🇰"
  });

  const { userData, setUserData } = useUserRegistration();
  const [phoneNo, setPhoneNo] = useState("");

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
    
    const validCountryCode = validateCountryCode(selectedCountry.callingCode);
    const validPhoneNo = validatePhoneNo(phoneNo);

    if (validCountryCode) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Country Code",
        textBody: validCountryCode,
        autoClose: 4000,
      });
    } else if (validPhoneNo) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Phone Number",
        textBody: validPhoneNo,
        autoClose: 4000,
      });
    } else {
      setUserData((previous) => ({
        ...previous,
        countryCode: selectedCountry.callingCode,
        contactNo: phoneNo,
      }));
      navigation.replace("AvatarScreen");
    }
    
    setLoading(false);
  };

  const countries = [
    { name: "Sri Lanka", code: "LK", callingCode: "+94", flag: "🇱🇰" },
    { name: "United States", code: "US", callingCode: "+1", flag: "🇺🇸" },
    { name: "United Kingdom", code: "GB", callingCode: "+44", flag: "🇬🇧" },
    { name: "India", code: "IN", callingCode: "+91", flag: "🇮🇳" },
    { name: "Australia", code: "AU", callingCode: "+61", flag: "🇦🇺" },
    { name: "Canada", code: "CA", callingCode: "+1", flag: "🇨🇦" },
  ];

  const selectCountry = (country: any) => {
    setSelectedCountry(country);
    setShowCountryPicker(false);
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
            verifying
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
                  {/* Phone Icon Animation */}
                  <Ionicons name="call-outline" size={24} color="white" />
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
                  textAlign: 'center',
                }}>
                  PingMe
                </Text>
              </Animated.View>
            </View>
            
            <Animated.View style={{
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
              alignItems: 'center',
            }}>
              <Text style={{
                fontFamily: 'System',
                fontWeight: '700',
                fontSize: 20,
                color: applied === "light" ? '#1f2937' : '#f1f5f9',
                marginBottom: 2,
                letterSpacing: -0.3,
                textAlign: 'center',
              }}>
                Contact Info 📞
              </Text>
              
              <Text style={{
                fontFamily: 'System',
                fontWeight: '400',
                fontSize: 12,
                color: applied === "light" ? '#6b7280' : '#94a3b8',
                letterSpacing: 0.3,
                textAlign: 'center',
                maxWidth: 280,
              }}>
                Connect with friends using your phone number
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
            
            {/* Country Picker */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{
                color: applied === "light" ? '#374151' : '#e5e7eb',
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 6,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}>
                🌎 SELECT COUNTRY
              </Text>
              
              <Animated.View style={{
                transform: [{ scale: pulseAnim }],
              }}>
                <Pressable
                  onPress={() => setShowCountryPicker(true)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    borderWidth: 2,
                    borderColor: showCountryPicker ? '#2563eb' : (applied === "light" ? '#e2e8f0' : '#475569'),
                    borderRadius: 12,
                    backgroundColor: applied === "light" ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <Text style={{ fontSize: 18, marginRight: 8 }}>
                      {selectedCountry.flag}
                    </Text>
                    <Text style={{
                      fontSize: 14,
                      fontWeight: '600',
                      color: applied === "light" ? '#1f2937' : '#f1f5f9',
                      flex: 1,
                    }}>
                      {selectedCountry.name} ({selectedCountry.callingCode})
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-down" 
                    size={16} 
                    color={applied === "light" ? '#64748b' : '#94a3b8'} 
                  />
                </Pressable>
              </Animated.View>

              {/* Country Picker Modal */}
              {showCountryPicker && (
                <View style={{
                  position: 'absolute',
                  top: 70,
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  backgroundColor: applied === "light" ? 'white' : '#1e293b',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: applied === "light" ? '#e2e8f0' : '#374151',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 8,
                  maxHeight: 200,
                  overflow: 'hidden',
                }}>
                  <ScrollView style={{ maxHeight: 200 }}>
                    {countries.map((country) => (
                      <Pressable
                        key={country.code}
                        onPress={() => selectCountry(country)}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingHorizontal: 14,
                          paddingVertical: 12,
                          borderBottomWidth: 1,
                          borderBottomColor: applied === "light" ? '#f1f5f9' : '#334155',
                          backgroundColor: selectedCountry.code === country.code ? 
                            (applied === "light" ? '#eff6ff' : '#1e3a8a') : 'transparent',
                        }}
                      >
                        <Text style={{ fontSize: 16, marginRight: 10, width: 24 }}>
                          {country.flag}
                        </Text>
                        <Text style={{
                          fontSize: 14,
                          fontWeight: '500',
                          color: applied === "light" ? '#1f2937' : '#f1f5f9',
                          flex: 1,
                        }}>
                          {country.name}
                        </Text>
                        <Text style={{
                          fontSize: 13,
                          color: applied === "light" ? '#64748b' : '#94a3b8',
                          fontWeight: '600',
                        }}>
                          {country.callingCode}
                        </Text>
                      </Pressable>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Phone Number Input */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{
                color: applied === "light" ? '#374151' : '#e5e7eb',
                fontSize: 12,
                fontWeight: '600',
                marginBottom: 6,
                letterSpacing: 0.5,
                textAlign: 'center',
              }}>
                📱 PHONE NUMBER
              </Text>
              
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {/* Country Code */}
                <Animated.View style={{
                  transform: [{ scale: pulseAnim }],
                  flex: 1,
                }}>
                  <View style={{
                    borderWidth: 2,
                    borderColor: isFocused ? '#2563eb' : (applied === "light" ? '#e2e8f0' : '#475569'),
                    borderRadius: 12,
                    backgroundColor: applied === "light" ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                    overflow: 'hidden',
                  }}>
                    <TextInput
                      inputMode="tel"
                      style={{
                        height: 44,
                        fontSize: 14,
                        fontWeight: '600',
                        color: applied === "light" ? '#1e40af' : '#60a5fa',
                        paddingHorizontal: 14,
                        textAlign: 'center',
                        backgroundColor: 'transparent',
                      }}
                      placeholder="+94"
                      value={selectedCountry.callingCode}
                      editable={false}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                  </View>
                </Animated.View>

                {/* Phone Number */}
                <Animated.View style={{
                  transform: [{ scale: pulseAnim }],
                  flex: 2,
                }}>
                  <View style={{
                    borderWidth: 2,
                    borderColor: isFocused ? '#2563eb' : (applied === "light" ? '#e2e8f0' : '#475569'),
                    borderRadius: 12,
                    backgroundColor: applied === "light" ? 'rgba(248, 250, 252, 0.8)' : 'rgba(30, 41, 59, 0.8)',
                    overflow: 'hidden',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                    <TextInput
                      inputMode="tel"
                      style={{
                        flex: 1,
                        height: 44,
                        fontSize: 14,
                        fontWeight: '500',
                        color: applied === "light" ? '#1f2937' : '#f1f5f9',
                        paddingHorizontal: 14,
                        textAlign: 'left',
                        backgroundColor: 'transparent',
                      }}
                      placeholder="77 123 4567"
                      value={phoneNo}
                      onChangeText={setPhoneNo}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                    />
                    <Ionicons 
                      name="phone-portrait-outline" 
                      size={16} 
                      color={isFocused ? "#3b82f6" : "#94a3b8"} 
                      style={{ marginRight: 14 }}
                    />
                  </View>
                </Animated.View>
              </View>
              
              <Text style={{
                color: applied === "light" ? '#6b7280' : '#9ca3b8',
                fontSize: 11,
                marginTop: 6,
                textAlign: 'center',
              }}>
                Enter your phone number to connect with friends
              </Text>
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
                width: 3, 
                height: 3, 
                backgroundColor: '#d1d5db', 
                borderRadius: 2,
              }} />
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
                    textAlign: 'center',
                  }}>
                    📞 CONTINUE
                  </Text>
                )}
              </Pressable>

              {/* SKIP Button */}
              <Pressable
                onPress={() => navigation.replace("AvatarScreen")}
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
                  textAlign: 'center',
                }}>
                  Skip for now
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
                Your phone number is used only for verification.{'\n'}
                We never share your contacts with third parties.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>

        {/* Country Picker Modal Backdrop */}
        {showCountryPicker && (
          <Pressable 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 40,
            }}
            onPress={() => setShowCountryPicker(false)}
          />
        )}
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}