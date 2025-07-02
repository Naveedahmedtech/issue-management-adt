import Pagination from "./Pagination";

interface PaginatedCardListProps<T> {
    data: T[];
    renderCard: (item: T) => React.ReactNode;
    totalPages: number;
    currentPage: number;
    onPageChange?: (page: number) => void;
}

const PaginatedCardList = <T,>({ data, renderCard, totalPages, currentPage, onPageChange }: PaginatedCardListProps<T>) => {
    return (
        <div>
            <div className="grid grid-cols-1 gap-2">
                {data.map((item) => renderCard(item))}
            </div>
            {
                onPageChange &&
                <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={onPageChange} />
            }
        </div>
    );
};

export default PaginatedCardList;
