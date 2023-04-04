export class PassRecoveryCommand {
  constructor(
    public readonly email: string,
    public readonly frontendAddress: string,
  ) {}
}
