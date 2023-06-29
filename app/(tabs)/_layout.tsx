import { Link, Tabs } from 'expo-router';
import { Pressable, useColorScheme } from 'react-native';
import { Entypo, FontAwesome, Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { COLORS } from '../../constants/theme';

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
   >
      <Tabs.Screen
        name="index"
        options={{
          tabBarStyle: {
            display: 'none'
          },
          title: '',
          headerTitleAlign: 'center', // Added to center the title
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name='two'
        options={{
          tabBarStyle: {
            display: 'none',        
          },
          headerStyle: {
            backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
          },
          title: 'WallKit',
          headerTitleAlign: 'center', // Added to center the title
          headerLeft: () => (
            <Link href="(users)/Profile" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Ionicons
                    name="md-notifications"
                    size={35}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginLeft: 12, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }) => (
                  <Entypo
                    name="heart-outlined"
                    size={35}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 12, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
    </Tabs>
  );
}
