import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ALL_MODULES, ModuleName } from '../data/modules';

export interface ModuleUnlock {
  name: ModuleName;
  displayName: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  order: number;
}

interface ModuleUnlockContextType {
  unlockedModules: ModuleName[];
  allModules: ModuleUnlock[];
  unlockModule: (moduleName: ModuleName) => void;
  isModuleUnlocked: (moduleName: ModuleName) => boolean;
  getNextUnlockableModule: () => ModuleUnlock | null;
  resetProgress: () => void;
}

const ModuleUnlockContext = createContext<ModuleUnlockContextType | undefined>(undefined);

// Convert ALL_MODULES to ModuleUnlock format
const DEFAULT_MODULES: ModuleUnlock[] = ALL_MODULES.map((module, index) => ({
  name: module.name as ModuleName,
  displayName: module.displayName,
  icon: module.icon,
  color: module.color,
  unlocked: module.isStartingApp, // Starting apps are always unlocked
  order: index + 1
}));

export function ModuleUnlockProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleUnlock[]>(DEFAULT_MODULES);

  const unlockedModules = modules
    .filter(module => module.unlocked)
    .map(module => module.name);

  const unlockModule = (moduleName: ModuleName) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.name === moduleName && !module.unlocked
          ? { ...module, unlocked: true, unlockedAt: new Date() }
          : module
      )
    );
  };

  const isModuleUnlocked = (moduleName: ModuleName) => {
    return unlockedModules.includes(moduleName);
  };

  const getNextUnlockableModule = () => {
    return modules.find(module => !module.unlocked) || null;
  };

  const resetProgress = () => {
    setModules(DEFAULT_MODULES);
  };

  const loadModules = async () => {
    try {
      const savedModules = await AsyncStorage.getItem('unlocked_modules');
      if (savedModules) {
        const parsedModules = JSON.parse(savedModules);
        setModules(parsedModules);
      }
    } catch (error) {
      console.error('Failed to load unlocked modules:', error);
    }
  };

  const saveModules = async () => {
    try {
      await AsyncStorage.setItem('unlocked_modules', JSON.stringify(modules));
    } catch (error) {
      console.error('Failed to save unlocked modules:', error);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    saveModules();
  }, [modules]);

  return (
    <ModuleUnlockContext.Provider value={{
      unlockedModules,
      allModules: modules,
      unlockModule,
      isModuleUnlocked,
      getNextUnlockableModule,
      resetProgress
    }}>
      {children}
    </ModuleUnlockContext.Provider>
  );
}

export function useModuleUnlock() {
  const context = useContext(ModuleUnlockContext);
  if (context === undefined) {
    throw new Error('useModuleUnlock must be used within a ModuleUnlockProvider');
  }
  return context;
}

// Add default export
export default ModuleUnlockProvider; 