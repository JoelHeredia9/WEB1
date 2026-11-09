"use strict";

// Función del reloj para hacer que se acyualize la hora cada segundo
function actualizarReloj() {
  const contenedorReloj = document.getElementById('reloj');
  if (!contenedorReloj) return;

  const ahora = new Date();
  
  // Obtener horas, minutos y segundos formateados a 2 dígitos
  const horas = String(ahora.getHours()).padStart(2, '0');
  const minutos = String(ahora.getMinutes()).padStart(2, '0');
  const segundos = String(ahora.getSeconds()).padStart(2, '0');

  // Insertar la hora en el elemento HTML
  contenedorReloj.textContent = `${horas}:${minutos}:${segundos}`;
}

// Ejecutar la función cada segundo (1000ms)
setInterval(actualizarReloj, 1000);

// Ejecutar una vez al cargar para evitar parpadeo o retardo inicial
actualizarReloj();

/* ==========================================================
   REQ 3 (Mostrar/Ocultar) — A) Menú hamburguesa responsive
   Alterna la clase .is-open (el CSS la muestra en móvil) y
   actualiza aria-expanded para accesibilidad.
   ========================================================== */
const navToggle = document.getElementById("navToggle");
const mainNav = document.getElementById("mainNav");

function setMenu(open) {
  mainNav.classList.toggle("is-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
}

navToggle.addEventListener("click", () => {
  setMenu(navToggle.getAttribute("aria-expanded") !== "true");
});

// Cierra el menú al pulsar un enlace o la tecla Escape
mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ==========================================================
   REQ 3 (Mostrar/Ocultar) — B) Acordeón de Preguntas Frecuentes
   Cada botón muestra/oculta su panel con el atributo `hidden`.
   Solo se mantiene una respuesta abierta a la vez.
   ========================================================== */
const accButtons = document.querySelectorAll(".acc-btn");

accButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const willOpen = btn.getAttribute("aria-expanded") !== "true";

    // Cierra todos los paneles
    accButtons.forEach((other) => {
      other.setAttribute("aria-expanded", "false");
      document.getElementById(other.getAttribute("aria-controls")).hidden = true;
    });

    // Abre el pulsado si estaba cerrado
    if (willOpen) {
      btn.setAttribute("aria-expanded", "true");
      document.getElementById(btn.getAttribute("aria-controls")).hidden = false;
    }
  });
});

/* ==========================================================
   REQ 3 — Formulario de contacto validado con JavaScript puro
   Campos: nombre, email y mensaje.
   ========================================================== */
const form = document.getElementById("contactForm");
const successBox = document.getElementById("formSuccess");

// Regex de formato de email: texto@dominio.extensión (sin espacios)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Muestra el error en el DOM bajo el input (nunca alert())
function showError(input, message) {
  const field = input.closest(".field");
  field.classList.add("invalid");
  field.querySelector(".error").textContent = message;
  input.setAttribute("aria-invalid", "true");
}

function clearError(input) {
  const field = input.closest(".field");
  field.classList.remove("invalid");
  field.querySelector(".error").textContent = "";
  input.removeAttribute("aria-invalid");
}

// Devuelve el mensaje de error de un campo, o "" si es válido
function validateField(input) {
  const value = input.value.trim();

  if (value === "") {                                   // Comprobación de campo vacío
    return "Este campo es obligatorio.";
  }
  if (input.id === "nombre" && value.length < 2) {
    return "Escribe al menos 2 caracteres.";
  }
  if (input.id === "email" && !EMAIL_REGEX.test(value)) { // Comprobación de formato con Regex
    return "Introduce un email válido, por ejemplo nombre@correo.com.";
  }
  if (input.id === "mensaje" && value.length < 10) {
    return "Cuéntanos un poco más (mínimo 10 caracteres).";
  }
  return "";
}

const fields = [
  document.getElementById("nombre"),
  document.getElementById("email"),
  document.getElementById("mensaje"),
];

// Validación en vivo: al salir de un campo y al corregirlo
fields.forEach((input) => {
  input.addEventListener("blur", () => {
    const msg = validateField(input);
    msg ? showError(input, msg) : clearError(input);
  });
  input.addEventListener("input", () => {
    if (input.closest(".field").classList.contains("invalid") && !validateField(input)) {
      clearError(input);
    }
  });
});

form.addEventListener("submit", (e) => {
  e.preventDefault();                 // Evita el envío por defecto
  successBox.textContent = "";

  let firstInvalid = null;
  fields.forEach((input) => {
    const msg = validateField(input);
    if (msg) {
      showError(input, msg);
      if (!firstInvalid) firstInvalid = input;
    } else {
      clearError(input);
    }
  });

  if (firstInvalid) {                 // Hay errores: se enfoca el primero
    firstInvalid.focus();
    return;
  }

  // Validación correcta: mensaje de éxito en el DOM
  // (aquí iría el fetch() a tu backend o servicio de formularios)
  const nombre = document.getElementById("nombre").value.trim();
  successBox.textContent = `¡Gracias, ${nombre}! Hemos recibido tu consulta y te responderemos en menos de 2 horas laborables.`;
  form.reset();
});
