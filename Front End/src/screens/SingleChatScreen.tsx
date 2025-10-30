import {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useLayoutEffect, useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useSingleChat } from "../socket/UseSingleChat";
import { Chat } from "../socket/chat";
import { formatChatTime } from "../util/DateFormatter";
import { useSendChat } from "../socket/UseSendChat";

type SingleChatScreenProps = NativeStackScreenProps<
  RootStack,
  "SingleChatScreen"
>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const isSmallScreen = SCREEN_WIDTH < 375;

export default function SingleChatScreen({
  route,
  navigation,
}: SingleChatScreenProps) {
  const { chatId, friendName, lastSeenTime, profileImage } = route.params;
  const singleChat = useSingleChat(chatId);
  const messages = singleChat.messages;
  const friend = singleChat.friend;
  const sendMessage = useSendChat();
  const [input, setInput] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const inputAnim = useRef(new Animated.Value(0)).current;
  const messageScaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      (e) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
        Animated.timing(inputAnim, {
          toValue: 1,
          duration: Platform.OS === 'ios' ? 250 : 100,
          useNativeDriver: false,
        }).start();
        
        // Scroll to bottom when keyboard opens
        setTimeout(() => {
          flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
        }, Platform.OS === 'ios' ? 300 : 150);
      }
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setIsKeyboardVisible(false);
        Animated.timing(inputAnim, {
          toValue: 0,
          duration: Platform.OS === 'ios' ? 250 : 100,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  useEffect(() => {
    // Animate new messages
    Animated.spring(messageScaleAnim, {
      toValue: 1,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [messages.length]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerTitle: () => (
        <View style={styles.headerCenter}>
          <View style={styles.headerMainInfo}>
            <Text style={styles.friendName} numberOfLines={1}>
              {friend ? `${friend.firstName} ${friend.lastName}` : friendName}
            </Text>
            <View style={styles.statusRow}>
              {friend?.status === "ONLINE" ? (
                <View style={styles.onlineStatus}>
                  <View style={styles.onlinePulse} />
                  <Text style={styles.onlineText}>Online</Text>
                </View>
              ) : (
                <View style={styles.offlineStatus}>
                  <Ionicons name="time-outline" size={12} color="#64748b" />
                  <Text style={styles.lastSeenText}>
                    Last seen {formatChatTime(friend?.updatedAt ?? lastSeenTime)}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerActionButton}>
            <Ionicons name="videocam" size={22} color="#3b82f6" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionButton}>
            <Ionicons name="call" size={20} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      ),
      headerStyle: {
  
      },
    });
  }, [navigation, friend, lastSeenTime]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "READ":
        return { name: "checkmark-done", color: "#3b82f6" };
      case "DELIVERED":
        return { name: "checkmark-done", color: "#94a3b8" };
      case "SENT":
        return { name: "checkmark", color: "#94a3b8" };
      default:
        return { name: "time-outline", color: "#94a3b8" };
    }
  };

  const renderItem = ({ item, index }: { item: Chat; index: number }) => {
    const isMe = item.from.id !== chatId;
    const showTimeSeparator = index === 0 || 
      new Date(item.createdAt).getDate() !== new Date(messages[index - 1]?.createdAt).getDate();
    
    const statusIcon = getStatusIcon(item.status);

    return (
      <Animated.View style={{ transform: [{ scale: messageScaleAnim }] }}>
        {showTimeSeparator && (
          <View style={styles.timeSeparator}>
            <Text style={styles.timeSeparatorText}>
              {new Date(item.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        )}
        <View style={[
          styles.messageContainer,
          isMe ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}>
          <View style={styles.messageContent}>
            {!isMe && (
              <Image
                source={{ uri: profileImage }}
                style={styles.senderAvatar}
              />
            )}
            <View style={[
              styles.messageBubble,
              isMe ? styles.myMessageBubble : styles.theirMessageBubble
            ]}>
              {!isMe && (
                <Text style={styles.senderName}>
                  {item.from.firstName}
                </Text>
              )}
              <Text style={[
                styles.messageText,
                isMe ? styles.myMessageText : styles.theirMessageText,
              ]}>
                {item.message}
              </Text>
              <View style={styles.messageFooter}>
                <Text style={[
                  styles.messageTime,
                  isMe ? styles.myMessageTime : styles.theirMessageTime,
                ]}>
                  {formatChatTime(item.createdAt)}
                </Text>
                {isMe && (
                  <View style={styles.statusContainer}>
                    <Ionicons
                      name={statusIcon.name as any}
                      size={14}
                      color={statusIcon.color}
                      style={styles.statusIcon}
                    />
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
    );
  };

  const handleSendChat = () => {
    if (!input.trim()) return;
    sendMessage(chatId, input);
    setInput("");
    // Scroll to bottom after sending message
    setTimeout(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, 100);
  };

  const inputContainerAnimatedStyle = {
    transform: [{
      translateY: inputAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -keyboardHeight + (Platform.OS === 'ios' ? 0 : 0)],
      }),
    }],
  };

  const messagesContentAnimatedStyle = {
    paddingBottom: inputAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [16, keyboardHeight + 80],
    }),
  };

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      <View style={styles.messagesContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          style={styles.messagesList}
          inverted
          keyExtractor={(item, index) => `${item.id}_${index}_${item.status}`}
          contentContainerStyle={[
            styles.messagesContent,
            isKeyboardVisible && styles.messagesContentWithKeyboard,
          ]}
          showsVerticalScrollIndicator={false}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            if (messages.length > 0) {
              flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
            }
          }}
        />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <Animated.View style={[
          styles.inputContainer, 
          inputContainerAnimatedStyle,
        ]}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="add" size={24} color="#64748b" />
            </TouchableOpacity>
            
            <TextInput
              value={input}
              onChangeText={setInput}
              multiline
              placeholder="Type a message..."
              placeholderTextColor="#94a3b8"
              style={styles.textInput}
              onFocus={() => {
                setTimeout(() => {
                  flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
                }, 100);
              }}
            />
            
            <TouchableOpacity style={styles.emojiButton}>
              <Ionicons name="happy" size={22} color="#64748b" />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.sendButton,
                input.trim() && styles.sendButtonActive,
              ]}
              onPress={handleSendChat}
              disabled={!input.trim()}
            >
              <Ionicons 
                name="send" 
                size={18} 
                color={input.trim() ? "white" : "#94a3b8"} 
              />
            </TouchableOpacity>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  messagesContainer: {
    flex: 1,
  },
  
  // Header Styles
  headerCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  headerMainInfo: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  friendName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0f172a',
    textAlign: 'center',
    marginBottom: 4,
    letterSpacing: -0.2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f0f9ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  onlinePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  onlineText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#059669',
  },
  offlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  lastSeenText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#475569',
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginRight: 12,
  },
  headerActionButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
  },

  // Messages
  messagesList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  messagesContent: {
    paddingBottom: 16,
    paddingTop: 8,
  },
  messagesContentWithKeyboard: {
    paddingBottom: 120,
  },
  timeSeparator: {
    alignItems: 'center',
    marginVertical: 20,
  },
  timeSeparatorText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  messageContainer: {
    marginVertical: 4,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  theirMessageContainer: {
    alignItems: 'flex-start',
  },
  messageContent: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    maxWidth: '85%',
  },
  senderAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  messageBubble: {
    maxWidth: '100%',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myMessageBubble: {
    backgroundColor: '#2563eb',
    marginLeft: 'auto',
  },
  theirMessageBubble: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  senderName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '400',
  },
  myMessageText: {
    color: '#ffffff',
  },
  theirMessageText: {
    color: '#1e293b',
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  messageTime: {
    fontSize: 11,
    fontWeight: '500',
  },
  myMessageTime: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirMessageTime: {
    color: '#64748b',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIcon: {
    marginLeft: 2,
  },

  // Input Area
  inputContainer: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachmentButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  emojiButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  textInput: {
    flex: 1,
    minHeight: 42,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 21,
    fontSize: 16,
    color: '#0f172a',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    fontWeight: '400',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  sendButtonActive: {
    backgroundColor: '#2563eb',
    borderColor: '#2563eb',
  },
});