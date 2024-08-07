'use client'
import React, { use, useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useUser } from "@clerk/nextjs";
import { Skeleton } from '@/components/ui/skeleton';
import { set } from 'lodash';





const AlarmPage = () => {
  const [telegramID, setTelegramID] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [hasAlarma, setHasAlarma] = useState(false);

  const [telegramFromApi, setTelegramFromApi] = useState('');
  const [emailFromApi, setEmailFromApi] = useState('');

  const [loading, setLoading] = useState(true);

  const user = useUser();
  // user.user.id  de aca sale el id del usuario

  useEffect(() => {
    setLoading(true);
    if (user && user.user) {
      setUserId(user.user.id);
      fetchUserAlarm(user.user.id);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
    
  }, []);

  useEffect(() => {
    if (hasAlarma) {
      fetchUserAlarm(userId);
    }
  }, [hasAlarma]);


  const handleSave = async () => {
    setLoading(true);
    const requestBody = {
      "userID": userId,
      "email": email,
      "telegram": telegramID
    };
    console.log("requestBody", requestBody);
    // Call your API to save the data here
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/alarm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.error('Error al enviar la información del usuario a la API de Lambda');
      setHasAlarma(false);
      setLoading(false);
    } else {
      console.log("informacion del usuario si tiene algo de información", response);
      setHasAlarma(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      
    }
    
  };

  const handleDeleteAlarma = async () => {
    setLoading(true);
    const requestBody = {
      "userID": userId
    };
    console.log("requestBody", requestBody);
    // Call your API to save the data here
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/alarm', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    if (!response.ok) {
      console.error('Error al enviar la información del usuario a la API de Lambda');
      
    } else {
      console.log("informacion del usuario si tiene algo de información", response);
    }
    setHasAlarma(false);
    setEmail('')
    setTelegramID('')
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    
    
  };

  const fetchUserAlarm = async (userIdData: any) => {
    console.log("userIdData", userIdData);
    
    const response = await fetch(`https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/alarm?userID=${userIdData}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      console.error('Error al enviar la información del usuario a la API de Lambda');
      setHasAlarma(false);
    } else {
      const responseData = await response.json();
      console.log("informacion de alarma del usuario si tiene algo de información", responseData);
      setTelegramFromApi(responseData?.User.Telegram);
      setEmailFromApi(responseData?.User.Email);
      setHasAlarma(true);
      
    }
  };

  const isSaveDisabled = !telegramID && !email;

  return (
    <>
      <span className="font-bold text-xl text-gray-800 pt-4 md:pt-0">Alarma</span>

      {loading?
      <div className="w-full lg:w-full h-auto rounded-2xl px-6 py-8 flex justify-center items-center">
        <Skeleton className="h-[345px] w-[350px] rounded-xl" /> 
      </div>:<>
      
      { !hasAlarma ? (  
            <div className="w-full lg:w-full h-auto rounded-2xl px-6 py-8 flex justify-center items-center">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Crear alarma</CardTitle>
                  <CardDescription>
                    Configura la alarma que te enviaremos cuando se produzca un evento anómalo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="telegramID">Telegram ID</Label>
                        <Input
                          id="telegramID"
                          placeholder="Tu Telegram ID"
                          value={telegramID}
                          onChange={(e) => setTelegramID(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input
                          id="email"
                          placeholder="Tu correo electrónico"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="custom" onClick={handleSave} disabled={isSaveDisabled}>
                    Guardar
                  </Button>
                </CardFooter>
              </Card>
            </div>)
            :(
            <div className="w-full lg:w-full h-auto rounded-2xl px-6 py-8 flex justify-center items-center">
              <Card className="w-[350px]">
                <CardHeader>
                  <CardTitle>Alarma configurada</CardTitle>
                  <CardDescription>
                    Tu alarma ha sido configurada con éxito, te enviaremos un mensaje cuando se produzca un evento anómalo.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form>
                    <div className="grid w-full items-center gap-4">
                      <div className="flex flex-col space-y-1.5">
                        <Label >Telegram ID:   {telegramFromApi && telegramFromApi.length > 0 ? telegramFromApi : 'No se ha configurado'}</Label>
                        
                      </div>
                      <div className="flex flex-col space-y-1.5">
                        <Label >Correo electrónico:   {emailFromApi && emailFromApi.length > 0 ? emailFromApi : 'No se ha configurado'}</Label>
                        
                      </div>
                    </div>
                  </form>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button variant="custom" onClick={handleDeleteAlarma} >
                    Quitar alarma
                  </Button>
                </CardFooter>
              </Card>
            </div>
            )}
      
      </>
    }
      
      
    
      
    </>
  );
};

export default AlarmPage;