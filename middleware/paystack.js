const axios = require('axios');

const initializedPayment = async (transactionData) => {
    const headers = {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json"
    }
    const response = await axios.post("https://api.paystack.co/transaction/initialize",
        transactionData,
        { headers }
    )

    return response.data;
}

const verifyTransaction = async (trxref) => {
    const verifyUrl = `https://api.paystack.co/transaction/verify/${trxref}`
    const response = await axios.get(verifyUrl, {
        headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
        }
    })
    return response.data
}

module.exports = {initializedPayment,verifyTransaction};

