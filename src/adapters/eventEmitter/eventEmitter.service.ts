import { EventEmitter } from 'events';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventEmitterAdapter {
  private readonly emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  emit(event: string, payload: any) {
    this.emitter.emit(event, payload);
  }
 
  on(event: string, listener: (...args: any[]) => void) {
    this.emitter.on(event, listener);
  }

  removeListener(event: string, listener: (...args: any[]) => void) {
    this.emitter.removeListener(event, listener);
  }
}