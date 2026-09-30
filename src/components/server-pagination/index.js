/**
 * Server-driven list pagination (Programs-style): per-page select + range summary + prev/next + page buttons.
 *
 * - Import `ServerListPerPageControl` + `ServerListPagination` for new screens.
 * - `normalizeServerPaginationMeta()` maps Laravel snake_case or camelCase `meta` to `{ currentPage, lastPage, … }`.
 * - Deprecated: `ProgramsPerPageControl` / `ProgramsPagination` from `src/components/programs/Pagination` re-export the same components.
 */

export * from './server-pagination-meta';

export * from './server-list-pagination';
export * from './server-list-per-page-control';
