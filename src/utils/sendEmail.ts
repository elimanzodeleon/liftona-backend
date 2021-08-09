import createError from 'http-errors';
import ses from '../config/ses';

export const sendEmail = (email: string, subject: string, message: string) => {
  return new Promise((resolve, reject) => {
    const params = {
      Destination: {
        ToAddresses: [email],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: 'elimanzodeleon@gmail.com',
    };

    ses.sendEmail(params, err => {
      if (err)
        reject(new createError.InternalServerError('Internal Server Error'));

      resolve(0);
    });
  });
};
