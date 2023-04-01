import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  async getPassHash(password: string): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    return await this.generateHash(password, passwordSalt);
  }
  private async generateHash(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }
}
