
let records = JSON.parse(localStorage.getItem("licenseRecords") || "[]");
let editingId = null;

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

  if (editingId !== null) {
    const index = records.findIndex(r => r.id === editingId);

    if (index !== -1) {
      records[index] = {
        ...records[index],
        name,
        birthdate,
        licenseNumber,
        address,
        domicile
      };
    }

    editingId = null;
  } else {
    records.push({
      id: Date.now(),
      name,
      birthdate,
      licenseNumber,
      address,
      domicile
    });
  }

  saveToStorage();
  clearForm();
  showData();
  alert("保存しました");
}

function editData(id) {
  const record = records.find(r => r.id === id);
  if (!record) return;

  document.getElementById("name").value = record.name || "";
  document.getElementById("birthdate").value = record.birthdate || "";
  document.getElementById("licenseNumber").value = record.licenseNumber || "";
  document.getElementById("address").value = record.address || "";
  document.getElementById("domicile").value = record.domicile || "";

  editingId = id;

  const button = document.querySelector(".app button");
  button.textContent = "変更を保存する";

  let cancelButton = document.getElementById("cancelEdit");

  if (!cancelButton) {
    cancelButton = document.createElement("button");
    cancelButton.id = "cancelEdit";
    cancelButton.textContent = "編集をキャンセル";
    cancelButton.onclick = cancelEdit;
    button.insertAdjacentElement("afterend", cancelButton);
  }

  window.scrollTo(0, 0);
}

function cancelEdit() {
  editingId = null;
  clearForm();
  showData();

  const button = document.querySelector(".app button");
  button.textContent = "保存する";

  const cancelButton = document.getElementById("cancelEdit");
  if (cancelButton) cancelButton.remove();
}

function deleteData(id) {
  if (!confirm("この登録情報を削除しますか？")) return;

  records = records.filter(r => r.id !== id);

  if (editingId === id) {
    cancelEdit();
  }

  saveToStorage();
  showData();
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("birthdate").value = "";
  document.getElementById("licenseNumber").value = "";
  document.getElementById("address").value = "";
  document.getElementById("domicile").value = "";

  const button = document.querySelector(".app button");
  button.textContent = "保存する";

  const cancelButton = document.getElementById("cancelEdit");
  if (cancelButton) cancelButton.remove();
}

function saveToStorage() {
  localStorage.setItem("licenseRecords", JSON.stringify(records));
}

function showData() {
  const keyword = document.getElementById("search").value.trim();
  const list = document.getElementById("list");

  list.innerHTML = "";

  records
    .filter(record => {
      const name = record.name || "";
      const licenseNumber = record.licenseNumber || "";
      const birthdate = record.birthdate || "";

      return (
        name.includes(keyword) ||
        licenseNumber.includes(keyword) ||
        birthdate.includes(keyword)
      );
    })
    .forEach(record => {
      const div = document.createElement("div");
      div.className = "record";

      const title = document.createElement("h4");
      title.textContent = record.name || "";

      const details = document.createElement("p");
      details.style.whiteSpace = "pre-line";
      details.textContent =
        "生年月日：" + (record.birthdate || "") +
        "\n免許番号：" + (record.licenseNumber || "") +
        "\n住所：" + (record.address || "") +
        "\n本籍地：" + (record.domicile || "");

      const editButton = document.createElement("button");
      editButton.textContent = "編集";
      editButton.onclick = () => editData(record.id);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "削除";
      deleteButton.onclick = () => deleteData(record.id);

      div.appendChild(title);
      div.appendChild(details);
      div.appendChild(editButton);
      div.appendChild(deleteButton);

      list.appendChild(div);
    });
}

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

      records = data.map((record, index) => ({
        ...record,
        id: record.id ?? Date.now() + index,
        birthdate: record.birthdate || "",
        licenseNumber: record.licenseNumber || ""
      }));

      editingId = null;
      saveToStorage();
      clearForm();
      showData();
      alert("復元しました");
    } catch {
      alert("バックアップファイルを読み込めませんでした");
    }

    event.target.value = "";
  };

  reader.readAsText(file);
}

showData();
