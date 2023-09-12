

const addItemButton = document.getElementById('addItem');
const itemList = document.getElementById('itemList');

addItemButton.addEventListener('click', () => {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const price = parseFloat(document.getElementById('price').value);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (name && description && !isNaN(price) && !isNaN(quantity)) {
     axios.post("https://crudcrud.com/api/dc1eb50df3964e1da157392d90db93d4/test3",{name:name , description : description , price : price , quantity : quantity})
     .then(()=>{
        clearInputFields();
        console.log("sucess")
        fetchData();
     })
        
    } else {
        alert('Please fill in all fields with valid data.');
    }
});

function fetchData() {
    axios.get('https://crudcrud.com/api/dc1eb50df3964e1da157392d90db93d4/task')
        .then((response) => {
            const data = response.data;
            // Clear the table
            itemList.innerHTML = '';
            // Loop through the data and display it in the table
            data.forEach((item) => {
                addItemToTable(item);
            });
        })
        .catch((error) => {
            console.error('Error fetching data:', error);
        });
}

function addItemToTable(item) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${item.name}</td>
        <td>${item.description}</td>
        <td>${item.price}</td>
        <td>${item.quantity}</td>
        <td>
            <button class="buy">Buy</button>
        </td>
    `;

    itemList.appendChild(row);

    const buyButtons = document.querySelectorAll('.buy');
    buyButtons.forEach(button => {
        button.addEventListener('click', () => {
            updateQuantity(row, -1);
        });
    });
}

function updateQuantity(row) {
    const itemId = row.dataset.id; // Assuming you have a "data-id" attribute on the table row
    
    // Get the item details from the row
    const itemName = row.cells[0].textContent; // Assuming name is in the first cell
    const itemDescription = row.cells[1].textContent; // Assuming description is in the second cell
    const itemPrice = parseFloat(row.cells[2].textContent); // Assuming price is in the third cell
    let itemQuantity = parseInt(row.cells[3].textContent); // Assuming quantity is in the fourth cell

    if (itemQuantity <= 0) {
        alert('Item is out of stock!');
        return;
    }

    // Decrement the item quantity
    itemQuantity--;

    // Create the updated item object
    const updatedItem = {
        name: itemName,
        description: itemDescription,
        price: itemPrice,
        quantity: itemQuantity,
    };

    // Send a PUT request to update the item in the API
    axios
        .put(`https://crudcrud.com/api/dc1eb50df3964e1da157392d90db93d4/task/${itemId}`, updatedItem)
        .then((response) => {
            // Update the quantity in the table row
            row.cells[3].textContent = itemQuantity;
        })
        .catch((error) => {
            console.error('Error updating quantity:', error);
        });
}

function clearInputFields() {
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    document.getElementById('price').value = '';
    document.getElementById('quantity').value = '';
}
