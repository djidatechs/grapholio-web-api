var express = require('express');
const secureCodeTransformer = require("../Logic/Transformer");
var compilerRouter = express.Router();

compilerRouter.post('/', function(req, res, next) {
  // Get the text from the request body
  const text = req.body.text

  // Check if text is provided
  if (!text) {
    return res.status(200);
  }

  // Call the Compile function
  try{
  const transformedCode = secureCodeTransformer(text);
    res.json({data:  transformedCode})
  }
  catch (e) {
    res.json({error:  e.toString()})
  }

});


compilerRouter.get('/', function(req, res, next) {
  const code = `
  this


`;
  const transformedCode = secureCodeTransformer(code);
  const formattedCode = `<pre>${transformedCode}</pre>`; // Wrap transformedCode in <pre> tag
    res.send(formattedCode);
});

module.exports = compilerRouter;
