import userModel from '../dao/mongo/models/user.js'; // Importa el modelo del usuario

export async function findClientByCartId(cid) {
    try {
      // Buscar el usuario por el ID del carrito asociado
      const user = await userModel.findOne({ cartId: cid });
  
      if (!user) {
        // Si no se encuentra el usuario, puedes manejar el error aquí
        throw new Error('Usuario no encontrado');
      }
  
      // Acceder al campo que contiene el ID del cliente en el usuario
      const clientId = user._id;
  
      return clientId;
    } catch (error) {
      console.log('Error al buscar cliente por ID de carrito:', error.message);
      return null; // O puedes lanzar un error aquí o manejarlo de otra manera según tus necesidades
    }
  }
