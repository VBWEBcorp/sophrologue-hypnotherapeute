'use client'

import { ToastProvider } from '@/components/admin/toast'
import { ConfirmProvider } from '@/components/admin/confirm-dialog'

/**
 * Regroupe les providers UX de l'admin (toasts + dialog de confirmation).
 * Monté une seule fois dans le layout admin.
 */
export function AdminProviders({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <ConfirmProvider>{children}</ConfirmProvider>
    </ToastProvider>
  )
}
