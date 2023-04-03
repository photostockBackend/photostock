export class ResendEmailCommand {
  constructor(
    public readonly email: string,
    public readonly frontendAdress: string,
  ) {}
}
