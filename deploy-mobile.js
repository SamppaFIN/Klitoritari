#!/usr/bin/env node

/**
 * Mobile Deployment Script for Eldritch Sanctuary
 * Prepares the app for mobile testing and deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🌌 Preparing Eldritch Sanctuary for mobile deployment...\n');

// Check if all required files exist
const requiredFiles = [
    'index.html',
    'manifest.json',
    'server.js',
    'package.json',
    'js/context-menu-system.js',
    'js/websocket-client.js',
    'js/simple-base-init.js',
    'js/svg-base-graphics.js',
    'js/layers/threejs-ui-layer.js',
    'styles.css'
];

console.log('📋 Checking required files...');
let allFilesExist = true;

requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} - MISSING`);
        allFilesExist = false;
    }
});

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing. Please check the project structure.');
    process.exit(1);
}

// Check package.json dependencies
console.log('\n📦 Checking dependencies...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredDeps = ['express', 'ws', 'cors'];

requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
        console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
        console.log(`❌ ${dep} - MISSING from dependencies`);
    }
});

// Check mobile optimizations
console.log('\n📱 Checking mobile optimizations...');

// Check viewport meta tag
const indexHtml = fs.readFileSync('index.html', 'utf8');
if (indexHtml.includes('viewport')) {
    console.log('✅ Viewport meta tag present');
} else {
    console.log('❌ Viewport meta tag missing');
}

// Check PWA manifest
if (fs.existsSync('manifest.json')) {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    if (manifest.display === 'standalone') {
        console.log('✅ PWA manifest configured for standalone mode');
    } else {
        console.log('❌ PWA manifest not configured for standalone mode');
    }
} else {
    console.log('❌ PWA manifest missing');
}

// Check mobile CSS
const stylesCss = fs.readFileSync('styles.css', 'utf8');
if (stylesCss.includes('mobile') || stylesCss.includes('@media')) {
    console.log('✅ Mobile CSS optimizations present');
} else {
    console.log('❌ Mobile CSS optimizations missing');
}

// Check icons
console.log('\n🎨 Checking PWA icons...');
const iconSizes = [72, 96, 128, 144, 152, 192, 384, 512];
iconSizes.forEach(size => {
    const iconPath = `icons/icon-${size}x${size}.png`;
    if (fs.existsSync(iconPath)) {
        console.log(`✅ ${iconPath}`);
    } else {
        console.log(`❌ ${iconPath} - MISSING`);
    }
});

// Generate deployment instructions
console.log('\n🚀 Mobile Deployment Instructions:');
console.log('1. Start the server: node server.js');
console.log('2. Open http://localhost:3000 on your mobile device');
console.log('3. Add to home screen for PWA experience');
console.log('4. Test base creation and management features');
console.log('5. Test multiplayer features with multiple devices');

console.log('\n📱 Mobile Testing Checklist:');
console.log('□ Base creation works on mobile');
console.log('□ Context menu is touch-friendly');
console.log('□ Map zoom and pan work smoothly');
console.log('□ WebSocket connection is stable');
console.log('□ PWA installation works');
console.log('□ Offline functionality works');

console.log('\n🌌 Eldritch Sanctuary is ready for mobile deployment!');
console.log('May the cosmic forces guide your testing journey! ✨');
