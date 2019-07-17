export class RegexUtil {
  static hasUppercaseLetter(inputString: string): boolean {
    const regexPatter = RegExp(/^(?=.*[A-Z]).+$/);
    return regexPatter.test(inputString);
  }

  static hasLowercaseLetter(inputString: string): boolean {
    const regexPatter = RegExp(/^(?=.*[a-z]).+$/);
    return regexPatter.test(inputString);
  }

  static hasSpecialCharOrNumber(inputString: string): boolean {
    const regexPatter = RegExp(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@€?!()}{°;.'#"§$%^&+=0-9])|(?=.*[0-9]).*$/);
    return regexPatter.test(inputString);
  }

  static matchesIPv4Pattern(inputString: string): boolean {
    const regexPatter = RegExp(/^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\.(?!$)|$)){4}$/);
    return regexPatter.test(inputString);
  }

  static getIPv4Pattern() {
    return "^(?:(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(\\.(?!$)|$)){4}$";
  }
}
