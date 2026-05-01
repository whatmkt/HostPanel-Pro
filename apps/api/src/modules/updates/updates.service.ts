import { Injectable } from '@nestjs/common';

@Injectable()
export class UpdatesService {
  getPanelVersion() { return { version: '1.0.0', channel: 'stable', build: '2026.04.30' }; }
  getUpdateHistory() { return []; }
  async checkUpdates() { return { available: false, updates: [] }; }
}