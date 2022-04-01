export interface OogyModernCryptoBrowser {
  randomUUID: () => string;
}

export class OogyUUIDBuilder {
  static randomUUID(): string {
    return (window.crypto as unknown as OogyModernCryptoBrowser).randomUUID();
  }
}
