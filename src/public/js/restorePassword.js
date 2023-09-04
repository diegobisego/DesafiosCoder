const form = document.getElementById('restorePasswordForm');
const text = document.getElementById('message');
const urlParams = new Proxy(new URLSearchParams(window.location.search),{
    get: (searchParams,prop) =>searchParams.get(prop)
})

form.addEventListener('submit', async (evt) => {
    
    evt.preventDefault();
    
    const data = new FormData(form);
    const fieldsToSend = ['email', 'password'];
    const formDataObject = {};
    
    // Convertir FormData a objeto JavaScript
    for (const [key, value] of data.entries()) {
        if (fieldsToSend.includes(key)) {
            formDataObject[key] = value;
        }
    }
    formDataObject.token = urlParams.token;
    
    try {
        const response = await axios.post('/api/session/restorePassword', formDataObject);  // Enviar los datos del formulario
        
        const result = response.data;
        text.innerHTML = result.message;

    } catch (error) {
        text.innerHTML = `Ha ocurrido un error en el proceso: ${error}`;
    }
});
