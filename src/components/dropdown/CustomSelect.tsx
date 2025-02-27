import React, { useState, useEffect, useRef, useCallback } from "react";

interface Option {
    [key: string]: string;
}

interface FetchOptionsParams {
    page: number;
    limit: number;
}

interface CustomSelectProps {
    selectedOption: Option | null;
    setSelectedOption: (option: Option) => void;
    fetchOptions: (params: FetchOptionsParams) => Promise<Option[]>;
    labelKey?: string;
    valueKey?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ selectedOption, setSelectedOption, fetchOptions, labelKey = "label", valueKey = "value" }) => {
    const [options, setOptions] = useState<Option[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && options.length === 0) {
            loadMoreOptions();
        }
    }, [isOpen]);

    const loadMoreOptions = useCallback(async () => {
        if (!hasMore || isFetching) return;

        setIsFetching(true);
        try {
            const newOptions = await fetchOptions({ page: currentPage, limit: 5 });
            if (newOptions.length === 0) {
                setHasMore(false);
            } else {
                setOptions((prevOptions) => [...prevOptions, ...newOptions]);
                setCurrentPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error("Error fetching options:", error);
        } finally {
            setIsFetching(false);
        }
    }, [currentPage, hasMore, fetchOptions, isFetching]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 10) {
            loadMoreOptions();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="border p-2 w-full text-left"
                onClick={() => setIsOpen((prev) => !prev)}
            >
                {selectedOption ? selectedOption[labelKey] : "Select an option"}
            </button>

            {isOpen && (
                <div
                    className="absolute w-full border bg-white max-h-60 overflow-auto"
                    onScroll={handleScroll}
                >
                    {options.map((option) => (
                        <div
                            key={option[valueKey]}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                                setSelectedOption(option);
                                setIsOpen(false);
                            }}
                        >
                            {option[labelKey]}
                        </div>
                    ))}
                    {isFetching && <div className="p-2 text-center">Loading...</div>}
                    {!hasMore && <div className="p-2 text-center text-gray-500">No more options</div>}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
