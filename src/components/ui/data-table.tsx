"use client";

import { ColumnDef, ColumnSizing, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, OnChangeFn, Row, RowSelectionState, useReactTable, VisibilityState } from "@tanstack/react-table";
import { useState } from "react";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "./dropdown-menu";
import { Button } from "./button";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "./table";
import { Checkbox } from "./checkbox";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    enableSorting?: boolean;
    enableFiltering?: boolean;
    showFooter?: boolean;
    enablePagination?: boolean;
    enableRowSelection?: boolean;
    externalRowSelection?: RowSelectionState;
    enableColumnVisibilityToggle?: boolean;
    onRowClick?: (row: Row<TData>) => void;
    onExternalRowSelectionChange?: OnChangeFn<RowSelectionState>;
    navigableColumnIds?: string[];
}

export function DataTable<TData, TValue>({
    columns,
    data,
    enableSorting = false,
    enableFiltering = false,
    showFooter = false,
    enablePagination = false,
    enableRowSelection = false,
    enableColumnVisibilityToggle = false,
    externalRowSelection,
    onExternalRowSelectionChange,
    onRowClick,
    navigableColumnIds
}: DataTableProps<TData, TValue>) {
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
    const [internalRowSelection, setInternalRowSelection] = useState<RowSelectionState>({});

    const table = useReactTable({
        data,
        columns,
        state: {
            columnVisibility,
            ...(enableRowSelection && externalRowSelection !== undefined && {
                rowSelection: externalRowSelection ?? internalRowSelection,
            }),
        },
        onColumnVisibilityChange: setColumnVisibility,
        getCoreRowModel: getCoreRowModel(),
        ...(enableSorting && { getSortedRowModel: getSortedRowModel() }),
        ...(enableFiltering && { getFilteredRowModel: getFilteredRowModel() }),
        ...(enablePagination && { getPaginationRowModel: getPaginationRowModel() }),
        ...(enableRowSelection && {
            enableRowSelection: true,
            onRowSelectionChange: onExternalRowSelectionChange ?? setInternalRowSelection,
        }),
    });

    return (
        <div className="space-y-4">
            {/* Top Controls */}
            <div className="flex items-center justify-between">
                {enableColumnVisibilityToggle && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Columns
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {table
                                .getAllColumns()
                                .filter((column) => column.getCanHide())
                                .map((column) => (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) => column.toggleVisibility(Boolean(value))}
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
                {enableRowSelection && (
                    <span className="text-sm text-muted-foreground">
                        {table.getSelectedRowModel().rows.length} row(s) selected
                    </span>
                )}
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {enableRowSelection && (
                                    <TableHead>
                                        <Checkbox
                                            checked={table.getIsAllPageRowsSelected()}
                                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                                            aria-label="Select all"
                                        />
                                    </TableHead>
                                )}
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())
                                        }
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                                    className={onRowClick ? "cursor-pointer hover:bg-muted": ""}
                                >
                                    {enableRowSelection && (
                                        <TableCell>
                                            <Checkbox
                                                checked={row.getIsSelected()}
                                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                                aria-label="Select row"
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </TableCell>
                                    )}
                                    {row.getVisibleCells().map((cell) => {
                                        const columnId = cell.column.id;
                                        const isNavigable = navigableColumnIds?.includes(columnId);

                                        return (
                                            <TableCell
                                                key={cell.id}
                                                className={isNavigable ? "cursor-pointer" : ""}
                                                onClick={(e) => {
                                                    if (isNavigable && onRowClick) {
                                                        e.stopPropagation();
                                                        onRowClick(row);
                                                    }
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        );
                                    })}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + (enableRowSelection ? 1 : 0)} className="h-24 text-center">
                                    No results
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {showFooter && (
                        <TableFooter>
                            {table.getFooterGroups().map((footerGroup) => (
                                <TableRow key={footerGroup.id}>
                                    {enableRowSelection && <TableCell />}
                                    {footerGroup.headers.map((header) => (
                                        <TableCell key={header.id}>
                                            {flexRender(header.column.columnDef.footer, header.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableFooter>
                    )}
                </Table>
            </div>

            {/* Pagination Controls */}
            {enablePagination && (
                <div className="flex items-center justify-between space-x-2">
                    <div className="text-sm text-muted-foreground">
                        Page {table.getState().pagination.pageIndex + 1} of {" "}
                        {table.getPageCount()}
                    </div>
                    <div className="space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}