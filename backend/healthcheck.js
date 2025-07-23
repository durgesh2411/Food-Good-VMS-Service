#!/usr/bin/env node

import axios from 'axios';

const BASE_URL = process.env.BASE_URL || 'http://localhost:8000';

async function healthCheck() {
  try {
    console.log('🔍 Performing health check...');
    
    const response = await axios.get(`${BASE_URL}/api/v1/health`);
    
    if (response.status === 200 && response.data.success) {
      console.log('✅ Health check passed');
      console.log('📊 Server Status:', response.data.message);
      console.log('⏰ Timestamp:', response.data.timestamp);
      process.exit(0);
    } else {
      console.log('❌ Health check failed');
      console.log('Response:', response.data);
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Health check failed with error:');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
    }
    process.exit(1);
  }
}

healthCheck();
