let titleInput = document.getElementById("title");
let priceInput = document.getElementById("price");
let taxesInput = document.getElementById("taxes");
let adsInput = document.getElementById("ads");
let discountInput = document.getElementById("discount")
let total = document.getElementById("total");
let countInput = document.getElementById("count")
let categoryInput = document.getElementById("category");
let createButton = document.getElementById("submit");
let searchInput = document.getElementById("search");
let searchTitleButton = document.getElementById("searchTitle");
let searchCategoryButton = document.getElementById("searchCategory");
let deleteAllButton = document.getElementById("deleteAll");
let tableBody = document.querySelector("table tbody");

function getTotal() {
    priceInput.oninput = function () {
        calcTotal();
    }
    taxesInput.oninput = function () {
        calcTotal();
    }
    adsInput.oninput = function () {
        calcTotal();
    }
    discountInput.oninput = function () {
        calcTotal();
    }
}

function calcTotal() {
    let priceValue = priceInput.value
        , taxesValue = taxesInput.value
        , adsValue = adsInput.value
        , discountValue = discountInput.value;

    if (priceValue.length) {
        total.textContent = +(priceValue) + Number(taxesValue) + +(adsValue) - Number(discountValue);
        total.style.cssText = "background-color:#040";
    }
    else {
        total.textContent = "";
        total.style.backgroundColor = "#a00d02";
    }
}

getTotal();

let dataProducts = [];
let mode = "create";
let index = 0;
let modeSearch = "title";

if (window.localStorage.getItem("products")) {
    dataProducts = JSON.parse(window.localStorage.getItem("products"))
    createProducts();
    createButtonDeleteAll();
}

createButton.onclick = modifyData;
window.onkeyup = function (e) {
    if (e.key == "Enter")
        modifyData();
}

function modifyData() {
    let objectProduct = {
        id: 0,
        title: titleInput.value,
        price: priceInput.value,
        taxes: taxesInput.value,
        ads: adsInput.value,
        discount: discountInput.value,
        total: total.textContent,
        categor: categoryInput.value
    }

    if (titleInput.value.length && priceInput.value.length && categoryInput.value.length) {
        if (mode == "create") {
            if (countInput.value <= 100) {
                if (countInput.value != "" && countInput.value > 1) {
                    createCountProducts(objectProduct);
                }
                else {
                    dataProducts.push(objectProduct);
                }
                clearInputs();
            }
            else {
                alert("Sorry, Count ( 1 => 100 )");
            }
        }
        else {
            dataProducts[index] = objectProduct;
            mode = "create";
            createButton.innerHTML = "Create";
            countInput.style.display = "block";
            clearInputs();
        }
    }
    else {
        alert("Title, Price And Category Are Required \n ")
    }

    searchInput.value = "";
    localStorage.setItem("products", JSON.stringify(dataProducts))
    createProducts();
    calcTotal();
}

function createProducts() {
    tableBody.innerHTML = "";
    for (let i = 0; i < dataProducts.length; i++) {
        let tableRow = document.createElement("tr");
        dataProducts[i].id = i + 1;
        let product = Object.values(dataProducts[i]);
        for (let j = 0; j < product.length; j++) {
            let tableDataCell = document.createElement("td");
            tableDataCell.textContent = product[j];
            tableRow.append(tableDataCell);
        }

        btnUpdateOnClick(tableRow, i);

        btnDeleteOnClick(tableRow, i);

        tableBody.append(tableRow);
    }
    createButtonDeleteAll();
}

function clearInputs() {
    titleInput.value = "";
    priceInput.value = "";
    taxesInput.value = "";
    adsInput.value = "";
    discountInput.value = "";
    total.textContent = "";
    countInput.value = "";
    categoryInput.value = "";
}

function btnDeleteOnClick(section, index) {
    let tableDataCell = document.createElement("td");
    let btn = document.createElement("button");
    btn.textContent = "Delete";
    btn.className = "delete";
    btn.onclick = function () {
        deleteProduct(index);
    }
    tableDataCell.append(btn);
    section.append(tableDataCell)
}

function deleteProduct(i) {
    if (mode != "update") {
        dataProducts.splice(i, 1);
        localStorage.setItem("products", JSON.stringify(dataProducts))
        createProducts();
    }
    else {
        alert("UpDating...")
    }
}

function createButtonDeleteAll() {
    if (dataProducts.length)
        deleteAllButton.innerHTML = `<button onclick =" deleteAllProduct() " class="deleteAll" > DeleteAll ( ${dataProducts.length} ) </button>`
    else
        deleteAllButton.innerHTML = "";

}

function deleteAllProduct() {
    if (mode != "update") {
        dataProducts.length = 0; // dataProducts.splice(0);
        window.localStorage.clear();
        // window.localStorage.removeItem("products")
        // localStorage.setItem("products", JSON.stringify(dataProducts))
        createProducts();
    }
    else {
        alert("UpDating...")
    }
}

function createCountProducts(objectProduct) {
    let count = +countInput.value;
    for (let i = 0; i < count; i++) {
        dataProducts.push(objectProduct);
    }
}

function btnUpdateOnClick(section, index) {
    let tableDataCell = document.createElement("td");
    let btn = document.createElement("button");
    btn.textContent = "UpDate";
    btn.onclick = function () {
        mode = "update";
        createButton.innerHTML = "UpDate";
        countInput.style.display = "none";
        updateProduct(index);
    }
    tableDataCell.append(btn);
    section.append(tableDataCell)
}

function updateProduct(i) {
    titleInput.value = dataProducts[i].title;
    priceInput.value = dataProducts[i].price;
    taxesInput.value = dataProducts[i].taxes;
    adsInput.value = dataProducts[i].ads;
    discountInput.value = dataProducts[i].discount;
    calcTotal();
    categoryInput.value = dataProducts[i].categor;
    index = i;
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
    preventFromDeletion();
}

function preventFromDeletion() {
    let deleteAllBtn = document.querySelector(" .deleteAll")
    deleteAllBtn.classList.add("prevent")
    let deleteBtn = document.querySelectorAll("td .delete");
    deleteBtn.forEach((btn) => {
        btn.classList.add("prevent");
    })
}

searchInput.oninput = function () {
    let value = searchInput.value;
    filterProducts(value);
}

searchTitleButton.onclick = function () {
    modeSearch = "title";
    searchData(searchTitleButton);
}

searchCategoryButton.onclick = function () {
    modeSearch = "category";
    searchData(searchCategoryButton);
}

function searchData(input) {
    searchInput.value = "";
    searchInput.setAttribute("placeholder", input.innerHTML);
    createProducts();
    searchInput.focus();
}

function filterProducts(value) {

    let products = (document.querySelectorAll("tbody tr"));
    products.forEach((product) => {
        product.style.display = "none";
        if (modeSearch == "title") {
            if ((product.children[1].textContent.toLowerCase()).includes(value.toLowerCase())) {
                product.style.display = "table-row";
            }
        }
        else {
            if ((product.children[7].textContent.toLowerCase()).includes(value.toLowerCase())) {
                product.style.display = "table-row";
            }
        }
    })
}