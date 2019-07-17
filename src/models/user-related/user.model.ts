export interface MinimalUser {
  username: string;
}

export interface UserLogin extends MinimalUser {
  password: string;
}

export interface UserSignUp extends UserLogin {
  email: string;
}

export interface UserExists {
  exists: boolean;
}



