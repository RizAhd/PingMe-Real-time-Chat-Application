import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { 
  Image, 
  Text, 
  TouchableOpacity, 
  View, 
  StatusBar, 
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { useContext, useLayoutEffect, useState } from "react";
import { useTheme } from "../theme/ThemeProvider";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserProfile } from "../socket/UseUserProfile";
import { uploadProfileImage } from "../api/UserService";
import { AuthContext } from "../components/AuthProvider";
import { ALERT_TYPE, Toast } from "react-native-alert-notification";

type ProfileScreenProp = NativeStackNavigationProp<RootStack, "ProfileScreen">;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenProp>();
  const { applied } = useTheme();
  const userProfile = useUserProfile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [hasNewImage, setHasNewImage] = useState(false);
  const auth = useContext(AuthContext);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "My Profile",
      headerStyle: {
        backgroundColor: '#ffffff',
      },
      headerTintColor: '#1e293b',
      headerTitleStyle: {
        fontWeight: '700',
        fontSize: 20,
      },
    });
  }, [navigation, applied]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Sorry, we need camera roll permissions to upload profile pictures.');
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        setHasNewImage(true);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to pick image. Please try again.",
        autoClose: 4000,
      });
    }
  };

  const uploadProfilePicture = async () => {
    if (!selectedImage) return;

    setIsUploading(true);
    try {
      const userId = auth?.userId ? String(auth.userId) : "0";
      const response = await uploadProfileImage(userId, selectedImage);
      
      if (response.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Profile picture updated successfully!",
          autoClose: 3000,
        });
        setHasNewImage(false);
        setSelectedImage(null);
        
        // Refresh the profile by updating the local state
        // The useUserProfile hook should automatically refresh on its own
        // If not, you might need to implement a refresh mechanism
      } else {
        throw new Error(response.message || "Upload failed");
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Upload Failed",
        textBody: "Failed to upload profile picture. Please try again.",
        autoClose: 4000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const cancelImageSelection = () => {
    setSelectedImage(null);
    setHasNewImage(false);
  };

  // Determine which image to display
  const displayImage = selectedImage || userProfile?.profileImage;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>

          {/* Profile Header Section */}
          <View style={styles.headerSection}>
            {/* Profile Image Container */}
            <View style={styles.imageContainer}>
              <View style={styles.imageWrapper}>
                {displayImage ? (
                  <Image
                    style={styles.profileImage}
                    source={{ uri: displayImage }}
                  />
                ) : (
                  <View style={styles.avatarFallback}>
                    <Text style={styles.avatarText}>
                      {userProfile?.firstName?.charAt(0)}{userProfile?.lastName?.charAt(0)}
                    </Text>
                  </View>
                )}
                
                {/* Uploading Indicator */}
                {isUploading && (
                  <View style={styles.uploadingOverlay}>
                    <ActivityIndicator size="large" color="#ffffff" />
                    <Text style={styles.uploadingText}>Uploading...</Text>
                  </View>
                )}
              </View>
              
              {/* Edit Photo Button */}
              <TouchableOpacity
                style={styles.editButton}
                onPress={pickImage}
                disabled={isUploading}
              >
                <Feather name="camera" size={18} color="white" />
              </TouchableOpacity>

              {/* New Image Indicator */}
              {hasNewImage && (
                <View style={styles.newImageBadge}>
                  <Text style={styles.newImageText}>NEW</Text>
                </View>
              )}
            </View>

            {/* User Name */}
            <Text style={styles.userName}>
              {userProfile?.firstName} {userProfile?.lastName}
            </Text>
            
            {/* Status */}
            <View style={styles.statusContainer}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>
                Online
              </Text>
            </View>
          </View>

          {/* Save/Cancel Buttons when new image is selected */}
          {hasNewImage && (
            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[styles.actionButton, styles.saveButton]}
                onPress={uploadProfilePicture}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Feather name="check" size={20} color="white" />
                    <Text style={styles.actionButtonText}>
                      Save Picture
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.cancelButton]}
                onPress={cancelImageSelection}
                disabled={isUploading}
              >
                <Feather name="x" size={20} color="#64748b" />
                <Text style={[styles.actionButtonText, styles.cancelButtonText]}>
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Edit Profile Button (when no new image) */}
          {!hasNewImage && (
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={pickImage}
            >
              <Feather name="edit-3" size={20} color="white" />
              <Text style={styles.editProfileText}>
                Edit Profile Picture
              </Text>
            </TouchableOpacity>
          )}

          {/* Profile Information Cards */}
          <View style={styles.cardsContainer}>

            {/* Personal Information Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Personal Information
              </Text>
              
              <View style={styles.cardContent}>

                {/* Name Section */}
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Feather name="user" size={20} color="#2563eb" />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      Full Name
                    </Text>
                    <Text style={styles.infoValue}>
                      {userProfile?.firstName} {userProfile?.lastName}
                    </Text>
                  </View>
                </View>

                {/* Phone Section */}
                <View style={styles.infoItem}>
                  <View style={styles.iconContainer}>
                    <Feather name="phone" size={20} color="#2563eb" />
                  </View>
                  <View style={styles.infoTextContainer}>
                    <Text style={styles.infoLabel}>
                      Phone Number
                    </Text>
                    <Text style={styles.infoValue}>
                      {userProfile?.countryCode} {userProfile?.contactNo}
                    </Text>
                  </View>
                </View>

              </View>
            </View>

            {/* Account Actions Card */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>
                Account Actions
              </Text>
              
              <View style={styles.actionsContent}>

                <TouchableOpacity 
                  style={styles.actionItem}
                  onPress={() => navigation.navigate('SettingScreen' as never)}
                >
                  <View style={styles.actionIcon}>
                    <Feather name="settings" size={18} color="#2563eb" />
                  </View>
                  <Text style={styles.actionText}>
                    Settings
                  </Text>
                  <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
                </TouchableOpacity>

              </View>
            </View>

          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 24,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
  },
  avatarFallback: {
    width: '100%',
    height: '100%',
    borderRadius: 66,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  editButton: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#2563eb',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 66,
  },
  uploadingText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  newImageBadge: {
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  newImageText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '800',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  actionButton: {
    flex: 1,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#2563eb',
  },
  cancelButton: {
    backgroundColor: '#f8fafc',
    borderWidth: 2,
    borderColor: '#e2e8f0',
  },
  actionButtonText: {
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
    letterSpacing: 0.3,
  },
  cancelButtonText: {
    color: '#64748b',
  },
  editProfileButton: {
    backgroundColor: '#2563eb',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 32,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  editProfileText: {
    fontWeight: '700',
    fontSize: 16,
    color: 'white',
    letterSpacing: 0.3,
  },
  cardsContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  cardContent: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
  },
  actionsContent: {
    gap: 12,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
  },
});