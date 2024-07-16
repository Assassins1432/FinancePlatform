document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');
    appDiv.innerHTML = `
        <form id="registerForm">
            <input type="text" id="name" placeholder="Nombre" required />
            <input type="email" id="email" placeholder="Correo" required />
            <input type="password" id="password" placeholder="Contraseña" required />
            <button type="submit">Registrar</button>
        </form>
    `;

    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const result = await response.json();
        alert(result.message);
    });
});
