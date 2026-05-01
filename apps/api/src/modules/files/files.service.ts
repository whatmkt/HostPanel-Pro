import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class FilesService {
  constructor(private prisma: PrismaService) {}
  async getTree(domainId: string, path: string) {
    return { path, files: [], directories: [] };
  }
  async readFile(domainId: string, path: string) { return { content: '' }; }
  async writeFile(domainId: string, path: string, content: string) { return { success: true }; }
  async deleteFile(domainId: string, path: string) { return { success: true }; }
  async createDirectory(domainId: string, path: string) { return { success: true }; }
  async deleteDirectory(domainId: string, path: string) { return { success: true }; }
  async rename(domainId: string, oldPath: string, newPath: string) { return { success: true }; }
  async copy(domainId: string, src: string, dest: string) { return { success: true }; }
  async move(domainId: string, src: string, dest: string) { return { success: true }; }
  async compress(domainId: string, path: string, format: 'zip' | 'tar') { return { jobId: 'mock' }; }
  async extract(domainId: string, archivePath: string) { return { jobId: 'mock' }; }
  async chmod(domainId: string, path: string, mode: string) { return { success: true }; }
  async search(domainId: string, query: string) { return { results: [] }; }
}