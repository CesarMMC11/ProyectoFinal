const fs = require('fs');
const path = require('path');
const { Image } = require('../models');

const imageController = {
    // Subir una nueva imagen
    uploadImage: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: 'No se ha subido ninguna imagen' });
            }

            const { section } = req.body;
            if (!section) {
                return res.status(400).json({ message: 'Se requiere especificar la sección (reservas, torneos, clases)' });
            }

            // Verificar si ya existe una imagen para esta sección
            const existingImage = await Image.findOne({ where: { section } });
            
            if (existingImage) {
                // Si existe, eliminar el archivo anterior
                const oldFilePath = path.join(__dirname, '..', 'uploads', existingImage.filename);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
                
                // Actualizar el registro existente
                await existingImage.update({
                    filename: req.file.filename,
                    path: `/uploads/${req.file.filename}`,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                });
                
                return res.status(200).json({
                    message: 'Imagen actualizada correctamente',
                    image: existingImage
                });
            }
            
            // Si no existe, crear un nuevo registro
            const newImage = await Image.create({
                section,
                filename: req.file.filename,
                path: `/uploads/${req.file.filename}`,
                mimetype: req.file.mimetype,
                size: req.file.size
            });
            
            res.status(201).json({
                message: 'Imagen subida correctamente',
                image: newImage
            });
        } catch (error) {
            console.error('Error al subir imagen:', error);
            res.status(500).json({ message: 'Error al subir imagen', error: error.message });
        }
    },
    
    // Obtener imagen por sección
    getImageBySection: async (req, res) => {
        try {
            const { section } = req.params;
            
            const image = await Image.findOne({ where: { section } });
            if (!image) {
                return res.status(404).json({ message: 'No se encontró imagen para esta sección' });
            }
            
            res.status(200).json(image);
        } catch (error) {
            console.error('Error al obtener imagen:', error);
            res.status(500).json({ message: 'Error al obtener imagen', error: error.message });
        }
    },
    
    // Eliminar imagen
    deleteImage: async (req, res) => {
        try {
            const { id } = req.params;
            
            const image = await Image.findByPk(id);
            if (!image) {
                return res.status(404).json({ message: 'Imagen no encontrada' });
            }
            
            // Eliminar el archivo
            const filePath = path.join(__dirname, '..', 'uploads', image.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
            
            // Eliminar el registro
            await image.destroy();
            
            res.status(200).json({ message: 'Imagen eliminada correctamente' });
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            res.status(500).json({ message: 'Error al eliminar imagen', error: error.message });
        }
    }
};

module.exports = imageController;
