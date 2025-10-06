'use client';

import {
  GridList,
  GridListItem,
  Button,
  Checkbox,
  TooltipTrigger,
  Tooltip
} from 'react-aria-components';
import { Info } from 'lucide-react';

export default function Filters() {
  return(
    <GridList 
      aria-label="Search Filters"
      selectionMode="multiple"
      selectionBehavior='toggle'
      className="grid grid-cols-1 gap-2"
    >
      {[
        { id: 'charizard', label: 'Charizard' },
        { id: 'blastoise', label: 'Blastoise' },
        { id: 'venusaur', label: 'Venusaur' },
        { id: 'pikachu', label: 'Pikachu' }
      ].map(item => (
        <GridListItem
          key={item.id}
          id={item.id}
          textValue={item.label}
          className="flex items-center justify-between rounded-lg border p-3
                     data-[selected]:ring-2 data-[selected]:ring-blue-500
                     data-[focus-visible]:outline-none data-[focus-visible]:ring-2 data-[focus-visible]:ring-blue-400"
        >
          {/* Selection checkbox (visible indicator) */}
          <div className="flex items-center gap-3">
            <Checkbox
              slot="selection"
              aria-label={`Select ${item.label}`}
              className="flex items-center gap-2"
            >
              {/* Visible checkbox indicator */}
              <div
                slot="indicator"
                className="h-5 w-5 rounded border
                           data-[selected]:bg-blue-600 data-[selected]:border-blue-600
                           data-[pressed]:scale-95 transition-transform"
              />
              {/* Optional text next to the checkbox; we’ll keep the row label separate below,
                  so we won't duplicate it here. You can omit text inside Checkbox. */}
            </Checkbox>

            {/* Main label text for the row */}
            <span className="text-sm font-medium">{item.label}</span>
          </div>

          {/* Action button with tooltip; doesn’t toggle selection */}
          <TooltipTrigger delay={150}>
            <Button
              slot="drag"
              aria-label="Info"
              className="rounded p-2 hover:bg-gray-100
                         focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <Info size={20} />
            </Button>
            <Tooltip className="rounded bg-black px-2 py-1 text-xs text-white shadow">
              More info about {item.label}
            </Tooltip>
          </TooltipTrigger>
        </GridListItem>
      ))}
    </GridList>
  );
}