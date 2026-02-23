"use client"

import { Button } from "@/shared/ui/forms/Button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ComprasPaginationProps {
    currentPage: number
    totalPages: number
    count: number
    pageSize: number
    onPageChange: (page: number) => void
}

export default function ComprasPagination({
    currentPage,
    totalPages,
    count,
    pageSize,
    onPageChange
}: ComprasPaginationProps) {
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-6 bg-white border-t border-gray-200">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
                <span>
                    Mostrando {(currentPage - 1) * pageSize + 1} a {Math.min(currentPage * pageSize, count)} de {count} compra{count !== 1 ? 's' : ''}
                </span>
            </div>

            <div className="flex items-center space-x-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Anterior
                </Button>

                {getPageNumbers().map((page) => (
                    <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className={`min-w-[40px] ${
                            currentPage === page 
                                ? "bg-[#0A3981] hover:bg-[#1F509A] text-white" 
                                : "text-gray-700"
                        }`}
                    >
                        {page}
                    </Button>
                ))}

                <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Siguiente
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
        </div>
    )
}

