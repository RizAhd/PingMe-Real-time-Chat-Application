import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { 
  Pressable, 
  Text, 
  TouchableOpacity, 
  View, 
  StatusBar, 
  ScrollView,
  TextInput,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import {
  validateCountryCode,
  validateFirstName,
  validateLastName,
  validatePhoneNo,
} from "../util/Validation";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";
import { useSendNewContact } from "../socket/UseSendNewContact";

type NewContactScreenProp = NativeStackNavigationProp<
  RootStack,
  "NewContactScreen"
>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;

export default function NewContactScreen() {
  const navigation = useNavigation<NewContactScreenProp>();
  
  // Enhanced Animations
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const slideUp = useRef(new Animated.Value(20)).current;
  const fadeIn = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const saveScaleAnim = useRef(new Animated.Value(1)).current;
  const cancelScaleAnim = useRef(new Animated.Value(1)).current;
  
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

    // Continuous pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.02,
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
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 8 }}>
          <TouchableOpacity
            style={{ 
              justifyContent: 'center', 
              alignItems: 'center', 
              width: isSmallScreen ? 36 : 40, 
              height: isSmallScreen ? 36 : 40, 
              borderRadius: isSmallScreen ? 18 : 20,
              backgroundColor: '#f1f5f9',
              marginRight: isSmallScreen ? 8 : 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={isSmallScreen ? 20 : 24} color="#2563eb" />
          </TouchableOpacity>
          <View>
            <Text style={{ 
              fontSize: isSmallScreen ? 18 : 20, 
              fontWeight: '800', 
              color: '#1e293b',
              letterSpacing: -0.5,
            }}>
              New Contact
            </Text>
            <Text style={{ 
              fontSize: isSmallScreen ? 12 : 13, 
              fontWeight: '500', 
              color: '#64748b',
              marginTop: 2,
            }}>
              Add someone to PingMe
            </Text>
          </View>
        </View>
      ),
      headerStyle: {
    
      },
    });
  }, [navigation]);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    phone: false
  });
  const [isLoading, setIsLoading] = useState(false);

  const newContact = useSendNewContact();
  const sendNewContact = newContact.sendNewContact;

  const animateButtonPress = (anim: Animated.Value) => {
    Animated.sequence([
      Animated.timing(anim, {
        toValue: 0.96,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(anim, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      })
    ]).start();
  };

  const sendData = async () => {
    setIsLoading(true);
    try {
      await sendNewContact({
        id: 0,
        firstName: firstName,
        lastName: lastName,
        countryCode: "+94",
        contactNo: phoneNo,
        createdAt: "",
        updatedAt: "",
        status: "",
      });
      
      setFirstName("");
      setLastName("");
      setPhoneNo("");
      
      Toast.show({
        type: ALERT_TYPE.SUCCESS,
        title: "Success",
        textBody: "Contact has been saved successfully!",
        autoClose: 3000,
      });
      
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to save contact. Please try again.",
        autoClose: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveContact = () => {
    animateButtonPress(saveScaleAnim);
    
    const firstNameValid = validateFirstName(firstName);
    const lastNameValid = validateLastName(lastName);
    const countryCodeValid = validateCountryCode("+94");
    const phoneNoValid = validatePhoneNo(phoneNo);

    if (firstNameValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "First Name Required",
        textBody: firstNameValid,
        autoClose: 4000,
      });
      return;
    }
    
    if (lastNameValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Last Name Required",
        textBody: lastNameValid,
        autoClose: 4000,
      });
      return;
    }
    
    if (countryCodeValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Country Code",
        textBody: countryCodeValid,
        autoClose: 4000,
      });
      return;
    }
    
    if (phoneNoValid) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Invalid Phone Number",
        textBody: phoneNoValid,
        autoClose: 4000,
      });
      return;
    }

    sendData();
  };

  const handleCancel = () => {
    animateButtonPress(cancelScaleAnim);
    navigation.goBack();
  };

  const rotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flex: 1, paddingHorizontal: isSmallScreen ? 20 : 24 }}>
          {/* Header Icon with PingMe Logo */}
          <Animated.View 
            style={{ 
              alignItems: 'center', 
              marginTop: isSmallScreen ? 24 : 32, 
              marginBottom: isSmallScreen ? 24 : 32,
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}
          >
            <Animated.View style={{
              transform: [
                { scale: logoScale },
                { rotate: rotateInterpolate }
              ],
            }}>
              <View style={{ 
                width: isSmallScreen ? 72 : 80, 
                height: isSmallScreen ? 72 : 80, 
                backgroundColor: '#2563eb', 
                borderRadius: isSmallScreen ? 18 : 20,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 12 },
                shadowOpacity: 0.4,
                shadowRadius: 20,
                elevation: 10,
                marginBottom: isSmallScreen ? 12 : 16,
              }}>
                <Feather name="user-plus" size={isSmallScreen ? 28 : 32} color="white" />
              </View>
            </Animated.View>
            
            <Text style={{ 
              fontSize: isSmallScreen ? 20 : 24, 
              fontWeight: '800', 
              color: '#1e293b',
              textAlign: 'center',
              marginBottom: 4,
            }}>
              Add New Contact
            </Text>
            <Text style={{ 
              fontSize: isSmallScreen ? 13 : 14, 
              fontWeight: '400', 
              color: '#64748b',
              textAlign: 'center',
              lineHeight: isSmallScreen ? 18 : 20,
            }}>
              Add someone to your PingMe contacts
            </Text>
          </Animated.View>

          {/* Form Section */}
          <Animated.View 
            style={{ 
              gap: isSmallScreen ? 20 : 24,
              opacity: fadeIn,
              transform: [{ translateY: slideUp }],
            }}
          >
            {/* First Name Input */}
            <View>
              <Text style={{ 
                color: '#374151', 
                fontWeight: '600', 
                fontSize: isSmallScreen ? 14 : 15, 
                marginBottom: isSmallScreen ? 6 : 8, 
                marginLeft: 2,
                letterSpacing: 0.3,
              }}>
                 FIRST NAME
              </Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  borderRadius: isSmallScreen ? 12 : 14, 
                  borderWidth: 2,
                  paddingHorizontal: isSmallScreen ? 14 : 16,
                  backgroundColor: isFocused.firstName ? '#f0f9ff' : '#ffffff',
                  borderColor: isFocused.firstName ? '#2563eb' : '#e2e8f0',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isFocused.firstName ? 0.15 : 0.08,
                  shadowRadius: isFocused.firstName ? 8 : 6,
                  elevation: isFocused.firstName ? 4 : 3,
                  height: isSmallScreen ? 52 : 58
                }}>
                  <Feather name="user" size={isSmallScreen ? 18 : 20} color={isFocused.firstName ? "#2563eb" : "#64748b"} />
                  <TextInput
                    style={{ 
                      flex: 1, 
                      marginLeft: isSmallScreen ? 10 : 12, 
                      fontSize: isSmallScreen ? 15 : 16, 
                      color: '#1e293b', 
                      fontWeight: '500',
                      height: '100%',
                      includeFontPadding: false,
                    }}
                    placeholder="Enter first name"
                    placeholderTextColor="#9ca3af"
                    value={firstName}
                    onChangeText={setFirstName}
                    onFocus={() => setIsFocused(prev => ({ ...prev, firstName: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, firstName: false }))}
                  />
                </View>
              </Animated.View>
            </View>

            {/* Last Name Input */}
            <View>
              <Text style={{ 
                color: '#374151', 
                fontWeight: '600', 
                fontSize: isSmallScreen ? 14 : 15, 
                marginBottom: isSmallScreen ? 6 : 8, 
                marginLeft: 2,
                letterSpacing: 0.3,
              }}>
                 LAST NAME
              </Text>
              <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                <View style={{ 
                  flexDirection: 'row', 
                  alignItems: 'center', 
                  borderRadius: isSmallScreen ? 12 : 14, 
                  borderWidth: 2,
                  paddingHorizontal: isSmallScreen ? 14 : 16,
                  backgroundColor: isFocused.lastName ? '#f0f9ff' : '#ffffff',
                  borderColor: isFocused.lastName ? '#2563eb' : '#e2e8f0',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isFocused.lastName ? 0.15 : 0.08,
                  shadowRadius: isFocused.lastName ? 8 : 6,
                  elevation: isFocused.lastName ? 4 : 3,
                  height: isSmallScreen ? 52 : 58
                }}>
                  <Feather name="users" size={isSmallScreen ? 18 : 20} color={isFocused.lastName ? "#2563eb" : "#64748b"} />
                  <TextInput
                    style={{ 
                      flex: 1, 
                      marginLeft: isSmallScreen ? 10 : 12, 
                      fontSize: isSmallScreen ? 15 : 16, 
                      color: '#1e293b', 
                      fontWeight: '500',
                      height: '100%',
                      includeFontPadding: false,
                    }}
                    placeholder="Enter last name"
                    placeholderTextColor="#9ca3af"
                    value={lastName}
                    onChangeText={setLastName}
                    onFocus={() => setIsFocused(prev => ({ ...prev, lastName: true }))}
                    onBlur={() => setIsFocused(prev => ({ ...prev, lastName: false }))}
                  />
                </View>
              </Animated.View>
            </View>

            {/* Phone Number Input */}
            <View>
              <Text style={{ 
                color: '#374151', 
                fontWeight: '600', 
                fontSize: isSmallScreen ? 14 : 15, 
                marginBottom: isSmallScreen ? 6 : 8, 
                marginLeft: 2,
                letterSpacing: 0.3,
              }}>
                PHONE NUMBER
              </Text>
              <View style={{ flexDirection: 'row', gap: isSmallScreen ? 10 : 12 }}>
                {/* Country Code Input */}
                <View style={{ flex: 1 }}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      borderRadius: isSmallScreen ? 12 : 14, 
                      borderWidth: 2,
                      paddingHorizontal: isSmallScreen ? 14 : 16,
                      backgroundColor: isFocused.phone ? '#f0f9ff' : '#ffffff',
                      borderColor: isFocused.phone ? '#2563eb' : '#e2e8f0',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isFocused.phone ? 0.15 : 0.08,
                      shadowRadius: isFocused.phone ? 8 : 6,
                      elevation: isFocused.phone ? 4 : 3,
                      height: isSmallScreen ? 52 : 58,
                      justifyContent: 'center'
                    }}>
                      <Feather name="phone" size={isSmallScreen ? 18 : 20} color={isFocused.phone ? "#2563eb" : "#64748b"} />
                      <Text style={{ 
                        fontWeight: '700', 
                        color: '#2563eb', 
                        fontSize: isSmallScreen ? 15 : 16, 
                        marginLeft: isSmallScreen ? 10 : 12 
                      }}>
                        +94
                      </Text>
                    </View>
                  </Animated.View>
                </View>

                {/* Phone Number Input */}
                <View style={{ flex: 2 }}>
                  <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                    <View style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center', 
                      borderRadius: isSmallScreen ? 12 : 14, 
                      borderWidth: 2,
                      paddingHorizontal: isSmallScreen ? 14 : 16,
                      backgroundColor: isFocused.phone ? '#f0f9ff' : '#ffffff',
                      borderColor: isFocused.phone ? '#2563eb' : '#e2e8f0',
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: isFocused.phone ? 0.15 : 0.08,
                      shadowRadius: isFocused.phone ? 8 : 6,
                      elevation: isFocused.phone ? 4 : 3,
                      height: isSmallScreen ? 52 : 58
                    }}>
                      <TextInput
                        style={{ 
                          flex: 1, 
                          fontSize: isSmallScreen ? 15 : 16, 
                          color: '#1e293b', 
                          fontWeight: '500',
                          height: '100%',
                          includeFontPadding: false,
                        }}
                        placeholder="77 123 4567"
                        placeholderTextColor="#9ca3af"
                        inputMode="tel"
                        value={phoneNo}
                        onChangeText={setPhoneNo}
                        onFocus={() => setIsFocused(prev => ({ ...prev, phone: true }))}
                        onBlur={() => setIsFocused(prev => ({ ...prev, phone: false }))}
                      />
                    </View>
                  </Animated.View>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* Buttons Section - Same Style as SignIn/SignUp */}
          <View style={{ 
            marginTop: isSmallScreen ? 36 : 48, 
            marginBottom: isSmallScreen ? 24 : 32, 
            gap: isSmallScreen ? 12 : 16 
          }}>
            {/* SAVE CONTACT Button - Same as SIGN IN Button */}
            <Animated.View style={{ transform: [{ scale: saveScaleAnim }] }}>
              <Pressable
                onPress={handleSaveContact}
                disabled={isLoading}
                style={{
                  backgroundColor: isLoading ? '#93c5fd' : '#2563eb',
                  height: isSmallScreen ? 52 : 56,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: isSmallScreen ? 26 : 28,
                  marginBottom: isSmallScreen ? 10 : 12,
                  shadowColor: '#2563eb',
                  shadowOffset: { width: 0, height: 6 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 4,
                }}
              >
                {isLoading ? (
                  <ActivityIndicator color="#ffffff" size="small" />
                ) : (
                  <Text style={{
                    fontSize: isSmallScreen ? 16 : 17,
                    fontWeight: '700',
                    color: '#ffffff',
                    letterSpacing: 0.5,
                  }}>
                    SAVE CONTACT
                  </Text>
                )}
              </Pressable>
            </Animated.View>

            {/* CANCEL Button - Same as CREATE ACCOUNT Button */}
            <Animated.View style={{ transform: [{ scale: cancelScaleAnim }] }}>
              <Pressable
                onPress={handleCancel}
                style={{
                  height: isSmallScreen ? 48 : 52,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: isSmallScreen ? 24 : 26,
                  borderWidth: 2,
                  borderColor: '#2563eb',
                  backgroundColor: 'transparent',
                }}
              >
                <Text style={{
                  fontSize: isSmallScreen ? 14 : 15,
                  fontWeight: '700',
                  color: '#2563eb',
                  letterSpacing: 0.3,
                }}>
                   CANCEL
                </Text>
              </Pressable>
            </Animated.View>
          </View>

          {/* Footer Note */}
          <View style={{ marginTop: isSmallScreen ? 16 : 20, alignItems: 'center' }}>
            <Text style={{
              color: '#9ca3af',
              fontSize: isSmallScreen ? 11 : 12,
              textAlign: 'center',
              lineHeight: isSmallScreen ? 16 : 18,
              letterSpacing: 0.2,
            }}>
              Contact will be added to your PingMe contacts list{'\n'}
              and available for messaging
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}