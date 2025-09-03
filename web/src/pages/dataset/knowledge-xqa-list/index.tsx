import React from 'react';

import ListFilterBar from '@/components/list-filter-bar';
import { useFetchNextKnowledgeXqaItems } from '@/hooks/knowledge-xqa-hooks';
import { useRowSelection } from '@/hooks/logic-hooks/use-row-selection';
import { useTranslation } from 'react-i18next';
import { KnowledgeXqaTable } from './xqa-table';

const KnowledgeXqaList: React.FC = () => {
  const { t } = useTranslation();

  const {
    loading,
    searchString,
    items,
    pagination,
    handleInputChange,
    setPagination,
  } = useFetchNextKnowledgeXqaItems();

  const showFilter = false;

  const { rowSelection, rowSelectionIsEmpty, setRowSelection, selectedCount } =
    useRowSelection();
  return (
    <section className="p-5 min-w-[880px]">
      <ListFilterBar
        title="KnowledgeXqa"
        onSearchChange={handleInputChange}
        searchString={searchString}
        showFilter={showFilter}
        leftPanel={
          <div className="items-start">
            <div className="pb-1">{t('knowledgeDetails.knowledgeXqa')}</div>
          </div>
        }
      ></ListFilterBar>
      <KnowledgeXqaTable
        items={items}
        pagination={pagination}
        setPagination={setPagination}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        loading={loading}
      ></KnowledgeXqaTable>
    </section>
  );
};

export default KnowledgeXqaList;
