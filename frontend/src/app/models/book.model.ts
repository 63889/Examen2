export interface Book{
    isbn: string,
    title: string,
    description: string | null,
    pub_date: string | null,
    page_count: number | null,
    thumbnail: string | null,
    search_info: string | null,
    authors: string[] | null,
    categories: string[] | null,
    reviews: Array<any | null>,
    total_digital_licenses: number | null,
    digital_licenses_left: number | null,
    is_active: boolean,
}

// interface Review{
//     authors_name: string,
//     authors_email: string,
//     stars: number | null,
//     explanation: string | null,
// }