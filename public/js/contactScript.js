const inputs = document.querySelectorAll(".contact-input");
const toggleBtn = document.querySelector(".theme-toggle");
const allElements = document.querySelectorAll("*");

toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    allElements.forEach(el => {
        el.classList.add("transition");
        setTimeout(() => {
            el.classList.remove("transition");
        }, 1000);
    });
});

inputs.forEach((ipt) => {
    ipt.addEventListener("focus", () => {
        ipt.parentNode.classList.add("focus");
        ipt.parentNode.classList.add("not-empty");
    });
    ipt.addEventListener("blur", () => {
        if(ipt.value == "") {
            ipt.parentNode.classList.remove("not-empty");
        }
        ipt.parentNode.classList.remove("focus");
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("form");
    const result = document.getElementById("result");
    const inputs = document.querySelectorAll(".contact-input");
    const toggleBtn = document.querySelector(".theme-toggle");
    const allElements = document.querySelectorAll("*");

    // Función para manejar el envío del formulario
    form.addEventListener("submit", function (e) {
        const formData = new FormData(form);
        e.preventDefault();

        const file = document.getElementById("attachment");
        const filesize = file.files[0].size / 1024;

        if (filesize > 1000) {
            alert("Please upload file less than 1 MB");
            return;
        }

        result.innerHTML = "Please wait...";

        fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData,
        })
            .then(async (response) => {
                let json = await response.json();
                if (response.status == 200) {
                    result.innerHTML = json.message;
                    result.classList.remove("text-gray-500");
                    result.classList.add("text-green-500");
                } else {
                    console.log(response);
                    result.innerHTML = json.message;
                    result.classList.remove("text-gray-500");
                    result.classList.add("text-red-500");
                }
            })
            .catch((error) => {
                console.log(error);
                result.innerHTML = "Something went wrong!";
            })
            .then(function () {
                form.reset();
                setTimeout(() => {
                    result.style.display = "none";
                }, 5000);
            });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.contact-form');
    const notificationContainer = document.querySelector('.notification-container');
    const namePattern = /^[A-Za-zÀ-ÿ '-]{2,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission to handle validation first
        notificationContainer.innerHTML = ''; // Clear previous notifications

        let isValid = true;

        // Validate Primer Nombre
        const firstName = form.querySelector('input[name="Primer Nombre"]');
        if (!namePattern.test(firstName.value)) {
            isValid = false;
            showNotification('Por favor, ingrese un nombre válido.', 'error');
        }

        // Validate Primer Apellido
        const lastName = form.querySelector('input[name="Primer Apellido"]');
        if (!namePattern.test(lastName.value)) {
            isValid = false;
            showNotification('Por favor, ingrese un apellido válido.', 'error');
        }

        // Validate Email
        const email = form.querySelector('input[name="Email"]');
        if (!emailPattern.test(email.value)) {
            isValid = false;
            showNotification('Por favor, ingrese un correo electrónico válido.', 'error');
        }

        if (isValid) {
            form.submit(); // Submit the form if all validations pass
        }
    });

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notificationContainer.appendChild(notification);
    }
});
