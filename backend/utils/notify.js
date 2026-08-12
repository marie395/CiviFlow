import nodemailer from "nodemailer";
import AfricasTalking from "africastalking";
import Notification from "../models/Notification.js";

let transporter;
const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  }
  return transporter;
};

let atSms;
const getAfricasTalkingSMS = () => {
  if (!atSms) {
    const at = AfricasTalking({
      apiKey: process.env.AT_API_KEY,
      username: process.env.AT_USERNAME, // "sandbox" en mode test
    });
    atSms = at.SMS;
  }
  return atSms;
};

/**
 * Envoie un email de notification. Échec silencieux journalisé (n'interrompt jamais la requête HTTP).
 */
const sendEmail = async (to, subject, message) => {
  try {
    await getTransporter().sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text: message,
      html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
    });
    return { ok: true };
  } catch (error) {
    console.error("Échec envoi email:", error.message);
    return { ok: false, error: error.message };
  }
};

/**
 * Envoie un SMS via Africa's Talking. Le numéro doit être au format international
 * (ex. +237600000000) pour que l'API l'accepte correctement.
 */
const sendSMS = async (toPhone, message) => {
  try {
    const sms = getAfricasTalkingSMS();
    const options = {
      to: [toPhone],
      message,
      // En sandbox, ne PAS envoyer "from" (l'ID d'expéditeur) : Africa's Talking
      // utilise automatiquement un numéro de test. En production, une fois un
      // "Sender ID" ou "Short Code" validé, on peut l'ajouter ici :
      // from: process.env.AT_SENDER_ID,
    };
    const response = await sms.send(options);

    // Vérifie que le SMS a bien été accepté par Africa's Talking (status "Success")
    const recipient = response?.SMSMessageData?.Recipients?.[0];
    if (recipient && recipient.status !== "Success") {
      throw new Error(recipient.status || "Échec Africa's Talking");
    }

    return { ok: true };
  } catch (error) {
    console.error("Échec envoi SMS (Africa's Talking):", error.message);
    return { ok: false, error: error.message };
  }
};

export const notifyStatusChange = async (user, complaint, newStatus) => {
  const message = `Bonjour ${user.fullName}, votre plainte n°${complaint.ticketNumber} ("${complaint.title}") est passée au statut : ${newStatus}.`;

  if (user.notificationPreferences?.email) {
    const result = await sendEmail(user.email, `Mise à jour de votre plainte ${complaint.ticketNumber}`, message);
    await Notification.create({
      user: user._id,
      complaint: complaint._id,
      channel: "email",
      message,
      status: result.ok ? "sent" : "failed",
      error: result.error,
    });
  }

  if (user.notificationPreferences?.sms) {
    const result = await sendSMS(user.phone, message);
    await Notification.create({
      user: user._id,
      complaint: complaint._id,
      channel: "sms",
      message,
      status: result.ok ? "sent" : "failed",
      error: result.error,
    });
  }
};