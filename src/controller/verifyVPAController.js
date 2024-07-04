const axios = require("axios");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { response } = require("express");

// Encryption algorithm and key size for AES-128-CBC
// const algorithm = "aes-128-cbc";
// const key = crypto.randomBytes(16); // 16 bytes for AES-128
// const iv = crypto.randomBytes(16); // Initialization vector



function encrypt(key, text) {
  const keyBuffer = Buffer.from(key, 'hex');
   const ivBuffer = Buffer.from([0x8E, 0x12, 0x39, 0x9C, 0x07, 0x72, 0x6F, 0x5A, 0x8E, 0x12, 0x39, 0x9C, 0x07, 0x72, 0x6F, 0x5A]);
  

  const cipher = crypto.createCipheriv('aes-128-cbc', keyBuffer, ivBuffer);
  let encrypted = Buffer.concat([cipher.update(JSON.stringify(text), 'utf8'), cipher.final()]);
  return Buffer.concat([ivBuffer, encrypted]).toString('base64');
}







function decrypt(key, encrypted) {
  const keyBuffer = Buffer.from(key, 'hex');
  const encryptedBuffer = Buffer.from(encrypted, 'base64');
  const ivBuffer = encryptedBuffer.slice(0, 16);
  const ciphertextBuffer = encryptedBuffer.slice(16);
  const decipher = crypto.createDecipheriv('aes-128-cbc', keyBuffer, ivBuffer);
  let decrypted = decipher.update(ciphertextBuffer, null, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

exports.verifyVPA = async (req, res) => {
  console.log("Request Body:", req.body);

  const { SubHeader, VerifyVPARequestBody } = req.body.VerifyVPARequest || {};

  if (!SubHeader || !VerifyVPARequestBody) {
    return res.status(400).json({
      message: "Invalid request body",
      error: "SubHeader and VerifyVPARequestBody are required",
    });
  }

  const keyAsHexString = 'D8ABA26A5EA3126758F4F9A593BC573B';

  // Convert hexadecimal string to Buffer
  const keyBuffer = Buffer.from(keyAsHexString, 'hex');


  
  console.log(keyBuffer,"KEY BUFFER IS THERE..."); // Output the Buffer

  // Encrypt the VerifyVPARequestBody parameter
  const encryptedBody = encrypt(keyBuffer,VerifyVPARequestBody);


  // Define the API endpoint
  const apiUrl = "https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/acct-recon/verifyVPA";

  // Path to your PFX certificate and passphrase
  const pfxPath = path.resolve(__dirname, "../certificate/client.p12");
  const passphrase = "Year@2024"; // Replace with your actual passphrase

  try {
    // Read the PFX file synchronously
    const pfx = fs.readFileSync(pfxPath);

    // Create an HTTPS agent with the PFX certificate
    const httpsAgent = new https.Agent({
      pfx: pfx,
      passphrase: passphrase,
    });

    // Define the request body with encrypted data
    const apiBody = {
      VerifyVPARequest: {
        SubHeader,
        VerifyVPARequestBodyEncrypted: encryptedBody,
      }
    };


   const body=JSON.stringify(apiBody);

   console.log(body,"BODY IS FBERE..");
 

    // Make the POST request to the external API with headers and host configuration
    const response = await axios.post(apiUrl, body, {
      httpsAgent: httpsAgent,
      headers: {
        "Content-Type": "application/json",
        "X-IBM-Client-Id": "bf21e9bd4ad7ba83c4f04b31c2833302",
        "X-IBM-Client-Secret": "d58a28965d3640ffb470dcad05d12395",
      },
    });

    console.log(response,"response is there.....");

    // Decrypt the VerifyVPAResponseBodyEncrypted field in the response
    const encryptedResponseBody = response.data.VerifyVPAResponse.VerifyVPAResponseBodyEncrypted;
    const decryptedResponseBody = decrypt(keyAsHexString,encryptedResponseBody);



    // Replace the encrypted value with the decrypted value in the response
    const responseBody = {
      VerifyVPAResponse: {
        SubHeader: response.data.VerifyVPAResponse.SubHeader,
        VerifyVPAResponseBody: decryptedResponseBody,
      }
    };

    // Send the response from the external API back to the client
    res.status(200).json(responseBody);
  } catch (error) {
    const errorMessage = error.response?.data || error.message;

    console.error("Error:", error.response?.status, errorMessage);

    // Send an error response if the API call fails
    return res.status(500).json({
      message: "Error occurred",
      error: errorMessage,
      status: error.response?.status || 500,
    });
  }
};



//https://sakshamuat.axisbank.co.in/gateway/api/txb/v1/payments/transfer-payment
