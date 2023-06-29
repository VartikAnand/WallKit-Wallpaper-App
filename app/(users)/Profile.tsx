import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, useColorScheme, Image, TouchableOpacity } from 'react-native';
import { client, urlFor } from '../../sanity';
import Colors from '../../constants/Colors';

interface Notification {
  _id: string;
  title: string;
  image: string;
  read: boolean;
}

const NotificationList = () => {
  const colorScheme = useColorScheme();

  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Fetch notifications from Sanity API
    const fetchNotifications = async () => {
      try {
        const response = await client.fetch('*[_type == "notification"]');
        setNotifications(response);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const handleNotificationPress = async (notificationId: string) => {
    try {
      // Mark the notification as read in Sanity
      await client.patch(notificationId).set({ read: true });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const renderNotificationItem = (notification: Notification) => {
    const containerStyle = notification.read ? styles.readContainer : styles.unreadContainer;
    const titleStyle = notification.read ? styles.readTitle : styles.unreadTitle;
    const statusText = notification.read ? 'Old' : 'New';

    return (
      <TouchableOpacity
        key={notification._id}
        style={containerStyle}
        onPress={() => handleNotificationPress(notification._id)}
      >
        <View style={styles.imageContainer}>
          <Image source={{ uri: urlFor(notification.image).url() }} style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={titleStyle}>{notification.title}</Text>
          <Text style={styles.description}>{statusText}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ScrollView style={styles.contentContainer}>
        {notifications.map(renderNotificationItem)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  unreadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD9D9', // Light red for unread notifications
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  readContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0', // Light gray for read notifications
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  imageContainer: {
    marginRight: 12,
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  textContainer: {
    flex: 1,
  },
  unreadTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF4D4D', // Dark red for unread notifications
  },
  readTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666', // Dark gray for read notifications
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default NotificationList;
