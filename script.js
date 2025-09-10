// Wait until the page is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("notify-form");
  const emailInput = document.getElementById("email");

  const FORMSPREE_URL = "https://formspree.io/f/mqadwlnl";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();

    if (!validateEmail(email)) {
      Swal.fire({
        icon: "warning",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
        confirmButtonColor: "#f107a3"
      });
      return;
    }

    // ✅ Check if email already registered in localStorage
    const registeredEmails = JSON.parse(localStorage.getItem("registeredEmails")) || [];
    if (registeredEmails.includes(email)) {
      Swal.fire({
        icon: "error",
        title: "Already Registered ❌",
        text: "This email is already subscribed to BABABUA updates.",
        confirmButtonColor: "#f107a3"
      });
      return;
    }

    // Loading state
    Swal.fire({
      title: "Submitting...",
      text: "Please wait while we add you to the list.",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    try {
      const formData = new FormData();
      formData.append("email", email);

      const response = await fetch(FORMSPREE_URL, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" }
      });

      Swal.close();

      if (response.ok) {
        // ✅ Save email to localStorage so it can't be reused
        registeredEmails.push(email);
        localStorage.setItem("registeredEmails", JSON.stringify(registeredEmails));

        Swal.fire({
          icon: "success",
          title: "Successfully Subscribed 🎉",
          html: `<p>Thanks for joining the <strong>BABABUA</strong> family!</p>
                 <p>We’ll notify you when we launch 🚀</p>`,
          confirmButtonColor: "#7b2ff7",
          background: "#111",
          color: "#fff",
        });
        form.reset();
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong. Try again later.",
          confirmButtonColor: "#f107a3"
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Please check your connection and try again.",
        confirmButtonColor: "#f107a3"
      });
    }
  });

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});
