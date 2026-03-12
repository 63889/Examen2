export interface User {
    first_name: string;
    last_name: string;
    email?: string;
    password?: string;
    role?: string;
    profile_picture_url?: string;
    isEditing?: boolean;
    editData?: any;
}


