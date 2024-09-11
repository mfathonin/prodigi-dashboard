"use client";

import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import React, { useState, useCallback } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data: initialData,
}: DataTableProps<TData, TValue>) {
  const [data, setData] = useState(initialData);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const onDataChange = useCallback((updatedUser: TData) => {
    setData((prevData) =>
      prevData.map((user) =>
        (user as any).id === (updatedUser as any).id ? updatedUser : user
      )
    );
  }, []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
    meta: {
      onDataChange,
    },
  });

  return (
    <div>
      <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <Table>
          <TableHeader className="bg-gray-100 dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`font-bold text-gray-700 dark:text-gray-300 ${
                        index === 0 ? "pl-6" : "" // Add extra left padding to the first column
                      } ${
                        index === 0
                          ? "rounded-tl-lg"
                          : index === headerGroup.headers.length - 1
                          ? "rounded-tr-lg"
                          : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, rowIndex) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`border-b border-gray-100 dark:border-gray-700 ${
                    rowIndex === table.getRowModel().rows.length - 1
                      ? "last-of-type:border-b-0"
                      : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell, cellIndex) => (
                    <TableCell
                      key={cell.id}
                      className={`py-3 ${
                        cellIndex === 0 ? "pl-6" : "" // Add extra left padding to the first column
                      } ${
                        rowIndex === table.getRowModel().rows.length - 1
                          ? cellIndex === 0
                            ? "rounded-bl-lg"
                            : cellIndex === row.getVisibleCells().length - 1
                            ? "rounded-br-lg"
                            : ""
                          : ""
                      }`}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center rounded-b-lg"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Remove pagination buttons */}
    </div>
  );
}
