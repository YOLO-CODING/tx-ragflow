import { IKnowledge, IKnowledgeXqa } from '@/interfaces/database/knowledge';
import i18n from '@/locales/config';
import kbService, {
  listKnowledgeXqa,
  removeAllKnowledgeXqa,
} from '@/services/knowledge-service';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { useCallback } from 'react';
import { useParams, useSearchParams } from 'umi';
import {
  useGetPaginationWithRouter,
  useHandleSearchChange,
} from './logic-hooks';
import { useGetKnowledgeSearchParams } from './route-hook';

export const useKnowledgeBaseId = (): string => {
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const knowledgeBaseId = searchParams.get('id') || id;

  return knowledgeBaseId || '';
};

export const useFetchKnowledgeBaseConfiguration = () => {
  const knowledgeBaseId = useKnowledgeBaseId();

  const { data, isFetching: loading } = useQuery<IKnowledge>({
    queryKey: ['fetchKnowledgeDetail'],
    initialData: {} as IKnowledge,
    gcTime: 0,
    queryFn: async () => {
      const { data } = await kbService.get_kb_detail({
        kb_id: knowledgeBaseId,
      });
      return data?.data ?? {};
    },
  });

  return { data, loading };
};

export function useFetchNextKnowledgeXqaItems() {
  const { knowledgeId } = useGetKnowledgeSearchParams();
  const { searchString, handleInputChange } = useHandleSearchChange();
  const { pagination, setPagination } = useGetPaginationWithRouter();
  const { id } = useParams();

  const { data, isFetching: loading } = useQuery<{
    items: IKnowledgeXqa[];
    total: number;
  }>({
    queryKey: ['fetchKnowledgeXqaList', searchString, pagination],
    initialData: { items: [], total: 0 },
    // enabled: !!knowledgeId || !!id,
    queryFn: async () => {
      const { data } = await listKnowledgeXqa({
        kb_id: knowledgeId || id,
        keywords: searchString,
        page_size: pagination.pageSize,
        page: pagination.current,
      });
      return data?.data ?? {};
    },
  });

  const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
    (e) => {
      setPagination({ page: 1 });
      handleInputChange(e);
    },
    [handleInputChange, setPagination],
  );

  return {
    loading,
    searchString,
    items: data.items,
    pagination: { ...pagination, total: data?.total },
    handleInputChange: onInputChange,
    setPagination,
  };
}

// export function useFetchNextKnowledgeXqaItems() {
//   const { knowledgeId } = useKnowledgeBaseId();
//   const { searchString, handleInputChange } = useHandleSearchChange();
//   const { pagination, setPagination } = useGetPaginationWithRouter();
//   const { id } = useParams();
//   const debouncedSearchString = useDebounce(searchString, { wait: 500 });

//   const { data, isFetching: loading } = useQuery<{
//     items: IKnowledgeXqa[];
//     total: number;
//   }>({
//     queryKey: [
//       "fetchKnowledgeXqaList",
//       debouncedSearchString,
//       pagination
//     ],
//     initialData: { items: [], total: 0 },
//     // enabled: !!knowledgeId || !!id,
//     queryFn: async () => {
//       const { data } = await listKnowledgeXqa(
//         {
//           kb_id: knowledgeId || id,
//           keywords: debouncedSearchString,
//           page_size: pagination.pageSize,
//           page: pagination.current,
//         }
//       );
//       return data?.data ?? {}
//     },
//   });

//   const onInputChange: React.ChangeEventHandler<HTMLInputElement> = useCallback(
//     (e) => {
//       setPagination({ page: 1 });
//       handleInputChange(e);
//     },
//     [handleInputChange, setPagination],
//   );

//   return {
//     loading,
//     searchString,
//     items: data.items,
//     pagination: { ...pagination, total: data?.total },
//     handleInputChange: onInputChange,
//     setPagination,
//   };
// };

export const useRemoveAllKnowledgeXqa = () => {
  const knowledgeBaseId = useKnowledgeBaseId();

  const queryClient = useQueryClient();
  const {
    data,
    isPending: loading,
    mutateAsync,
  } = useMutation({
    mutationKey: ['removeAllKnowledgeXqa'],
    mutationFn: async () => {
      const { data } = await removeAllKnowledgeXqa(knowledgeBaseId);
      if (data.code === 0) {
        message.success(i18n.t(`message.deleted`));
        queryClient.invalidateQueries({
          queryKey: ['fetchKnowledgeXqaList'],
        });
      }
      return data?.code;
    },
  });

  return { data, loading, removeKnowledgeGraph: mutateAsync };
};
