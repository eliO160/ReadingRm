'use client';
import Link from 'next/link';
import ThemeToggle from "@/components/ThemeToggle";
import SearchBar from './SearchBar';


export default function NavBar() {
  return (
    <nav className="flex flex-row justify-end gap-10 px-10 py-3">
      <SearchBar />
      <Link href="/about">About</Link>
      <Link href="/demo_page">Demo Page</Link>
      <Link href="/search">Advanced Search</Link>
      <Link href="/signIn">Sign In</Link>
      <ThemeToggle />
      
    </nav>
  );

}