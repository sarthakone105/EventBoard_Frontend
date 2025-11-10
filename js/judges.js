// judges page: list, create, delete
document.addEventListener("DOMContentLoaded", () => {
  loadJudges();

  const form = document.getElementById("judgeForm");
  if (form) {
    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const fd = new FormData(form);
      const body = Object.fromEntries(fd.entries());

      try {
        await fetchJSON("/judges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        form.reset();
        bootstrap.Modal.getInstance(document.getElementById("judgeModal")).hide();
        loadJudges();
      } catch (e) {
        console.error("Error creating judge:", e);
        alert("Error: " + e.message);
      }
    });
  }
});

async function loadJudges() {
  try {
    const data = await fetchJSON("/judges");
    const tbody = document.querySelector("#judges-table tbody");
    if (!tbody) return;
    if (!data || !data.length) {
      tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No judges found</td></tr>`;
      return;
    }

    tbody.innerHTML = data
      .map(
        (j) => `
        <tr>
          <td>${j.judge_id}</td>
          <td>${j.name || ""}</td>
          <td>${j.designation || ""}</td>
          <td><button class="btn btn-sm btn-danger" onclick="deleteJudge(${j.judge_id})">Delete</button></td>
        </tr>`
      )
      .join("");
  } catch (e) {
    console.error("Error loading judges:", e);
  }
}

async function deleteJudge(id) {
  if (!confirm("Delete judge " + id + "?")) return;
  try {
    await fetchJSON("/judges/" + id, { method: "DELETE" });
    loadJudges();
  } catch (e) {
    alert("Delete failed: " + e.message);
  }
}
