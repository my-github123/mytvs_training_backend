const express = require("express");
const router = express.Router();
const os = require('os');
const axios = require("axios");




  async function getPublicIp() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        console.error('Error fetching public IP:', error);
        return 'Unable to retrieve public IP';
    }
}

  
router.get('/getServer', async(req, res) => {
  
    const publicIp = await getPublicIp();

          

    
    res.status(200).json({message:publicIp})
});

module.exports=router;