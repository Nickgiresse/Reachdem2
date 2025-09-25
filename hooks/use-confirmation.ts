import { useState } from "react";

interface ConfirmationOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive" | "success" | "warning";
}

interface ConfirmationState {
  isOpen: boolean;
  options: ConfirmationOptions;
  onConfirm: (() => void) | null;
}

export function useConfirmation() {
  const [state, setState] = useState<ConfirmationState>({
    isOpen: false,
    options: {
      title: "",
      description: "",
      confirmText: "Confirmer",
      cancelText: "Annuler",
      variant: "default",
    },
    onConfirm: null,
  });

  const confirm = (options: ConfirmationOptions, onConfirm: () => void) => {
    setState({
      isOpen: true,
      options: {
        title: options.title,
        description: options.description,
        confirmText: options.confirmText || "Confirmer",
        cancelText: options.cancelText || "Annuler",
        variant: options.variant || "default",
      },
      onConfirm,
    });
  };

  const handleConfirm = () => {
    if (state.onConfirm) {
      state.onConfirm();
    }
    setState(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  const handleCancel = () => {
    setState(prev => ({ ...prev, isOpen: false, onConfirm: null }));
  };

  return {
    ...state,
    confirm,
    handleConfirm,
    handleCancel,
  };
}