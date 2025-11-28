
export const ARCHITECTURE_GUIDE = {
    overview: "This application follows a Modular Monolith architecture designed for React + TypeScript client-side execution.",
    
    structure: [
        {
            folder: "src/modules/*",
            description: "Self-contained feature sets. Each folder (e.g., Sales, HR) contains the main view and its specific sub-components. This ensures features are isolated and easy to upgrade."
        },
        {
            folder: "src/components/common/*",
            description: "Atomic UI Building Blocks (Buttons, Inputs, Modals, Tables). These are 'dumb' components that strictly follow the Design System."
        },
        {
            folder: "src/hooks/useAppStore.ts",
            description: "The Global State Manager. It centralizes authentication, user sessions, and global configurations (Branches, Settings) to prevent prop-drilling chaos."
        },
        {
            folder: "src/services/database.ts",
            description: "The Persistence Layer. Implements a Repository Pattern to handle data storage. Currently uses LocalStorage, but designed to be easily swapped for a Cloud API."
        },
        {
            folder: "src/styles/designSystem.ts",
            description: "The Source of Truth for visuals. Defines strict constants for colors, spacing, and typography to ensure 100% UI consistency."
        }
    ],

    dataFlow: "App.tsx (Router) -> useAppStore (Global State) -> Module (Feature Logic) -> Database Service (Persistence)",
    
    versioning: "Versioning is file-based in 'src/versions/logs/'. To add a new version, simply create a new file following the naming convention."
};
