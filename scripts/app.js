"use strict";
const itemsContainer = document.querySelectorAll('.items-container');
let actualContainer, actualBtn, actualUl, actualForm, actualTextInput, actualValidation;
// Function pour ajouter un item dans une liste
function addContainerListners(currentContainer) {
    // Récupération des éléments du container
    const currentContainerDeleteBtn = currentContainer.querySelector('.delete-container-btn');
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn');
    const currentCloseformBtn = currentContainer.querySelector('.close-form-btn');
    const currentForm = currentContainer.querySelector('form');
    // Ajout des listeners
    deleteBtnListeners(currentContainerDeleteBtn);
    addItemBtnListeners(currentAddItemBtn);
    closingFormBtnListeners(currentCloseformBtn);
    addFormSubmitListeners(currentForm);
    addDDListeners(currentContainer);
}
// Ajout des listeners pour chaque container
itemsContainer.forEach((container) => {
    addContainerListners(container);
});
// function pour supprimer un btn listener
function deleteBtnListeners(btn) {
    btn.addEventListener('click', handleContainerDeletion);
}
function addItemBtnListeners(btn) {
    btn.addEventListener('click', handleAddItem);
}
function closingFormBtnListeners(btn) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}
function addFormSubmitListeners(form) {
    form.addEventListener('submit', createNewItem);
}
// Drag and Drop
function addDDListeners(element) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}
function handleContainerDeletion(e) {
    const btn = e.target;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')];
    const containers = [...document.querySelectorAll('.items-container')];
    containers[btnsArray.indexOf(btn)].remove();
}
function handleAddItem(e) {
    const btn = e.target;
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}
function toggleForm(btn, form, action) {
    if (!action) {
        form.style.display = 'none';
        btn.style.display = 'block';
    }
    else if (action) {
        form.style.display = 'block';
        btn.style.display = 'none';
    }
}
function setContainerItems(btn) {
    actualBtn = btn;
    actualContainer = btn.parentElement;
    actualUl = actualContainer.querySelector('ul');
    actualForm = actualContainer.querySelector('form');
    actualTextInput = actualContainer.querySelector('input');
    actualValidation = actualContainer.querySelector('.validation-msg');
}
//  function pour creer nouvel item
function createNewItem(e) {
    e.preventDefault();
    // Validation
    if (actualTextInput.value.length === 0) {
        actualValidation.textContent = "Must not be empty";
        return;
    }
    else {
        actualValidation.textContent = "";
    }
    // Creation de Item
    const itemContent = actualTextInput.value;
    const li = `
    <li class="item" draggable="true">
        <p>${itemContent}</p>
        <button>X</button>
        </li>`;
    actualUl.insertAdjacentHTML('beforeend', li);
    const item = actualUl.lastElementChild;
    const iBtn = item.querySelector('button');
    handleItemDeletion(iBtn);
    addDDListeners(item);
    actualTextInput.value = "";
}
function handleItemDeletion(btn) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement;
        elToRemove.remove();
    });
}
// Drag and Drop
let dragSrcEl;
function handleDragStart(e) {
    var _a;
    e.stopPropagation();
    if (actualContainer)
        toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this;
    (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.setData('text/html', this.innerHTML);
}
function handleDragOver(e) {
    e.preventDefault();
}
function handleDrop(e) {
    var _a;
    e.stopPropagation();
    const receptionEl = this;
    if (dragSrcEl.nodeName === 'LI' && receptionEl.classList.contains("items-container")) {
        receptionEl.querySelector('ul').appendChild(dragSrcEl);
        addDDListeners(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector('button'));
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = (_a = e.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('text/html');
        if (this.classList.contains("items-container")) {
            addContainerListners(this);
            this.querySelectorAll('li').forEach((li) => {
                handleItemDeletion(li.querySelector('button'));
                addDDListeners(li);
            });
        }
        else {
            addDDListeners(this);
            handleItemDeletion(this.querySelector('button'));
        }
    }
}
function handleDragEnd(e) {
    e.stopPropagation();
    if (this.classList.contains('items-container')) {
        addContainerListners(this);
        this.querySelectorAll('li').forEach((li) => {
            handleItemDeletion(li.querySelector('button'));
            addDDListeners(li);
        });
    }
    else {
        addDDListeners(this);
    }
}
// Add New Container
const addContainerBtn = document.querySelector('.add-container-btn');
const addContainerForm = document.querySelector('.add-new-container form');
const addContainerFormInput = document.querySelector('.add-new-container input');
const validationNewContainer = document.querySelector('.add-new-container .validation-msg');
const addContainerCloseBtn = document.querySelector('.close-form-btn');
const addNewContainer = document.querySelector('.add-new-container');
const containersList = document.querySelector('.main-content');
addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);
});
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
});
addContainerForm.addEventListener('submit', createNewContainer);
function createNewContainer(e) {
    e.preventDefault();
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Must not be empty";
        return;
    }
    else {
        validationNewContainer.textContent = "";
    }
    const itemContainer = document.querySelector('.items-container');
    const newContainer = itemContainer.cloneNode(true);
    const newContainerContent = `
  
    <div class="top-container">
        <h2>${addContainerFormInput.value}</h2>
        <button class="delete-container-btn">
            X
        </button>
    </div>
    <ul></ul>
    <button class="add-item-btn">
        Add an item
    </button>
    <form autocomplete="off">
        <div class="top-form-container">
            <label for="item">
                Add a new item
            </label>
            <button type="button" class="close-form-btn">
                X
            </button>
        </div>
        <input type="text" id="item" />
        <span class="validation-msg"></span>
        <button type="submit">Submit</button>
    </form>
    `;
    newContainer.innerHTML = newContainerContent;
    containersList === null || containersList === void 0 ? void 0 : containersList.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListners(newContainer);
}
