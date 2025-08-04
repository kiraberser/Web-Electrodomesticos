import { ToastViewport } from "@/components/ui/display/ToastRender"

export default function RootLayout({ children }) {
  return (
    <>
      {children}
      <ToastViewport />
    </>
  )
}
