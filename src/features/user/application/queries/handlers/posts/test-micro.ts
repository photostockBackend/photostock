import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

export class TestMicro {
  constructor(public id: number) {}
}

@QueryHandler(TestMicro)
export class TestHandler implements IQueryHandler<TestMicro> {
  constructor(
    @Inject('FILES_MICROSERVICE') private readonly client: ClientProxy,
  ) {}
  async execute(query: TestMicro): Promise<any> {
    const f = this.client.send({ role: 'item', cmd: 'get-by-id' }, query.id);
    f.subscribe({
      next(x) {
        console.log('got value ' + x[0].id);
      },
    });
    return;
  }
}
