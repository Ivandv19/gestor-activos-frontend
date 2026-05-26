export interface Pagination<T> {
	data: T[];
	pagination: {
		readonly total: number;
		readonly totalPages: number;
		readonly page: number;
		readonly limit: number;
	};
}
