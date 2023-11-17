import React from "react";
import { Stack } from "expo-router"; // Import useNavigation hook

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}}/>
      <Stack.Screen name="CarouselMain" options={{headerShown:false}}/>
      <Stack.Screen name="Page" options={{headerShown:false}} />
    </Stack>
  );
};
export default Layout;