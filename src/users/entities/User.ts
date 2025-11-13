import * as bcrypt from 'bcrypt';
import { UserRole } from '../value-objects/UserRole';

export class User {
  id: number;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;

  constructor(userData: Partial<User> & { role?: string | UserRole }) {
    Object.assign(this, userData);
    if (typeof userData.role === 'string') {
      this.role = UserRole.fromString(userData.role);
    }
  }

  public async comparePassword(plainTextPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, this.password);
  }

  public async setPassword(plainTextPassword: string): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(plainTextPassword, saltRounds);
  }

  public isSelf(targetUserId: number): boolean {
    return this.id == Number(targetUserId);
  }

  public canModifyArticle(targetUserId: number): boolean {
    return this.isAdmin() || this.isSelf(targetUserId);
  }

  public canDelete(userToDelete: User): boolean {
    return (
      (this.isAdmin() && !userToDelete.isAdmin()) ||
      this.isSelf(userToDelete.id)
    );
  }

  public isAdmin(): boolean {
    return this.role.isAdmin();
  }

  public promoteToAdmin(): void {
    this.role = UserRole.createAdmin();
  }

  public getData(): Omit<User, 'password'> {
    const { password, ...userData } = this;
    return userData as Omit<User, 'password'>;
  }

  public static async create(data: {
    email: string;
    password: string;
  }): Promise<User> {
    const user = new User({
      email: data.email,
      role: UserRole.createUser(),
    });
    await user.setPassword(data.password);
    return user;
  }
}
