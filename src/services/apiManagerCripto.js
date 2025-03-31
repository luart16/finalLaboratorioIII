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
        name: "purchase"
    },
    {
        option: "sell",
        name: "sell"
    },
]
//constructor
constructor() {}

//Métodos
TraerCrypto() { return this.monedasCripto }
TraerOperaciones() { return this.OperacionesDeComercio }

async TraerPrecio(Crypto) {
    try {
        const respuesta = await axios.get(`https://criptoya.com/api/argenbtc/${Crypto}/ars`)
        return respuesta.data
    } catch (err) {
        console.log(err)
    }
}}
