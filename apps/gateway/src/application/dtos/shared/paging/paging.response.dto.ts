export class PaginationResponsePayload {
  currentPage: number; // Taken from Query object

  prevPage: number; // currentPage - 1 === 0 ? 1 : currentPage -1

  nextPage: number; // (currentPage - 1) * limit + currentItemsCount <= totalItemsCount ? currentPage : currentPage + 1

  totalPages: number; // totalItemsCount / limit

  totalShownItemsCount: number; // (currentPage - 1) * limit + currentItemsCount

  currentItemsCount: number; // Items count

  totalItemsCount: number; // Returned from service

  limit: number; // Taken from Query object
}

export class PagingResponseDto {
  pagination: PaginationResponsePayload;
}
