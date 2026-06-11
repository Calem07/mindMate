const http = require('http');

function request(url, options, body) {
  return new Promise((resolve, reject) => {
    const req = http.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(body);
    }
    req.end();
  });
}

async function run() {
  try {
    const rand = Math.random().toString(36).substring(7);
    const email = `teststudent_${rand}@example.com`;
    
    // Register
    const regRes = await request('http://localhost:8088/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
      name: 'Test Student',
      email: email,
      password: 'Password123'
    }));
    
    if (regRes.statusCode !== 200) {
      console.error('Registration failed:', regRes.statusCode, regRes.body);
      return;
    }
    
    const token = JSON.parse(regRes.body).token;
    console.log('Registered successfully! Token acquired.');
    
    // Get Companion
    const getRes = await request('http://localhost:8088/api/companion', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Get Companion initial status code:', getRes.statusCode, JSON.stringify(getRes.body));
    
    // Adopt
    const adoptRes = await request('http://localhost:8088/api/companion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, JSON.stringify({
      petType: 'Luna',
      petName: 'TestPet',
      petLevel: 1,
      petMood: '😊 Happy',
      petTheme: 'Classic',
      petAccessory: 'None'
    }));
    
    console.log('Adopt Companion status code:', adoptRes.statusCode);
    console.log('Adopt Companion response body:', adoptRes.body);
    
    // Customize
    const customRes = await request('http://localhost:8088/api/companion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }, JSON.stringify({
      petType: 'Luna',
      petName: 'TestPet',
      petLevel: 1,
      petMood: '😊 Happy',
      petTheme: 'Galaxy',
      petAccessory: 'Crown'
    }));
    
    console.log('Customize Companion status code:', customRes.statusCode);
    console.log('Customize Companion response body:', customRes.body);
    
  } catch (error) {
    console.error('Error running test:', error);
  }
}

run();
