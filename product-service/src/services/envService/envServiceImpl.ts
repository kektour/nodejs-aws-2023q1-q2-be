import { EnvService } from './envService';

export class EnvServiceImpl implements EnvService {
  public getVar(value: string): string {
    const envVar = process.env[value];
    if (!envVar) {
      throw new Error(`Process env var missing: ${value}`);
    }

    return envVar;
  }
}
