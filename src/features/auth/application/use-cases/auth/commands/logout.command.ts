export class LogoutCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceId: string,
  ) {}
}
