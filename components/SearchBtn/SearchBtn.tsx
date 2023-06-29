import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ViewStyle, TextStyle, ActivityIndicator, useColorScheme, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { COLORS, SIZES } from '../../constants/theme';
import { getCategory, urlFor } from '../../sanity';
import Colors from '../../constants/Colors';

interface Category {
  _id: number;
  title: string;
  image: string;
}


const SearchBtn = ({ searchTerm, setSearchTerm, handleClick }) => {
  const colorScheme = useColorScheme();

  const router = useRouter();
  const [activeWallpaperType, setActiveWallpaperType] = useState('');
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
    marginLeft: 0,
    borderColor: activeWallpaperType === item.name ? COLORS.secondary : (colorScheme === 'dark' ? COLORS.tertiary : COLORS.primary),
    backgroundColor: colorScheme === 'dark' ? COLORS.primary : 'white',
  });

  const tabTextStyle = (activeWallpaperType: string, item: any): TextStyle => ({
    color: activeWallpaperType === item.name ? COLORS.secondary : COLORS.tertiary,
  });

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            placeholder='Search Select Apply  😀'
            placeholderTextColor={COLORS.primary}
            value={searchTerm}
            onChangeText={(text) => setSearchTerm(text)}
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleClick}>
          <Ionicons name="search-outline" size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Category list */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginTop: 10 }}>
        <Link href="/categoryScreen/categoryList" >

          <Text style={{
            color: Colors[colorScheme ?? 'light'].text,
            fontWeight: '400',
            fontSize: 18
          }}>Categories</Text>
        </Link>
        <Link href="/categoryScreen/categoryList">
          <Ionicons name="arrow-forward-sharp" size={24} color={Colors[colorScheme ?? 'light'].text} />
        </Link>

      </View>

      {/* Scrollable flat list category */}
      <View style={styles.tabsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={COLORS.tertiary} size="large" />
          </View>) : (
          <FlatList
            data={categories}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  setActiveWallpaperType(item.title);
                  router.push(`/category/${item._id}`);
                }}
              >
                <ImageBackground
                  source={{ uri: urlFor(item.image).url() }}
                  style={[styles.tab, , tabStyle(activeWallpaperType, item)]}
                >
                  <Text style={[styles.tabText, tabTextStyle(activeWallpaperType, item)]}>
                    {item.title.toUpperCase()}
                  </Text>
                </ImageBackground>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ columnGap: SIZES.small }}
            horizontal
          />
        )}
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  searchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: SIZES.large,
    height: 50,
    paddingHorizontal: 15,
  },
  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginRight: SIZES.small,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SIZES.medium,
    height: '100%',
  },
  searchInput: {
    width: '100%',
    height: '100%',
    paddingHorizontal: SIZES.medium,
  },
  searchBtn: {
    width: 50,
    height: '100%',
    backgroundColor: COLORS.tertiary,
    borderRadius: SIZES.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    width: '100%',
    marginTop: SIZES.small,
    marginLeft: 10,
    marginRight: 10,
  },
  tab: {
    paddingVertical: SIZES.small / 2,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.medium,
    borderWidth: 0,
    borderColor: COLORS.gray2,
    marginHorizontal: 0,
    marginBottom: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  tabText: {
    color: COLORS.tertiary,
    fontWeight: '800',
    shadowColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBtn;
