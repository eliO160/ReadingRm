'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {SearchField, Label, Input} from 'react-aria-components';
import { Search }  from "lucide-react"

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  async function handleSubmit(value) {
    if(!value?.trim()) return;
    router.push(`/search?q=${encodeURIComponent(value)}`);
  }
  
  return(
    <div className="flex justify-center">
      <div className="flex items-center gap-4">
        <SearchField 
          className="flex items-center w-full max-w-xl"
          value={query}
          onChange={setQuery}
          onSubmit={handleSubmit}
        >
          <Label className="sr-only">Quick Search</Label>
          <Input
            placeholder="Quick Search"
            className="
            border border-gray-300 rounded-md px-3 py-2 text-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 
            placeholder-gray-700" 
          />
        </SearchField>
        <button
        type="button"
          onClick={() => handleSubmit(query)}
          aria-label="Search"
          className="icon-circle-btn shrink-0"
        >
          <Search size={20} />
        </button>
      </div>
    </div>
  );
}