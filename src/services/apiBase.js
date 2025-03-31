import axios from 'axios'; //importo axios
import { from } from 'core-js/core/array';

//aquí debajo pego el código que pasó el profe:
const apiClient = axios.create({

    baseURL: ' https://laboratorio3-5459.restdb.io/rest/', 

    headers: {'x-apikey': '64a57c2b86d8c50fe6ed8fa5'}

});
export default apiClient //exporto para poder usarlo en otro lugar