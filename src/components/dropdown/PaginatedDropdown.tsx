import React, { useState, useEffect, useRef } from "react";
import { AiOutlineDown, AiOutlineReload } from "react-icons/ai"; // Reload icon for spinning effect

interface PaginatedDropdownProps<T> {
    fetchData: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
    renderItem: (item: T) => React.ReactNode;
    onSelect: (item: T) => void;
    placeholder?: string;
}

export default function PaginatedDropdown<T>({
    fetchData,
    renderItem,
    onSelect,
    placeholder = "Select an item",
}: PaginatedDropdownProps<T>) {
    const [items, setItems] = useState<T[]>([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<T | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // **Close dropdown when clicking outside**
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open]);

    // **Fetch Data when Dropdown Opens (Initial Load)**
    useEffect(() => {
        if (!open) return;

        const loadInitialItems = async () => {
            setLoading(true);
            try {
                const result = await fetchData(1);
                setItems(result.data);
                setHasMore(result.hasMore);
                setPage(2);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
            setLoading(false);
        };

        loadInitialItems();
    }, [open]);

    // **Load More Data on Pagination**
    useEffect(() => {
        if (!open || page === 1) return;

        const loadMoreItems = async () => {
            setLoading(true);
            try {
                const result = await fetchData(page);
                setItems((prev) => [...prev, ...result.data]);
                setHasMore(result.hasMore);
            } catch (error) {
                console.error("Error fetching more data:", error);
            }
            setLoading(false);
        };

        loadMoreItems();
    }, [page]);

    const handleSelect = (e: React.MouseEvent, item: T) => {
        e.stopPropagation();
        setSelectedItem(item);
        onSelect(item);
        setOpen(false);
    };

    return (
        <div className="relative w-64" ref={dropdownRef}>
            <button
                className="w-full flex justify-between items-center border border-border p-3 rounded-lg bg-background shadow-md text-text transition-all"
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setOpen(!open)
                }}
            >
                {selectedItem ? renderItem(selectedItem) : placeholder}
                {loading ? (
                    <AiOutlineReload className="animate-spin text-textSecondary" />
                ) : (
                    <AiOutlineDown className="text-textSecondary" />
                )}
            </button>

            {open && (
                <div
                    className="absolute mt-2 w-full max-h-60 overflow-auto border border-border rounded-lg shadow-lg bg-backgroundShade1 text-textSecondary transition-all animate-fadeIn z-50"
                >
                    <ul>
                        {loading && items.length === 0 ? (
                            <div className="p-3 space-y-2">
                                {[1, 2, 3].map((_, i) => (
                                    <div key={i} className="h-6 bg-backgroundShade2 animate-pulse rounded"></div>
                                ))}
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <li
                                    key={index}
                                    className="p-3 text-text hover:bg-primary cursor-pointer transition-all"
                                    onClick={(e) => handleSelect(e, item)}
                                >
                                    {renderItem(item)}
                                </li>
                            ))
                        )}
                    </ul>

                    {loading && items.length > 0 && (
                        <div className="p-3 flex justify-center text-primary">Loading..</div>
                    )}

                    {!loading && hasMore && (
                        <button
                            className="w-full text-textHover p-3 border-t border-border bg-backgroundShade2 hover:bg-primary transition-all flex justify-center items-center gap-2"
                            onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                setPage((prev) => prev + 1)
                            }}
                        >
                            <AiOutlineReload className="animate-spin" /> Load More
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
