import React, { ChangeEvent } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  overlayClassName?: string;
  contentClassName?: string;
}

export interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value?: string;
  name?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void | ((value: string) => void);
  className?: string;
  icon?: React.ReactNode;
  step?: string | number;
  min?: string | number;
  max?: string | number;
  as?: 'input' | 'textarea';
  rows?: number;
}

export interface TextareaProps {
  label?: string;
  error?: string;
  required?: boolean;
  placeholder?: string;
  value?: string;
  name?: string;
  onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  icon?: React.ReactNode;
  rows?: number;
}