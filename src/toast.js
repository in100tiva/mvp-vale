import { createContext, useContext } from 'react';

// Contexto do sistema de toasts.
// Fica em um módulo próprio para que `ui.jsx` exporte apenas componentes
// (regra react-refresh/only-export-components).
export const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);
