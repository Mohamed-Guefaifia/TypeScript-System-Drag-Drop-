const itemsContainer = document.querySelectorAll('.items-container') as NodeListOf<HTMLDivElement>;

let actualContainer: HTMLDivElement,
    actualBtn: HTMLButtonElement,
    actualUl: HTMLUListElement,
    actualForm: HTMLFormElement,
    actualTextInput: HTMLInputElement,
    actualValidation: HTMLSpanElement;


// Function pour ajouter un item dans une liste
function addContainerListners(currentContainer: HTMLDivElement) {
    // Récupération des éléments du container
    const currentContainerDeleteBtn = currentContainer.querySelector('.delete-container-btn') as HTMLButtonElement;
    const currentAddItemBtn = currentContainer.querySelector('.add-item-btn') as HTMLButtonElement;
    const currentCloseformBtn = currentContainer.querySelector('.close-form-btn') as HTMLButtonElement;
    const currentForm = currentContainer.querySelector('form') as HTMLFormElement;


    // Ajout des listeners
    deleteBtnListeners(currentContainerDeleteBtn);
    addItemBtnListeners(currentAddItemBtn);
    closingFormBtnListeners(currentCloseformBtn);
    addFormSubmitListeners(currentForm);
    addDDListeners(currentContainer);
}
// Ajout des listeners pour chaque container
itemsContainer.forEach((container: HTMLDivElement) => {
    addContainerListners(container);
})
// function pour supprimer un btn listener
function deleteBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleContainerDeletion)
}

function addItemBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', handleAddItem);
}

function closingFormBtnListeners(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => toggleForm(actualBtn, actualForm, false));
}

function addFormSubmitListeners(form: HTMLFormElement) {
    form.addEventListener('submit', createNewItem);
}

// Drag and Drop
function addDDListeners(element: HTMLElement) {
    element.addEventListener('dragstart', handleDragStart);
    element.addEventListener('dragover', handleDragOver);
    element.addEventListener('drop', handleDrop);
    element.addEventListener('dragend', handleDragEnd);
}




function handleContainerDeletion(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement;
    const btnsArray = [...document.querySelectorAll('.delete-container-btn')] as HTMLButtonElement[];
    const containers = [...document.querySelectorAll('.items-container')] as HTMLDivElement[];
    containers[btnsArray.indexOf(btn)].remove();
}

function handleAddItem(e: MouseEvent) {
    const btn = e.target as HTMLButtonElement;
    if (actualContainer) toggleForm(actualBtn, actualForm, false);
    setContainerItems(btn);
    toggleForm(actualBtn, actualForm, true);
}

function toggleForm(btn: HTMLButtonElement, form: HTMLFormElement, action: boolean) {
    if (!action) {
        form.style.display = 'none';
        btn.style.display = 'block';
    }
    else if (action) {
        form.style.display = 'block';
        btn.style.display = 'none';
    }
}

function setContainerItems(btn: HTMLButtonElement) {
    actualBtn = btn;
    actualContainer = btn.parentElement as HTMLDivElement;
    actualUl = actualContainer.querySelector('ul') as HTMLUListElement;
    actualForm = actualContainer.querySelector('form') as HTMLFormElement;
    actualTextInput = actualContainer.querySelector('input') as HTMLInputElement;
    actualValidation = actualContainer.querySelector('.validation-msg') as HTMLSpanElement;

}



//  function pour creer nouvel item
function createNewItem(e: Event) {
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
        </li>`
    actualUl.insertAdjacentHTML('beforeend', li);

    const item = actualUl.lastElementChild as HTMLLIElement;
    const iBtn = item.querySelector('button') as HTMLButtonElement;
    handleItemDeletion(iBtn);
    addDDListeners(item);
    actualTextInput.value = "";
}

function handleItemDeletion(btn: HTMLButtonElement) {
    btn.addEventListener('click', () => {
        const elToRemove = btn.parentElement as HTMLLIElement;
        elToRemove.remove();
    })
}


// Drag and Drop

let dragSrcEl: HTMLLIElement;
function handleDragStart(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();

    if (actualContainer) toggleForm(actualBtn, actualForm, false);
    dragSrcEl = this as HTMLLIElement;
    e.dataTransfer?.setData('text/html', this.innerHTML);
}

function handleDragOver(e: DragEvent) {
    e.preventDefault();
}
function handleDrop(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();
    const receptionEl = this as HTMLLIElement;

    if (dragSrcEl.nodeName === 'LI' && receptionEl.classList.contains("items-container")) {
        (receptionEl.querySelector('ul') as HTMLUListElement).appendChild(dragSrcEl);
        addDDListeners(dragSrcEl);
        handleItemDeletion(dragSrcEl.querySelector('button') as HTMLButtonElement);
    }
    if (dragSrcEl !== this && this.classList[0] === dragSrcEl.classList[0]) {
        dragSrcEl.innerHTML = this.innerHTML;
        this.innerHTML = e.dataTransfer?.getData('text/html') as string;
        if (this.classList.contains("items-container")) {
            addContainerListners(this as HTMLDivElement);

            this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
                handleItemDeletion(li.querySelector('button') as HTMLButtonElement);
                addDDListeners(li);

            })
        }
        else {
            addDDListeners(this);
            handleItemDeletion(this.querySelector('button') as HTMLButtonElement);
        }
    }
}

function handleDragEnd(this: HTMLElement, e: DragEvent) {
    e.stopPropagation();
    if (this.classList.contains('items-container')) {
        addContainerListners(this as HTMLDivElement)
        this.querySelectorAll('li').forEach((li: HTMLLIElement) => {
            handleItemDeletion(li.querySelector('button') as HTMLButtonElement);
            addDDListeners(li);

        })
    }
    else {
        addDDListeners(this);

    }
}



// Add New Container

const addContainerBtn = document.querySelector('.add-container-btn') as HTMLButtonElement;
const addContainerForm = document.querySelector('.add-new-container form') as HTMLFormElement;
const addContainerFormInput = document.querySelector('.add-new-container input') as HTMLInputElement;
const validationNewContainer = document.querySelector('.add-new-container .validation-msg') as HTMLSpanElement;
const addContainerCloseBtn = document.querySelector('.close-form-btn') as HTMLButtonElement;
const addNewContainer = document.querySelector('.add-new-container') as HTMLDivElement;
const containersList = document.querySelector('.main-content') as HTMLDivElement;


addContainerBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, true);

})
addContainerCloseBtn.addEventListener('click', () => {
    toggleForm(addContainerBtn, addContainerForm, false);
})
addContainerForm.addEventListener('submit', createNewContainer);


function createNewContainer(e: Event) {
    e.preventDefault();
    if (addContainerFormInput.value.length === 0) {
        validationNewContainer.textContent = "Must not be empty";
        return;
    }
    else {
        validationNewContainer.textContent = "";
    }

    const itemContainer = document.querySelector('.items-container') as HTMLDivElement;
    const newContainer = itemContainer.cloneNode(true) as HTMLDivElement;
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
    `
    newContainer.innerHTML = newContainerContent;
    containersList?.insertBefore(newContainer, addNewContainer);
    addContainerFormInput.value = "";
    addContainerListners(newContainer);
}
