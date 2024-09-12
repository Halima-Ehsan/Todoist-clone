import Link from 'next/link';
import Image from 'next/image';
import { FC } from 'react';
import { signIn } from 'next-auth/react';



const Navbar: FC = () => {
  return (
    <nav className="bg-white-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-dark text-lg font-semibold">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Taskly Logo"
              width={30}
              height={15}
              className="hover:opacity-80"
            />
            <span className="text-dark text-lg font-semibold ml-1">Taskly</span>
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => signIn('google')}
              className="btn text-dark-300 hover:text-gray"
            >
              Log in
            </button>
            
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

