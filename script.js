import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  serverTimestamp,
  onSnapshot,
  query,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* =========================================
   ELEMENT
========================================= */

const orderBtn =
  document.querySelector(".cod-btn");

const progressText =
  document.querySelector(
    ".progress-top span:last-child"
  );

const progressBar =
  document.querySelector(
    ".progress"
  );

const stockBadge =
  document.querySelector(
    ".stock-badge"
  );

const paymentMethod =
  document.getElementById(
    "paymentMethod"
  );

const qrisBox =
  document.getElementById(
    "qrisBox"
  );

const buktiTf =
  document.getElementById(
    "buktiTf"
  );

const previewTf =
  document.getElementById(
    "previewTf"
  );

const locationBtn =
  document.getElementById(
    "locationBtn"
  );

const locationResult =
  document.getElementById(
    "locationResult"
  );

const qtyInput =
  document.getElementById(
    "qty"
  );

const totalPriceEl =
  document.getElementById(
    "totalPrice"
  );

const mobileSidebar =
  document.getElementById(
    "mobileSidebar"
  );

const sidebarOverlay =
  document.getElementById(
    "sidebarOverlay"
  );

const hamburger =
  document.getElementById(
    "hamburger"
  );

const closeSidebarBtn =
  document.getElementById(
    "closeSidebar"
  );

/* =========================================
   CONFIG
========================================= */

const TOTAL_TICKET = 1000;

const PRICE = 2500;

/* =========================================
   LOCATION CONFIG
========================================= */

const TASIK_LAT = -7.292490;

const TASIK_LNG = 108.208156;

const MAX_RADIUS_KM = 15;

/* =========================================
   LOCATION STATE
========================================= */

let userLocation = {
  verified: false,
  latitude: null,
  longitude: null,
};

/* =========================================
   UTIL FUNCTION
========================================= */

function getVal(id) {
  const el =
    document.getElementById(id);

  return el
    ? el.value.trim()
    : "";
}

function rupiah(number) {
  return number.toLocaleString(
    "id-ID"
  );
}

function convertToBase64(file) {

  return new Promise(
    (resolve, reject) => {

      const reader =
        new FileReader();

      reader.readAsDataURL(
        file
      );

      reader.onload =
        () =>
          resolve(
            reader.result
          );

      reader.onerror =
        (error) =>
          reject(error);
    }
  );
}

/* =========================================
   DISTANCE FUNCTION
========================================= */

function calculateDistance(
  lat1,
  lon1,
  lat2,
  lon2
) {

  const R = 6371;

  const dLat =
    ((lat2 - lat1) *
      Math.PI) /
    180;

  const dLon =
    ((lon2 - lon1) *
      Math.PI) /
    180;

  const a =
    Math.sin(
      dLat / 2
    ) *
      Math.sin(
        dLat / 2
      ) +
    Math.cos(
      (lat1 * Math.PI) /
        180
    ) *
      Math.cos(
        (lat2 * Math.PI) /
          180
      ) *
      Math.sin(
        dLon / 2
      ) *
      Math.sin(
        dLon / 2
      );

  return (
    2 *
    R *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    )
  );
}

/* =========================================
   SIDEBAR MENU
========================================= */

function openMenu() {

  if (mobileSidebar) {
    mobileSidebar.classList.add(
      "active"
    );
  }

  if (sidebarOverlay) {
    sidebarOverlay.classList.add(
      "active"
    );
  }

  document.body.style.overflow =
    "hidden";
}

function closeMenu() {

  if (mobileSidebar) {
    mobileSidebar.classList.remove(
      "active"
    );
  }

  if (sidebarOverlay) {
    sidebarOverlay.classList.remove(
      "active"
    );
  }

  document.body.style.overflow =
    "";
}

if (hamburger) {

  hamburger.addEventListener(
    "click",
    openMenu
  );
}

if (closeSidebarBtn) {

  closeSidebarBtn.addEventListener(
    "click",
    closeMenu
  );
}

if (sidebarOverlay) {

  sidebarOverlay.addEventListener(
    "click",
    closeMenu
  );
}

document
  .querySelectorAll(
    ".mobile-sidebar a"
  )
  .forEach((link) => {

    link.addEventListener(
      "click",
      closeMenu
    );
  });

/* =========================================
   LOCATION CHECK
========================================= */

if (locationBtn) {

  locationBtn.addEventListener(
    "click",
    () => {

      if (
        !navigator.geolocation
      ) {

        alert(
          "Browser tidak mendukung lokasi"
        );

        return;
      }

      locationBtn.disabled =
        true;

      locationBtn.textContent =
        "Mengecek lokasi...";

      navigator.geolocation.getCurrentPosition(

        (position) => {

          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

          const distance =
            calculateDistance(
              lat,
              lng,
              TASIK_LAT,
              TASIK_LNG
            );

          if (
            distance >
            MAX_RADIUS_KM
          ) {

            alert(
              "❌ Pemesanan hanya untuk wilayah Tasikmalaya"
            );

            locationBtn.disabled =
              false;

            locationBtn.textContent =
              "📍 Gunakan Lokasi Saya";

            return;
          }

          userLocation = {
            verified: true,
            latitude: lat,
            longitude: lng,
          };

          if (
            locationResult
          ) {

            locationResult.value =
              `✅ Lokasi terverifikasi (${distance.toFixed(
                1
              )} KM)`;
          }

          locationBtn.textContent =
            "✅ Lokasi Terverifikasi";
        },

        (error) => {

          console.error(
            error
          );

          alert(
            "❌ Gagal mengambil lokasi"
          );

          locationBtn.disabled =
            false;

          locationBtn.textContent =
            "📍 Gunakan Lokasi Saya";
        }
      );
    }
  );
}

/* =========================================
   PAYMENT METHOD
========================================= */

if (paymentMethod) {

  paymentMethod.addEventListener(
    "change",
    () => {

      if (
        paymentMethod.value ===
        "QRIS"
      ) {

        qrisBox.style.display =
          "block";

      } else {

        qrisBox.style.display =
          "none";

        if (buktiTf) {
          buktiTf.value = "";
        }

        if (previewTf) {

          previewTf.src = "";

          previewTf.style.display =
            "none";
        }
      }
    }
  );
}

/* =========================================
   IMAGE PREVIEW
========================================= */

if (buktiTf) {

  buktiTf.addEventListener(
    "change",
    function () {

      const file =
        this.files[0];

      if (!file) return;

      const reader =
        new FileReader();

      reader.onload =
        (e) => {

          previewTf.src =
            e.target.result;

          previewTf.style.display =
            "block";
        };

      reader.readAsDataURL(
        file
      );
    }
  );
}

/* =========================================
   REALTIME STOCK
========================================= */

const orderQuery = query(
  collection(
    db,
    "orders"
  )
);

onSnapshot(
  orderQuery,
  (snapshot) => {

    let sold = 0;

    snapshot.forEach(
      (docSnap) => {

        const data =
          docSnap.data();

        sold += Number(
          data.qty || 0
        );
      }
    );

    const left =
      TOTAL_TICKET - sold;

    const percentage =
      Math.min(
        (sold /
          TOTAL_TICKET) *
          100,
        100
      );

    if (progressText) {

      progressText.textContent =
        `${sold} / ${TOTAL_TICKET}`;
    }

    if (progressBar) {

      progressBar.style.width =
        percentage + "%";
    }

    if (stockBadge) {

      stockBadge.textContent =
        `🔥 Sisa Kupon: ${left} / ${TOTAL_TICKET}`;
    }
  }
);

/* =========================================
   TOTAL PRICE
========================================= */

function updateTotalPrice() {

  if (
    !qtyInput ||
    !totalPriceEl
  )
    return;

  const qty =
    parseInt(
      qtyInput.value
    );

  if (
    isNaN(qty) ||
    qty < 1
  ) {

    totalPriceEl.textContent =
      "Rp0";

    return;
  }

  const total =
    qty * PRICE;

  totalPriceEl.textContent =
    `Rp${rupiah(total)}`;
}

if (qtyInput) {

  qtyInput.addEventListener(
    "input",
    updateTotalPrice
  );
}

/* =========================================
   ORDER FUNCTION
========================================= */

window.order =
  async function () {

    const name =
      getVal("name");

    const phone =
      getVal("phone");

    const address =
      getVal("address");

    const qty =
      parseInt(
        getVal("qty")
      );

    const payment =
      getVal(
        "paymentMethod"
      );

    if (
      !name ||
      !phone ||
      !address ||
      !qty ||
      !payment
    ) {

      alert(
        "⚠️ Lengkapi semua data!"
      );

      return;
    }

    if (
      !userLocation.verified
    ) {

      alert(
        "⚠️ Gunakan lokasi terlebih dahulu!"
      );

      return;
    }

    if (
      qty < 10 ||
      qty > 100
    ) {

      alert(
        "⚠️ Minimal 10 kupon dan maksimal 100 kupon"
      );

      return;
    }

    let buktiTransfer =
      "";

    if (
      payment === "QRIS"
    ) {

      if (
        !buktiTf.files[0]
      ) {

        alert(
          "⚠️ Upload bukti transfer terlebih dahulu"
        );

        return;
      }

      buktiTransfer =
        await convertToBase64(
          buktiTf.files[0]
        );
    }

    try {

      orderBtn.disabled =
        true;

      orderBtn.textContent =
        "Loading...";

      await addDoc(
        collection(
          db,
          "orders"
        ),
        {
          name,
          phone,
          address,
          qty,
          paymentMethod:
            payment,
          buktiTransfer,
          latitude:
            userLocation.latitude,
          longitude:
            userLocation.longitude,
          totalPrice:
            qty * PRICE,
          status:
            "pending",
          createdAt:
            serverTimestamp(),
        }
      );

      showSuccessModal();

      document
        .querySelectorAll(
          "input"
        )
        .forEach((el) => {

          if (
            el.type !==
            "file"
          ) {

            el.value = "";
          }
        });

      if (previewTf) {

        previewTf.src =
          "";

        previewTf.style.display =
          "none";
      }

      if (qrisBox) {

        qrisBox.style.display =
          "none";
      }

      if (paymentMethod) {

        paymentMethod.value =
          "";
      }

      userLocation = {
        verified: false,
        latitude: null,
        longitude: null,
      };

      if (locationBtn) {

        locationBtn.disabled =
          false;

        locationBtn.textContent =
          "📍 Gunakan Lokasi Saya";
      }

      if (locationResult) {

        locationResult.value =
          "";
      }

      updateTotalPrice();

    } catch (error) {

      console.error(
        error
      );

      alert(
        "❌ Gagal mengirim order"
      );

    } finally {

      orderBtn.disabled =
        false;

      orderBtn.textContent =
        "PESAN SEKARANG";
    }
  };

/* =========================================
   COUNTDOWN
========================================= */

const targetDate =
  new Date(
    "2026-09-06T06:00:00"
  ).getTime();

function updateCountdown() {

  const now =
    new Date().getTime();

  const distance =
    targetDate - now;

  const daysEl =
    document.getElementById(
      "days"
    );

  const hoursEl =
    document.getElementById(
      "hours"
    );

  const minutesEl =
    document.getElementById(
      "minutes"
    );

  const secondsEl =
    document.getElementById(
      "seconds"
    );

  if (distance <= 0) {

    daysEl.textContent =
      "00";

    hoursEl.textContent =
      "00";

    minutesEl.textContent =
      "00";

    secondsEl.textContent =
      "00";

    return;
  }

  const days =
    Math.floor(
      distance /
        (
          1000 *
          60 *
          60 *
          24
        )
    );

  const hours =
    Math.floor(
      (
        distance %
        (
          1000 *
          60 *
          60 *
          24
        )
      ) /
        (
          1000 *
          60 *
          60
        )
    );

  const minutes =
    Math.floor(
      (
        distance %
        (
          1000 *
          60 *
          60
        )
      ) /
        (
          1000 * 60
        )
    );

  const seconds =
    Math.floor(
      (
        distance %
        (
          1000 * 60
        )
      ) / 1000
    );

  if (daysEl) {

    daysEl.textContent =
      String(days).padStart(
        2,
        "0"
      );
  }

  if (hoursEl) {

    hoursEl.textContent =
      String(hours).padStart(
        2,
        "0"
      );
  }

  if (minutesEl) {

    minutesEl.textContent =
      String(
        minutes
      ).padStart(
        2,
        "0"
      );
  }

  if (secondsEl) {

    secondsEl.textContent =
      String(
        seconds
      ).padStart(
        2,
        "0"
      );
  }
}

updateCountdown();

setInterval(
  updateCountdown,
  1000
);

/* =========================================
   FAQ ACCORDION
========================================= */

document
  .querySelectorAll(
    ".faq-question"
  )
  .forEach((btn) => {

    btn.addEventListener(
      "click",
      () => {

        const faqItem =
          btn.parentElement;

        faqItem.classList.toggle(
          "active"
        );
      }
    );
  });

/* =========================================
   AUTO CLOSE SIDEBAR
========================================= */

window.addEventListener(
  "resize",
  () => {

    if (
      window.innerWidth >
      768
    ) {

      closeMenu();
    }
  }
);
const sponsorStorage =
  document.getElementById(
    "sponsorStorage"
  );

if(sponsorStorage){

  sponsorStorage.addEventListener(
    "click",
    ()=>{

      sponsorStorage.classList.toggle(
        "active"
      );

    }
  );

}

/* =========================================
   MEDIA STORAGE TOGGLE
========================================= */

const mediaStorage =
document.getElementById('mediaStorage');

if(mediaStorage){

  mediaStorage.onclick = () => {

    mediaStorage.classList.toggle(
      'active'
    );

  };

}
window.showSuccessModal = function(){

  const modal =
    document.getElementById(
      "successModal"
    );

  if(modal){
    modal.classList.add("show");
  }

};

window.closeSuccessModal = function(){

  const modal =
    document.getElementById(
      "successModal"
    );

  if(modal){
    modal.classList.remove("show");
  }

};
document.addEventListener("DOMContentLoaded", () => {

  const tutorialBtns =
    document.querySelectorAll(".tutorial-btn");

  const tutorialContents =
    document.querySelectorAll(".tutorial-content");

  tutorialBtns.forEach(btn => {

    btn.addEventListener("click", () => {

      tutorialBtns.forEach(item =>
        item.classList.remove("active")
      );

      tutorialContents.forEach(item =>
        item.classList.remove("active")
      );

      btn.classList.add("active");

      const target =
        document.getElementById(
          btn.dataset.target
        );

      if(target){
        target.classList.add("active");
      }

    });

  });

});
