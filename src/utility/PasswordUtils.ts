import {PasswordSetForm} from "@/screens/ProfileSetting/Panel/SecurityPanel/SecurityPanel.tsx";

const invalidPasswordText = 'Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character'

export class PasswordUtils {
  static validatePassword(password: string) {
    const isValidPassword = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[^\s\t]{8,}$/.test(password)

    return isValidPassword
      ? null
      : invalidPasswordText
  }

  static validateConfirmPassword(password: string, values: PasswordSetForm) {
    if (password !== values.newPassword) {
      return 'Passwords did not match'
    } else {
      return null
    }
  }
}

