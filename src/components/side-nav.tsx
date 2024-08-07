'use client';

import React, { use, useEffect, useState } from 'react';

import { useUser } from "@clerk/nextjs";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';
import Image from 'next/image'
import logo from '../assets/mainlogo.png';

const SideNav = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const user = useUser();

  const fetchUsers = async () => {
    const response = await fetch('https://erokmgq6y9.execute-api.us-east-2.amazonaws.com/prod/users'); // Reemplaza con tu URL de API de usuarios
    const data = await response.json();
    console.log("Users in management page", data);
    setUsers(data);
    
  };
  useEffect(() => {
    fetchUsers();
    
    
  }, []);

  useEffect(() => {
    if (user?.user?.id) {
      const currentUser = users.find(u => u.UserID === user.user.id);
      if (currentUser && currentUser.Roles.includes('admin')) {
        setIsAdmin(true);
        console.log("user is admin", currentUser);
      } else {
        setIsAdmin(false);
      }
    }
  }, [user?.user?.id, users]);
  
  return (
    <div className="md:w-60 bg-gray-800 h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/dashboard"
          className="flex flex-row space-x-3 items-center justify-center md:justify-center md:px-6  h-12 w-full"
        >
          <Image src={logo} width={160} height={60} alt="logo" />
        </Link>

        <div className="flex flex-col space-y-2  md:px-4 ">
          {SIDENAV_ITEMS.map((item, idx) => {
            if (item.path === '/dashboard/management' && !isAdmin) {
              return null;
            }

            return <MenuItem key={idx} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNav;

const MenuItem = ({ item }: { item: SideNavItem }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  return (
    <div className="">
      {item.submenu ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg hover-bg-button-blue-gradient w-full justify-between hover:bg-button-blue-gradient ${
              pathname.includes(item.path || '/dashboard/plant') ? 'bg-button-blue-gradient' : ''
            }`}
          >
            <div className="flex flex-row space-x-3 items-center">
              {item.icon}
              <span className="font-semibold text-md  flex text-zinc-200">{item.title}</span>
            </div>

            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <Icon icon="lucide:chevron-down" width="22" height="22" className='text-zinc-200'/>
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => {
                return (
                  <Link
                    key={idx}
                    href={subItem.path}
                    className={`${
                      subItem.path === pathname ? 'font-bold' : ''
                    }`}
                  >
                    <span className="text-zinc-200 text-md">{subItem.title}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-3 items-center p-2 rounded-lg hover:bg-button-blue-gradient ${
            item.path === pathname ? 'bg-button-blue-gradient' : pathname.includes('/dashboard/plant') && item.path === '/dashboard' ? 'bg-button-blue-gradient' : ''
          }`}
        >
          {item.icon}
          <span className="font-semibold text-md flex text-zinc-200">{item.title}</span>
        </Link>
      )}
    </div>
  );
};