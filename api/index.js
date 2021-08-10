const fetch = require('node-fetch');
const FormData = require('form-data');
const fs = require('fs');
module.exports = async (req, res) => {
  const { document_id } = req.query;
  const formdata = new FormData();
  formdata.append('document_id', document_id);

  const requestOptions1 = {
    method: 'POST',
    body: formdata,
    redirect: 'follow'
  };
  try {
  const response = await fetch('https://www.zohoapis.com/crm/v2/functions/uploaddocument/actions/execute?auth_type=apikey&zapikey=1003.db2c6e3274aace3b787c802bb296d0e8.3bef5ae5ee6b1553f7d3ed7f0116d8cf', requestOptions1);
  
  const text = await response.json();
  
  const result = fs.writeFileSync('out.pdf', text.details.output, 'base64');
  console.log(result)
  res.download('out.pdf');
  // res.send(result);
  }catch(e) {
    res.send(e)
    console.log(e);
  }
};