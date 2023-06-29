import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, ViewStyle, TextStyle, ActivityIndicator, Image, ImageBackground, Pressable, useColorScheme } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { Link, Stack, useNavigation, useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';
import { getCategory, urlFor } from '../../sanity';
import Colors from '../../constants/Colors';

interface Category {
  _id: number;
  title: string;
  image: string;
}

const SearchBtn = () => {

  const router = useRouter();
  const navigation = useNavigation();
  const [activeWallpaperType, setActiveWallpaperType] = useState("Trending");
  const [categories, setCategories] = useState<Category[]>([]); // Specify the type of categories as Category[]
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Loading category list from backend
    getCategory()
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(err => alert(err));
  }, []);

  const tabStyle = (activeWallpaperType: string, item: any): ViewStyle => ({
    paddingVertical: SIZES.xxLarge / 2,
    paddingHorizontal: SIZES.xxLarge,
    borderRadius: SIZES.xxLarge,
    borderWidth: 2,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    borderColor: activeWallpaperType === item.name ? COLORS.secondary : COLORS.tertiary,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Add this line to set a dark transparent background color
  });

  const tabTextStyle = (activeWallpaperType: string, item: any): TextStyle => ({
    color: activeWallpaperType === item.name ? COLORS.secondary : COLORS.tertiary,
  });

  const renderCategoryTab = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={styles.tabWrapper}
      onPress={() => {
        setActiveWallpaperType(item.title);
        router.push(`/category/${item._id}`);
      }}
    >
      <ImageBackground
        source={{ uri: urlFor(item.image).url() }}
        style={[styles.tab, tabStyle(activeWallpaperType, item)]}
      >
        <Text style={[styles.tabText, tabTextStyle(activeWallpaperType, item)]}>
          {item.title.toUpperCase()}
        </Text>
      </ImageBackground>
    </TouchableOpacity>
  );
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>

<Stack.Screen
        options={{
          headerShown: true,
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          },
          headerLeft: () => (
            <Pressable onPress={() => {
              navigation.goBack();
            }}>
              {({ pressed }) => (
                <FontAwesome
                  name="arrow-left"
                  size={25}
                  color={Colors[colorScheme ?? 'light'].text}
                  style={{ marginLeft: 8, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
          headerTitle: 'Categories List',
      
        }}
      />
      {/* Scrollable flat list category */}
      <View style={styles.tabsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.tertiary} size="large" />
          </View>
        ) : (
          <FlatList
            data={categories}
            renderItem={renderCategoryTab}
            keyExtractor={(item) => item._id.toString()}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Align content in the middle of the screen
  },
  tabsContainer: {
    flex: 1,
    marginTop: SIZES.small,
  },
  tabWrapper: {
    marginLeft: 10,
    marginRight: 10,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 0,
    borderColor: COLORS.gray2,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tabText: {
    color: COLORS.tertiary,
    fontWeight: '800',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    textShadowColor: COLORS.primary,
    textShadowOffset: { width: 1, height: 4 },
    textShadowRadius: 2,
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBtn;
