export class CreateNewPairTokensCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
    public readonly ip: string,
    public readonly issuedAt: number,
  ) {}
}
