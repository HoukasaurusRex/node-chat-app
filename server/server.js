const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const env = process.env.NODE_ENV || 'development';

const publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Express server listening on port ${port} in ${env} mode...`);
});
