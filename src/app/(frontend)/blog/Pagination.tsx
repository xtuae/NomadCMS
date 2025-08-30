'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function Pagination({ totalPages, hasNextPage, hasPrevPage }: PaginationProps) {
  const searchParams = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;

  return (
    <div className="flex justify-center items-center mt-12">
      {hasPrevPage && (
        <Link href={`/blog?page=${page - 1}`} className="px-4 py-2 mx-1 text-gray-700 capitalize bg-white rounded-md border border-gray-200 hover:bg-gray-100">
          Previous
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => (
        <Link
          href={`/blog?page=${i + 1}`}
          key={i}
          className={`px-4 py-2 mx-1 text-gray-700 transition-colors duration-300 transform rounded-md ${page === i + 1 ? 'bg-[#de6076] text-white' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
        >
          {i + 1}
        </Link>
      ))}

      {hasNextPage && (
        <Link href={`/blog?page=${page + 1}`} className="px-4 py-2 mx-1 text-gray-700 capitalize bg-white rounded-md border border-gray-200 hover:bg-gray-100">
          Next
        </Link>
      )}
    </div>
  );
}
