import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardTitle,
} from "../ui/card";

import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { toast } from "sonner";
import client from "../../api/client";

const Signup = () => {
  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    console.log(email, password);

    if (!email || !password){
      toast.error("Please fill in Email and Password");
      return;
    }

    const { data, error } = await client.auth.signUp({
      email,
      password,
    });

    console.log(data, error);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Signed up successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Create an account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input id="email" type="email" placeholder="jhezraang@gmail.com"></Input>
            </div>
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input id="password" type="password" placeholder="Enter your password"></Input>
            </div>
            <Button type="submit" className="w-full">Sign Up</Button>
          </div>
        </form>
      </CardContent>
    </Card>

  );
};

export default Signup;