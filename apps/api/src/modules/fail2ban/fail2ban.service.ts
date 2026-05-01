import { Injectable } from '@nestjs/common';

@Injectable()
export class Fail2banService {
  getStatus() { return { enabled: true, jails: 5, banned: 0 }; }
  getJails() { return []; }
  getBanned() { return []; }
  unban(ip: string) { return { ip, unbanned: true }; }
  banManually(ip: string) { return { ip, banned: true }; }
}