module.exports = (req, res) => {
  const { name = 'Worlds' } = req.query;
  res.status(200).send(`Hellos ${name}!`);
};