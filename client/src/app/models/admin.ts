

export interface Admin {
    firstName: string;
    lastName: string;
    email: string;
    password?: string; // Password fields can be populated, if admin tries to update the fields
    confirmPassword?: string; // The server will NEVER return the actual passwords
    oldPassword?: string;
    lastActive: Date;
    created?: Date;
}