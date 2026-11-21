let records = JSON.parse(localStorage.getItem("licenseRecords") || "[]");

function saveData() {
  const name = document.getElementById("name").value.trim();
  const address = document.getElementById("address").value.trim();
  const domicile = document.getElementById("domicile").value.trim();

  if (!name) {
    alert("氏名を入力してください");
    return;
  }

  records.push({
    id: Date.now(),
    name,
    address,
    domicile,
    date: new Date().toLocaleString("ja-JP")
  });

  saveRecords();
  document.getElementById("name").value = "";
  document.getElementById("address").value = "";
  document.getElementById("domicile").value = "";
  showData();
}

function saveRecords() {
  localStorage.setItem("licenseRecords", JSON.stringify(records));
}

function showData() {
  const keyword = document.getElementById("search").value.trim();
  const list = document.getElementById("list");
  list.innerHTML = "";

  records.filter(r => r.name.includes(keyword))
    .forEach(r => {
      const item = document.createElement("div");
      item.className = "item";

      const title = document.createElement("strong");
      title.textContent = r.name;

      const details = document.createElement("p");
      details.textContent =
        "住所：" + r.address +
        "\n本籍地：" + r.domicile +
        "\n登録日：" + (r.date || "記録なし");
      details.style.whiteSpace = "pre-wrap";

      const edit = document.createElement("button");
      edit.textContent = "編集";
      edit.onclick = () => editData(r.id);

      const del = document.createElement("button");
      del.textContent = "削除";
      del.style.marginTop = "5px";
      del.onclick = () => deleteData(r.id);

      item.append(title, details, edit, del);
      list.appendChild(item);
    });
}

function editData(id) {
  const r = records.find(x => x.id === id);
  if (!r) return;

  document.getElementById("name").value = r.name;
  document.getElementById("address").value = r.address;
  document.getElementById("domicile").value = r.domicile;

  records = records.filter(x => x.id !== id);
  saveRecords();
  showData();

  alert("内容を変更して、もう一度保存してください");
}

function deleteData(id) {
  if (!confirm("削除しますか？")) return;
  records = records.filter(x => x.id !== id);
  saveRecords();
  showData();
}

function backupData() {
  const blob = new Blob(
    [JSON.stringify(records, null, 2)],
    { type: "application/json" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "免許証管理バックアップ.json";
  a.click();
  URL.revokeObjectURL(url);
}

function restoreData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data)) throw new Error();

      if (!confirm("現在のデータを置き換えますか？")) return;

      records = data;
      saveRecords();
      showData();
      alert("復元しました");
    } catch {
      alert("正しいバックアップファイルではありません");
    }
  };
  reader.readAsText(file);
}

showData();
