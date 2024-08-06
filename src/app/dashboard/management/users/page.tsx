'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Icon } from '@iconify/react';
import { Skeleton } from "@/components/ui/skeleton"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const UserManagementPage = () => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDialogOpen2, setIsDialogOpen2] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedPlants, setSelectedPlants] = useState<string[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/users'); // Reemplaza con tu URL de API de usuarios
    const data = await response.json();
    console.log("Users in management page", data);
    setUsers(data);
    setFilteredUsers(data);
  };

  const fetchCompanies = async () => {
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/companys'); // Reemplaza con tu URL de API de empresas
    const data = await response.json();
    setCompanies(data);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term === '') {
      setFilteredUsers(users);
    } else {
      const newUsers = users.filter((user: any) => {
        return user.Name.toLowerCase().includes(term.toLowerCase());
      });
      setFilteredUsers(newUsers);
    }
  };

  const handleCheckboxChange = (id: string) => {
    setSelectedItems((prevSelectedItems) =>
      prevSelectedItems.includes(id) ? [] : [id]
    );
  };
 console.log("selectedplants", selectedPlants);
  const handleDelete = async () => {
    if (selectedItems.length === 1) {
      const userID = selectedItems[0];
      const user = users.find((user) => user.UserID === userID);
      
      if (user) {
        await fetch(`https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/user`, { // Reemplaza con tu URL de API de eliminación de usuarios
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_id: user.UserID })
        });

        // Refrescar los datos después de eliminar el usuario
        fetchUsers();
        setSelectedItems([]);
        setIsDialogOpen2(false);
      }
    }
  };

  const handleEditClick = () => {
    setIsDialogOpen(true); // Abrir el diálogo
    if (selectedItems.length === 1) {
      const user = users.find((user: any) => user.UserID === selectedItems[0]);
      setSelectedUser(user);
      setOriginalUser(JSON.parse(JSON.stringify(user))); // Clonar los valores originales
    }
  };

  const handleSaveChanges = async () => {
    if (!originalUser || !selectedUser) return;

    const changes = [];

    if (selectedCompany || selectedPlants.length > 0) {
      changes.push({
        user_id: selectedUser.UserID,
        companyID: selectedCompany ? `["${selectedCompany}"]` : "[]",
        plantID: selectedPlants.length > 0 ? `["${selectedPlants.join('","')}"]` : "[]"
      });
    }

    for (const change of changes) {
      await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/user', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(change)
      });
    }

    fetchUsers();
    setIsDialogOpen(false);
  };
  

  const handleCompanyChange = (companyID: string) => {
    setSelectedCompany(companyID);
    const selectedCompanyObj = companies.find(company => company.CompanyID === companyID);
    setFilteredPlants(selectedCompanyObj ? selectedCompanyObj.Plants : []);
    setSelectedPlants([]);
  };

  useEffect(() => {
    fetchUsers();
    fetchCompanies();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    
  }, []);

  const tableElements = filteredUsers.map((user: any) => (
    <TableRow key={user.UserID} className='h-12'>
      <TableCell className="py-2 px-4 border-b text-center">
        <Checkbox checked={selectedItems.includes(user.UserID)} onCheckedChange={() => handleCheckboxChange(user.UserID)} />
      </TableCell>
      <TableCell>{user.Name}</TableCell>
      <TableCell>{user.Email}</TableCell>
      <TableCell>{user.Roles}</TableCell>
      <TableCell>
        {user.Companies.map((company: any) => (
          <div key={company.CompanyID}>
            {company.CompanyName}
          </div>
        ))}
      </TableCell>
      <TableCell>
        {user.Companies.map((company: any) => (
          <div key={company.CompanyID}>
            {company.Plants.map((plant: any) => (
              <div key={plant.PlantID}>
                {plant.PlantName}
              </div>
            ))}
          </div>
        ))}
      </TableCell>
    </TableRow>
  ));

  return (
    <>
      <span className="font-bold text-xl text-gray-800 pt-4 md:pt-0">Usuarios</span>
      
      {loading ?
      <>
      <div className="w-full h-auto rounded-2xl pt-4 px-4">
        <div className='grid grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-7 p-0 pt-4 sm:p-4 lg:p-12 lg:pt-4'>
        <Skeleton className="h-[35px] w-full col-span-6 xl:col-span-4" />
        <Skeleton className="h-[35px] col-span-2 xl:col-span-1 w-full" />
        <Skeleton className="h-[35px] col-span-2 xl:col-span-1 w-full" />
        </div>
      </div>

      <Skeleton className="h-[550px] w-full " />
      </> :
      <>
       <div className="w-full h-auto rounded-2xl pt-4 px-4">
        <div className='grid grid-cols-6 md:grid-cols-6 lg:grid-cols-6 xl:grid-cols-6 gap-7 p-0 pt-4 sm:p-4 lg:p-12 lg:pt-4'>
          <Input
            type="text"
            placeholder="Buscar por nombre de usuario"
            value={searchTerm}
            onChange={handleSearchChange}
            className='w-full col-span-6 xl:col-span-4'
          />
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Asignar empresa</DialogTitle>
                <DialogDescription>
                  Asigna una empresa y plantas al usuario. Haz click en guardar cuando estes listo.
                </DialogDescription>
              </DialogHeader>
              <div>
                <Label>Empresa</Label>
                <Select onValueChange={handleCompanyChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.CompanyID} value={company.CompanyID}>
                        {company.CompanyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plantas</Label>
                {filteredPlants.length > 0 ? filteredPlants.map((plant, index) => (
                  <div key={plant.PlantID} className="mb-2">
                    <Select
                      value={selectedPlants[index] || ''}
                      onValueChange={(value) => {
                        const updatedPlants = [...selectedPlants];
                        updatedPlants[index] = value;
                        setSelectedPlants(updatedPlants.filter(Boolean));
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Selecciona planta ${index + 1}`} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={plant.PlantID}>
                          {plant.PlantName}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )):
                <Label>Plantas</Label>}
              </div>
              <DialogFooter>
                <Button type="submit" onClick={handleSaveChanges}>
                  Guardar cambios
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen2} onOpenChange={setIsDialogOpen2}>
            <DialogTrigger asChild>
              <Button 
                variant={selectedItems.length === 1 ? "custom" : "customUnable"}  
                className='col-span-2 xl:col-span-1' 
                onClick={() => setIsDialogOpen2(true)}
                disabled={selectedItems.length !== 1}
              >
                <Icon icon="lucide:trash-2" width="22" height="22" className="text-zinc-200 mr-2 "/> 
                Eliminar
              </Button> 
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Eliminar usuario</DialogTitle>
                <DialogDescription>
                  ¿Está seguro de que desea eliminar este usuario? Esta acción no se puede deshacer.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button type="submit" onClick={handleDelete}>
                  Confirmar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="border  rounded-md mt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Seleccionar</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Correo electrónico</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Empresa</TableHead>
              <TableHead>Planta</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableElements}
          </TableBody>
        </Table>
      </div>
      </>
    }
      
      
      
     
    </>
  );
};

export default UserManagementPage;
