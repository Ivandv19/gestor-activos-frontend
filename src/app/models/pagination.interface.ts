export interface Pagination<T> {
	data: T[];
	pagination: {
		total: number;
		totalPages: number;
		page: number;
		limit: number;
	};
}
