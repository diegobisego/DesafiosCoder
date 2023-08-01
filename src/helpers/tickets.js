export function generateTicketCode() {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const codeLength = 8;
    let code = "";
  
    for (let i = 0; i < codeLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
  
    return code;
  }
  

  export function calculateTotalAmount(cartProducts) {
    let totalAmount = 0;
  
    for (const cartProduct of cartProducts) {
      const price = cartProduct.price;
      totalAmount += price
    }
  
    return totalAmount;
  }

  
   