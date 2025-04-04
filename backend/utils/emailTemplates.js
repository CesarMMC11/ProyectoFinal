const welcomeEmail = (userName) => {
return {
    subject: '¡Bienvenido a nuestra plataforma!',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">¡Bienvenido, ${userName}!</h2>
        <p>Gracias por registrarte en nuestra plataforma. Estamos emocionados de tenerte con nosotros.</p>
        <p>Ahora puedes acceder a todas nuestras funcionalidades y servicios.</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        </div>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
    `
};
};

const passwordResetEmail = (userName, resetToken) => {
return {
    subject: 'Recuperación de contraseña',
    html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Recuperación de contraseña</h2>
        <p>Hola ${userName},</p>
        <p>Recibimos una solicitud para restablecer tu contraseña. Haz clic en el siguiente enlace para crear una nueva contraseña:</p>
        <p><a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">Restablecer contraseña</a></p>
        <p>Este enlace expirará en 1 hora.</p>
        <p>Si no solicitaste este cambio, puedes ignorar este correo y tu contraseña seguirá siendo la misma.</p>
        <p style="margin-top: 20px; font-size: 12px; color: #777;">Este es un correo automático, por favor no respondas a este mensaje.</p>
    </div>
    `
};
};

module.exports = {
welcomeEmail,
passwordResetEmail
};
