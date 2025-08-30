import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import AuthLogin from "./authLogin";
import AuthDashboard from "./authDashboard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Navigation() {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);
	const [initialRoute, setInitialRoute] = useState(null);

	useEffect(() => {
		const checkUser = async () => {
		  try {
			const userData = await AsyncStorage.getItem("userData");
			console.log("userData", userData)
			if (userData) {
			  setUser(JSON.parse(userData));
			}
		  } catch (err) {
			console.error("Error loading user:", err);
		  } finally {
			setLoading(false);
		  }
		};
		checkUser();
	}, []);
	
	if (loading) return null;
	console.log("user", user)

    return (
		<SafeAreaProvider>
			<NavigationContainer>
                {user ? <AuthDashboard /> : <AuthLogin />}
			</NavigationContainer>
		</SafeAreaProvider>
	);
}
