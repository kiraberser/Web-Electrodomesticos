import { ToastViewport } from "@/shared/ui/display/ToastRender"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}