document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const loginLink = document.querySelector('a[href="/login"]');
  const profileLink = document.querySelector('a[href="/profile"]');

  // Obtener el estado de inicio de sesión del almacenamiento local
  let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Función para manejar la visibilidad de los enlaces
  const toggleLinks = () => {
    console.log('toggleLinks llamada con isLoggedIn:', isLoggedIn);
    loginLink.style.display = isLoggedIn ? 'none' : 'block';
    profileLink.style.display = isLoggedIn ? 'block' : 'none';
  };

  // Mostrar los enlaces correctos al cargar la página
  toggleLinks();

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("/api/sessions/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar el estado de isLoggedIn
        isLoggedIn = true;
        // Almacenar el estado de inicio de sesión en el almacenamiento local
        localStorage.setItem("isLoggedIn", "true");
        toggleLinks();

        // Cargar el contenido de la página de perfil sin recargar la página
        const profileContent = await fetch("/profile");
        const profileHTML = await profileContent.text();
        document.body.innerHTML = profileHTML;
      } else {
        alert(data.message);
        // Actualizar el estado de isLoggedIn
        isLoggedIn = false;
        // Almacenar el estado de inicio de sesión en el almacenamiento local
        localStorage.setItem("isLoggedIn", "false");
        toggleLinks();
      }
    } catch (error) {
      console.log(`Error al analizar la respuesta JSON: ${error.message}`);
      console.log(`Detalles del error completo: ${error}`);
      // Actualizar el estado de isLoggedIn
      isLoggedIn = false;
      // Almacenar el estado de inicio de sesión en el almacenamiento local
      localStorage.setItem("isLoggedIn", "false");
      toggleLinks();
    }
  });
});