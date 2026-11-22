
let records = JSON.parse(localStorage.getItem("licenseRecords") || "[]");

function saveData() {
  const name = document.getElementById("name").value.trim();
  const birthdate = document.getElementById("birthdate").value;
  const licenseNumber = document.getElementById("licenseNumber").value.trim();
  const address = document.getElementById("address").value.trim();
  const domicile = document.getElementById("domicile").value.trim();

  if (!name) {
    alert("氏名を入力してください");
    return;
  }

  const record = {
    id: Date.now(),
    name,
    birthdate,
    licenseNumber,
    address,
    domicile
  };

  records.push(record);
  localStorage.setItem("licenseRecords", JSON.stringify(records));

  document.getElementById("name").value = "";
  document.getElementById("birthdate").value = "";
  document.getElementById("licenseNumber").value = "";
  document.getElementById("address").value = "";
  document.getElementById("domicile").value = "";

  showData();
  alert("保存しました");
}

function showData() {
  const keyword = document.getElementById("search").value.trim();
  const list = document.getElementById("list");

  list.innerHTML = "";

  records
    .filter(record => record.name.includes(keyword))
    .forEach(record => {
      const div = document.createElement("div");
      div.className = "record";

      const title = document.createElement("h4");
      title.textContent = record.name;

      const details = document.createElement("p");
      details.textContent =
        "生年月日：" + (record.birthdate || "") +
        "\n免許番号：" + (record.licenseNumber || "") +
        "\n住所：" + (record.address || "") +
        "\n本籍地：" + (record.domicile || "");

      div.appendChild(title);
      div.appendChild(details);
      list.appendChild(div);
    });
}

function backupData() {
  const blob = new Blob(
    [JSON.stringify(records, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "license-backup.json";
  a.click();
  URL.revokeObjectURL(url);
}

function restoreData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      if (!Array.isArray(data)) {
        throw new Error("形式が違います");
      }

      records = data.map(record => ({
        ...record,
        birthdate: record.birthdate || "",
        licenseNumber: record.licenseNumber || ""
      }));

      localStorage.setItem("licenseRecords", JSON.stringify(records));
      showData();
      alert("復元しました");
    } catch {
      alert("バックアップファイルを読み込めませんでした");
    }
  };

  reader.readAsText(file);
}

showData();
