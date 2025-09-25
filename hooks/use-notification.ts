import { useState } from "react";

interface NotificationOptions {
  title: string;
  description: string;
  variant?: "default" | "destructive" | "success" | "warning";
  buttonText?: string;
}

interface NotificationState {
  isOpen: boolean;
  options: NotificationOptions;
}

export function useNotification() {
  const [state, setState] = useState<NotificationState>({
    isOpen: false,
    options: {
      title: "",
      description: "",
      variant: "default",
      buttonText: "OK",
    },
  });

  const show = (options: NotificationOptions) => {
    setState({
      isOpen: true,
      options: {
        title: options.title,
        description: options.description,
        variant: options.variant || "default",
        buttonText: options.buttonText || "OK",
      },
    });
  };

  const hide = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  return {
    ...state,
    show,
    hide,
  };
}
