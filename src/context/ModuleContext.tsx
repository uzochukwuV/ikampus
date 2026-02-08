"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Module = "General" | "MKT2006W1" | "MKT2050W" | "MKT2011W";

interface ModuleContextType {
    selectedModule: Module;
    setSelectedModule: (module: Module) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
    const [selectedModule, setSelectedModule] = useState<Module>("General");

    return (
        <ModuleContext.Provider value={{ selectedModule, setSelectedModule }}>
            {children}
        </ModuleContext.Provider>
    );
}

export function useModule() {
    const context = useContext(ModuleContext);
    if (context === undefined) {
        throw new Error("useModule must be used within a ModuleProvider");
    }
    return context;
}
