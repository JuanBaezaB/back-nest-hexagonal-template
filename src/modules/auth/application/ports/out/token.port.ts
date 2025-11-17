export abstract class TokenPort {
  abstract sign(payload: object): string;
  abstract signAsync(payload: object): Promise<string>;
}
