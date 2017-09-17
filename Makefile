all:
	tsc --strictNullChecks --pretty --outFile dist/miam.js src/internal.ts src/result.ts src/parsers.ts

run:
	node dist/miam.js
