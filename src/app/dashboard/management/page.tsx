'use client'
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input';
import { Icon } from '@iconify/react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { CldImage } from 'next-cloudinary';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';




const ManagementPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredCompanies, setFilteredCompanies] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedCompany2, setSelectedCompany2] = useState<any>(null);
  const [selectedCompanyDevices, setSelectedCompanyDevices] = useState<any[]>([]);
  const [showDevices, setShowDevices] = useState(false);
  const [originalCompany, setOriginalCompany] = useState<any>(null); // Estado para los valores originales
  const [imageUrl, setImageUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [isDialogOpen3, setIsDialogOpen3] = useState(false);
  const [newCompanyName, setNewCompanyName] = useState('');
  const [newPlantName, setNewPlantName] = useState('');
  const [newDeviceName, setNewDeviceName] = useState('');
  const [newDeviceMAC, setNewDeviceMAC] = useState('');
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [newCompanyImageURL, setNewCompanyImageURL] = useState('');
  const [newDeviceImageURL, setNewDeviceImageURL] = useState('');
  
  const [newDeviceNamePlant, setNewDeviceNamePlant] = useState('');
  const [newDeviceMACPlant, setNewDeviceMACPlant] = useState(''); 
  const [newDeviceImageURLPLANT, setNewDeviceImageURLPLANT] = useState('');

  const [newPlantName2, setNewPlantName2] = useState('');
  const [newDeviceName2, setNewDeviceName2] = useState('');
  const [newDeviceMAC2, setNewDeviceMAC2] = useState('');
  const [newDeviceImageURL2, setNewDeviceImageURL2] = useState('');

  

  const handleDelete = async () => {
    if (selectedItems.length === 1) {
      const companyID = selectedItems[0];
      const company = companies.find((company) => company.CompanyID === companyID);
      
      if (company) {
        await fetch(`https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/company`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            companyName: company.CompanyName
          })
        });
  
        // Refrescar los datos después de eliminar la empresa
        fetchCompanies();
        setSelectedItems([]);
        setIsDialogOpen2(false);
      }
    }
  };
  
  

  const fetchCompanies = async () => {
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/companys');
    const data = await response.json();
    console.log("Companies in management page", data);
    setCompanies(data);
    setFilteredCompanies(data);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredCompanies(companies);
    } else {
      const newCompanies = companies.filter((company: any) => {
        return company.CompanyName.toLowerCase().includes(term.toLowerCase());
      });
      setFilteredCompanies(newCompanies);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id) ? [] : [id]
    );
  };

  const uploadImage = async (file: any) => {
    const url = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');

    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.secure_url;
  };

  const handleImageUpload = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
        const url = await uploadImage(file);
        console.log(url);
        setImageUrl(url);
    }
};

const handleImageCompanyUpload = async (event: any) => {
  const file = event.target.files[0];
  if (file) {
      const url = await uploadImage(file);
      console.log(url);
      setNewCompanyImageURL(url);
  }
};

const handleImageDeviceUpload = async (event: any) => {  
  const file = event.target.files[0];
  if (file) {
      const url = await uploadImage(file);
      console.log(url);
      setNewDeviceImageURL(url);
  }
};

const handleImageDeviceUploadPlant = async (event: any) => {  
  const file = event.target.files[0];
  if (file) {
      const url = await uploadImage(file);
      console.log(url);
      setNewDeviceImageURLPLANT(url);
  }
};

const handleImageDeviceUploadPlant2 = async (event: any) => {  
  const file = event.target.files[0];
  if (file) {
      const url = await uploadImage(file);
      console.log(url);
      setNewDeviceImageURL2(url);
  }
};

const handleDeviceImageUpload = async (event: any, deviceID: string) => {
  const file = event.target.files[0];
  if (file) {
    const url = await uploadImage(file); // Reutiliza tu función uploadImage
    const newDevices = selectedCompanyDevices.map((d: any) =>
      d.DeviceID === deviceID ? { ...d, image: url } : d
    );
    setSelectedCompanyDevices(newDevices);
  }
};

const handleEditClick = () => {
  setImageUrl('');
  if (selectedItems.length === 1) {
    const company = companies.find((company: any) => company.CompanyID === selectedItems[0]);
    setSelectedCompany(company);
    setOriginalCompany(JSON.parse(JSON.stringify(company))); // Clonar los valores originales
    setSelectedCompanyDevices(company.Plants.flatMap((plant: any) => plant.Devices));
    setShowDevices(false);
    setImageUrl(company.image);
    setIsDialogOpen(true); // Abrir el diálogo
  }
};
  

  const handleSaveChanges = async () => {
    // Comparar los valores originales con los actuales y realizar las llamadas a la API según sea necesario
    if (!originalCompany || !selectedCompany) return;

    const changes = [];
    const changesIntegratedDevices: any = [];

    const imagesChanges: any = [];
    
    if (originalCompany.CompanyName !== selectedCompany.CompanyName) {
      changes.push({
        type: 'companyName',
        OldName: originalCompany.CompanyName,
        NewName: selectedCompany.CompanyName
      });
    }

    if (originalCompany.image !== imageUrl) {
      imagesChanges.push({
        id: selectedCompany.CompanyID,
        type: 'company',
        newImageURL: imageUrl
      });
    }

    selectedCompany.Plants.forEach((plant: any, index: number) => {
      const originalPlant = originalCompany.Plants[index];
      if (originalPlant.PlantName !== plant.PlantName) {
        changes.push({
          type: 'plantName',
          OldName: originalPlant.PlantName,
          NewName: plant.PlantName
        });
      }
    });

    selectedCompanyDevices.forEach((device: any) => {
      const originalDevice = originalCompany.Plants.flatMap((plant: any) => plant.Devices).find((d: any) => d.DeviceID === device.DeviceID);
  
      if (!originalDevice) return;
  
      if (originalDevice.DeviceName !== device.DeviceName) {
        
        if (originalDevice.MAC && originalDevice.MAC !== 'N/A') {
          changes.push({
            type: 'deviceName',
            OldName: originalDevice.DeviceName,
            NewName: device.DeviceName
          });
        } else if (originalDevice.DataTable && originalDevice.MAC === 'N/A') {
          console.log("entro aqui", originalDevice);
          changesIntegratedDevices.push({
            deviceID: originalDevice.DeviceID,
            newDeviceName: device.DeviceName
          });
        }
      }
      
      if (originalDevice.image && originalDevice.image !== device.image) {
        imagesChanges.push({
          id: device.DeviceID,
          type: 'device',
          newImageURL: device.image
        });
      }
    });

    

    // Realizar las llamadas a la API PATCH
    for (const change of changes) {
      await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/company', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(change)
      });
    }

    for (const change of changesIntegratedDevices) {
      await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/devices/name', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(change)
      });
    }

    for (const change of imagesChanges) {
      await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/image', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(change)
      });
    }

    // Refrescar los datos después de guardar los cambios
    fetchCompanies();

    setIsDialogOpen(false);
  };

  // console.log("Empresa seleccionada", selectedItems);


  const handleSaveDevice = async () => {
    const requestBody: { [key: string]: any } = {
      companyName: selectedCompany2 === 'new' ? newCompanyName : selectedCompany2.CompanyName,
      plantName: selectedCompany2 === 'new' ? newPlantName : selectedPlant.PlantName,
    };
  
    // Conditionally add properties if they have values
    if (newDeviceName.length > 0) {
      requestBody.deviceName = newDeviceName;
    }
    if (newDeviceMAC.length > 0) {
      requestBody.MAC = newDeviceMAC;
    }
    if (newCompanyImageURL && newCompanyImageURL.length > 0) {
      requestBody.companyImageURL = newCompanyImageURL;
    }
    if (newDeviceImageURL && newDeviceImageURL.length > 0) {
      requestBody.deviceImageURL = newDeviceImageURL;
    }

    // Conditionally add properties if they have values
    if (newDeviceNamePlant.length > 0) {
      requestBody.deviceName = newDeviceNamePlant;
    }
    if (newDeviceMACPlant.length > 0) {
      requestBody.MAC = newDeviceMACPlant;
    }
    if (newDeviceImageURLPLANT && newDeviceImageURLPLANT.length > 0) {
      requestBody.deviceImageURL = newDeviceImageURLPLANT;
    }

    // Conditionally add properties if they have values
    if (newPlantName2.length > 0) {
      requestBody.plantName = newPlantName2;
    }
    if (newDeviceName2.length > 0) {
      requestBody.deviceName = newDeviceName2;
    }
    if (newDeviceMAC2.length > 0) {
      requestBody.MAC = newDeviceMAC2;
    }
    if (newDeviceImageURL2 && newDeviceImageURL2.length > 0) {
      requestBody.deviceImageURL = newDeviceImageURL2;
    }
  
    console.log("requestBody", requestBody);
  
    // Call API to save device
    await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/company', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });
  
    // Close dialog and refresh data
    setIsDialogOpen3(false);
    fetchCompanies();
  };

  useEffect(() => {
    fetchCompanies();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const tableElements = filteredCompanies.map((company: any) => {
    const plantsElements = company.Plants.map((plant: any) => (
      <span key={plant.PlantID}>
        {plant.PlantName}<br />
      </span>
    ));

    const devicesElements = company.Plants.map((plant: any) => {
      const devices = plant.Devices.map((device: any) => (
        <DropdownMenuItem key={device.DeviceID}>
          {device.DeviceName}
        </DropdownMenuItem>
      ));
      return (
        <React.Fragment key={plant.PlantID}>
          {devices}
        </React.Fragment>
      );
    });

    return (
      <TableRow key={company.CompanyID} className='h-12'>
        <TableCell className="py-2 px-4 border-b text-center">
          <Checkbox checked={selectedItems.includes(company.CompanyID)} onCheckedChange={() => handleCheckboxChange(company.CompanyID)} />
        </TableCell>
        <TableCell className="py-2 px-4 border-b border-gray-300">{company.CompanyName}</TableCell>
        <TableCell className="py-2 px-4 border-b border-gray-300">{plantsElements}</TableCell>
        <TableCell className="py-2 px-4 border-b border-gray-300">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="custom">Ver</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                {devicesElements}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    );
  });

  const handleAddDevice = async () => {
    setNewDeviceName2('');
    setNewDeviceMAC2('');
    setNewDeviceImageURL2('');
    setNewPlantName2('');


    setSelectedCompany2(null);
    setSelectedPlant(null);
    setNewDeviceNamePlant('');
    setNewDeviceMACPlant('');
    setNewDeviceImageURLPLANT('');
  
    setSelectedCompany2(null);
    setNewCompanyName('');
    setNewPlantName('');
    setNewDeviceName('');
    setNewDeviceMAC('');
    setImageUrl('');
  }

  console.log("selectedCompany", selectedCompany);
  console.log("selectedCompany2", selectedCompany2);

  console.log("selectedPlant", selectedPlant);

  console.log("newcompany", newCompanyName);
  console.log("newplant", newPlantName);
    console.log("newdevice", newDeviceName);
    console.log("newdevicemac", newDeviceMAC);

  return (
    <>
      <span className="font-bold text-xl text-gray-800 pt-4 md:pt-0">Empresas</span>

      {loading ?
      <>
      <div className="w-full h-auto rounded-2xl pt-4 px-4">
        <div className='grid grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-7 p-0 pt-4 sm:p-4 lg:p-12 lg:pt-4'>
        <Skeleton className="h-[35px] w-full col-span-6 xl:col-span-3" />
        <Skeleton className="h-[35px] col-span-2 xl:col-span-1 w-full" />
        <Skeleton className="h-[35px] col-span-2 xl:col-span-1 w-full" />
        <Skeleton className="h-[35px] col-span-2 xl:col-span-1 w-full" />
        </div>
      </div>
      <div className="w-full h-auto rounded-2xl px-16">
      <Skeleton className="h-[550px] w-full " />
      </div>
      </> :<>
      
      <div className="w-full h-auto rounded-2xl p-4">


        <div className='grid grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-7 p-0 pt-4 sm:p-4 lg:p-12 lg:pt-4'>
          <Input placeholder='Buscar por nombre de empresa' 
          className='w-full col-span-6 xl:col-span-3' value={searchTerm} onChange={handleSearchChange} />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
              variant={selectedItems.length === 1 ? "custom" : "customUnable"}  
              className='col-span-2 xl:col-span-1' 
              onClick={handleEditClick}
              disabled={selectedItems.length !== 1}
            >
              <Icon icon="lucide:edit" width="22" height="22" className="text-zinc-200 mr-2 "/> 
              Editar
            </Button> 
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Editar empresa</DialogTitle>
                <DialogDescription>
                  Haz cambios a tu empresa aqui. Haz click en guardar cuando estes listo.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                  <CldImage
                          alt='Uploaded Image'
                          src={imageUrl}
                          width="80"
                          height="80"
                          crop={{
                              type: 'auto',
                              source: true
                          }}
                      />
                
                <Input className='w-full col-span-3' id="picture" type="file" onChange={handleImageUpload} />
                    
              </div>
              </div>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="companyName" className="text-right">
                    Empresa
                  </Label>
                  <Input
                    id="companyName"
                    value={selectedCompany?.CompanyName || ''}
                    className="col-span-3"
                    onChange={(e) => setSelectedCompany({ ...selectedCompany, CompanyName: e.target.value })}
                  />
                </div>
                
                {selectedCompany?.Plants.map((plant: any, index: number) => (
                  <div key={plant.PlantID} className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor={`plant-${plant.PlantID}`} className="text-right">
                      Planta {index + 1}
                    </Label>
                    <Input
                      id={`plant-${plant.PlantID}`}
                      value={plant.PlantName}
                      className="col-span-3"
                      onChange={(e) => {
                        const newPlants = selectedCompany.Plants.map((p: any) =>
                          p.PlantID === plant.PlantID ? { ...p, PlantName: e.target.value } : p
                        );
                        setSelectedCompany({ ...selectedCompany, Plants: newPlants });
                      }}
                    />
                  </div>
                ))}
                <div  className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="switch" className="text-right">
                    Ver equipos
                  </Label>
                  <Switch checked={showDevices} onCheckedChange={() => setShowDevices(!showDevices)} />

                </div>
                
                {showDevices && selectedCompanyDevices.map((device: any, index: number) => (
                    <div key={device.DeviceID} className="grid grid-cols-4 items-center gap-4 ">
                      <Label htmlFor={`device-${device.DeviceID}`} className="text-right ">
                        Equipo {index + 1}
                      </Label>
                      <Input
                        id={`device-${device.DeviceID}`}
                        value={device.DeviceName}
                        className="col-span-3"
                        onChange={(e) => {
                          const newDevices = selectedCompanyDevices.map((d: any) =>
                            d.DeviceID === device.DeviceID ? { ...d, DeviceName: e.target.value } : d
                          );
                          setSelectedCompanyDevices(newDevices);
                        }}
                      />
                      {device.image && (
                        <>
                          <CldImage
                            alt='Uploaded Image'
                            src={device.image}
                            width="80"
                            height="80"
                            crop={{
                              type: 'auto',
                              source: true
                            }}
                          />
                          <Input
                            className='w-full col-span-3'
                            id={`picture-${device.DeviceID}`}
                            type="file"
                            onChange={(e) => handleDeviceImageUpload(e, device.DeviceID)}
                          />
                        </>
                      )}
                      <Separator className="my-0 col-span-4" />
                    </div>
                  ))}




              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveChanges}>Guardar cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          

          <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
            <DialogTrigger asChild>
              <Button 
              variant={selectedItems.length === 1 ? "custom" : "customUnable"}  
              className='col-span-2  xl:col-span-1' 
              onClick={()=>console.log()}
              disabled={selectedItems.length !== 1}
            >
            <Icon icon="lucide:trash-2" width="22" height="22" className="text-zinc-200 mr-2 "/>
            Eliminar
          </Button> 
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Eliminar empresa</DialogTitle>
                <DialogDescription>
                ¿Estas seguro que quieres eliminar esta empresa?
                </DialogDescription>
              </DialogHeader>
              
              <DialogFooter>
              <Button type="submit" className='mr-4' onClick={handleDelete}>Si</Button>
              <Button type="reset" onClick={() => setIsDialogOpen2(false)}>No</Button>
    
              </DialogFooter>
            </DialogContent>
          </Dialog>

          
          <Dialog open={isDialogOpen3} onOpenChange={setIsDialogOpen3}>
            <DialogTrigger asChild>
              <Button 
              variant={selectedItems.length === 1 ? "customUnable" : "custom"}  
              className='col-span-2  xl:col-span-1'
              disabled={selectedItems.length === 1}
              onClick={handleAddDevice}>
                <Icon icon="lucide:plus" width="22" height="22" className="text-zinc-200 mr-2" />
                Agregar 
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Agregar Dispositivo</DialogTitle>
                <DialogDescription>
                  Agrega un nuevo dispositivo o selecciona una empresa/planta existente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="companySelect" className="text-right ">Empresa</Label>
                  <Select
                  
                    onValueChange={(value) => {
                      const company = companies.find((c: any) => c.CompanyID === value);
                      if(company){
                        setSelectedCompany2(company);
                      }else{
                        setSelectedCompany2(value);
                      }
                      
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {selectedCompany2 ? selectedCompany2.CompanyName : 'Seleccionar empresa'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map((company) => (
                        <SelectItem key={company.CompanyID} value={company.CompanyID}>
                          {company.CompanyName}
                        </SelectItem>
                      ))}
                      <SelectItem value="new">Crear nueva empresa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {selectedCompany2 === 'new' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newCompanyName" className="text-right">Nombre de Empresa</Label>
                    <Input
                      id="newCompanyName"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
                {selectedCompany2 === 'new' &&<div className="grid grid-cols-4 items-center gap-4">
                  {imageUrl && <CldImage src={imageUrl} width="80" height="80" alt="Device Image" />}
                  <Label htmlFor="deviceImage" className="text-right">Imagen de empresa</Label>
                  <Input
                    id="deviceImage"
                    type="file"
                    onChange={handleImageCompanyUpload}
                    className="col-span-3"
                  />
                  
                </div>}

                {selectedCompany2 === 'new' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newCompanyName" className="text-right">Nombre de la planta</Label>
                    <Input
                      id="newPlantName"
                      value={newPlantName}
                      onChange={(e) => setNewPlantName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
                {selectedCompany2 === 'new' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newCompanyName" className="text-right">Nombre del dispositivo</Label>
                    <Input
                      id="newPlantName"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
                {selectedCompany2 === 'new' &&<div className="grid grid-cols-4 items-center gap-4">
                  {imageUrl && <CldImage src={imageUrl} width="80" height="80" alt="Device Image" />}
                  <Label htmlFor="deviceImage" className="text-right">Imagen de dispositivo</Label>
                  <Input
                    id="deviceImage"
                    type="file"
                    onChange={handleImageDeviceUpload}
                    className="col-span-3"
                  />
                  
                </div>}
                {selectedCompany2 === 'new' && (
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newCompanyName" className="text-right">MAC</Label>
                    <Input
                      id="newPlantName"
                      value={newDeviceMAC}
                      onChange={(e) => setNewDeviceMAC(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}

                {/* si la planta existe, crea un nuevo dispositivo con el nombre del dispositivo y el mac del dispositivo para la nueva planta */}

                {selectedCompany2 !== 'new' && selectedCompany2 && <div >
                  <Label htmlFor="plantSelect" className="text-right">Planta</Label>
                  <Select
                    
                    onValueChange={(value) => {
                      const plant = selectedCompany2.Plants.find((p: any) => p.PlantID === value);
                      if(plant){
                        setSelectedPlant(plant);
                      }else{
                        setSelectedPlant(value);
                      }
                      
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {selectedPlant ? selectedPlant.PlantName : 'Seleccionar planta'}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                    {selectedCompany2?.Plants.map((plant: any) => (
                      <SelectItem key={plant.PlantID} value={plant.PlantID}>
                        {plant.PlantName}
                      </SelectItem>
                    ))}
                    <SelectItem value="newPlant">Crear nueva planta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>}

                {selectedPlant !== null && selectedPlant !== "newPlant"  && 
                <div className="">
                  <Label htmlFor="newCompanyName" className="text-right">Nombre del dispositivo</Label>
                  <Input
                    id="newPlantName"
                    value={newDeviceNamePlant}
                    onChange={(e) => setNewDeviceNamePlant(e.target.value)}
                    className="col-span-3"
                  />
                </div>}

                {selectedPlant !== null && selectedPlant !== "newPlant"  && 
                <div className="">
                  <Label htmlFor="deviceImage" className="text-right">Imagen de dispositivo</Label>
                    <Input
                      id="deviceImage"
                      type="file"
                      onChange={handleImageDeviceUploadPlant}
                      className="col-span-3"
                    />
                  </div>}

                {selectedPlant !== null && selectedPlant !== "newPlant"  && 
                <div className="">
                  <Label htmlFor="newCompanyName" className="text-right">MAC</Label>
                  <Input
                    id="newPlantName"
                    value={newDeviceMACPlant}
                    onChange={(e) => setNewDeviceMACPlant(e.target.value)}
                    className="col-span-3"
                  />
                </div>}



                {/* si hay nueva planta, muestra para poner el nombre de la planta y el nombre del dispositivo */}



                {selectedPlant === 'newPlant' && (
                  <div className="">
                    <Label htmlFor="newPlantName" className="text-right">Nombre de Planta</Label>
                    <Input
                      id="newPlantName"
                      value={newPlantName2}
                      onChange={(e) => setNewPlantName2(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}

              {selectedPlant === 'newPlant' && (
                  <div className="">
                    <Label htmlFor="newPlantName" className="text-right">Nombre del dispositivo</Label>
                    <Input
                      id="newPlantName"
                      value={newDeviceName2}
                      onChange={(e) => setNewDeviceName2(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}

                {selectedPlant === 'newPlant' && 
                <div className="">
                  <Label htmlFor="deviceImage" className="text-right">Imagen de dispositivo</Label>
                    <Input
                      id="deviceImage"
                      type="file"
                      onChange={handleImageDeviceUploadPlant2}
                      className="col-span-3"
                    />
                  </div>}
                {selectedPlant === 'newPlant' && (
                  <div className="">
                    <Label htmlFor="newPlantName" className="text-right">MAC</Label>
                    <Input
                      id="newPlantName"
                      value={newDeviceMAC2}
                      onChange={(e) => setNewDeviceMAC2(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                )}
                
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSaveDevice}>Guardar Dispositivo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          
          
        </div>
        
        
        {/* Tabla de datos */}
        <div className='w-full h-auto rounded-2xl p-0 pt-2 sm:p-4 lg:p-12 mt-2 lg:pt-2 '>
          <Table className='rounded-2xl'>
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 flex justify-center items-center border-b">Seleccionar</TableHead>
                <TableHead className="py-2 px-4 border-b border-gray-300">Empresa</TableHead>
                <TableHead className="py-2 px-4 border-b border-gray-300">Plantas</TableHead>
                <TableHead className="py-2 px-4 border-b border-gray-300">Dispositivos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableElements}
            </TableBody>
          </Table>
        </div>

        
      </div>
      </>}

      
    </>
  );
};

export default ManagementPage;
