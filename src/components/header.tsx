'use client';

import React from 'react';
import Image from 'next/image'

import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';
import { UserButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';

import logo from '../assets/mainlogo.png';

const Header = () => {
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  const { user } = useUser();

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all `,
        {
          'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
          ' bg-white': selectedLayout,
        },
      )}
    >
      <div className="flex h-[49px] items-center justify-between px-4 bg-gray-800 md:bg-zinc-100">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <Image src={logo} width={160} height={60} alt="logo" />
          </Link>
        </div>

        <div className="hidden md:flex">
          <p className='h-8 mx-6 flex text-sm items-center justify-center text-center'>Bienvenido, {user?.firstName} {user?.lastName}</p>
          <UserButton />
        </div>
      </div>
    </div>
  );
};

export default Header;