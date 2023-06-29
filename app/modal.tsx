import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions,useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';
import { useRouter } from 'expo-router';

interface Bookmark {
  id: string;
  imageUrl: string;
  likes: number;
}

const ModalScreen = () => {
  const colorScheme = useColorScheme();

  const router = useRouter();

  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const bookmarksJSON = await AsyncStorage.getItem('bookmarks');
      const bookmarks = bookmarksJSON ? JSON.parse(bookmarksJSON) : [];

      setBookmarks(bookmarks);
    } catch (error) {
      console.log('Error fetching bookmarks: ', error);
    }
  };

  const handleDeleteBookmark = async (id: string) => {
    try {
      const updatedBookmarks = bookmarks.filter((bookmark: Bookmark) => bookmark.id !== id);
      await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      setBookmarks(updatedBookmarks);
    } catch (error) {
      console.log('Error deleting bookmark: ', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? 'black' : 'white' }]}>

      {bookmarks.length > 0 ? (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
       {bookmarks.reverse().map((bookmark, index) => (
  <TouchableOpacity
    key={index}

    onPress={() => {
      router.push(`/images/${bookmark.id}`);
    }}
    style={styles.bookmarkItem}
  >
    <Image source={{ uri: bookmark.imageUrl }} style={styles.bookmarkImage} />
    <TouchableOpacity

    
      onPress={() => handleDeleteBookmark(bookmark.id)}
      style={styles.deleteIconContainer}
    >
      <FontAwesome name="trash-o" size={30} color={COLORS.tertiary} />
    </TouchableOpacity>
  </TouchableOpacity>
))}

        </ScrollView>
      ) : (
        <Text style={styles.emptyText}>No bookmarks found</Text>
      )}
    </View>
  );
};

const { width } = Dimensions.get('window');
const itemWidth = (width - SIZES.large * 2) / 1;
const itemHeight = itemWidth * 1.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',


  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  scrollViewContainer: {
    alignItems: 'center',
    marginTop:20,
  },
  bookmarkItem: {
    position: 'relative',
    marginBottom: SIZES.large,
    marginHorizontal: SIZES.large, // Add margin between images
  },
  bookmarkImage: {
    width: itemWidth,
    height: itemHeight,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  deleteIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    transitionProperty: 'background-color',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease-in-out',
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.gray,
  },
});

export default ModalScreen;
