import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useLayoutEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStack } from "../../App";
import { useNavigation } from "@react-navigation/native";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { User } from "../socket/chat";
import { useUserList } from "../socket/UseUserList";

type NewChatScreenProp = NativeStackNavigationProp<RootStack, "NewChatScreen">;

export default function NewChatScreen() {
  const navigation = useNavigation<NewChatScreenProp>();
  const [search, setSearch] = useState("");
  const users = useUserList();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerLeft: () => (
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#3b82f6" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>New Chat</Text>
            <Text style={styles.headerSubtitle}>
              {users.length} contacts
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.headerRightButton}>
          <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
        </TouchableOpacity>
      ),
      headerStyle: {
      
      },
    });
  }, [navigation, users]);

  const renderItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={styles.contactItem}
      onPress={() => {
        navigation.replace("SingleChatScreen", {
          chatId: item.id,
          friendName: `${item.firstName} ${item.lastName}`,
          lastSeenTime: item.updatedAt,
          profileImage: item.profileImage
            ? item.profileImage
            : `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=0ea5e9&color=ffffff&bold=true`,
        });
      }}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatarWrapper}>
          {item.profileImage ? (
            <Image
              source={{ uri: item.profileImage }}
              style={styles.avatarImage}
            />
          ) : (
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${item.firstName}+${item.lastName}&background=0ea5e9&color=ffffff&bold=true`,
              }}
              style={styles.avatarImage}
            />
          )}
        </View>
        {item.status === "ACTIVE" && (
          <View style={styles.onlineIndicator} />
        )}
      </View>
      
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.contactStatus}>
          {item.status === "ACTIVE" 
            ? "Online • Message now" 
            : "Hey there! I'm using ChatApp"
          }
        </Text>
      </View>
      
      <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
    </TouchableOpacity>
  );

  const filteredUsers = [...users]
    .filter((user) => {
      return (
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.contactNo.includes(search)
      );
    })
    .sort((a, b) => a.firstName.localeCompare(b.firstName));

  return (
    <SafeAreaView style={styles.container} edges={["right", "bottom", "left"]}>
      <StatusBar 
        barStyle="dark-content" 
        backgroundColor="#ffffff"
        translucent={false}
      />
      
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#64748b" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search contacts..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={(text) => setSearch(text)}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={20} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* New Contact Button */}
        <View style={styles.newContactContainer}>
          <TouchableOpacity
            style={styles.newContactButton}
            onPress={() => navigation.navigate("NewContactScreen" as never)}
          >
            <View style={styles.newContactIcon}>
              <Feather name="user-plus" size={24} color="white" />
            </View>
            <View style={styles.newContactTextContainer}>
              <Text style={styles.newContactTitle}>New Contact</Text>
              <Text style={styles.newContactSubtitle}>
                Add a new contact to start chatting
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        {/* Contacts List */}
        <View style={styles.listContainer}>
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            ListHeaderComponent={
              filteredUsers.length > 0 ? (
                <View style={styles.listHeader}>
                  <Text style={styles.listHeaderText}>
                    Contacts ({filteredUsers.length})
                  </Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <View style={styles.emptyIcon}>
                  <Ionicons name="people-outline" size={40} color="#3b82f6" />
                </View>
                <Text style={styles.emptyTitle}>
                  {search ? "No contacts found" : "No contacts available"}
                </Text>
                <Text style={styles.emptySubtitle}>
                  {search 
                    ? "Try searching with a different name or number" 
                    : "Add new contacts to start chatting"
                  }
                </Text>
              </View>
            }
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
  },
  // Header Styles
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    gap: 16,
  },
  backButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  headerTitleContainer: {
    flexDirection: 'column',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  headerRightButton: {
    marginRight: 16,
  },
  // Search Styles
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#1e293b',
    marginLeft: 12,
  },
  // New Contact Styles
  newContactContainer: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  newContactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  newContactIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  newContactTextContainer: {
    flex: 1,
  },
  newContactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  newContactSubtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  // List Styles
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  listHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  listHeaderText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Contact Item Styles
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  avatarContainer: {
    position: 'relative',
  },
  avatarWrapper: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  avatarImage: {
    width: 52,
    height: 52,
    borderRadius: 14,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    backgroundColor: '#22c55e',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 2,
  },
  contactStatus: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
  },
  // Empty State Styles
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    marginTop: 80,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    backgroundColor: '#dbeafe',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});