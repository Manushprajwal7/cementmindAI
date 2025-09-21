console.log('Testing Firebase Environment Variables:');
console.log('----------------------------------');

// Client-side variables
console.log('Client-side variables:');
console.log('NEXT_PUBLIC_FIREBASE_API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '✅ Set' : '❌ Missing');

// Server-side variables
console.log('\nServer-side variables:');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? '✅ Set' : '❌ Missing');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set (first 10 chars: ' + process.env.FIREBASE_PRIVATE_KEY.substring(0, 10) + '...)' : '❌ Missing');

// Check if private key has newlines properly escaped
if (process.env.FIREBASE_PRIVATE_KEY) {
  const hasNewlines = process.env.FIREBASE_PRIVATE_KEY.includes('\n');
  console.log('\nPrivate key format check:');
  console.log(hasNewlines ? '⚠️  Warning: Private key contains actual newlines. Make sure they are escaped as \\n in .env file' : '✅ Private key format looks good');
}
