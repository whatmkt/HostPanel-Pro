import type { UUID, ISO8601 } from './common';

export interface FileItem {
  name: string;
  path: string;
  type: 'file' | 'directory' | 'symlink';
  size: number;
  permissions: string;
  owner: string;
  group: string;
  modifiedAt: ISO8601;
  mimeType?: string;
  isHidden: boolean;
}

export interface FileListResult {
  path: string;
  parent: string;
  items: FileItem[];
  totalFiles: number;
  totalDirs: number;
  writable: boolean;
  diskUsage: DiskUsage;
}

export interface DiskUsage {
  totalMb: number;
  usedMb: number;
  freeMb: number;
  percentUsed: number;
}

export interface FileContentResult {
  path: string;
  content: string;
  size: number;
  language?: string;
  readOnly: boolean;
}

export interface FileSearchResult {
  file: string;
  path: string;
  line: number;
  column: number;
  context: string;
}

export interface SaveFileInput {
  path: string;
  content: string;
}

export interface CreateDirectoryInput {
  path: string;
  name: string;
  permissions?: string;
}

export interface RenameInput {
  path: string;
  newName: string;
}

export interface CopyMoveInput {
  source: string;
  destination: string;
}

export interface UploadProgress {
  fileName: string;
  uploaded: number;
  total: number;
  percent: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

export interface CompressInput {
  path: string;
  format: 'zip' | 'tar' | 'tar.gz';
  archiveName: string;
}

export interface ExtractInput {
  archivePath: string;
  destinationPath: string;
}

export interface PermissionsInput {
  path: string;
  permissions: string;
}

export interface ChangeOwnerInput {
  path: string;
  owner: string;
  group: string;
}