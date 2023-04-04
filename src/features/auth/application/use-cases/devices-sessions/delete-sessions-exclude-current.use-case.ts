/*@CommandHandler(DeleteSessionsExcludeCurrentCommand)
export class DeleteSessionsExcludeCurrentUseCase
  implements ICommandHandler<DeleteSessionsExcludeCurrentCommand>
{
  constructor(
    private refreshTokenMetasRepository: RefreshTokenMetasRepository,
  ) {}

  async execute(
    command: DeleteSessionsExcludeCurrentCommand,
  ): Promise<boolean> {
    const { userId, deviceId } = command;
    return await this.refreshTokenMetasRepository.deleteAllExceptCurrent(
      userId,
      deviceId,
    );
  }
}*/
