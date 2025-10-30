import { Text, TouchableOpacity, View, StatusBar, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeOption, useTheme } from "../theme/ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { useLayoutEffect } from "react";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStack } from "../../App";
import { Ionicons } from "@expo/vector-icons";

const options: ThemeOption[] = ["light", "dark", "system"];
type SettingScreenProp = NativeStackNavigationProp<RootStack, "SettingScreen">;

export default function SettingScreen() {
  const { preference, applied, setPreference } = useTheme();
  const navigation = useNavigation<SettingScreenProp>();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerStyle: {
        backgroundColor: applied === "dark" ? "#1e293b" : "#ffffff",
      },
      headerTintColor: applied === "dark" ? "#ffffff" : "#1e293b",
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 20,
      },
    });
  }, [navigation, applied]);

  const getThemeIcon = (option: ThemeOption) => {
    switch (option) {
      case 'light':
        return 'sunny';
      case 'dark':
        return 'moon';
      case 'system':
        return 'phone-portrait';
      default:
        return 'settings';
    }
  };

  const getThemeDescription = (option: ThemeOption) => {
    switch (option) {
      case 'light':
        return 'Always use light mode';
      case 'dark':
        return 'Always use dark mode';
      case 'system':
        return 'Follow system settings';
      default:
        return '';
    }
  };

  // Dynamic styles based on theme
  const dynamicStyles = {
    container: {
      flex: 1,
      backgroundColor: applied === "dark" ? "#0f172a" : "#f8fafc",
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
    },
    headerIcon: {
      width: 80,
      height: 80,
      backgroundColor: applied === "dark" ? "#3b82f6" : "#3b82f6",
      borderRadius: 20,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      shadowColor: '#3b82f6',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.4,
      shadowRadius: 20,
      elevation: 10,
      marginBottom: 16
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: applied === "dark" ? "#ffffff" : "#1e293b",
      marginBottom: 8
    },
    headerSubtitle: {
      fontSize: 16,
      fontWeight: '500' as const,
      color: applied === "dark" ? "#cbd5e1" : "#64748b",
      textAlign: 'center' as const
    },
    card: {
      backgroundColor: applied === "dark" ? "#1e293b" : "#ffffff",
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: applied === "dark" ? 0.2 : 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: applied === "dark" ? "#334155" : "#f1f5f9",
    },
    cardIcon: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: applied === "dark" ? "#1e40af" : "#f0f9ff",
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: 16
    },
    cardTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: applied === "dark" ? "#ffffff" : "#1e293b",
      marginBottom: 4
    },
    cardSubtitle: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: applied === "dark" ? "#94a3b8" : "#64748b"
    },
    themeOption: (isSelected: boolean) => ({
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      backgroundColor: isSelected 
        ? (applied === "dark" ? "#1e40af" : "#f0f9ff") 
        : (applied === "dark" ? "#334155" : "#f8fafc"),
      borderRadius: 14,
      padding: 16,
      borderWidth: 2,
      borderColor: isSelected ? '#3b82f6' : (applied === "dark" ? "#475569" : "#e2e8f0"),
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isSelected ? 0.1 : 0.05,
      shadowRadius: 8,
      elevation: isSelected ? 4 : 2,
    }),
    themeIcon: (isSelected: boolean) => ({
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: isSelected ? '#3b82f6' : (applied === "dark" ? "#475569" : "#e2e8f0"),
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      marginRight: 16
    }),
    themeName: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: applied === "dark" ? "#ffffff" : "#1e293b",
      marginBottom: 2
    },
    themeDescription: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: applied === "dark" ? "#94a3b8" : "#64748b"
    },
    settingItem: {
      backgroundColor: applied === "dark" ? "#1e293b" : "#ffffff",
      borderRadius: 16,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: applied === "dark" ? 0.2 : 0.08,
      shadowRadius: 12,
      elevation: 4,
      borderWidth: 1,
      borderColor: applied === "dark" ? "#334155" : "#f1f5f9",
      flexDirection: 'row' as const,
      alignItems: 'center' as const
    },
    appInfoText: {
      fontSize: 14,
      fontWeight: '500' as const,
      color: applied === "dark" ? "#94a3b8" : "#64748b",
      textAlign: 'center' as const
    },
    appVersionText: {
      fontSize: 12,
      fontWeight: '400' as const,
      color: applied === "dark" ? "#64748b" : "#94a3b8",
      textAlign: 'center' as const,
      marginTop: 4
    }
  };

  return (
    <SafeAreaView style={dynamicStyles.container} edges={["right", "bottom", "left"]}>
      <StatusBar 
        barStyle={applied === "dark" ? "light-content" : "dark-content"}
        backgroundColor={applied === "dark" ? "#1e293b" : "#ffffff"}
        translucent={false}
      />
      
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={dynamicStyles.content}>

          {/* Header Section */}
          <View style={{ alignItems: 'center', marginTop: 32, marginBottom: 24 }}>
            <View style={dynamicStyles.headerIcon}>
              <Ionicons name="settings" size={32} color="white" />
            </View>
            <Text style={dynamicStyles.headerTitle}>
              App Settings
            </Text>
            <Text style={dynamicStyles.headerSubtitle}>
              Customize your app appearance and preferences
            </Text>
          </View>

          {/* Theme Selection Card */}
          <View style={[dynamicStyles.card, { marginBottom: 24 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={dynamicStyles.cardIcon}>
                <Ionicons name="color-palette" size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.cardTitle}>
                  App Theme
                </Text>
                <Text style={dynamicStyles.cardSubtitle}>
                  Choose your preferred theme
                </Text>
              </View>
            </View>

            {/* Theme Options */}
            <View style={{ gap: 12 }}>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={dynamicStyles.themeOption(preference === option)}
                  onPress={() => setPreference(option)}
                >
                  <View style={dynamicStyles.themeIcon(preference === option)}>
                    <Ionicons 
                      name={getThemeIcon(option) as any} 
                      size={20} 
                      color={preference === option ? "white" : (applied === "dark" ? "#cbd5e1" : "#64748b")} 
                    />
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={dynamicStyles.themeName}>
                      {option.charAt(0).toUpperCase() + option.slice(1)} Mode
                    </Text>
                    <Text style={dynamicStyles.themeDescription}>
                      {getThemeDescription(option)}
                    </Text>
                  </View>

                  {/* Selection Indicator */}
                  {preference === option && (
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#3b82f6',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderWidth: 2,
                      borderColor: applied === "dark" ? "#1e293b" : "#ffffff",
                      shadowColor: '#3b82f6',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 4
                    }}>
                      <Ionicons name="checkmark" size={16} color="white" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Additional Settings Sections */}
          <View style={{ gap: 16 }}>

            {/* Notifications Settings */}
            <TouchableOpacity style={dynamicStyles.settingItem}>
              <View style={dynamicStyles.cardIcon}>
                <Ionicons name="notifications" size={24} color="#3b82f6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.themeName}>
                  Notifications
                </Text>
                <Text style={dynamicStyles.themeDescription}>
                  Manage your notification preferences
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={applied === "dark" ? "#475569" : "#cbd5e1"} />
            </TouchableOpacity>

            {/* Privacy Settings */}
            <TouchableOpacity style={dynamicStyles.settingItem}>
              <View style={[dynamicStyles.cardIcon, { backgroundColor: applied === "dark" ? "#7f1d1d" : "#fef2f2" }]}>
                <Ionicons name="shield-checkmark" size={24} color="#ef4444" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dynamicStyles.themeName}>
                  Privacy & Security
                </Text>
                <Text style={dynamicStyles.themeDescription}>
                  Control your privacy settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={applied === "dark" ? "#475569" : "#cbd5e1"} />
            </TouchableOpacity>

          </View>

          {/* App Info */}
          <View style={{ 
            alignItems: 'center', 
            marginTop: 32, 
            marginBottom: 24,
            padding: 20
          }}>
            <Text style={dynamicStyles.appInfoText}>
              ChatApp v1.0.0
            </Text>
            <Text style={dynamicStyles.appVersionText}>
              Built with ❤️ for better conversations
            </Text>
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}