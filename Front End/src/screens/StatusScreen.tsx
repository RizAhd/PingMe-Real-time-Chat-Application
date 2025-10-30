import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function StatusScreen() {
  const statusData = [
    {
      id: '1',
      name: 'My Status',
      time: 'Tap to add status update',
      isMe: true,
      hasStatus: false,
    },
    {
      id: '2',
      name: 'John Smith',
      time: 'Just now',
      hasStatus: true,
    },
    {
      id: '3',
      name: 'Sarah Johnson',
      time: '30 minutes ago',
      hasStatus: true,
    },
    {
      id: '4',
      name: 'Mike Wilson',
      time: '1 hour ago',
      hasStatus: true,
    },
    {
      id: '5',
      name: 'Emily Davis',
      time: '2 hours ago',
      hasStatus: true,
    },
  ];

  const renderStatusItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity style={styles.statusItem}>
        <View style={[
          styles.avatar,
          item.hasStatus && styles.hasStatusAvatar
        ]}>
          <Ionicons 
            name={item.isMe ? "person" : "person-outline"} 
            size={24} 
            color="#64748b" 
          />
        </View>

        <View style={styles.statusInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        {item.isMe && (
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#2563eb" />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="camera" size={24} color="#2563eb" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#64748b" />
          </TouchableOpacity>
        </View>
      </View>

      {/* My Status */}
      <TouchableOpacity style={styles.myStatus}>
        <View style={[styles.avatar, styles.myStatusAvatar]}>
          <Ionicons name="person" size={28} color="#64748b" />
        </View>
        <View style={styles.myStatusInfo}>
          <Text style={styles.myStatusName}>My Status</Text>
          <Text style={styles.myStatusText}>Tap to add status update</Text>
        </View>
        <TouchableOpacity style={styles.addStatusButton}>
          <Ionicons name="add" size={20} color="#2563eb" />
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Recent Updates */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent updates</Text>
      </View>

      {/* Status List */}
      <FlatList
        data={statusData.filter(item => !item.isMe)}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="camera" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerButton: {
    padding: 8,
  },
  myStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  myStatusAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f1f5f9',
  },
  myStatusInfo: {
    flex: 1,
    marginLeft: 12,
  },
  myStatusName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  myStatusText: {
    fontSize: 14,
    color: '#64748b',
  },
  addStatusButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  listContent: {
    paddingBottom: 100,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  hasStatusAvatar: {
    borderWidth: 2,
    borderColor: '#10b981',
  },
  statusInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  time: {
    fontSize: 14,
    color: '#64748b',
  },
  addButton: {
    padding: 8,
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    gap: 12,
  },
  floatingButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});