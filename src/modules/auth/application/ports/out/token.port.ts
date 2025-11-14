export abstract class TokenPort {
  abstract sign(payload: object): string;
}
