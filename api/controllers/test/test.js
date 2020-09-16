async function test(req, res, next) {
	return res.status(200).json({ message: 'It Worked Version 2.0!' });
}

module.exports = test;
