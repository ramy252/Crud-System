const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productCategory = document.getElementById("productCategory");
const productDescription = document.getElementById("productDescription");
const tableBody = document.getElementById('tableBody');
const btnUpdate = document.getElementById('btnUpdate');
const btnAdd = document.getElementById('btnAdd');
let inputSearch = document.getElementById('inputSearch');
const btnDeleteAll = document.getElementById('btnDeleteAll')
let productList = [];

// Add global click event listener to handle clicks outside input fields
document.addEventListener('click', function(event) {
    if (!event.target.closest('.form-control') && !event.target.closest('.validation-list')) {
        hideAllValidationLists();
    }
});

if (localStorage.getItem("AllIteams") != null) {
    productList = JSON.parse(localStorage.getItem("AllIteams"));
    display();
}

let currentIndex = 0;

function addProduct() {
    if (!validationName() || !validationPrice() || !validationType() || !validationDescription()) {
        return; // Stop if any validation fails
    }
    
    let product = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        description: productDescription.value
    };

    productList.push(product);
    localStorage.setItem("AllIteams", JSON.stringify(productList));

    clearForm();
    display();
}

function display() {
    let cartona = ``;
    for (let i = 0; i < productList.length; i++) {
        cartona += ` <tr>
                        <td scope="row">${i}</td>
                        <td scope="row">${productList[i].name}</td>
                        <td>${productList[i].price}</td>
                        <td>${productList[i].category}</td>
                        <td>${productList[i].description}</td>
                        <td><button type="button" onclick="setProduct(${i})" class="btn btn-warning">Update</button></td>
                        <td><button type="button" onclick="deleteProduct(${i})" class="btn btn-danger">Delete</button></td>
                    </tr>`;
    }
    tableBody.innerHTML = cartona;
}

function deleteProduct(index) {
    productList.splice(index, 1);
    localStorage.setItem("AllIteams", JSON.stringify(productList));
    display();
}

function deleteAllProducts() {
    if (confirm("Are you sure you want to delete all products?")) {
        productList = [];
        localStorage.removeItem("AllIteams");
        display();
    }
}

function search() {
    let tirm = inputSearch.value;
    let cartona = ``;
    for (let i = 0; i < productList.length; i++) {
        if (productList[i].name.toLowerCase().includes(tirm.toLowerCase()) ||
            productList[i].category.toLowerCase().includes(tirm.toLowerCase()) ||
            productList[i].description.toLowerCase().includes(tirm.toLowerCase()) ||
            productList[i].price.includes(tirm)) {
            cartona += `<tr>
                            <td scope="row">${i}</td>
                            <td scope="row">${productList[i].name}</td>
                            <td>${productList[i].price}</td>
                            <td>${productList[i].category}</td>
                            <td>${productList[i].description}</td>
                            <td><button type="button" class="btn btn-warning" onclick="setProduct(${i})">Update</button></td>
                            <td><button type="button" onclick="deleteProduct(${i})" class="btn btn-danger">Delete</button></td>
                        </tr>`;
        }
    }
    tableBody.innerHTML = cartona;
}

function setProduct(index) {
    currentIndex = index;
    productName.value = productList[index].name;
    productPrice.value = productList[index].price;
    productCategory.value = productList[index].category;
    productDescription.value = productList[index].description;
    btnUpdate.classList.replace('d-none', 'd-block');
    btnAdd.classList.replace('d-block', 'd-none');
    btnDeleteAll.classList.replace('d-block', 'd-none');
}

function updateProduct() {
    if (!validationName() || !validationPrice() || !validationType() || !validationDescription()) {
        return; // Stop if any validation fails during update
    }
    
    let product = {
        name: productName.value,
        price: productPrice.value,
        category: productCategory.value,
        description: productDescription.value
    };
    productList.splice(currentIndex, 1, product);
    localStorage.setItem("AllIteams", JSON.stringify(productList));
    btnAdd.classList.replace('d-none', 'd-block');
    btnUpdate.classList.replace('d-block', 'd-none');
    display();
    clearForm();
}

// Function to show validation list when user starts typing (onfocus or oninput)
function showValidation(validationId) {
    document.getElementById(validationId).style.display = 'block';
}

// Function to hide validation list if the input is empty or valid (onblur)
function hideValidation(validationId, isValid) {
    const input = document.querySelector(`#${validationId}`).previousElementSibling;
    if (input.value.trim() === "" || isValid) {
        document.getElementById(validationId).style.display = 'none';
        if (input.value.trim() === "") {
            resetValidationList(validationId);  // Reset the validation checks when the input is empty
        }
    }
}

// Hide all validation lists when clicking outside
function hideAllValidationLists() {
    const validationLists = document.querySelectorAll('.validation-list');
    validationLists.forEach(list => list.style.display = 'none');
}

// Function to reset validation check statuses when input is cleared
function resetValidationList(validationId) {
    const listItems = document.querySelectorAll(`#${validationId} li`);
    listItems.forEach(item => {
        item.classList.remove('valid-check');
        item.classList.add('invalid-check');
    });
}

// Name validation function
function validationName() {
    const nameInput = productName.value.trim();
    const regexUppercase = /^[A-Z]/;
    const nameUppercase = document.getElementById('nameUppercase');
    const nameLength = document.getElementById('nameLength');
    
    let isValid = true;

    // Check if the first letter is uppercase
    if (regexUppercase.test(nameInput)) {
        nameUppercase.classList.replace('invalid-check', 'valid-check');
    } else {
        nameUppercase.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Check if the length is between 3 and 20 characters
    if (nameInput.length >= 3 && nameInput.length <= 20) {
        nameLength.classList.replace('invalid-check', 'valid-check');
    } else {
        nameLength.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Set the valid or invalid class on the input
    if (isValid) {
        productName.classList.add("is-valid");
        productName.classList.remove("is-invalid");
        hideValidation('nameValidationList', true); // Hide the list if the input is valid
        return true;
    } else {
        productName.classList.add("is-invalid");
        productName.classList.remove("is-valid");
        showValidation('nameValidationList'); // Show the list if input is invalid
        return false;
    }
}

// Price validation function
function validationPrice() {
    const priceInput = productPrice.value.trim();
    const priceValid = document.getElementById('priceValid');
    const priceGreater = document.getElementById('priceGreater');
    const regexPrice = /^[1-9]\d*(\.\d+)?$/;
    
    let isValid = true;

    // Check if it's a valid number
    if (regexPrice.test(priceInput)) {
        priceValid.classList.replace('invalid-check', 'valid-check');
    } else {
        priceValid.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Check if it's greater than 0
    if (parseFloat(priceInput) > 0) {
        priceGreater.classList.replace('invalid-check', 'valid-check');
    } else {
        priceGreater.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Set the valid or invalid class on the input
    if (isValid) {
        productPrice.classList.add("is-valid");
        productPrice.classList.remove("is-invalid");
        hideValidation('priceValidationList', true); // Hide the list if the input is valid
        return true;
    } else {
        productPrice.classList.add("is-invalid");
        productPrice.classList.remove("is-valid");
        showValidation('priceValidationList'); // Show the list if input is invalid
        return false;
    }
}

// Category validation function
function validationType() {
    const categoryInput = productCategory.value.trim();
    const categoryAlphabetic = document.getElementById('categoryAlphabetic');
    const categoryLength = document.getElementById('categoryLength');
    const regexAlphabetic = /^[A-Za-z\s]+$/;
    
    let isValid = true;

    // Check if the category contains only letters
    if (regexAlphabetic.test(categoryInput)) {
        categoryAlphabetic.classList.replace('invalid-check', 'valid-check');
    } else {
        categoryAlphabetic.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Check if the length is between 3 and 15 characters
    if (categoryInput.length >= 3 && categoryInput.length <= 15) {
        categoryLength.classList.replace('invalid-check', 'valid-check');
    } else {
        categoryLength.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Set the valid or invalid class on the input
    if (isValid) {
        productCategory.classList.add("is-valid");
        productCategory.classList.remove("is-invalid");
        hideValidation('categoryValidationList', true); // Hide the list if the input is valid
        return true;
    } else {
        productCategory.classList.add("is-invalid");
        productCategory.classList.remove("is-valid");
        showValidation('categoryValidationList'); // Show the list if input is invalid
        return false;
    }
}

// Description validation function
function validationDescription() {
    const descriptionInput = productDescription.value.trim();
    const descriptionLength = document.getElementById('descriptionLength');
    
    let isValid = true;

    // Check if the length is between 6 and 50 characters
    if (descriptionInput.length >= 4 && descriptionInput.length <= 50) {
        descriptionLength.classList.replace('invalid-check', 'valid-check');
    } else {
        descriptionLength.classList.replace('valid-check', 'invalid-check');
        isValid = false;
    }

    // Set the valid or invalid class on the input
    if (isValid) {
        productDescription.classList.add("is-valid");
        productDescription.classList.remove("is-invalid");
        hideValidation('descriptionValidationList', true); // Hide the list if the input is valid
        return true;
    } else {
        productDescription.classList.add("is-invalid");
        productDescription.classList.remove("is-valid");
        showValidation('descriptionValidationList'); // Show the list if input is invalid
        return false;
    }
}

function clearForm() {
    productName.value = '';
    productPrice.value = '';
    productCategory.value = '';
    productDescription.value = '';
    productName.classList.remove("is-valid");
    productPrice.classList.remove("is-valid");
    productCategory.classList.remove("is-valid");
    productDescription.classList.remove("is-valid");
}
