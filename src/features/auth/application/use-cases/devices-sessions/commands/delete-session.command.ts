export class DeleteSessionCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}
