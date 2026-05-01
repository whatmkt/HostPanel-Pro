import { Injectable } from '@nestjs/common';

@Injectable()
export class FirewallService {
  getStatus() { return { enabled: true, provider: 'ufw', rules: 8 }; }
  getRules() { return []; }
  addRule(data: any) { return { ...data, id: '1', status: 'active' }; }
  deleteRule(id: string) { return { id, deleted: true }; }
}