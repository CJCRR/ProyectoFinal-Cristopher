function renderCartHTML(cartData) {
    const cartElement = document.querySelector('section.container > div');
    const productsElement = cartElement.querySelector('ul.products');
    const summaryElement = cartElement.querySelector('div.summary');

    // Crear un DocumentFragment para almacenar los nuevos elementos
    const fragment = document.createDocumentFragment();

    // Generar el HTML para los productos en el carrito
    cartData.products.forEach(product => {
        const productElement = document.createElement('li');
        productElement.classList.add('rows');
        productElement.innerHTML = `
            <div class="col left">
                <div class="thumbnail">
                    <a href="#">
                        <img src="${product.product.thumbnail}" class="card-img-top" alt="${product.product.title}">
                    </a>
                </div>
                <div class="detail">
                    <div class="name"><a href="#">${product.product.title}</a></div>
                    <div class="description">${product.product._id}</div>
                    <div class="price">${product.product.price}$</div>
                    <div class="price">${product.quantity}</div>
                </div>
            </div>

            <div class="col right">
                    <div class="quantity">
                        <input type="number" class="quantity" step="1" value="{{this.quantity}}"
                            @input="updateQuantity(index, $event)" @blur="checkQuantity(index, $event)" />
                    </div>

                <div class="remove">
                    <svg class="removeFromCartBtn" data-cart-id="${cartData.cid}" data-product-id="${product.product._id}" version="1.1" xmlns="//www.w3.org/2000/svg" xmlns:xlink="//www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 60 60" enable-background="new 0 0 60 60" xml:space="preserve">
                        <polygon points="38.936,23.561 36.814,21.439 30.562,27.691 24.311,21.439 22.189,23.561 28.441,29.812 22.189,36.064 24.311,38.186 30.562,31.934 36.814,38.186 38.936,36.064 32.684,29.812"></polygon>
                    </svg>
                </div>
            </div>
        `;
        fragment.appendChild(productElement);
    });

    // Reemplazar el contenido actual del carrito con los nuevos elementos
    productsElement.innerHTML = '';
    productsElement.appendChild(fragment);

    // Actualizar el resumen del carrito
    const subtotalElement = summaryElement.querySelector('span.Subtotal');
    const taxElement = summaryElement.querySelector('span.tax');
    const totalElement = summaryElement.querySelector('span.total');

    subtotalElement.textContent = `${cartData.subtotal}$`;
    taxElement.textContent = `${cartData.tax}$`;
    totalElement.textContent = `${cartData.total}$`;

    // Agregar eventos click a los botones de eliminar producto
    const removeFromCartButtons = productsElement.querySelectorAll('.removeFromCartBtn');
    removeFromCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const cartId = button.getAttribute('data-cart-id');
            const productId = button.getAttribute('data-product-id');

            removeProductFromCart(cartId, productId);
        });
    });
}


const removeFromCartButtons = document.querySelectorAll('.removeFromCartBtn');

removeFromCartButtons.forEach(button => {
    button.addEventListener('click', () => {
        const cartId = button.getAttribute('data-cart-id');
        const productId = button.getAttribute('data-product-id');

        removeProductFromCart(cartId, productId);
    });
});

function removeProductFromCart(cartId, productId) {
    fetch(`/api/carts/${cartId}/product/${productId}`, {
        method: 'DELETE'
    })
        .then(response => {
            if (response.ok) {
                // Obtener los datos actualizados del carrito
                return fetch(`/api/carts/${cartId}`);
            } else {
                console.error('Error al eliminar el producto del carrito');
            }
        })
        .then(response => response.json())
        .then(cartData => {
            // Actualizar el contenido del elemento HTML del carrito
            renderCartHTML(cartData);
        })
        .catch(error => {
            console.error('Error al eliminar el producto del carrito:', error);
        });
}

const quantityInputs = document.querySelectorAll('.quantity');

quantityInputs.forEach((input, index) => {

    input.addEventListener('input', (event) => updateQuantity(index, event));
    input.addEventListener('blur', (event) => checkQuantity(index, event));
});

function updateQuantity(index, event) {
    const newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) {
        event.target.value = event.target.defaultValue;
        return;
    }

    const cartId = event.target.closest('.rows').querySelector('.removeFromCartBtn').dataset.cartId;
    const productId = event.target.closest('.rows').querySelector('.removeFromCartBtn').dataset.productId;

    fetch(`/api/carts/${cartId}/products/${productId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
    })
        .then((response) => response.json())
        .then((data) => {
            // Actualizar el HTML del carrito con los nuevos datos del carrito
            // ...
        })
        .catch((error) => {
            console.error('Error al actualizar la cantidad del producto:', error);
            event.target.value = event.target.defaultValue;
        });
}

function incrementQuantity(index) {
    const input = quantityInputs[index];
    const currentQuantity = parseInt(input.value, 10);
    input.value = currentQuantity + 1;
    updateQuantity(index, { target: input });
}

function decrementQuantity(index) {
    const input = quantityInputs[index];
    const currentQuantity = parseInt(input.value, 10);
    if (currentQuantity > 1) {
        input.value = currentQuantity - 1;
        updateQuantity(index, { target: input });
    } else {
        // Mostrar un mensaje de advertencia al usuario sobre eliminar el producto del carrito
        alert('¿Estás seguro de que deseas eliminar este producto del carrito?');
    }
}

function checkQuantity(index, event) {
    const newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity <= 0) {
        event.target.value = event.target.defaultValue;
    } else {
        updateQuantity(index, event);
    }
}
