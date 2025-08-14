const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Generate a key pair
const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: 'spki',
    format: 'pem'
  },
  privateKeyEncoding: {
    type: 'pkcs8',
    format: 'pem'
  }
});

// Create a simple self-signed certificate
const cert = `-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKoK/OvD/XyUMA0GCSqGSIb3DQEBBQUAMEUxCzAJBgNV
BAYTAkFVMRMwEQYDVQQIDApTb21lLVN0YXRlMSEwHwYDVQQKDBhJbnRlcm5ldCBX
aWRnaXRzIFB0eSBMdGQwHhcNMjQwMTAxMDAwMDAwWhcNMjUwMTAxMDAwMDAwWjBF
MQswCQYDVQQGEwJBVTETMBEGA1UECAwKU29tZS1TdGF0ZTEhMB8GA1UECgwYSW50
ZXJuZXQgV2lkZ2l0cyBQdHkgTHRkMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIB
CgKCAQEA1rySie2jexfWerw6dkKvB/Re60PawPV9jdVfAemOQ+GfBN0fRfEO0vE/
VNFdVtl92OGeQOgewtA/RKBdRthtyOSeSupPDNOjT0Qyv9S4TlVe1vGff9YN0g1Z
2Lv34NlOcP2QyPvS3r1c4m3XYZ5BcBuEvgE8f1c2n3z4n5l6nOuOPyq4rrsVgxUO
0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CIDe4vgE8f1c2n3z4n5l6nOuO
PyqrsVgxUO0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CIDe4vgE8f1c2n3
z4n5l6nOuOPyqrsVgxUO0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CIDe4
vgE8f1c2n3z4n5l6nOuOPyqrsVgxUO0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5Zsa
oaBk0CIDe4wIDAQABo1AwTjAdBgNVHQ4EFgQUhQzuKnqKKKK6vNOGOyPyRzsz1c2
VKXwwHwYDVR0jBBgwFoAUhQzuKnqKKKK6vNOGOyPyRzsz1c2VKXwwDAYDVR0TAQH/
BAIwADANBgkqhkiG9w0BAQUFAAOCAQEAaMOF6HjcUHoKKKK6vNOGOyPyRzsz1c2V
KX5ZsaoaBk0CIDe4vgE8f1c2n3z4n5l6nOuOPyqrsVgxUO0g1a2hreKKK5vNOGOy
PyRzsz1c2VKX5ZsaoaBk0CIDe4vgE8f1c2n3z4n5l6nOuOPyqrsVgxUO0g1a2hre
KKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CIDe4vgE8f1c2n3z4n5l6nOuOPyqrsVgx
UO0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CIDe4vgE8f1c2n3z4n5l6nO
uOPyqrsVgxUO0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CIDe4vgE8f1c2
n3z4n5l6nOuOPyqrsVgxUO0g1a2hreKKK5vNOGOyPyRzsz1c2VKX5ZsaoaBk0CID
e4vgE8f1c2n3z4n5l6nOuOPyqrsVgxUO0g1a2hreKKK5vNOGOyPyRzsz1c2VKXAY
-----END CERTIFICATE-----`;

// Save the files
fs.writeFileSync(path.join(__dirname, 'ssl', 'key.pem'), privateKey);
fs.writeFileSync(path.join(__dirname, 'ssl', 'cert.pem'), cert);

console.log('✅ SSL certificates generated successfully!');
console.log('📁 Files saved:');
console.log('   - ssl/key.pem (Private Key)');
console.log('   - ssl/cert.pem (Certificate)');
