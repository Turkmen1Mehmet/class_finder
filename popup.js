document.getElementById('findClasses').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  const results = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: findClassNames,
  });

  displayResults(results[0].result);
});

function findClassNames() {
  const elements = document.querySelectorAll('*');
  const classMap = new Map();

  elements.forEach(element => {
    if (element.className && typeof element.className === 'string') {
      const text = element.textContent.trim();
      if (text) {
        element.classList.forEach(className => {
          if (!classMap.has(className)) {
            classMap.set(className, text.substring(0, 50));
          }
        });
      }
    }
  });

  const result = {};
  classMap.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}

function displayResults(results) {
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  for (const [className, text] of Object.entries(results)) {
    resultDiv.innerHTML += `
      <div>
        <strong>Class:</strong> ${className}<br>
        <strong>İçerik:</strong> ${text}<br>
        <hr>
      </div>
    `;
  }
}

document.getElementById('copyButton').addEventListener('click', () => {
  const resultText = document.getElementById('result').innerText;
  navigator.clipboard.writeText(resultText);
  alert('Sonuçlar panoya kopyalandı!');
}); 