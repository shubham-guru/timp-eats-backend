import parse from "partparse";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";
import dotenv from "dotenv";
dotenv.config();

function generateHtml(htmlPath, replacements) {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const filePath = path.join(__dirname, htmlPath);
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  return template(replacements);
}

function generateTeamMail(request) {
  const { toAddress, subject, message } = request;
  const path = '../../views/mail.html'
  const htmlContent = generateHtml(path, message)
  const userAccount = {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  };
  const options = {
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    auth: {
      user: userAccount.user,
      pass: userAccount.pass,
    },
  };
  // console.log(options)
  const defaults = {
    from: `${userAccount.user}`,
  };
  const teamMail = {
    to: `${toAddress}`,
    text: `${subject}`,
    subject: `${subject}`,
    watchHtml: "<h1>New Mail Received from autophoto</h1>",
    html: htmlContent,
  };
  // if (file) teamMail.attachments = [{
  // filename: generateFileName( name, file?.filename),
  // content: file?.content
  // }]
  return { code: 200, body: [defaults, options, teamMail] };
}

// function generateMailWithView(parsedBody, params, viewPath) {
// const { name = '', phone = '', email = '', subject = '', message= '' } = parsedBody;
// // const { publication, region } = params;
// // const viewPath =/${viewRelativePath}/${publication}/${region}/index.html;
// const clientMail = {
// to: "${name}" ${email},
// text: "Thank you for contacting us.",
// subject: subject,
// watchHtml: "<h1>Thanks for contacting us.</h1>",
// html: generateHtml(viewPath, trimEmptyKeyFromObject({
// name: name,
// phone: phone,
// email: email,
// subject: subject,
// message: message
// }))
// };
// return clientMail
// }

export { generateTeamMail };
