'use client';

import router from "next/dist/shared/lib/router/router";
import useAuth from "../hooks/useAuth";
import { useRouter } from "next/navigation";

export default function Home() {

  const { user, loading } = useAuth();

  if (!loading && user){ 
    router.push('/dashboard');
    return null;
  }
  return (
    
      <div> 
      { loading ? <h1> Loading . . . </h1> : <h1> log in form </h1>}
  </div>
  );
}
