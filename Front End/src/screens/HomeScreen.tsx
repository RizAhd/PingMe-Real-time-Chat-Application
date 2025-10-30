import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useContext, useLayoutEffect, useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useChatList } from "../socket/UseChatList";
import { formatChatTime } from "../util/DateFormatter";
import { Chat } from "../socket/chat";
import { AuthContext } from "../components/AuthProvider";

type HomeScreenProps = NativeStackNavigationProp<RootStack, "HomeScreen">;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenWidth < 375;
const isLargeScreen = screenWidth > 414;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps>();
  const [search, setSearch] = useState("");
  const chatList = useChatList();
  const [isModalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const auth = useContext(AuthContext);

  // Animation values
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const tabIndicatorAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const searchFocusAnim = useRef(new Animated.Value(0)).current;

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

    // Tab indicator animation
    Animated.timing(tabIndicatorAnim, {
      toValue: activeTab === "all" ? 0 : 1,
      duration: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [activeTab]);

  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <View
          style={{
            height: isSmallScreen ? 80 : 96,
            backgroundColor: '#ffffff',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderBottomColor: '#f1f5f9',
            paddingHorizontal: 20,
            paddingTop: Platform.OS === "ios" ? (isSmallScreen ? 20 : 40) : (isSmallScreen ? 10 : 20),
            paddingBottom: Platform.OS === "ios" ? (isSmallScreen ? 10 : 20) : (isSmallScreen ? 5 : 10),
          }}
        >
          <View style={{ flex: 1, alignItems: 'flex-start' }}>
            {/* Animated PingMe Logo */}
            <Animated.View 
              style={{ 
                transform: [
                  { scale: logoScale },
                  { rotate: logoRotate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg']
                  })}
                ]
              }}
              className="flex-row items-center"
            >
              <View style={{
                width: isSmallScreen ? 32 : 40,
                height: isSmallScreen ? 32 : 40,
                backgroundColor: '#2563eb',
                borderRadius: isSmallScreen ? 12 : 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: isSmallScreen ? 8 : 12,
                shadowColor: '#2563eb',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <View style={{
                  width: isSmallScreen ? 16 : 20,
                  height: isSmallScreen ? 14 : 18,
                  borderWidth: 2,
                  borderColor: 'white',
                  borderRadius: isSmallScreen ? 4 : 5,
                  borderBottomWidth: isSmallScreen ? 4 : 6,
                  borderBottomColor: 'white',
                  position: 'relative',
                }}>
                  <View style={{
                    width: isSmallScreen ? 6 : 8,
                    height: isSmallScreen ? 2 : 3,
                    backgroundColor: 'white',
                    borderRadius: 1,
                    position: 'absolute',
                    bottom: isSmallScreen ? 2 : 3,
                    left: isSmallScreen ? 3 : 4,
                  }} />
                </View>
              </View>
              <Text style={{
                fontFamily: 'System',
                fontWeight: '900',
                fontSize: isSmallScreen ? 20 : 24,
                color: '#2563eb',
                letterSpacing: -0.5,
              }}>
                PingMe
              </Text>
            </Animated.View>
          </View>
          <View>
            <View style={{ flexDirection: 'row', gap: isSmallScreen ? 12 : 20 }}>
              <TouchableOpacity style={{ padding: isSmallScreen ? 6 : 8 }}>
                <Ionicons 
                  name="camera" 
                  size={isSmallScreen ? 20 : 24} 
                  color="#3b82f6" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{ padding: isSmallScreen ? 6 : 8 }}
                onPress={() => setModalVisible(true)}
              >
                <Ionicons 
                  name="ellipsis-vertical" 
                  size={isSmallScreen ? 18 : 22} 
                  color="#64748b" 
                />
              </TouchableOpacity>
              <Modal
                animationType="fade"
                visible={isModalVisible}
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
              >
                <Pressable
                  style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.4)', justifyContent: 'flex-end' }}
                  onPress={() => setModalVisible(false)}
                >
                  <Pressable onPress={(e) => e.stopPropagation()}>
                    <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', padding: 20 }}>
                      <View style={{
                        backgroundColor: '#ffffff',
                        borderRadius: 20,
                        width: screenWidth * 0.7,
                        maxWidth: 280,
                        padding: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 10 },
                        shadowOpacity: 0.1,
                        shadowRadius: 20,
                        elevation: 8,
                      }}>
                        <TouchableOpacity
                          style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            paddingVertical: 16, 
                            borderBottomWidth: 1, 
                            borderBottomColor: '#f1f5f9'
                          }}
                          onPress={() => {
                            navigation.navigate("SettingScreen");
                            setModalVisible(false);
                          }}
                        >
                          <Ionicons name="settings-outline" size={20} color="#64748b" style={{ marginRight: 12 }} />
                          <Text style={{ fontFamily: 'System', fontWeight: '600', color: '#1f2937', fontSize: 16 }}>Settings</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ 
                            flexDirection: 'row', 
                            alignItems: 'center', 
                            paddingVertical: 16, 
                            borderBottomWidth: 1, 
                            borderBottomColor: '#f1f5f9'
                          }}
                          onPress={() => {
                            navigation.navigate("ProfileScreen");
                            setModalVisible(false);
                          }}
                        >
                          <Ionicons name="person-outline" size={20} color="#64748b" style={{ marginRight: 12 }} />
                          <Text style={{ fontFamily: 'System', fontWeight: '600', color: '#1f2937', fontSize: 16 }}>My Profile</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16 }}
                          onPress={() => {
                            if (auth) auth.signOut();
                          }}
                        >
                          <Ionicons name="log-out-outline" size={20} color="#ef4444" style={{ marginRight: 12 }} />
                          <Text style={{ fontFamily: 'System', fontWeight: '600', color: '#ef4444', fontSize: 16 }}>Log Out</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>
            </View>
          </View>
        </View>
      ),
    });
  }, [navigation, isModalVisible]);

  // Filter chats based on active tab and search
  const filteredChats = [...chatList]
    .filter((chat) => {
      const matchesSearch = 
        chat.friendName.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage.toLowerCase().includes(search.toLowerCase());
      
      if (activeTab === "unread") {
        return matchesSearch && chat.unreadCount > 0;
      }
      return matchesSearch;
    })
    .sort(
      (a, b) =>
        new Date(b.lastTimeStamp).getTime() -
        new Date(a.lastTimeStamp).getTime()
    );

  const handleSearchFocus = () => {
    Animated.timing(searchFocusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleSearchBlur = () => {
    Animated.timing(searchFocusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const searchContainerScale = searchFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02]
  });

  const searchBorderColor = searchFocusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#e2e8f0', '#2563eb']
  });

  const renderItem = ({ item }: { item: Chat }) => (
    <Animated.View style={{ opacity: fadeAnim }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: isSmallScreen ? 12 : 16,
          paddingHorizontal: isSmallScreen ? 16 : 20,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#f8fafc',
        }}
        onPress={() => {
          navigation.navigate("SingleChatScreen", {
            chatId: item.friendId,
            friendName: item.friendName,
            lastSeenTime: formatChatTime(item.lastTimeStamp),
            profileImage: item.profileImage
              ? item.profileImage
              : `https://ui-avatars.com/api/?name=${item.friendName.replace(" ", "+")}&background=0ea5e9&color=ffffff`,
          });
        }}
      >
        <View style={{ position: 'relative' }}>
          <View style={{
            width: isSmallScreen ? 56 : 64,
            height: isSmallScreen ? 56 : 64,
            borderRadius: isSmallScreen ? 16 : 20,
            backgroundColor: '#eff6ff',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 2,
            borderColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}>
            {item.profileImage ? (
              <Image
                source={{ uri: item.profileImage }}
                style={{ 
                  width: isSmallScreen ? 56 : 64, 
                  height: isSmallScreen ? 56 : 64, 
                  borderRadius: isSmallScreen ? 16 : 20 
                }}
              />
            ) : (
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${item.friendName.replace(" ", "+")}&background=0ea5e9&color=ffffff&bold=true`,
                }}
                style={{ 
                  width: isSmallScreen ? 56 : 64, 
                  height: isSmallScreen ? 56 : 64, 
                  borderRadius: isSmallScreen ? 16 : 20 
                }}
              />
            )}
          </View>
          {item.unreadCount > 0 && (
            <View style={{
              position: 'absolute',
              top: -4,
              right: -4,
              backgroundColor: '#ef4444',
              borderRadius: 10,
              minWidth: isSmallScreen ? 18 : 20,
              height: isSmallScreen ? 18 : 20,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 2,
              borderColor: '#ffffff',
            }}>
              <Text style={{ 
                color: '#ffffff', 
                fontSize: isSmallScreen ? 10 : 11, 
                fontWeight: '800',
                includeFontPadding: false,
              }}>
                {item.unreadCount > 99 ? "99+" : item.unreadCount}
              </Text>
            </View>
          )}
        </View>
        <View style={{ flex: 1, marginLeft: isSmallScreen ? 12 : 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
            <Text
              style={{
                fontFamily: 'System',
                fontWeight: '700',
                fontSize: isSmallScreen ? 16 : 18,
                color: item.unreadCount > 0 ? '#111827' : '#374151',
                flex: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.friendName}
            </Text>
            <Text style={{
              fontFamily: 'System',
              fontWeight: '500',
              fontSize: isSmallScreen ? 11 : 12,
              color: item.unreadCount > 0 ? '#2563eb' : '#6b7280',
              marginLeft: 8,
            }}>
              {formatChatTime(item.lastTimeStamp)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'System',
                fontWeight: item.unreadCount > 0 ? '600' : '500',
                fontSize: isSmallScreen ? 13 : 14,
                color: item.unreadCount > 0 ? '#111827' : '#6b7280',
                flex: 1,
              }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.lastMessage}
            </Text>
            {item.unreadCount > 0 && (
              <View style={{
                backgroundColor: '#2563eb',
                borderRadius: 12,
                minWidth: isSmallScreen ? 20 : 24,
                height: isSmallScreen ? 20 : 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 8,
              }}>
                <Text style={{
                  color: '#ffffff',
                  fontSize: isSmallScreen ? 10 : 11,
                  fontWeight: '800',
                  includeFontPadding: false,
                }}>
                  {item.unreadCount > 99 ? "99+" : item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  const tabIndicatorPosition = tabIndicatorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth * 0.5 - 32]
  });

  const unreadCount = chatList.filter(chat => chat.unreadCount > 0).length;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
      edges={["right", "bottom", "left"]}
    >
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      {/* Search Bar */}
      <View style={{ 
        paddingHorizontal: isSmallScreen ? 16 : 20, 
        paddingTop: isSmallScreen ? 12 : 16, 
        paddingBottom: isSmallScreen ? 8 : 12 
      }}>
        <Animated.View 
          style={{ 
            transform: [{ scale: searchContainerScale }],
            borderColor: searchBorderColor,
            borderWidth: 1.5,
            borderRadius: isSmallScreen ? 14 : 16,
            backgroundColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: searchFocusAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.05, 0.1]
            }),
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: isSmallScreen ? 14 : 16,
            height: isSmallScreen ? 48 : 56,
          }}>
            <Ionicons name="search" size={isSmallScreen ? 18 : 20} color="#64748b" />
            <TextInput
              style={{
                flex: 1,
                fontFamily: 'System',
                fontWeight: '500',
                fontSize: isSmallScreen ? 15 : 16,
                color: '#111827',
                marginLeft: isSmallScreen ? 10 : 12,
                margin: 0,
                padding: 0,
                includeFontPadding: false,
              }}
              placeholder="Search conversations..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={(text) => setSearch(text)}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={isSmallScreen ? 18 : 20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      </View>

      {/* Tabs Section */}
      <View style={{ 
        paddingHorizontal: isSmallScreen ? 16 : 20, 
        paddingBottom: isSmallScreen ? 8 : 12 
      }}>
        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: isSmallScreen ? 14 : 16,
          padding: 4,
          flexDirection: 'row',
          position: 'relative',
          borderWidth: 1,
          borderColor: '#f1f5f9',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 1,
        }}>
          {/* Animated Tab Indicator */}
          <Animated.View 
            style={{ 
              transform: [{ translateX: tabIndicatorPosition }],
              width: '50%',
              position: 'absolute',
              height: isSmallScreen ? 36 : 44,
              backgroundColor: '#2563eb',
              borderRadius: isSmallScreen ? 12 : 14,
              margin: 4,
              shadowColor: '#2563eb',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 2,
            }}
          />
          
          {/* All Chats Tab */}
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: isSmallScreen ? 10 : 12,
              borderRadius: isSmallScreen ? 12 : 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setActiveTab("all")}
          >
            <Text style={{
              fontFamily: 'System',
              fontWeight: '600',
              fontSize: isSmallScreen ? 14 : 15,
              color: activeTab === "all" ? "#ffffff" : "#64748b",
            }}>
              All Chats
            </Text>
          </TouchableOpacity>

          {/* Unread Tab */}
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: isSmallScreen ? 10 : 12,
              borderRadius: isSmallScreen ? 12 : 14,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onPress={() => setActiveTab("unread")}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                fontFamily: 'System',
                fontWeight: '600',
                fontSize: isSmallScreen ? 14 : 15,
                color: activeTab === "unread" ? "#ffffff" : "#64748b",
              }}>
                Unread
              </Text>
              {unreadCount > 0 && (
                <View style={{
                  marginLeft: 6,
                  backgroundColor: activeTab === "unread" ? '#ffffff' : '#ef4444',
                  borderRadius: 10,
                  minWidth: isSmallScreen ? 18 : 20,
                  height: isSmallScreen ? 18 : 20,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: activeTab === "unread" ? '#2563eb' : '#ffffff',
                    fontSize: isSmallScreen ? 10 : 11,
                    fontWeight: '800',
                    includeFontPadding: false,
                  }}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Chat List Header */}
      <View style={{ 
        paddingHorizontal: isSmallScreen ? 16 : 20, 
        paddingBottom: isSmallScreen ? 6 : 8 
      }}>
        <Text style={{
          fontFamily: 'System',
          fontWeight: '500',
          fontSize: isSmallScreen ? 12 : 13,
          color: '#6b7280',
        }}>
          {activeTab === "all" ? "All Conversations" : "Unread Messages"} • {filteredChats.length}
        </Text>
      </View>

      {/* Chat List */}
      <View style={{ flex: 1 }}>
        {filteredChats.length === 0 ? (
          <Animated.View 
            style={{ 
              opacity: fadeAnim,
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: isSmallScreen ? 24 : 40,
            }}
          >
            <View style={{
              width: isSmallScreen ? 80 : 96,
              height: isSmallScreen ? 80 : 96,
              backgroundColor: '#eff6ff',
              borderRadius: isSmallScreen ? 20 : 24,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: isSmallScreen ? 16 : 24,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 2,
            }}>
              <Ionicons 
                name={activeTab === "unread" ? "checkmark-done" : "chatbubble-outline"} 
                size={isSmallScreen ? 32 : 40} 
                color="#2563eb" 
              />
            </View>
            <Text style={{
              fontFamily: 'System',
              fontWeight: '700',
              fontSize: isSmallScreen ? 20 : 24,
              color: '#1f2937',
              textAlign: 'center',
              marginBottom: isSmallScreen ? 6 : 8,
            }}>
              {activeTab === "unread" ? "No Unread Messages" : "No Conversations"}
            </Text>
            <Text style={{
              fontFamily: 'System',
              fontWeight: '400',
              fontSize: isSmallScreen ? 14 : 16,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: isSmallScreen ? 20 : 24,
            }}>
              {activeTab === "unread" 
                ? "You're all caught up! All messages have been read." 
                : "Start a new conversation by tapping the + button below."
              }
            </Text>
          </Animated.View>
        ) : (
          <FlatList
            data={filteredChats}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.friendId.toString()}
          />
        )}
      </View>

      {/* New Chat Floating Button */}
      <View style={{
        position: 'absolute',
        bottom: isSmallScreen ? 20 : 24,
        right: isSmallScreen ? 20 : 24,
      }}>
        <TouchableOpacity
          style={{
            width: isSmallScreen ? 56 : 64,
            height: isSmallScreen ? 56 : 64,
            backgroundColor: '#2563eb',
            borderRadius: isSmallScreen ? 18 : 20,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#2563eb',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 8,
          }}
          onPress={() => navigation.navigate("NewChatScreen")}
        >
          <Ionicons name="add" size={isSmallScreen ? 24 : 28} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}