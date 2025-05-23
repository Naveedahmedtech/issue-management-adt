import React, { useCallback, useEffect, useState } from 'react';
import { useGetAllUsersQuery } from '../../redux/features/authApi.ts';
import UserSelect from './UserSelect.tsx';

interface Option { label: string; value: string }

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

  const [userOptions, setUserOptions] = useState<Option[]>([]);
  const [hasMore, setHasMore] = useState(true);

  // Ensure fresh fetch on mount/arg change
  const { data, isFetching } = useGetAllUsersQuery(
    { page, limit, roleName },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    if (!data?.data) {
      setHasMore(false);
      return;
    }

    const { users, pagination } = data.data;
    const newOptions: Option[] = users.map((user: any) => ({
      label: user.displayName || user.email || user.id,
      value: user.id,
    }));

    setUserOptions(prev => {
      // Merge or replace
      const combined = page === 1 ? newOptions : [...prev, ...newOptions];
      // De-dupe by `value`
      const deduped = Array.from(
        new Map<string, Option>(
          combined.map(opt => [opt.value, opt])
        ).values()
      );
      return deduped;
    });

    setHasMore(pagination.page * pagination.limit < pagination.total);
  }, [data, page]);

  // Reset on role change
  useEffect(() => {
    setPage(1);
    setUserOptions([]);
    setHasMore(true);
  }, [roleName]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isFetching, hasMore]);

  return (
    <UserSelect
      name={name}
      value={value}
      onChange={val => onChange?.(val as string[])}
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
