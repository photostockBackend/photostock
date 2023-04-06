export class DeleteSessionsExcludeCurrentCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}
