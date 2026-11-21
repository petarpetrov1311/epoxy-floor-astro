const url = process.env.STAGING_URL || process.argv[2] || '';
console.log('Hello', url);