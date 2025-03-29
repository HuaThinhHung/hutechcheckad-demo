import otpGenerator from 'otp-generator'

export function generateOTP() {
  const otp = otpGenerator.generate(Math.floor(Math.random() * 55) + 10, {
    digits: true,
    lowerCaseAlphabets: true,
    upperCaseAlphabets: true,
    specialChars: true
  })

  return otp
}
