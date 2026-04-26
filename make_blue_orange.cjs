const fs = require('fs');
const file = 'src/pages/LandingPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// Primary gradients – blue to orange
content = content.replace(/from-indigo-600 to-purple-600/g, 'from-blue-600 to-orange-600');
content = content.replace(/from-indigo-50 to-purple-50/g, 'from-blue-50 to-orange-50');

// Background blob colors – brighter blues and oranges
content = content.replace(/bg-indigo-400/g, 'bg-blue-400');
content = content.replace(/bg-purple-400/g, 'bg-orange-400');
content = content.replace(/bg-pink-400/g, 'bg-orange-300');

// Shadows
content = content.replace(/shadow-indigo-500\/25/g, 'shadow-blue-500/25');
content = content.replace(/shadow-indigo-500\/30/g, 'shadow-orange-500/30');

// Text colors
content = content.replace(/text-indigo-600/g, 'text-blue-600');
content = content.replace(/text-indigo-700/g, 'text-blue-700');
content = content.replace(/text-indigo-100/g, 'text-gray-100');
content = content.replace(/text-indigo-200/g, 'text-gray-200');
content = content.replace(/hover:text-indigo-600/g, 'hover:text-blue-600');
content = content.replace(/text-indigo-500/g, 'text-blue-500');

// Backgrounds and borders
content = content.replace(/bg-indigo-50/g, 'bg-blue-50');
content = content.replace(/bg-indigo-50\/50/g, 'bg-blue-50/50');
content = content.replace(/border-indigo-100/g, 'border-blue-100');
content = content.replace(/border-indigo-200/g, 'border-blue-200');
content = content.replace(/border-indigo-300/g, 'border-blue-300');
content = content.replace(/selection:bg-indigo-200/g, 'selection:bg-blue-200');
content = content.replace(/selection:text-indigo-900/g, 'selection:text-blue-900');

// Dark sections gradients – deep blue to orange
content = content.replace(/from-indigo-900 to-purple-900/g, 'from-blue-900 to-orange-900');
content = content.replace(/bg-indigo-800\/30/g, 'bg-blue-800/30');
content = content.replace(/border-indigo-700\/50/g, 'border-blue-700/50');
content = content.replace(/from-indigo-300 to-transparent/g, 'from-blue-300 to-transparent');

// Footer dark background
content = content.replace(/bg-slate-900/g, 'bg-blue-900');
content = content.replace(/bg-slate-950/g, 'bg-blue-950');

fs.writeFileSync(file, content);
console.log('LandingPage colors updated to professional blue/orange palette.');
