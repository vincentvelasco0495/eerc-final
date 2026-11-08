import { useState, useEffect, useCallback } from 'react';

export function usePageRowSelection(rows = []) {
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const visibleIds = new Set((rows ?? []).map((row) => row?.id).filter(Boolean));
    setSelectedIds((current) => {
      const next = current.filter((id) => visibleIds.has(id));
      return next.length === current.length ? current : next;
    });
  }, [rows]);

  const toggleRow = useCallback((rowId) => {
    setSelectedIds((current) =>
      current.includes(rowId) ? current.filter((id) => id !== rowId) : [...current, rowId]
    );
  }, []);

  const toggleAll = useCallback(
    (checked) => {
      setSelectedIds(checked ? (rows ?? []).map((row) => row.id).filter(Boolean) : []);
    },
    [rows]
  );

  return { selectedIds, setSelectedIds, toggleRow, toggleAll };
}

export async function deleteSelectedRows(rows, deleteRow) {
  let deleted = 0;
  const deletedIds = [];
  let lastError = null;

  for (const row of rows) {
    try {
      await deleteRow(row);
      deleted += 1;
      deletedIds.push(row.id);
    } catch (error) {
      lastError = error;
    }
  }

  return { deleted, failed: rows.length - deleted, deletedIds, lastError };
}
