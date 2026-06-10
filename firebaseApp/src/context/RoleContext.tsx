import { createContext, ReactNode, useContext, useState } from 'react';

interface RoleContextType {
    role: 'member' | 'admin' | null;
    setRole: (role: 'member' | 'admin' | null) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider = ({ children }: { children: ReactNode }) => {
    const [role, setRole] = useState<'member' | 'admin' | null>(null);

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {children}
        </RoleContext.Provider>
    );
};

export const useRole = () => {
    const context = useContext(RoleContext);
    if (!context) {
        throw new Error('useRole must be used within RoleProvider');
    }
    return context;
};
