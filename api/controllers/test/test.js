async function test(req, res, next) {
	return res.status(200).json({ message: 'It Worked!' });
}

module.exports = test;
