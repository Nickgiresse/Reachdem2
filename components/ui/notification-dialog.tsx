"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/motion-primitives/dialog";
import { CheckCircle, Info, XCircle, AlertTriangle } from "lucide-react";

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  buttonText?: string;
  variant?: "default" | "destructive" | "success" | "warning";
}

export function NotificationDialog({
  isOpen,
  onClose,
  title,
  description,
  buttonText = "OK",
  variant = "default",
}: NotificationDialogProps) {
  const getIcon = () => {
    switch (variant) {
      case "destructive":
        return <XCircle className="h-6 w-6 text-red-500" />;
      case "success":
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-6 w-6 text-yellow-500" />;
      default:
        return <Info className="h-6 w-6 text-blue-500" />;
    }
  };

  const getButtonVariant = () => {
    switch (variant) {
      case "destructive":
        return "destructive";
      case "success":
        return "default";
      case "warning":
        return "default";
      default:
        return "default";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end pt-4">
          <Button
            variant={getButtonVariant()}
            onClick={onClose}
            className="w-full"
          >
            {buttonText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
