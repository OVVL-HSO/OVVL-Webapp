export interface Token {
  tokenType: string;
  accessToken: string;
}

export interface JwtResponse extends Token {
  username: string;
}
