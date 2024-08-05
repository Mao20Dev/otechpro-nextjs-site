'use client';

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import backgroundImage from "@/assets/mainbackground.jpg";
import CompanyCards from "./_components-dashboard/CompanyCards";
import {  useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton"


export default function  Home() {
  const [userData, setUserData] = useState<any>(null);
  const [fullUserData, setFullUserData] = useState<any>(null);
  const [hasCompanies, setHasCompanies] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
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

  // aca se envía el dato del usuario al backend
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
            console.log(responseData);
            setLoading(false);
          }
        } catch (error) {
          console.error('Error al enviar la información del usuario a la API de Lambda', error);
        }
      };

      sendUserDataToLambda();
    }
  }, [userData]);

  console.log(fullUserData?.User.Companies);


  return (
    <>
      <div className="font-bold text-xl text-gray-800 pt-4 md:pt-0 mb-8">Principal</div>
      
      <div className=" w-full h-auto rounded-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8  ">
        {loading ? (
          <>
            <Skeleton className="h-[285px] w-full rounded-xl" />
            <Skeleton className="h-[285px] w-full rounded-xl" />
            <Skeleton className="h-[285px] w-full rounded-xl" />
          </>
        ) : (
          <>
            <CompanyCards company={fullUserData?.User.Companies} />
          </>
          
        )}
          
      </div>
    </>
  );
}