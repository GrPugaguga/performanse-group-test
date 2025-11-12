export class UserRole {
    private readonly _value: 'user' | 'admin';

    private constructor(value: 'user' | 'admin') {
        this._value = value;
    }

    public static createAdmin(): UserRole {
        return new UserRole('admin');
    }

    public static createUser(): UserRole {
        return new UserRole('user');
    }

    public static fromString(roleString: string): UserRole {
        if (roleString === 'admin') {
            return UserRole.createAdmin();
        }
        if (roleString === 'user') {
            return UserRole.createUser();
        }
        throw new Error(`Invalid user role string: ${roleString}`);
    }

    public isAdmin(): boolean {
        return this._value === 'admin';
    }

    public equals(other: UserRole): boolean {
        return this._value === other._value;
    }

    public toString(): 'user' | 'admin' {
        return this._value;
    }
}