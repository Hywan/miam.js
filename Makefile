all:
	tsc --strictNullChecks --pretty --outDir dist/ --module commonjs src/*

ex:
	node examples/simple.js
