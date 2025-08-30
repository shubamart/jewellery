import React from 'react'
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Splash from '../screens/splash/index';
import Register from '../screens/register/index';
import Login from '../screens/login/index';
import Welcome from '../screens/welcome/index';
import AddEmployee from '../screens/addEmployee/index';
import EmployeeScreen from '../screens/employeeList/index';
import CreatePartyMaster from '../screens/createPartyMaster/index';
import ViewPartyMaster from '../screens/viewPartyMaster/index';
import EditPartyMaster from '../screens/editPartyMaster/index';
import AddItem from '../screens/addItem/index';
import ViewItems from '../screens/viewItems/index';
import EditItem from '../screens/editItem/index';
import AddIssueVoucher from '../screens/addIssueVoucher/index';
import AddRecieveVoucher from '../screens/addRecieveVoucher/index';
import Statement from '../screens/statement/index';
import ProfileDetails from '../screens/profileDetails/index';
import NotFound from '../screens/notFound/index';

const AppStack = createNativeStackNavigator();

export const AuthDashboard = (props) => {
  return(
    <AppStack.Navigator 
      initialRouteName="Welcome"
      screenOptions={{
        animation: "none",
        headerShown: false,
      }}
    >
      {/* <AppStack.Screen name="Splash" component={Splash}/> */}
      <AppStack.Screen name="Welcome" component={Welcome}/>
      <AppStack.Screen name="AddEmployee" component={AddEmployee}/>
      <AppStack.Screen name="EmployeeList" component={EmployeeScreen}/>
      <AppStack.Screen name="CreatePartyMaster" component={CreatePartyMaster}/>
      <AppStack.Screen name="ViewPartyMaster" component={ViewPartyMaster}/>
      <AppStack.Screen name="EditPartyMaster" component={EditPartyMaster}/>
      <AppStack.Screen name="AddItem" component={AddItem}/>
      <AppStack.Screen name="ViewItems" component={ViewItems}/>
      <AppStack.Screen name="EditItem" component={EditItem}/>
      <AppStack.Screen name="AddIssueVoucher" component={AddIssueVoucher}/>
      <AppStack.Screen name="AddRecieveVoucher" component={AddRecieveVoucher}/>
      <AppStack.Screen name="Statement" component={Statement}/>
      <AppStack.Screen name="ProfileDetails" component={ProfileDetails}/>
      <AppStack.Screen name="NotFound" component={NotFound}/>
      
    </AppStack.Navigator>
  );
}
export default AuthDashboard

