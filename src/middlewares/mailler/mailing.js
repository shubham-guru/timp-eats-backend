import nodemailer from "nodemailer";

import { generateTeamMail } from "./mailingHelper.js";
import { buildResponse } from "../../helper/httpResponse.js";

async function sendMailToClient(request) {
  const mailObject = generateTeamMail(request);
  // console.log("🚀 ~ sendMailToClient ~ mailObject:", mailObject)
  if (mailObject.code === 500)
    return buildResponse(200, "E-Mail sent successfully");
  const [defaults, options, teamMail] = mailObject.body;
  const transporter = nodemailer.createTransport(options, defaults);

  const teamPromise =  transporter.sendMail(teamMail);

  return await Promise.allSettled([teamPromise])
    .then((res) => {
      return buildResponse({code:200, body:"E-Mail sent successfully"});
    })
    .catch((error) => {
      console.log("Email not sent with error: ", error);
      return buildResponse({code:400, body:"failed to sent email"});
    });
}

export { sendMailToClient };
