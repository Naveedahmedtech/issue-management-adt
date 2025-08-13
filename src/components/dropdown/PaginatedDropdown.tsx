import React, {useEffect, useRef, useState} from "react";
import {AiOutlineDown, AiOutlineReload} from "react-icons/ai";

interface PaginatedDropdownProps<T> {
  fetchData: (page: number) => Promise<{ data: T[]; hasMore: boolean }>;
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  placeholder?: string;
  selectedItem?: T | null;  // Accept selected item from parent
}

export default function PaginatedDropdown<T>({
  fetchData,
  renderItem,
  onSelect,
  placeholder = "Select an item",
  selectedItem, // Use this to preselect an item
}: PaginatedDropdownProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [open, setOpen] = useState(false);
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
        setItems(result?.data || []);
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
        if (result.data) {
          setItems((prev) => [...prev, ...result.data]);
          setHasMore(result.hasMore);
        }
      } catch (error) {
        console.error("Error fetching more data:", error);
      }
      setLoading(false);
    };

    loadMoreItems();
  }, [page]);

  const handleSelect = (e: React.MouseEvent, item: T) => {
    e.stopPropagation();
    onSelect(item); // Let parent component handle selected item
    setOpen(false);
  };

  return (
    <div className="relative inline-block !z-[100px]" ref={dropdownRef}
    style={{ zIndex: "10" }}
    >
      <button
        className="w-full h-10 px-3.5 rounded-xl border border-border/80 bg-background text-textDark
                   shadow-sm hover:shadow-md transition-shadow
                   hover:bg-backgroundShade2 focus:outline-none focus:ring-2 focus:ring-primary/40
                   flex items-center justify-between text-left"
        type="button"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          setOpen(!open);
        }}
      >
        <span className="truncate">
          {selectedItem ? (
            <span className="inline-flex items-center gap-2">{renderItem(selectedItem)}</span>
          ) : (
            <span className="text-textSecondary">{placeholder}</span>
          )}
        </span>
        <span className="shrink-0 opacity-80">
          {loading ? (
            <AiOutlineReload className="animate-spin" />
          ) : (
            <AiOutlineDown />
          )}
        </span>
      </button>

      {open && (
        <div
          className="absolute mt-2 min-w-full w-[22rem] max-w-[80vw]
                     rounded-xl border border-border/80 bg-white text-textDark shadow-xl !z-[100px]
                     ring-1 ring-black/5 animate-[fadeIn_120ms_ease-out]"
        >
          {/* Top divider accent */}
          <div className="h-[2px] w-full bg-gradient-to-r from-primary/30 via-primary/10 to-transparent rounded-t-xl" />

          <ul className="max-h-60 overflow-auto py-1 custom-scroll">
            {/* Loading skeletons (initial) */}
            {loading && items.length === 0 ? (
              <div className="px-3 py-2 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-7 rounded-md bg-backgroundShade2/80 animate-pulse" />
                ))}
              </div>
            ) : (
              items.map((item, index) => (
                <li
                  key={index}
                  className="px-3.5 py-2 text-sm cursor-pointer
                             hover:bg-background active:bg-backgroundShade2
                             transition-colors rounded-md mx-1 my-0.5 !z-[9999px]"
                  onClick={(e) => handleSelect(e, item)}
                  title={typeof item === "object" ? undefined : String(item)}
                >
                  <div className="min-w-0 truncate">{renderItem(item)}</div>
                </li>
              ))
            )}
          </ul>

          {/* Footer states */}
          {loading && items.length > 0 && (
            <div className="px-3 py-2 text-center text-sm text-primary/90 border-t border-border/70 rounded-b-xl">
              <AiOutlineReload className="inline-block mr-1 animate-spin" />
              Loading…
            </div>
          )}

          {!loading && hasMore && (
            <button
              className="w-full px-3 py-2 text-sm rounded-b-xl
                         hover:bg-backgroundShade2 transition-colors
                         border-t border-border/70 flex items-center justify-center gap-2"
              type="button"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setPage((prev) => prev + 1);
              }}
            >
              <AiOutlineReload className="opacity-80" /> Load more
            </button>
          )}

          {!loading && !hasMore && items.length > 0 && (
            <div className="px-3 py-2 text-center text-xs text-textSecondary border-t border-border/70 rounded-b-xl">
              End of results
            </div>
          )}
        </div>
      )}

      {/* optional: subtle custom scrollbar (Tailwind plugin or global CSS) */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { height: 10px; width: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(100,100,100,0.25); border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  );
}
