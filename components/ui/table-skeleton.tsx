import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 6 }: TableSkeletonProps) {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex space-x-4 p-4 border-b border-zinc-200">
        {Array.from({ length: columns }).map((_, index) => (
          <div
            key={index}
            className="h-4 bg-zinc-200 rounded animate-pulse flex-1"
            style={{ width: `${Math.random() * 40 + 60}px` }}
          />
        ))}
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-zinc-100">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div
              key={colIndex}
              className="h-4 bg-zinc-100 rounded animate-pulse flex-1"
              style={{ 
                width: `${Math.random() * 40 + 60}px`,
                animationDelay: `${rowIndex * 0.1 + colIndex * 0.05}s`
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ContactTableSkeleton() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex space-x-4 p-4 border-b border-zinc-200">
        <div className="h-4 w-4 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-28 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-36 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-zinc-100">
          <div className="h-4 w-4 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-40 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
          <div className="h-6 w-20 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" />
          <div className="h-8 w-20 bg-zinc-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function GroupTableSkeleton() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex space-x-4 p-4 border-b border-zinc-200">
        <div className="h-4 w-4 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-40 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: 6 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-zinc-100">
          <div className="h-4 w-4 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-48 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-16 bg-zinc-100 rounded animate-pulse" />
          <div className="h-8 w-20 bg-zinc-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function CampaignTableSkeleton() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex space-x-4 p-4 border-b border-zinc-200">
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: 5 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-zinc-100">
          <div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-12 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-56 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-20 bg-zinc-100 rounded animate-pulse" />
          <div className="h-6 w-16 bg-zinc-100 rounded-full animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="h-6 w-32 bg-zinc-200 rounded" />
        <div className="h-6 w-16 bg-zinc-200 rounded-full" />
      </div>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-zinc-100 rounded" />
          <div className="h-4 w-24 bg-zinc-100 rounded" />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="h-4 w-6 bg-zinc-100 rounded" />
          <div className="h-4 w-32 bg-zinc-100 rounded" />
        </div>
        
        <div className="h-4 w-28 bg-zinc-100 rounded" />
      </div>
      
      <div className="flex gap-2">
        <div className="h-8 w-20 bg-zinc-100 rounded flex-1" />
        <div className="h-8 w-20 bg-zinc-100 rounded flex-1" />
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="p-6 border border-gray-200 rounded-xl flex flex-col justify-center gap-6 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-6 w-32 bg-zinc-200 rounded" />
        <div className="h-8 w-8 bg-zinc-200 rounded-full" />
      </div>
      <div className="space-y-3">
        <div className="h-8 w-16 bg-zinc-200 rounded" />
        <div className="h-4 w-24 bg-zinc-100 rounded" />
      </div>
    </div>
  );
}

export function DashboardStatsSkeleton() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-2">
      {/* Activité de message skeleton */}
      <div className="p-6 border border-gray-200 rounded-xl gap-6 flex flex-col justify-center animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-40 bg-zinc-200 rounded" />
          <div className="h-8 w-8 bg-zinc-200 rounded-full" />
        </div>
        <div className="h-4 w-48 bg-zinc-100 rounded mb-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-zinc-100 rounded" />
            <div className="h-6 w-12 bg-zinc-100 rounded" />
          </div>
        </div>
        
        <div className="h-px bg-zinc-200 my-4" />
        
        <div className="space-y-3">
          <div className="h-6 w-16 bg-zinc-200 rounded" />
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-14 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
        </div>
      </div>
      
      {/* Statistiques financières skeleton */}
      <div className="p-6 border border-gray-200 rounded-xl gap-6 flex flex-col justify-center animate-pulse">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-44 bg-zinc-200 rounded" />
          <div className="h-8 w-8 bg-zinc-200 rounded-full" />
        </div>
        <div className="h-4 w-52 bg-zinc-100 rounded mb-4" />
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="h-4 w-32 bg-zinc-100 rounded" />
            <div className="h-6 w-16 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-28 bg-zinc-100 rounded" />
            <div className="h-6 w-16 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-24 bg-zinc-100 rounded" />
            <div className="h-6 w-16 bg-zinc-100 rounded" />
          </div>
        </div>
        
        <div className="h-px bg-zinc-200 my-4" />
        
        <div className="space-y-3">
          <div className="h-6 w-48 bg-zinc-200 rounded" />
          <div className="flex justify-between items-center">
            <div className="h-4 w-16 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
          <div className="flex justify-between items-center">
            <div className="h-4 w-20 bg-zinc-100 rounded" />
            <div className="h-6 w-8 bg-zinc-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MessageTableSkeleton() {
  return (
    <div className="w-full">
      {/* Header skeleton */}
      <div className="flex space-x-4 p-4 border-b border-zinc-200">
        <div className="h-4 w-48 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-32 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-20 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-28 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-16 bg-zinc-200 rounded animate-pulse" />
        <div className="h-4 w-24 bg-zinc-200 rounded animate-pulse" />
      </div>
      
      {/* Rows skeleton */}
      {Array.from({ length: 8 }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4 p-4 border-b border-zinc-100">
          <div className="h-4 w-56 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-36 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-24 bg-zinc-100 rounded animate-pulse" />
          <div className="h-4 w-32 bg-zinc-100 rounded animate-pulse" />
          <div className="h-6 w-20 bg-zinc-100 rounded-full animate-pulse" />
          <div className="h-4 w-28 bg-zinc-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export function DashboardTableSkeleton() {
  return (
    <div className="bg-white border border-zinc-200 rounded-xl shadow-sm animate-pulse">
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-zinc-50">
            <tr>
              {Array.from({ length: 5 }).map((_, index) => (
                <th key={index} className="px-4 py-3">
                  <div className="h-4 w-20 bg-zinc-200 rounded" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {Array.from({ length: 3 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="transition-colors duration-200">
                {Array.from({ length: 5 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <div className="h-4 w-16 bg-zinc-100 rounded" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
