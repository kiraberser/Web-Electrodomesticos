"use client";

import * as React from "react";

export function Checkbox({ id, checked, onCheckedChange }) {
    return (
        <div className="flex items-center space-x-2">
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={(e) => onCheckedChange(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
        </div>
    );
}
