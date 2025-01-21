import { PagingRequestDto, PaginationResponsePayload } from '../dtos';

export function createPagingResponse(
  pagingDto: PagingRequestDto,
  totalItemsCount: number,
  currentItemsCount: number,
): PaginationResponsePayload {
  const { page: currentPage, limit } = pagingDto;

  const totalPages = Math.ceil(totalItemsCount / limit);

  const prevPage = currentPage - 1 === 0 ? 1 : currentPage - 1;

  const totalShownItemsCount = (currentPage - 1) * limit + currentItemsCount;

  const nextPage =
    totalShownItemsCount <= totalItemsCount ? currentPage : currentPage + 1;

  return {
    currentPage,
    prevPage,
    nextPage,
    totalPages,
    totalShownItemsCount,
    currentItemsCount,
    totalItemsCount,
    limit,
  };
}
