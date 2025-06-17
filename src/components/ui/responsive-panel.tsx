"use client"

import { Drawer, DrawerContent } from "@/components/ui/drawer"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { useIsMobile } from "@/hooks/use-is-mobile"

interface ResponsivePanelProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ResponsivePanel({ isOpen, onClose, title, children }: ResponsivePanelProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <SheetContent side="bottom" className="h-[90vh] overflow-y-auto p-6">
          <h2 className="text-xl font-bold mb-4">{title}</h2>
          {children}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="p-6 max-h-[calc(100vh-4rem)] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </DrawerContent>
    </Drawer>
  )
}
