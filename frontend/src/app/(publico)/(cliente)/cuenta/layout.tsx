import { ToastViewport } from "@/components/ui/display/ToastRender"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}