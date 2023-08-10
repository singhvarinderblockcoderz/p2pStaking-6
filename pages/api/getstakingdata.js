import axios from "axios";

export default async function handler(req, res) {

  if (req.method === "POST") {
    try {
      const data = req.body;
      console.log(data,"to send to api")
      var config = {
        method: "post",
        url: "http://3.109.75.65:4001/api/v1/auth/getstakingdata",data
      };
      await axios(config).then(function (response) {
        res.status(200).json({ data: response.data });
      });
    } catch (err) {
      
      res.status(500).json({ Error: err });
    }
  }
}