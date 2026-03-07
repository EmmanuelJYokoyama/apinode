export interface User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: 'USER' | 'ADMIN';
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

