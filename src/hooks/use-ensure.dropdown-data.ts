"use client";

import { useDropdownStore } from "@/lib/stores/use-dropdown-store";
import { useEffect } from "react";

export function useEnsureDropdownData() {
    const { isLoaded, fetchDropdownData } = useDropdownStore();

    useEffect(() => {
        if (!isLoaded) {
            fetchDropdownData().catch((err) => {
                console.error("Dropdown fetch failed", err);
            });
        }
    }, [isLoaded, fetchDropdownData]);
}