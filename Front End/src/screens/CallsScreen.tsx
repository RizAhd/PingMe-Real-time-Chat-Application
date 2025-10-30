import { 
  SafeAreaView, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CallsScreen() {
  const callsData = [
    {
      id: '1',
      name: 'John Smith',
      time: 'Today, 10:30 AM',
      type: 'outgoing',
      duration: '5:24',
      isVideo: true,
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      time: 'Today, 9:15 AM',
      type: 'incoming',
      duration: '2:18',
      isVideo: false,
    },
    {
      id: '3',
      name: 'Mike Wilson',
      time: 'Yesterday, 8:45 PM',
      type: 'missed',
      isVideo: false,
    },
    {
      id: '4',
      name: 'Emily Davis',
      time: 'Yesterday, 6:20 PM',
      type: 'incoming',
      duration: '12:45',
      isVideo: true,
    },
  ];

  const getCallIcon = (call: any) => {
    if (call.type === 'missed') {
      return { name: 'call-missed', color: '#ef4444' };
    } else if (call.type === 'incoming') {
      return { name: 'call-received', color: '#10b981' };
    } else {
      return { name: 'call-made', color: '#2563eb' };
    }
  };

  const renderCallItem = ({ item }: { item: any }) => {
    const callIcon = getCallIcon(item);
    
    return (
      <TouchableOpacity style={styles.callItem}>
        <View style={styles.avatar}>
          <Ionicons 
            name={item.isVideo ? "videocam" : "person"} 
            size={24} 
            color="#64748b" 
          />
        </View>

        <View style={styles.callInfo}>
          <Text style={[
            styles.name,
            item.type === 'missed' && styles.missedName
          ]}>
            {item.name}
          </Text>
          <View style={styles.details}>
            <Ionicons 
              name={callIcon.name as any} 
              size={16} 
              color={callIcon.color} 
            />
            <Text style={styles.time}>{item.time}</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {item.duration && (
            <Text style={styles.duration}>{item.duration}</Text>
          )}
          <TouchableOpacity style={styles.callButton}>
            <Ionicons 
              name={item.isVideo ? "videocam" : "call"} 
              size={20} 
              color="#2563eb" 
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Calls</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="search" size={24} color="#2563eb" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Call List */}
      <FlatList
        data={callsData}
        renderItem={renderCallItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* New Call Button */}
      <View style={styles.floatingButtonContainer}>
        <TouchableOpacity style={styles.floatingButton}>
          <Ionicons name="add" size={24} color="white" />
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
  },
  headerButton: {
    padding: 8,
  },
  listContent: {
    padding: 16,
  },
  callItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
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
  callInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  missedName: {
    color: '#ef4444',
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  time: {
    fontSize: 14,
    color: '#64748b',
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  duration: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dbeafe',
  },
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 24,
    right: 24,
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