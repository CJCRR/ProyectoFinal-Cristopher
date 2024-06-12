const addToCartButtons = document.querySelectorAll('.addToCartBtn');
const loginButtons = document.querySelectorAll('.login-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', async (event) => {
        event.preventDefault(); // Prevenir el comportamiento predeterminado del evento de clic

        const productId = button.getAttribute('data-product-id'); // ID del producto
        const cartId = button.getAttribute('data-cart-id');

        try {
            const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
                method: 'POST'
            });

            if (response.ok) {
                // Manejar la respuesta aquí si es necesario, por ejemplo, mostrar un mensaje de éxito
                console.log('Producto agregado al carrito');
                alert('Producto agregado al carrito');
            } else {
                console.error('Inicia sesion para agregar productos al carrito:', response.statusText);
                alert('Inicia sesion para agregar productos al carrito');
            }
        } catch (error) {
            console.error('Error al agregar producto al carrito:', error);
            alert('Error al agregar producto al carrito');
        }
    });
});

loginButtons.forEach(button => {
    button.addEventListener('click', () => {
        window.location.href = '/login'; // Redirigir al usuario a la ruta /login
    });
});