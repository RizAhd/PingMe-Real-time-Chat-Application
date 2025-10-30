import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  Animated,
  Easing,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState, useRef, useEffect } from "react";
import { useUserRegistration } from "../components/UserContext";
import { validateProfileImage } from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { createNewAccount } from "../api/UserService";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../components/AuthProvider";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

type AvatarScreenProps = NativeStackNavigationProp<RootStack, "AvatarScreen">;

export default function AvatarScreen() {
  const navigation = useNavigation<AvatarScreenProps>();
  const { applied } = useTheme();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const { userData, setUserData } = useUserRegistration();
  const auth = useContext(AuthContext);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setUserData((previous) => ({
        ...previous,
        profileImage: result.assets[0].uri,
      }));
    }
  };

  const avatars = [
    require("../../assets/avatar/avatar_1.png"),
    require("../../assets/avatar/avatar_2.png"),
    require("../../assets/avatar/avatar_3.png"),
    require("../../assets/avatar/avatar_4.png"),
    require("../../assets/avatar/avatar_5.png"),
    require("../../assets/avatar/avatar_6.png"),
  ];

  const handleCreateAccount = async () => {
    const validProfile = validateProfileImage(
      userData.profileImage
        ? { uri: userData.profileImage, type: "", fileSize: 0 }
        : null
    );
    
    if (validProfile) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Profile Image Required",
        textBody: "Please select a profile image or choose an avatar to continue",
        autoClose: 4000,
      });
    } else {
      try {
        setLoading(true);
        const response = await createNewAccount(userData);
        if (response.status) {
          const id = response.userId;
          if (auth) {
            await auth.signUp(String(id));
            // navigation.replace("HomeScreen");
          }
        } else {
          Toast.show({
            type: ALERT_TYPE.WARNING,
            title: "Registration Failed",
            textBody: response.message,
            autoClose: 5000,
          });
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Error",
          textBody: "Something went wrong. Please try again.",
          autoClose: 5000,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: applied === "light" ? "#f0f4f8" : "#0a0f1c" }}>
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
          creating
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
                {/* Person Icon Animation */}
                <Ionicons name="person-circle-outline" size={24} color="white" />
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
              Profile Picture 🎨
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
              Choose how friends will see you in chats
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
          
          {/* Upload Image Section */}
          <View style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{
              color: applied === "light" ? '#374151' : '#e5e7eb',
              fontSize: 12,
              fontWeight: '600',
              marginBottom: 12,
              letterSpacing: 0.5,
              textAlign: 'center',
            }}>
              📸 UPLOAD PHOTO
            </Text>
            
            <Animated.View style={{
              transform: [{ scale: pulseAnim }],
            }}>
              <Pressable
                onPress={pickImage}
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: 2,
                  borderStyle: image ? 'solid' : 'dashed',
                  borderColor: image ? '#2563eb' : (applied === "light" ? '#d1d5db' : '#475569'),
                  backgroundColor: image ? 'rgba(37, 99, 235, 0.05)' : (applied === "light" ? 'rgba(255, 255, 255, 0.8)' : 'rgba(30, 41, 59, 0.8)'),
                  shadowColor: '#2563eb',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: image ? 0.2 : 0.1,
                  shadowRadius: 8,
                  elevation: 2,
                  overflow: 'hidden',
                }}
              >
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{ width: 120, height: 120, borderRadius: 20 }}
                  />
                ) : (
                  <View style={{ alignItems: 'center', gap: 8 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      backgroundColor: applied === "light" ? '#eff6ff' : '#1e3a8a',
                      borderRadius: 20,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                      <Ionicons name="camera-outline" size={20} color="#2563eb" />
                    </View>
                    <Text style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: '#2563eb',
                      textAlign: 'center',
                    }}>
                      Upload Photo
                    </Text>
                  </View>
                )}
              </Pressable>
            </Animated.View>
            
            <Text style={{
              color: applied === "light" ? '#6b7280' : '#9ca3b8',
              fontSize: 11,
              marginTop: 8,
              textAlign: 'center',
            }}>
              {image ? "Tap to change photo" : "Upload your own photo"}
            </Text>
          </View>

          {/* Avatar Selection */}
          <View style={{ marginBottom: 20 }}>
            <View style={{ 
              flexDirection: 'row', 
              alignItems: 'center', 
              justifyContent: 'center', 
              marginBottom: 16,
              gap: 12,
            }}>
              <View style={{ flex: 1, height: 1, backgroundColor: applied === "light" ? '#e5e7eb' : '#374151' }} />
              <Text style={{
                color: applied === "light" ? '#6b7280' : '#9ca3b8',
                fontSize: 11,
                fontWeight: '600',
                textAlign: 'center',
              }}>
                OR CHOOSE AVATAR
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: applied === "light" ? '#e5e7eb' : '#374151' }} />
            </View>

            <FlatList
              data={avatars}
              horizontal
              keyExtractor={(_, index) => index.toString()}
              renderItem={({ item }) => (
                <Animated.View style={{
                  transform: [{ scale: pulseAnim }],
                }}>
                  <Pressable
                    onPress={() => {
                      const avatarUri = Image.resolveAssetSource(item).uri;
                      setImage(avatarUri);
                      setUserData((previous) => ({
                        ...previous,
                        profileImage: avatarUri,
                      }));
                    }}
                    style={{
                      marginHorizontal: 6,
                      padding: 3,
                      borderRadius: 16,
                      backgroundColor: image === Image.resolveAssetSource(item).uri ? 
                        'rgba(37, 99, 235, 0.1)' : 'transparent',
                      borderWidth: 2,
                      borderColor: image === Image.resolveAssetSource(item).uri ? 
                        '#2563eb' : 'transparent',
                    }}
                  >
                    <Image
                      source={item}
                      style={{ width: 70, height: 70, borderRadius: 14 }}
                    />
                  </Pressable>
                </Animated.View>
              )}
              contentContainerStyle={{ paddingHorizontal: 4 }}
              showsHorizontalScrollIndicator={false}
            />
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
          </View>

          {/* Buttons */}
          <View>
            {/* CREATE ACCOUNT Button */}
            <Pressable
              onPress={handleCreateAccount}
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
                  ✅ CREATE ACCOUNT
                </Text>
              )}
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
              By creating an account, you agree to our{' '}
              <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Terms</Text> and{' '}
              <Text style={{ color: '#3b82f6', fontWeight: '600' }}>Privacy</Text>
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}