import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  Pressable,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Stack, useSearchParams } from 'expo-router';
import { COLORS } from '../../constants/theme';
import { Entypo, Ionicons } from '@expo/vector-icons';
import { getMainImgeById, urlFor } from '../../sanity';
import moment from "moment";
import * as FileSystem from "expo-file-system";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

type ItemData = {
  _id: string;
  mainImage: string;
  title: string;
  description: string;
};
interface Bookmark {
  imageUrl: string;
  likes: number;
  id: string | undefined;
  index: string | number[];
  
}

const ImageView = () => {
  const param = useSearchParams();
  const id = param.id?.toString();
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const [getMainImage, setGetMainImage] = useState<ItemData[]>([]);
  const [isLiked, setIsLiked] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    if (id) {
      getMainImgeById(id)
        .then((data) => {
          setGetMainImage(data);
          setIsLoading(false);
        })
        .catch((err) => alert(err));
    }
  }, []);

  useEffect(() => {
    checkIfBookmarked();
  }, []);

  const checkIfBookmarked = async () => {
    const bookmarksJSON = await AsyncStorage.getItem('bookmarks');
    const bookmarks = bookmarksJSON ? JSON.parse(bookmarksJSON) : [];
    const isBookmarked = bookmarks.some((bookmark: { imageUrl: string }) => bookmark.imageUrl === imageUrl);
    setIsBookmarked(isBookmarked);
  };

  const handlePress = () => {
    navigation.goBack();
  };

// BOOKMARK 
const handlePressBookmark = async () => {
  if (isBookmarked) {
    // Remove the bookmark
    setIsBookmarked(false);
    setImageUrl('');

    // Remove the bookmark from local storage
    const bookmarksJSON = await AsyncStorage.getItem('bookmarks');
    const bookmarks = bookmarksJSON ? JSON.parse(bookmarksJSON) : [];
    const updatedBookmarks = bookmarks.filter((bookmark: Bookmark) => bookmark.imageUrl !== imageUrl);
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

    ToastAndroid.show('Removed from bookmarks', ToastAndroid.SHORT);
  } else {
    // Add the bookmark
    setIsBookmarked(true);
    setImageUrl(urlFor(getMainImage[0].mainImage).url());

    // Save the bookmark to local storage
    const bookmarksJSON = await AsyncStorage.getItem('bookmarks');
    const bookmarks = bookmarksJSON ? JSON.parse(bookmarksJSON) : [];
    const id = param.id?.toString(); // Assuming the 'id' is obtained from 'param'
    const newBookmark: Bookmark = {
      id: id ,
      index: uuid.v4(),
      imageUrl: urlFor(getMainImage[0].mainImage).url(),
      likes: 1,
    };
    const updatedBookmarks = [...bookmarks, newBookmark];
    await AsyncStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

    ToastAndroid.show('Bookmark added', ToastAndroid.SHORT);
  }
};


  const handleDownload = async () => {
    let date = moment().format('YYYYMMDDhhmmss');
    let fileUri = FileSystem.documentDirectory + `${date}.jpg`;
    try {
      const res = await FileSystem.downloadAsync(urlFor(getMainImage[0].mainImage).url(), fileUri);
      saveFile(res.uri);
    } catch (err) {
      console.log("FS Err: ", err);
      ToastAndroid.show('Failed to download image', ToastAndroid.SHORT);
    }
  };

  const saveFile = async (fileUri: string) => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === 'granted') {
      try {
        const asset = await MediaLibrary.createAssetAsync(fileUri);
        const album = await MediaLibrary.getAlbumAsync('Download');
        if (album == null) {
          await MediaLibrary.createAlbumAsync('Download', asset, false);
          ToastAndroid.show('Image downloading...', ToastAndroid.SHORT);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
          ToastAndroid.show('Image saved', ToastAndroid.SHORT);
        }
      } catch (err) {
        console.log('Save err: ', err);
        ToastAndroid.show('Failed to save image', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Please allow permissions to download', ToastAndroid.SHORT);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primary }}>
      <Stack.Screen
        options={{
          headerShown: false,
          headerShadowVisible: false,
          headerBackVisible: false,
          headerTitle: '',
        }}
      />
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={COLORS.tertiary} size="large" />
        </View>
      ) : getMainImage.length > 0 ? (
        <View style={styles.container}>
          <View style={StyleSheet.absoluteFill}>
            <Image
              source={{ uri: urlFor(getMainImage[0].mainImage).url() }}
              style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
            />
          </View>
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'flex-start',
              marginTop: 45,
              paddingHorizontal: 18,
              borderColor: COLORS.tertiary,
            }}
          >
            <Pressable onPress={handlePress}>
              <View
                style={{
                  backgroundColor: COLORS.primary,
                  height: 45,
                  width: 45,
                  borderRadius: 10,
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: COLORS.secondary,
                  shadowOpacity: 0.8,
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <Ionicons name="arrow-back" size={35} color={COLORS.tertiary} />
              </View>
            </Pressable>
            <View>
              <View style={{ marginBottom: 10 }}>
                <Pressable onPress={handlePressBookmark} disabled={isBookmarked}>
                  <View
                    style={{
                      height: 45,
                      width: 45,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: COLORS.tertiary,
                      shadowOpacity: 0.8,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 4,
                      elevation: 5,
                      backgroundColor: isBookmarked ? 'red' : COLORS.primary,
                    }}
                  >
                    <Entypo name="heart-outlined" size={35} color={COLORS.tertiary} />
                  </View>
                </Pressable>
              </View>
              <View style={{ marginBottom: 10 }}>
                <Pressable onPress={handleDownload}>
                  <View
                    style={{
                      backgroundColor: COLORS.primary,
                      height: 45,
                      width: 45,
                      borderRadius: 10,
                      justifyContent: 'center',
                      alignItems: 'center',
                      shadowColor: COLORS.tertiary,
                      shadowOpacity: 0.8,
                      shadowOffset: { width: 0, height: 2 },
                      shadowRadius: 4,
                      elevation: 5,
                    }}
                  >
                    <Ionicons name="ios-cloud-download-outline" size={35} color={COLORS.tertiary} />
                  </View>
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleStyle}>{getMainImage[0].title.toUpperCase()}</Text>
            <Text style={{ color: COLORS.secondary }}>{getMainImage[0].description.toLowerCase()}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.loadingContainer}>No Item Found ..</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    shadowColor: COLORS.secondary,
    height: 70,
    width: '65%',
    borderTopEndRadius: 20,
    borderBottomEndRadius: 20,
    marginBottom: '30%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleStyle: {
    color: COLORS.tertiary,
    fontWeight: '600',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});

export default ImageView;

