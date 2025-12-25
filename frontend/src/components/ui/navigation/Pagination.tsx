"use client"

import { Button } from "@/components/ui/forms/Button"
import { useAdminTheme } from "@/components/admin/hooks/useAdminTheme"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

interface PaginationProps {
    currentPage: number
    totalPages: number
    count?: number
    pageSize?: number
    onPageChange: (page: number) => void
    hrefForPage?: (page: number) => string
}

export default function Pagination({ currentPage, totalPages, count, pageSize = 10, onPageChange, hrefForPage }: PaginationProps) {
    const { dark } = useAdminTheme()
    if (totalPages <= 1) return null

    const goToPage = (page: number) => {
        onPageChange(Math.max(1, Math.min(page, totalPages)))
    }

    const goToPreviousPage = () => {
        onPageChange(Math.max(1, currentPage - 1))
    }

    const goToNextPage = () => {
        onPageChange(Math.min(totalPages, currentPage + 1))
    }

    const getPageNumbers = () => {
        const pages: number[] = []
        const maxVisiblePages = 5
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i)
        }
        return pages
    }

    return (
        <div className={`flex items-center justify-between px-6 py-4 ${dark ? "border-t border-white/10" : "bg-white border-t border-gray-200"}`}>
            <div className={`flex items-center space-x-2 text-sm ${dark ? "text-gray-300" : "text-gray-700"}`}>
                {typeof count === 'number' && (
                    <span>
                        Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, count)} de {count} resultado{count !== 1 ? 's' : ''}
                    </span>
                )}
            </div>

            <div className="flex items-center space-x-2">
                {hrefForPage ? (
                    <Link prefetch href={hrefForPage(Math.max(1, currentPage - 1))} aria-disabled={currentPage === 1} className="cursor-pointer">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === 1}
                            className={`disabled:opacity-50 ${dark ? "text-gray-300" : "text-gray-700"}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Anterior
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={`disabled:opacity-50 disabled:cursor-not-allowed ${dark ? "text-gray-300" : "text-gray-700"}`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Anterior
                    </Button>
                )}

                {getPageNumbers().map((page) => (
                    hrefForPage ? (
                        <Link prefetch key={page} href={hrefForPage(page)} className="cursor-pointer">
                            <Button
                                variant={currentPage === page ? "default" : "ghost"}
                                size="sm"
                                className="min-w-[40px]"
                            >
                                {page}
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            key={page}
                            variant={currentPage === page ? "default" : "ghost"}
                            size="sm"
                            onClick={() => goToPage(page)}
                            className={`cursor-pointer min-w-[40px] ${dark ? "text-gray-300" : "text-gray-700"}`}
                        >
                            {page}
                        </Button>
                    )
                ))}

                {hrefForPage ? (
                    <Link prefetch href={hrefForPage(Math.min(totalPages, currentPage + 1))} aria-disabled={currentPage === totalPages} className="cursor-pointer">
                        <Button
                            variant="ghost"
                            size="sm"
                            disabled={currentPage === totalPages}
                            className={`disabled:opacity-50 cursor-pointer ${dark ? "text-gray-300" : "text-gray-700"}`}
                        >
                            Siguiente
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </Link>
                ) : (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={`cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${dark ? "text-gray-300" : "text-gray-700"}`}
                    >
                        Siguiente
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                )}
            </div>
        </div>
    )
}

