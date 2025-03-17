document.addEventListener("DOMContentLoaded", () => {
  const togglePanelButton = document.getElementById("togglePanelButton");
  const optionsPanel = document.getElementById("optionsPanel");
  const closePanelButton = document.querySelector(".menu-close-icon");

  togglePanelButton.addEventListener("click", () => {
    if (optionsPanel.classList.contains("open")) {
      optionsPanel.style.transform = "translate(-1000px, -1000px)";
      optionsPanel.classList.remove("open");
    } else {
      optionsPanel.style.transform = "translate(0, 0)";
      optionsPanel.classList.add("open");
    }
  });

  closePanelButton.addEventListener("click", () => {
    optionsPanel.style.transform = "translate(-1000px, -1000px)";
    optionsPanel.classList.remove("open");
  });

  function parseData(data, delimiter) {
    const lines = data.split("\n");
    const headers = lines[0].split(delimiter);
    const rows = lines
      .slice(1)
      .filter((line) => line.trim() !== "")
      .map((line) => line.split(delimiter));
    return { headers, rows };
  }

  function displayTable(data) {
    const table = document.getElementById("dataTable");
    table.innerHTML = "";

    const headerRow = table.createTHead().insertRow();
    data.headers.forEach((header) => {
      const th = document.createElement("th");
      th.textContent = header;
      headerRow.appendChild(th);
    });

    const tbody = table.createTBody();
    data.rows.forEach((row) => {
      const tr = tbody.insertRow();
      row.forEach((cell) => {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      });
    });
  }

  function loadData(data, delimiter) {
    try {
      const parsedData = parseData(data, delimiter);
      displayTable(parsedData);
    } catch (error) {
      alert("Error parsing data: " + error.message);
    }
  }

  document.getElementById("loadUrlButton").addEventListener("click", () => {
    const url = document.getElementById("urlInput").value;
    const delimiter = document.getElementById("delimiter").value;
    fetch(url, { mode: "cors" })
      .then((response) => response.text())
      .then((data) => loadData(data, delimiter))
      .catch((error) => alert("Error loading URL: " + error.message));
  });

  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    const delimiter = document.getElementById("delimiter").value;
    reader.onload = (e) => loadData(e.target.result, delimiter);
    reader.readAsText(file);
  });

  document.getElementById("loadPasteButton").addEventListener("click", () => {
    const data = document.getElementById("pasteData").value;
    const delimiter = document.getElementById("delimiter").value;
    loadData(data, delimiter);
  });

  const urlParams = new URLSearchParams(window.location.search);
  const urlParam = urlParams.get("url");
  const delimiter = document.getElementById("delimiter").value;
  const defaultURL =
    "https://raw.githubusercontent.com/18F/analytics.usa.gov/refs/heads/develop/ga4-data/defense/os-browsers.csv";

  if (urlParam) {
    fetch(urlParam, { mode: "cors" })
      .then((response) => response.text())
      .then((data) => loadData(data, delimiter))
      .catch((error) => alert("Error loading URL parameter: " + error.message));
  } else {
    fetch(defaultURL, { mode: "cors" })
      .then((response) => response.text())
      .then((data) => loadData(data, delimiter))
      .catch((error) => alert("Error loading default URL: " + error.message));
  }
});




if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

if ('launchQueue' in window.navigator) {
    window.navigator.launchQueue.setConsumer(launchParams => {
        if (!launchParams.files.length) {
            return;
        }
        for (const fileHandle of launchParams.files) {
            const file = await fileHandle.getFile();
            const text = await file.text();
            const delimiter = document.getElementById('delimiter').value;
            loadData(text, delimiter);
        }
    });
}
