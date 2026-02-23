import * as React from "react"

import { cn } from "@/shared/lib/utils"

interface TabsContextValue {
    value: string
    onValueChange: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const useTabsContext = () => {
    const context = React.useContext(TabsContext)
    if (!context) {
        throw new Error("Tabs components must be used within Tabs")
    }
    return context
}

interface TabsProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}

const Tabs = ({ value: controlledValue, defaultValue, onValueChange, children }: TabsProps) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    
    const value = controlledValue !== undefined ? controlledValue : internalValue
    
    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
    }

    return (
        <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
            {children}
        </TabsContext.Provider>
    )
}

const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
                className
            )}
            {...props} />
    )
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<
    HTMLButtonElement,
    React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange } = useTabsContext()
    const isActive = selectedValue === value

    return (
        <button
            ref={ref}
            type="button"
            onClick={() => onValueChange(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                isActive && "bg-background text-foreground shadow border border-gray-300",
                className
            )}
            {...props} />
    )
})
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, ...props }, ref) => {
    const { value: selectedValue } = useTabsContext()
    
    if (selectedValue !== value) return null

    return (
        <div
            ref={ref}
            className={cn(
                "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                className
            )}
            {...props} />
    )
})
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }
