const form = document.getElementById('restorePasswordForm');
const text = document.getElementById('message');
const urlParams = new Proxy(new URLSearchParams(window.location.search),{
    get: (searchParams,prop) =>searchParams.get(prop)
})

form.addEventListener('submit',async(evt)=>{
    evt.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value,key)=>obj[key]=value);
    obj.token = urlParams.token;
    const response = await axios.post('/api/sessions/restorePassword')
    
    const json =await response.json();
    if(json.status==="success"){
        text.innerHTML = "Se ha cambiado su contraseña"
    }else{
        text.innerHTML = json.error
    }
})