import { formatDate } from '@/utils/date';
import { ColumnDef } from '@tanstack/table-core';
import { useTranslation } from 'react-i18next';

export function useXqaTableColumns() {
  const { t } = useTranslation('translation', {
    keyPrefix: 'knowledgeDetails',
  });

  const columns: ColumnDef<IDocumentInfo>[] = [
    {
      accessorKey: 'question',
      header: t('xqa_question'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('question')}</div>
      ),
    },
    {
      accessorKey: 'answer',
      header: t('xqa_answer'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('answer')}</div>
      ),
    },
    {
      accessorKey: 'docnm_kwd',
      header: t('xqa_docnm'),
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('docnm_kwd')}</div>
      ),
    },
    {
      accessorKey: 'create_time',
      header: t('created'),
      cell: ({ row }) => (
        <div className="capitalize">
          {formatDate(row.getValue('create_time'))}
        </div>
      ),
    },
  ];

  return columns;
}
