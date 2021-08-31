const reset_password_email = (clientEmail, clientPassword) => {
  return `<!DOCTYPE html>
  <html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
  
    <head>
      <meta charset="utf-8">
      <meta name="x-apple-disable-message-reformatting">
      <meta http-equiv="x-ua-compatible" content="ie=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
      <!--[if mso]>
      <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
      <style>
        td,th,div,p,a,h1,h2,h3,h4,h5,h6 {font-family: "Segoe UI", sans-serif; mso-line-height-rule: exactly;}
      </style>
    <![endif]-->
      <title>Welcome Murtaza</title>
      <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700" rel="stylesheet" media="screen">
      <style>
        .hover-underline:hover {
          text-decoration: underline !important;
        }
  
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
  
        @keyframes ping {
  
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
  
        @keyframes pulse {
          50% {
            opacity: .5;
          }
        }
  
        @keyframes bounce {
  
          0%,
          100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
          }
  
          50% {
            transform: none;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
          }
        }
  
        @media (max-width: 600px) {
          .sm-px-24 {
            padding-left: 24px !important;
            padding-right: 24px !important;
          }
  
          .sm-py-32 {
            padding-top: 32px !important;
            padding-bottom: 32px !important;
          }
  
          .sm-w-full {
            width: 100% !important;
          }
        }
      </style>
    </head>
  
    <body style="margin: 0; padding: 0; width: 100%; word-break: break-word; -webkit-font-smoothing: antialiased; --bg-opacity: 1; background-color: #283046; background-color: rgba(40, 48, 70, 1);">
      <div role="article" aria-roledescription="email" aria-label="Reset your Password" lang="en">
        <table style="font-family: 'Roboto Condensed', -apple-system, 'Segoe UI', sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td align="center" style="--bg-opacity: 1; background-color: #283046; background-color: rgba(40, 48, 70, 1); font-family: 'Roboto Condensed', -apple-system, 'Segoe UI', sans-serif;" bgcolor="rgba(40, 48, 70, 1)">
              <table class="sm-w-full" style="font-family: ''Roboto Condensed'',Arial,sans-serif; width: 600px;" width="600" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td class="sm-py-32 sm-px-24" style="font-family: 'Roboto Condensed', -apple-system, 'Segoe UI', sans-serif; padding: 48px; text-align: center;" align="center">
                    <a href="https://queensman.com">
                      <img src="https://queensman-icemelt72.vercel.app/static/media/qslogo.30f8f0eb.png" width="100" alt="Queensman Logo" style="border: 0; max-width: 100%; line-height: 100%; vertical-align: middle;">
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center" class="sm-px-24" style="font-family: ''Roboto Condensed'',Arial,sans-serif;">
                    <table style="font-family: ''Roboto Condensed'',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                      <tr>
                        <td class="sm-px-24" style="--bg-opacity: 1; background-color: #ffffff; background-color: rgba(255, 255, 255, 1); border-radius: 4px; font-family: 'Roboto Condensed', -apple-system, 'Segoe UI', sans-serif; font-size: 16px; line-height: 24px; padding: 48px; text-align: left; --text-opacity: 1; color: #000; color: rgba(0, 0, 0, var(--text-opacity));" bgcolor="rgba(255, 255, 255, 1)" align="left">
                          <p style="font-weight: 700; font-size: 20px; margin-top: 0; --text-opacity: 1; color: #ff5850;">Password Reset</p>
                          <p style="margin: 0 0 24px;">Your password has been reset.</p>
                            <p style="margin: 0 0 24px;">Use the following credentials to login. <br />
                            <strong>Email: </strong>${clientEmail}<br />
                            <strong>Password: </strong>${clientPassword}<br />
                            </p>
                            <p>If this is not you, please contact the administrator</p>
                          <a href=""><img src="https://backend-8106d23e.nhost.app/storage/o/public/google-play-badge.png" width="180"/></a>
                          <table style="font-family: ''Roboto Condensed'',Arial,sans-serif; width: 100%;" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                            <tr>
                              <td style="font-family: ''Roboto Condensed'',Arial,sans-serif; padding-top: 32px; padding-bottom: 32px;">
                                <div style="--bg-opacity: 1; background-color: #eceff1; background-color: rgba(40, 48, 70, 1); height: 1px; line-height: 1px;">&zwnj;</div>
                              </td>
                            </tr>
                          </table>
                          <p style="margin: 0 0 16px;">
                            Not sure why you received this email? Please
                            <a href="mailto:services@queensman.com" class="hover-underline" style="--text-opacity: 1; color: #ecc65d; color: rgba(115, 103, 240, var(--text-opacity)); text-decoration: none;">let us know</a>.
                          </p>
                          <p style="margin: 0 0 16px;">Thanks, <br>The Queensman Team</p>
                        </td>
                      </tr>
                      <tr>
                        <td style="font-family: ''Roboto Condensed'',Arial,sans-serif; height: 20px;" height="20"></td>
                      </tr>
                      <tr>
                        <td style="font-family: ''Roboto Condensed'',Arial,sans-serif; height: 16px;" height="16"></td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    </body>
  
  </html>`;
};

module.exports = { reset_password_email };
