import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { doc, getDoc } from 'firebase/firestore'
import nodemailer from 'nodemailer'

import { db } from '../firebase/config.js'
import { formatDateTime } from './datetime.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function sendEmail(options) {
  const configRef = doc(db, 'system', 'configuration')
  const configSnap = await getDoc(configRef)

  if (configSnap.exists()) {
    const configData = configSnap.data()

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configData.systemEmail,
        pass: configData.systemEmailPw
      }
    })

    const mailOptions = {
      from: configData.systemEmail,
      ...options
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        // console.error("Error sending email:", error);
      } else {
        // console.log("Email sent:", info.response);
      }
    })
  }
}

function readHtmlTemplate(templateName, replacements) {
  const templatePath = path.join(__dirname, 'template', templateName)
  let htmlContent = fs.readFileSync(templatePath, 'utf-8')

  for (const key in replacements) {
    const placeholder = `{{${key}}}`
    htmlContent = htmlContent.replace(
      new RegExp(placeholder, 'g'),
      replacements[key]
    )
  }

  return htmlContent
}

export async function sendOTPEmail(email, otp) {
  const htmlContent = readHtmlTemplate('otp-student.html', { code: otp })

  const mailOptions = {
    to: email,
    subject: 'HUTECH Checkins: Mã xác thực cho sinh viên',
    html: htmlContent
  }

  await sendEmail(mailOptions)
}

export async function sendOTPVerifyEmail(studentId, email, otp) {
  const htmlContent = readHtmlTemplate('otp-verify-email.html', {
    studentId,
    code: otp
  })

  const mailOptions = {
    to: email,
    subject: 'HUTECH: Mã xác nhận email cho tài khoản sinh viên',
    html: htmlContent
  }

  await sendEmail(mailOptions)
}

export async function sendEmailEventReminder(email, event) {
  const htmlContent = readHtmlTemplate('event-reminder.html', {
    eventName: event.title,
    eventDate: formatDateTime(event.date, 'lúc'),
    eventRoom: event.room,
    eventPoster: event.poster
      ? event.poster
      : 'https://hutechcheckad.web.app/images/poster_event_default.jpg',
    eventSummary: event.summary ? event.summary : ''
  })

  const mailOptions = {
    to: email,
    subject: 'HUTECH Checkins: Nhắc nhở tham dự sự kiện',
    html: htmlContent
  }

  await sendEmail(mailOptions)
}

export async function sendEmailCheckin(email, eventName, studentName) {
  const htmlContent = readHtmlTemplate('thank-you-checkin.html', {
    studentName,
    eventName
  })

  const mailOptions = {
    to: email,
    subject: 'HUTECH Checkins: Cảm ơn bạn đã tham dự sự kiện',
    html: htmlContent
  }

  await sendEmail(mailOptions)
}
