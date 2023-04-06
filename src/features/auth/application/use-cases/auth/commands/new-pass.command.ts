import { NewPasswordInputModel } from '../../../../types/auth-input.models';

export class NewPassCommand {
  constructor(public readonly newPassDto: NewPasswordInputModel) {}
}
