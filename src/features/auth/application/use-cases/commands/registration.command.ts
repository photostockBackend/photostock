import { RegistrationInputModel } from '../../../types/auth-input.models';

export class RegistrationCommand {
  constructor(public readonly userDto: RegistrationInputModel) {}
}
