const BASE_URL = 'http://localhost:3001';

async function runTests() {
  console.log('--- STARTING OUTREACHAI API INTEGRATION TESTS ---');

  const randomEmail = `test_${Math.floor(Math.random() * 1000000)}@outreachai.com`;
  const password = 'testpassword123';
  let token = '';
  let userId = null;

  try {
    // 1. Register a new user
    console.log('\n1. Testing User Registration...');
    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomEmail, password })
    });
    const regData = await regRes.json();
    if (regRes.status !== 201) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    console.log('✔ Registration successful:', JSON.stringify(regData.user));
    token = regData.token;
    userId = regData.user.id;

    // 2. Try registering duplicate email
    console.log('\n2. Testing Duplicate Registration Prevention...');
    const dupRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomEmail, password })
    });
    const dupData = await dupRes.json();
    if (dupRes.status === 400 && dupData.error === 'User already exists') {
      console.log('✔ Duplicate registration correctly blocked.');
    } else {
      throw new Error(`Duplicate registration should have failed with 400, got status ${dupRes.status}: ${JSON.stringify(dupData)}`);
    }

    // 3. Log in with the registered user
    console.log('\n3. Testing User Login...');
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: randomEmail, password })
    });
    const loginData = await loginRes.json();
    if (loginRes.status !== 200) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    console.log('✔ Login successful. Received token.');
    token = loginData.token;

    // 4. Retrieve /me profile
    console.log('\n4. Testing GET /api/auth/me...');
    const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const meData = await meRes.json();
    if (meRes.status !== 200) {
      throw new Error(`GET /me failed: ${JSON.stringify(meData)}`);
    }
    console.log('✔ Profile fetched successfully:', JSON.stringify(meData.user));

    // 5. Generate Email Sequence (1st generation)
    const payload = {
      user_name: 'Sarah Jenkins',
      prospect_name: 'John Doe',
      prospect_company: 'Acme Corp',
      prospect_title: 'VP of Sales',
      what_they_sell: 'CRM automation software'
    };

    console.log('\n5. Generating 1st Email Sequence (Free Tier)...');
    const genRes1 = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const genData1 = await genRes1.json();
    if (genRes1.status !== 200) {
      throw new Error(`1st Generation failed: ${JSON.stringify(genData1)}`);
    }
    console.log('✔ 1st generation successful. Response structure correct.');
    console.log('Opener Snippet:', genData1.emails[0].split('\n').slice(0, 3).join('\n'));

    // 6. Generate 2nd and 3rd email sequences
    console.log('\n6. Generating 2nd Email Sequence...');
    const genRes2 = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (genRes2.status !== 200) throw new Error('2nd Generation failed');
    console.log('✔ 2nd generation successful.');

    console.log('Generating 3rd Email Sequence...');
    const genRes3 = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    if (genRes3.status !== 200) throw new Error('3rd Generation failed');
    console.log('✔ 3rd generation successful.');

    // 7. Try a 4th email generation (should be blocked under free tier)
    console.log('\n7. Testing Free Tier Rate Limit (4th generation attempt)...');
    const genRes4 = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const genData4 = await genRes4.json();
    if (genRes4.status === 403) {
      console.log('✔ 4th generation blocked successfully with status 403:', genData4.error);
    } else {
      throw new Error(`4th generation should have been blocked (403), but got status ${genRes4.status}: ${JSON.stringify(genData4)}`);
    }

    // 8. Verify Payment (upgrade to paid)
    console.log('\n8. Testing Bitcoin Payment Verification / Upgrade...');
    const txId = 'tx_783bc8da294e10ab64cf8ef9021da3b2c0f16f3922d51b473ef230a104f26bca';
    const payRes = await fetch(`${BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bitcoin_tx_id: txId })
    });
    const payData = await payRes.json();
    if (payRes.status !== 200 || !payData.success) {
      throw new Error(`Payment verification failed: ${JSON.stringify(payData)}`);
    }
    console.log('✔ Payment verified and upgraded to paid tier successfully.');

    // 9. Try the 4th email generation again (should now succeed)
    console.log('\n9. Testing Generation on Paid Tier (4th attempt)...');
    const genResPaid = await fetch(`${BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    const genDataPaid = await genResPaid.json();
    if (genResPaid.status === 200) {
      console.log('✔ 4th generation now succeeds because user is on the Paid tier!');
    } else {
      throw new Error(`4th generation failed on Paid tier with status ${genResPaid.status}: ${JSON.stringify(genDataPaid)}`);
    }

    // 10. Check Usage Stats
    console.log('\n10. Testing GET /api/user/usage...');
    const usageRes = await fetch(`${BASE_URL}/api/user/usage`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const usageData = await usageRes.json();
    if (usageRes.status !== 200) {
      throw new Error(`GET /user/usage failed: ${JSON.stringify(usageData)}`);
    }
    console.log('✔ Usage statistics retrieved successfully:', JSON.stringify(usageData));

    // 11. Check Generation History
    console.log('\n11. Testing GET /api/user/history...');
    const historyRes = await fetch(`${BASE_URL}/api/user/history`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const historyData = await historyRes.json();
    if (historyRes.status !== 200) {
      throw new Error(`GET /user/history failed: ${JSON.stringify(historyData)}`);
    }
    console.log(`✔ History fetched successfully. Number of records: ${historyData.generations.length}`);
    console.log('First record company name matched:', historyData.generations[0].prospect_company === 'Acme Corp');

    console.log('\n--- ALL API INTEGRATION TESTS PASSED SUCCESSFULLY! 🚀 ---');
  } catch (error) {
    console.error('\n✖ TEST SUITE FAILED:', error.message);
    process.exit(1);
  }
}

runTests();
