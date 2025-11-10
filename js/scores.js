document.addEventListener("DOMContentLoaded", () => {
  loadScores();
  populateDropdowns();

  const form = document.getElementById("scoreForm");
  form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const fd = new FormData(form);
    const body = Object.fromEntries(fd.entries());
    body.event_id = Number(body.event_id);
    body.player_id = Number(body.player_id);
    body.judge_id = Number(body.judge_id);
    body.score = Number(body.score);

    try {
      await fetchJSON("/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      form.reset();
      bootstrap.Modal.getInstance(document.getElementById("scoreModal")).hide();
      loadScores();
    } catch (e) {
      alert("Error: " + e.message);
    }
  });
});

async function populateDropdowns() {
  try {
    const [events, players, judges] = await Promise.all([
      fetchJSON("/events"),
      fetchJSON("/players"),
      fetchJSON("/judges"),
    ]);

    const eventSelect = document.getElementById("eventSelect");
    const playerSelect = document.getElementById("playerSelect");
    const judgeSelect = document.getElementById("judgeSelect");

    eventSelect.innerHTML =
      `<option value="">Select Event</option>` +
      events.map((e) => `<option value="${e.event_id}">${e.name}</option>`).join("");

    playerSelect.innerHTML =
      `<option value="">Select Player</option>` +
      players.map((p) => `<option value="${p.player_id}">${p.name}</option>`).join("");

    judgeSelect.innerHTML =
      `<option value="">Select Judge</option>` +
      judges.map((j) => `<option value="${j.judge_id}">${j.name}</option>`).join("");
  } catch (e) {
    console.error("Error populating dropdowns:", e);
  }
}

async function loadScores() {
  try {
    const [scores, events, players, judges] = await Promise.all([
      fetchJSON("/scores"),
      fetchJSON("/events"),
      fetchJSON("/players"),
      fetchJSON("/judges"),
    ]);

    const eventMap = Object.fromEntries(events.map((e) => [e.event_id, e.name]));
    const playerMap = Object.fromEntries(players.map((p) => [p.player_id, p.name]));
    const judgeMap = Object.fromEntries(judges.map((j) => [j.judge_id, j.name]));

    const tbody = document.querySelector("#scores-table tbody");
    tbody.innerHTML = scores
      .map(
        (s) => `
        <tr>
          <td>${s.score_id}</td>
          <td>${eventMap[s.event_id] || "?"}</td>
          <td>${playerMap[s.player_id] || "?"}</td>
          <td>${judgeMap[s.judge_id] || "?"}</td>
          <td>${s.score}</td>
          <td>${s.score_date ? new Date(s.score_date).toLocaleString() : ""}</td>
        </tr>`
      )
      .join("");
  } catch (e) {
    console.error("Error loading scores:", e);
  }
}
