import React, {useCallback, useEffect, useState} from 'react';
import {useGetAllUsersQuery} from '../../redux/features/authApi.ts';
import UserSelect from './UserSelect.tsx';

interface PaginatedUserSelectProps {
    name: string;
    isMulti?: boolean;
    placeholder?: string;
    roleName?: string;
    className?: string;
    value?: string[];
    onChange?: (value: string[]) => void;
}

const PaginatedUserSelect: React.FC<PaginatedUserSelectProps> = ({
                                                                     name,
                                                                     isMulti = true,
                                                                     placeholder = 'Select users...',
                                                                     roleName,
                                                                     className,
                                                                     value,
                                                                     onChange,
                                                                 }) => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const [userOptions, setUserOptions] = useState<{ label: string; value: string }[]>([]);
    const [hasMore, setHasMore] = useState(true);

    const {data, isFetching} = useGetAllUsersQuery({page, limit, roleName});


    // Handle API data
    useEffect(() => {
        const users = data?.data?.users || [];
        const pagination = data?.data?.pagination;

        if (users.length) {
            const newOptions = users.map((user: any) => ({
                label: user.displayName || user.email || user.id,
                value: user.id,
            }));

            const merged = [...userOptions, ...newOptions];
            const unique = Array.from(new Map(merged.map((item) => [item.value, item])).values());

            setUserOptions(unique);

            if (pagination && (pagination.page * pagination.limit >= pagination.total)) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
    }, [data, userOptions, data?.data?.pagination]);


    // Reset when role filter changes
    useEffect(() => {
        setPage(1);
        setUserOptions([]);
        setHasMore(true);
    }, [roleName]);

    const handleLoadMore = useCallback(() => {
        if (!isFetching && hasMore) {
            setPage((prev) => prev + 1);
        }
    }, [isFetching, hasMore]);


    console.log({value, userOptions, data})


    return (
        <UserSelect
            name={name}
            value={value}
            onChange={(val) => onChange?.(val as string[])}
            options={userOptions}
            placeholder={placeholder}
            className={className}
            isMulti={isMulti}
            isLoading={isFetching}
            onMenuScrollToBottom={handleLoadMore}
            hasMoreOptions={hasMore}
        />
    );
};

export default PaginatedUserSelect;
