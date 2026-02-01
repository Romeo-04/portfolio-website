'use client';
import {createContext, useEffect, useState } from 'react';
import client from '../../api/client';

export const AuthContext = createContext(null);

const AuthProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true);

    useEffect(() => {
        client.auth.getSession().then(({data:{session}}) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });

        const {data: authListener} = client.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => {authListener.subscription.unsubscribe()}; // when app gets unrendered stop listening
    }, []);

    return <AuthContext.Provider value={{user, loading}}>
        {children}
    </AuthContext.Provider> 
}

export default AuthProvider;
