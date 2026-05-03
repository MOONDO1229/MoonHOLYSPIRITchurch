const { saveData, getData } = require('./lib/db');
const settings = {
  welcomeTitle: "Test",
  theme: { primaryColor: "#000", secondaryColor: "#fff" },
  history: []
};
const success = saveData('settings', [settings]);
console.log('Save success:', success);
const loaded = getData('settings');
console.log('Loaded:', JSON.stringify(loaded, null, 2));
