import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ChatsScreen from "./ChatsScreen";
import StatusScreen from "./StatusScreen";
import CallsScreen from "./CallsScreen";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const Tabs = createBottomTabNavigator();

// Temporary placeholder component for Community tab
function CommunityPlaceholder() {
  return (
    <View style={styles.placeholderContainer}>
      <View style={styles.iconContainer}>
        <Ionicons name="people" size={64} color="#2563eb" />
      </View>
      <Text style={styles.title}>Community</Text>
      <Text style={styles.subtitle}>
        Community features coming soon!
      </Text>
      <Text style={styles.description}>
        Connect with groups and communities on PingMe
      </Text>
    </View>
  );
}

export default function HomeTabs() {
  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          if (route.name === "Chats") {
            iconName = focused ? "chatbubble" : "chatbubble-outline";
          } else if (route.name === "Status") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Calls") {
            iconName = focused ? "call" : "call-outline";
          } else if (route.name === "Community") {
            iconName = focused ? "people" : "people-outline";
          } else {
            iconName = "chatbubble-outline";
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 8,
        },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: "#64748b",
        tabBarStyle: {
          height: 70,
          backgroundColor: "#ffffff",
          borderTopWidth: 1,
          borderTopColor: "#f1f5f9",
          paddingTop: 8,
          paddingBottom: 4,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
        },
        tabBarItemStyle: {
          paddingVertical: 6,
        },
      })}
    >
      <Tabs.Screen
        name="Chats"
        component={ChatsScreen}
        options={{ 
          headerShown: false,
          tabBarBadge: 3, // Example badge count
          tabBarBadgeStyle: {
            backgroundColor: '#ef4444',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: '700',
          }
        }}
      />
      <Tabs.Screen 
        name="Status" 
        component={StatusScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen 
        name="Calls" 
        component={CallsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen 
        name="Community" 
        component={CommunityPlaceholder}
        options={{
          headerShown: true,
          headerTitle: "Community",
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTitleStyle: {
            fontWeight: '700',
            color: '#1f2937',
            fontSize: 18,
          },
        }}
      />
    </Tabs.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2563eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 24,
  },
});