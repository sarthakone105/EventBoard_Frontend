// events page: list, create
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ events.js loaded");
  loadEvents();

  const form = document.getElementById("eventForm");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = new FormData(ev.target);
      const body = Object.fromEntries(fd.entries());
      console.log("🟡 Submitting event:", body);

      try {
        const res = await fetchJSON("/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        console.log("✅ Event created:", res);
        ev.target.reset();
        bootstrap.Modal.getInstance(document.getElementById("eventModal")).hide();
        loadEvents();
      } catch (e) {
        console.error("❌ Error creating event:", e);
        alert("Error: " + e.message);
      }
    });
  } else {
    console.warn("⚠️ #eventForm not found in DOM.");
  }
});

async function loadEvents() {
  try {
    console.log("➡️ Fetching events from backend...");
    const data = await fetchJSON("/events");
    console.log("✅ Received events:", data);

    const container = document.getElementById("eventsList");
    if (!container) {
      console.warn("⚠️ #eventsList not found in DOM.");
      return;
    }

    if (!data || !data.length) {
      container.innerHTML = `<div class="col-12 text-center text-muted">No events found</div>`;
      return;
    }

    container.innerHTML = data
      .map(
        (ev) => `
      <div class="col-md-4">
        <div class="card p-3 border border-dark bg-white text-dark">
          <h5 class="fw-bold">${ev.name}</h5>
          <div class="text-muted">${ev.round_name || ""} • ${
          ev.event_date ? ev.event_date.split("T")[0] : ""
        }</div>
          <div class="mt-2">
            <a class="btn btn-sm btn-outline-dark" href="event.html?id=${ev.event_id}">
              View
            </a>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (e) {
    console.error("❌ Error fetching events:", e);
  }
}
