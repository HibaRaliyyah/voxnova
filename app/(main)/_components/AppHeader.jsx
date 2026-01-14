"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserButton, useUser } from "@stackframe/stack";

const AppHeader = () => {
  const user = useUser(); // null when signed out

  return (
    <header className="px-6 py-4 flex justify-between items-center border-b">
      {/* Logo */}
      <div className="flex items-center gap-2">
      <Link href={'/'}>
        <Image
          src="/logo.svg"
          alt="VoxNova"
          width={120}
          height={40}
          priority
        />
        </Link>
      </div>

      {/* Sign In */}
      <div>
        {user ? (
          <UserButton />
        ) : (
          <Link href="/handler/sign-in">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 rounded-full cursor-pointer">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
