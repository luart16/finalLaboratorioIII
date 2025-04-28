import axios from "axios"; //importo el axios porque más abajo lo voy a usar para llamar

//creo una clase:
class ManagerCripto {
  //pongo las propiedades
  monedasCripto = [
    {
      code: "btc",
      name: "BitCoin",
    },
    {
      code: "eth",
      name: "Ethereum",
    },
    {
      code: "usdt",
      name: "Tether USDt",
    },
  ]
OperacionesDeComercio = [
    {
        option: "purchase",
        name: "Compra"
    },
    {
        option: "sale",
        name: "Venta"
    },
]
//constructor
constructor() {}

//Métodos:
//Creo un método para traer el tipo de monedas:
TraerCrypto() { return this.monedasCripto }
//creo un método para traer el tipo de operaciones:
TraerOperaciones() { return this.OperacionesDeComercio }
//Creo un método para traer los datos de las criptomonedas transformados a peso argentino(lo hace llamando a esa api)
async TraerPrecio(Crypto) {
    try {
        const respuesta = await axios.get(`https://criptoya.com/api/argenbtc/${Crypto}/ars`)
        return respuesta.data
    } catch (err) {
        console.log(err)
    }
}}
export default ManagerCripto