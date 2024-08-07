'use client'

import Header from '@/components/header';
import HeaderMobile from '@/components/header-mobile';
import MarginWidthWrapper from '@/components/margin-width-wrapper';
import PageWrapper from '@/components/page-wrapper';
import SideNav from '@/components/side-nav';
import { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import Loading from './_components-dashboard/Loading';
import NoAccess from './_components-dashboard/NoAccess';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [fullUserData, setFullUserData] = useState(null);
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasAccess, setHasAccess] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const user = useUser();

    // aca se recoge los datos del usuario
    useEffect(() => {
        if (user && user.user) {
        setUserData({
            user_id: user.user.id,
            name: user.user.firstName,
            email: user.user.primaryEmailAddress?.emailAddress
        });
        setIsAuthenticated(true);
        } else {
        setIsAuthenticated(false);
        }
    }, [user.user]);

    useEffect(() => {
        if (userData) {
        const sendUserDataToLambda = async () => {
            try {
                const lambdaEndpoint = 'https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/token';
    
                const response = await fetch(lambdaEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
                });
    
                if (!response.ok) {
                console.error('Error al enviar la información del usuario a la API de Lambda');
                } else {
                const responseData = await response.json();
                setFullUserData(responseData);
                console.log("informacion del usuario si tiene algo de información", responseData);
                console.log("cuantas companias tiene lucianito?", responseData?.User?.Companies);
    
                if (responseData?.User?.Companies?.length > 0) {
                    setHasAccess(true);
                } else {
                    setHasAccess(false);
                }
    
                setLoading(false);
              }
            } catch (error) {
              console.error('Error al enviar la información del usuario a la API de Lambda', error);
            }
          };
    
          sendUserDataToLambda();
        }
      }, [userData]);
    
      if (loading) {
        return <Loading />;
      }
    
      if (!hasAccess) {
        return <NoAccess />;
      }
    return (
    <div className="flex">
        <SideNav />
        <main className="flex-1">
            <MarginWidthWrapper>
            <Header />
            <HeaderMobile />
            <PageWrapper>{children}</PageWrapper>
            </MarginWidthWrapper>
        </main>
    </div>
    );
}