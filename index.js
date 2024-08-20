const http = require('http');
const { DefaultAzureCredential } = require('@azure/identity');
const { SecretClient } = require('@azure/keyvault-secrets');

const port = process.env.PORT || 3000;

// Set your Key Vault URL and secret name
const keyVaultName ="msbpro-kv-prod-01"
const kvUri = `https://${keyVaultName}.vault.azure.net`;
const secretName ="myname"

// Create a new secret client using the DefaultAzureCredential
const credential = new DefaultAzureCredential();
const client = new SecretClient(kvUri, credential);

// Fetch the secret asynchronously
async function getSecret() {
  try {
    const secret = await client.getSecret(secretName);
    return secret.value;
  } catch (err) {
    console.error(`Error fetching secret: ${err}`);
    return null;
  }
}

const server = http.createServer(async (req, res) => {
  res.statusCode = 200;
  const secretValue = await getSecret();
  const msg = secretValue ? `Hello Node! Secret Value: ${secretValue}\n` : 'Hello Node! Could not retrieve secret.\n';
  res.end(msg);
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});
