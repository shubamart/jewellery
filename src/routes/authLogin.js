import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from '../screens/splash/index';
import Register from '../screens/register/index';
import Login from '../screens/login/index';
import Welcome from '../screens/welcome';
import AddEmployee from '../screens/addEmployee';
import EmployeeList from '../screens/employeeList';
import CreatePartyMaster from '../screens/createPartyMaster/index';
import ViewPartyMaster from '../screens/viewPartyMaster/index';
import EditPartyMaster from '../screens/editPartyMaster/index';
import ProfileDetails from '../screens/profileDetails';
import NotFound from '../screens/notFound';

const AuthStack = createNativeStackNavigator();

export const AuthLogin = (props) => {
  return(
    <AuthStack.Navigator 
      initialRouteName="Splash"
      screenOptions={{
        animation: "none",
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Splash" component={Splash}/>
      <AuthStack.Screen name="Register" component={Register}/>
      <AuthStack.Screen name="Login" component={Login}/>
    </AuthStack.Navigator>
  );
}
export default AuthLogin

