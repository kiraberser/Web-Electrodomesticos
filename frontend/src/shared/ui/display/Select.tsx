import * as React from "react"
import { Check, ChevronDown, ChevronUp } from "lucide-react"

import { cn } from "@/shared/lib/utils"

interface SelectContextValue {
    value: string
    onValueChange: (value: string) => void
    open: boolean
    setOpen: (open: boolean) => void
}

const SelectContext = React.createContext<SelectContextValue | undefined>(undefined)

const useSelectContext = () => {
    const context = React.useContext(SelectContext)
    if (!context) {
        throw new Error("Select components must be used within Select")
    }
    return context
}

interface SelectProps {
    value?: string
    defaultValue?: string
    onValueChange?: (value: string) => void
    children: React.ReactNode
}

const Select = ({ value: controlledValue, defaultValue, onValueChange, children }: SelectProps) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue || "")
    const [open, setOpen] = React.useState(false)
    
    const value = controlledValue !== undefined ? controlledValue : internalValue
    
    const handleValueChange = (newValue: string) => {
        if (controlledValue === undefined) {
            setInternalValue(newValue)
        }
        onValueChange?.(newValue)
        setOpen(false)
    }

    return (
        <SelectContext.Provider value={{ value, onValueChange: handleValueChange, open, setOpen }}>
            {children}
        </SelectContext.Provider>
    )
}

const SelectGroup = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div {...props}>{children}</div>
)

const SelectValue = ({ placeholder, ...props }: { placeholder?: string } & React.HTMLAttributes<HTMLSpanElement>) => {
    const { value } = useSelectContext()
    return <span {...props}>{value || placeholder}</span>
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, children, ...props }, ref) => {
        const { open, setOpen } = useSelectContext()
        return (
            <button
                ref={ref}
                type="button"
                onClick={() => setOpen(!open)}
                className={cn(
                    "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    className
                )}
                {...props}>
                {children}
                <ChevronDown className="h-4 w-4 opacity-50" />
            </button>
        )
    }
)
SelectTrigger.displayName = "SelectTrigger"

const SelectScrollUpButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cn("flex cursor-default items-center justify-center py-1", className)}
            {...props}>
            <ChevronUp className="h-4 w-4" />
        </button>
    )
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

const SelectScrollDownButton = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ className, ...props }, ref) => (
        <button
            ref={ref}
            type="button"
            className={cn("flex cursor-default items-center justify-center py-1", className)}
            {...props}>
            <ChevronDown className="h-4 w-4" />
        </button>
    )
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"

const SelectContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { position?: "popper" | "item-aligned" }>(
    ({ className, children, position = "popper", ...props }, ref) => {
        const { open, setOpen } = useSelectContext()
        const contentRef = React.useRef<HTMLDivElement>(null)

        React.useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (contentRef.current && !contentRef.current.contains(event.target as Node)) {
                    setOpen(false)
                }
            }

            if (open) {
                document.addEventListener("mousedown", handleClickOutside)
                return () => document.removeEventListener("mousedown", handleClickOutside)
            }
        }, [open, setOpen])

        if (!open) return null

        return (
            <div
                ref={contentRef}
                className={cn(
                    "relative z-50 max-h-96 min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95",
                    className
                )}
                {...props}>
                <SelectScrollUpButton />
                <div className="p-1">
                    {children}
                </div>
                <SelectScrollDownButton />
            </div>
        )
    }
)
SelectContent.displayName = "SelectContent"

const SelectLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
    ({ className, ...props }, ref) => (
        <label
            ref={ref}
            className={cn("px-2 py-1.5 text-sm font-semibold", className)}
            {...props} />
    )
)
SelectLabel.displayName = "SelectLabel"

const SelectItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement> & { value: string }>(
    ({ className, children, value, ...props }, ref) => {
        const { value: selectedValue, onValueChange } = useSelectContext()
        const isSelected = selectedValue === value

        return (
            <div
                ref={ref}
                onClick={() => onValueChange(value)}
                className={cn(
                    "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                    isSelected && "bg-accent text-accent-foreground",
                    className
                )}
                {...props}>
                <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                    {isSelected && <Check className="h-4 w-4" />}
                </span>
                {children}
            </div>
        )
    }
)
SelectItem.displayName = "SelectItem"

const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (
        <div
            ref={ref}
            className={cn("-mx-1 my-1 h-px bg-muted", className)}
            {...props} />
    )
)
SelectSeparator.displayName = "SelectSeparator"

export {
    Select,
    SelectGroup,
    SelectValue,
    SelectTrigger,
    SelectContent,
    SelectLabel,
    SelectItem,
    SelectSeparator,
    SelectScrollUpButton,
    SelectScrollDownButton,
}
