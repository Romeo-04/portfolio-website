import React from 'react'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '../ui/tabs';
import Login from './Login';
import Signup from './Signup';


const auth = () => {
  return <Tabs defaultValue="login" className="w-[400px] mt-[100px]">
    <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="signup">Signup</TabsTrigger>
    </TabsList>
    <TabsContent value="login">
        <Login />
    </TabsContent>
    <TabsContent value="signup">
        <Signup />
    </TabsContent>
  </Tabs>
}

export default auth;