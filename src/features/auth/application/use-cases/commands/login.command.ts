export class LoginCommand {
  constructor(
    public readonly userId: number,
    public readonly deviceName: string,
    public readonly ip: string,
  ) {}
}
