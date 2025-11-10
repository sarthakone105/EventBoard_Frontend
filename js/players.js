// players page: list, create, delete
document.addEventListener("DOMContentLoaded", () => {
  loadPlayers();

  const form = document.getElementById("playerForm");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const body = Object.fromEntries(fd.entries());
      if (body.age) body.age = Number(body.age);

      try {
        await fetchJSON("/players", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("playerModal")).hide();
        loadPlayers();
      } catch (e) {
        console.error("Error adding player:", e);
        alert("Error: " + e.message);
      }
    });
  }
});

async function loadPlayers() {
  try {
    const data = await fetchJSON("/players");
    const tbody = document.querySelector("#players-table tbody");
    if (!tbody) return;
    if (!data || !data.length) {
      tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted">No players found</td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map(
        (p) => `
        <tr>
          <td>${p.player_id}</td>
          <td>${p.name || ""}</td>
          <td>${p.age || ""}</td>
          <td>${p.force || ""}</td>
          <td>${p.rank || ""}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deletePlayer(${p.player_id})">Delete</button></td>
        </tr>`
      )
      .join("");
  } catch (e) {
    console.error("Error loading players:", e);
  }
}

async function deletePlayer(id) {
  if (!confirm("Delete player " + id + "?")) return;
  try {
    await fetchJSON("/players/" + id, { method: "DELETE" });
    loadPlayers();
  } catch (e) {
    alert("Delete failed: " + e.message);
  }
}
