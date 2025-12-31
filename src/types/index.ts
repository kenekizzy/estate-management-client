export interface User {
    _id: string;
    username: string;
    email: string;
    avatar: string;
    isVerified: boolean;
}

export interface Listing {
    _id: string;
    name: string;
    description: string;
    address: string;
    regularPrice: number;
    discountedPrice?: number;
    bathrooms: number;
    bedrooms: number;
    furnished: boolean;
    parking: boolean;
    type: 'rent' | 'sale';
    offer: boolean;
    imageUrls: string[];
    userRef: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface RootState {
    user: {
        currentUser: User | null;
        error: string | null;
        loading: boolean;
    };
}

export interface FormData {
    username?: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

export interface SearchFilters {
    searchTerm: string;
    type: 'all' | 'rent' | 'sale';
    parking: boolean;
    furnished: boolean;
    offer: boolean;
    sort: string;
    order: 'asc' | 'desc';
}