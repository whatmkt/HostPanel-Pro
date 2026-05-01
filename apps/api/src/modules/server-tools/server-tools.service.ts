import { Injectable } from '@nestjs/common';

@Injectable()
export class ServerToolsService {
  getServices() { return []; }
  getPhpVersions() { return { installed: ['8.1', '8.2', '8.3'], default: '8.3' }; }
  restartService(name: string) { return { service: name, action: 'restart', status: 'ok' }; }
}