function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function removeAccents(str) {
  return `${str}`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function delay(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function createDiv(classList = ["form-floating"]) {
  let div = document.createElement("div");
  classList.forEach((x) => {
    div.classList.add(x);
  });
  return div;
}

/**
 *
 * @param {*} id // id input
 * @param {*} type // kieu
 * @param {*} placeholder
 * @param {*} classList
 * @param {*} idDataList
 * @param {*} dataId
 * @param {*} required
 * @returns
 */
function createInput(
  id,
  type,
  placeholder,
  classList,
  idDataList,
  dataId,
  required = false,
  value = null
) {
  const input = document.createElement("input");
  input.id = id;
  input.type = type;
  if (required) input.required = required;
  if (type == "number") input.min = 0;
  input.setAttribute("placeholder", placeholder);
  Array.from(classList).forEach((x) => {
    input.classList.add(x);
  });
  if (idDataList) {
    input.setAttribute("list", idDataList);
  }
  if (dataId) {
    input.setAttribute("data-id", dataId);
  }
  if (value) {
    input.value = value;
  }
  return input;
}
function createLable(forlable, text) {
  const label = document.createElement("label");
  label.setAttribute("for", forlable);
  label.textContent = text;
  return label;
}
function createDataList(id, array) {
  let dataList = document.createElement("datalist");
  dataList.id = id;
  array
    .map((x) => x.trim())
    .forEach((e) => {
      const option = document.createElement("option");
      option.value = e;
      dataList.appendChild(option);
    });
  return dataList;
}

function getDataInTable(selectElement, removeFistElement = true) {
  let data = [];
  //gets table
  var oTable = document.querySelector(selectElement);

  //gets rows of table
  var rowLength = oTable.rows.length;

  //loops through rows
  for (i = 0; i < rowLength; i++) {
    let row = [];
    //gets cells of current row
    var oCells = oTable.rows.item(i).cells;

    //gets amount of cells of current row
    var cellLength = oCells.length;

    //loops through each cell in current row
    for (var j = 0; j < cellLength; j++) {
      // get your cell info here

      var cellVal = oCells.item(j).querySelector("input")?.value;
      row.push(cellVal);
    }
    if (removeFistElement) row.shift();
    data.push(row);
  }
  return data;
}
function deleteRow() {
  const table = document.querySelector(".table.nhap-hangs");
  const trLength = document.querySelectorAll(".table.nhap-hangs tr").length;
  table.deleteRow(trLength - 1);
}
