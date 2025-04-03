const transporter = require('../config/mail');

const emailService = {
sendWelcomeEmail: async (userEmail, userName) => {
try {
    console.log('Enviando correo de bienvenida...');
    const mailOptions = {
    from: '"Club de Padel Command Park" <cesardeveloper11@gmail.com>',
    to: userEmail,
    subject: '¡Bienvenido a nuestra aplicación!',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">¡Hola ${userName}!</h2>
        <p>Gracias por registrarte en nuestra aplicación. Estamos emocionados de tenerte con nosotros.</p>
        <p>Con tu cuenta podrás:</p>
        <ul>
            <li>Reservar canchas</li>
            <li>Inscribirte en torneos</li>
            <li>Participar en clases</li>
        </ul>
        <p>¡Si tienes alguna pregunta, no dudes en contactarnos!.</p>
        <p>¡Esperamos que disfrutes de nuestros servicios!</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #777;">Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
        </div>
    `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de bienvenida enviado:', info.messageId);
    return true;
} catch (error) {
    console.error('Error al enviar correo de bienvenida:', error);
    return false;
}
},


sendPasswordResetEmail: async (userEmail, userName, resetToken) => {
try {
    console.log('Enviando correo de recuperación de contraseña...');
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    
    const mailOptions = {
    from: '"Club de Padel Command Park" <cesardeveloper11@gmail.com>',
    to: userEmail,
    subject: 'Recuperación de contraseña',
    html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">¡Hola ${userName}!</h2>
        <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p style="margin: 20px 0;">
            <a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
            Restablecer contraseña
            </a>
        </p>
        <p>Este enlace expirará en 1 hora por motivos de seguridad.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0;">
            <p style="font-size: 12px; color: #777;">Este es un correo automático, por favor no respondas a este mensaje.</p>
        </div>
        </div>
    `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Correo de recuperación enviado:', info.messageId);
    return true;
} catch (error) {
    console.error('Error al enviar correo de recuperación:', error);
    return false;
}
}
};


module.exports = emailService;
