import { Injectable } from '@nestjs/common';
// import { TRANSCODE_QUEUE } from './constants';
// import { Queue } from 'bull';

@Injectable()
export class AppService {
  // constructor(
  //   @Inject(TRANSCODE_QUEUE) private readonly transcodeQueue: Queue,
  // ) {}

  // async transcode() {
  //   await this.transcodeQueue.add({});
  // }

  getHello(): string {
    return 'Hello World!';
  }
}
