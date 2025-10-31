// Email template functions for different form types

interface EmailTemplateData {
  [key: string]: string | number | boolean | undefined;
}

const BRAND_COLOR = "#ea580c"; // Dandeal orange
const BRAND_NAME = "Dandeal";

function interpolateTemplate(template: string, data: EmailTemplateData): string {
  return template.replace(/{(\w+)}/g, (match, key) => {
    return String(data[key] || "");
  });
}

export function getEmailTemplate(
  formType: "quote" | "consultation" | "contact",
  data: EmailTemplateData,
  useHtmlTemplate: boolean = true
): { subject: string; html: string; text: string } {
  if (useHtmlTemplate) {
    return getHtmlTemplate(formType, data);
  }
  return getPlainTextTemplate(formType, data);
}

function getHtmlTemplate(
  formType: "quote" | "consultation" | "contact",
  data: EmailTemplateData
): { subject: string; html: string; text: string } {
  const baseHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: ${BRAND_COLOR}; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .header h1 { margin: 0; font-size: 24px; }
          .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
          .field { margin-bottom: 15px; }
          .field-label { font-weight: bold; color: ${BRAND_COLOR}; }
          .field-value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid ${BRAND_COLOR}; }
          .footer { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 5px 5px; }
          .footer a { color: ${BRAND_COLOR}; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${BRAND_NAME}</h1>
          </div>
          <div class="content">
            {content}
          </div>
          <div class="footer">
            <p>This is an automated message from ${BRAND_NAME}. Please do not reply to this email.</p>
            <p>&copy; ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  let subject = "";
  let content = "";

  if (formType === "quote") {
    subject = `New Quote Request from ${data.firstName} ${data.lastName}`;
    content = `
      <h2>New Quote Request</h2>
      <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">${data.firstName} ${data.lastName}</div>
      </div>
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone:</div>
        <div class="field-value">${data.phone}</div>
      </div>
      <div class="field">
        <div class="field-label">Origin:</div>
        <div class="field-value">${data.origin}</div>
      </div>
      <div class="field">
        <div class="field-label">Destination:</div>
        <div class="field-value">${data.destination}</div>
      </div>
      <div class="field">
        <div class="field-label">Shipping Method:</div>
        <div class="field-value">${data.shippingMethod}</div>
      </div>
      <div class="field">
        <div class="field-label">Cargo Type:</div>
        <div class="field-value">${data.cargoType}</div>
      </div>
      <div class="field">
        <div class="field-label">Weight:</div>
        <div class="field-value">${data.weight || "Not specified"}</div>
      </div>
      <div class="field">
        <div class="field-label">Preferred Date:</div>
        <div class="field-value">${data.preferredDate || "Not specified"}</div>
      </div>
      <div class="field">
        <div class="field-label">Notes:</div>
        <div class="field-value">${data.notes || "None"}</div>
      </div>
    `;
  } else if (formType === "consultation") {
    subject = `New Consultation Request from ${data.name}`;
    content = `
      <h2>New Consultation Request</h2>
      <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">${data.name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone:</div>
        <div class="field-value">${data.phone}</div>
      </div>
      <div class="field">
        <div class="field-label">Service:</div>
        <div class="field-value">${data.service}</div>
      </div>
      <div class="field">
        <div class="field-label">Message:</div>
        <div class="field-value">${data.message}</div>
      </div>
    `;
  } else if (formType === "contact") {
    subject = `New Contact Message from ${data.name}`;
    content = `
      <h2>New Contact Message</h2>
      <div class="field">
        <div class="field-label">Name:</div>
        <div class="field-value">${data.name}</div>
      </div>
      <div class="field">
        <div class="field-label">Email:</div>
        <div class="field-value"><a href="mailto:${data.email}">${data.email}</a></div>
      </div>
      <div class="field">
        <div class="field-label">Phone:</div>
        <div class="field-value">${data.phone || "Not provided"}</div>
      </div>
      <div class="field">
        <div class="field-label">Subject:</div>
        <div class="field-value">${data.subject}</div>
      </div>
      <div class="field">
        <div class="field-label">Message:</div>
        <div class="field-value">${data.message}</div>
      </div>
    `;
  }

  const html = baseHtml.replace("{content}", content);
  const text = `${subject}\n\n${JSON.stringify(data, null, 2)}`;

  return { subject, html, text };
}

function getPlainTextTemplate(
  formType: "quote" | "consultation" | "contact",
  data: EmailTemplateData
): { subject: string; html: string; text: string } {
  let subject = "";
  let text = "";

  if (formType === "quote") {
    subject = `New Quote Request from ${data.firstName} ${data.lastName}`;
    text = `
New Quote Request

Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}
Origin: ${data.origin}
Destination: ${data.destination}
Shipping Method: ${data.shippingMethod}
Cargo Type: ${data.cargoType}
Weight: ${data.weight || "Not specified"}
Preferred Date: ${data.preferredDate || "Not specified"}
Notes: ${data.notes || "None"}
    `;
  } else if (formType === "consultation") {
    subject = `New Consultation Request from ${data.name}`;
    text = `
New Consultation Request

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone}
Service: ${data.service}
Message: ${data.message}
    `;
  } else if (formType === "contact") {
    subject = `New Contact Message from ${data.name}`;
    text = `
New Contact Message

Name: ${data.name}
Email: ${data.email}
Phone: ${data.phone || "Not provided"}
Subject: ${data.subject}
Message: ${data.message}
    `;
  }

  return { subject, html: text, text };
}

