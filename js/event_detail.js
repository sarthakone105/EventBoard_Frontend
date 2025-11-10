document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const eventId = params.get("id");
  if (!eventId) {
    alert("No event ID provided!");
    return;
  }

  document.getElementById("refreshEventBtn").addEventListener("click", () => loadEventScores(eventId));
  loadEventScores(eventId);
});

async function loadEventScores(eventId) {
  try {
    const [event, judges, scores] = await Promise.all([
      fetchJSON(`/events/${eventId}`),
      fetchJSON(`/judges`),
      fetchJSON(`/scores`),
    ]);

    // Event metadata
    document.getElementById("eventTitle").innerText = event.name || "Unnamed Event";
    document.getElementById("eventRound").innerText = event.round_name ? `Round: ${event.round_name}` : "No round info";
    document.getElementById("eventDate").innerText = event.event_date ? `Date: ${event.event_date.split("T")[0]}` : "No date";
    
    // Filter scores for this event
    const eventScores = scores.filter((s) => s.event_id === Number(eventId));
    const players = [...new Set(eventScores.map((s) => s.player_id))];
    document.getElementById("participantCount").innerText = `${players.length} Participants`;

    // Header
    const headerRow = document.getElementById("scoreHeader");
    headerRow.innerHTML =
      `<th>Player</th>` +
      judges.map((j) => `<th>${j.name}</th>`).join("") +
      `<th>Average</th>`;

    const tbody = document.getElementById("scoreBody");

    // For each player
    const playerRows = await Promise.all(
      players.map(async (pid) => {
        const player = await fetchJSON(`/players/${pid}`);
        const playerScores = judges.map((j) => {
          const s = eventScores.find((x) => x.judge_id === j.judge_id && x.player_id === pid);
          return s ? Number(s.score).toFixed(2) : "-";
        });
        const validScores = playerScores.filter((s) => s !== "-").map(Number);
        const avg = validScores.length
          ? (validScores.reduce((a, b) => a + b, 0) / validScores.length).toFixed(2)
          : "-";

        return `
          <tr>
            <td class="fw-semibold">${player.name}</td>
            ${playerScores.map((s) => `<td>${s}</td>`).join("")}
            <td class="fw-bold">${avg}</td>
          </tr>`;
      })
    );

    tbody.innerHTML = playerRows.join("");
  } catch (e) {
    console.error("Error loading event detail:", e);
    const tbody = document.getElementById("scoreBody");
    tbody.innerHTML = `<tr><td colspan="10" class="text-center text-danger">Error loading data</td></tr>`;
  }
}
