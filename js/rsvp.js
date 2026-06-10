(function () {
  const db = window.rsvpDb;
  const searchForm = document.getElementById("rsvpSearchForm");
  const resultsForm = document.getElementById("rsvpResultsForm");
  const resultsContainer = document.getElementById("rsvpResults");
  const statusElement = document.getElementById("rsvpStatus");
  const notesElement = document.getElementById("rsvpNotes");

  let currentGuests = [];

  function setStatus(message, type) {
    statusElement.textContent = message;
    statusElement.dataset.type = type || "";
  }

  function setLoading(isLoading) {
    searchForm.querySelector("button").disabled = isLoading;
    resultsForm.querySelector("button").disabled = isLoading;
  }

  function normalizeValue(value) {
    return value.trim().replace(/\s+/g, " ");
  }

  function createGuestName(guest) {
    return guest.first_name;
  }

  function createPreferenceOption(guest, value, label) {
    const option = document.createElement("label");
    const input = document.createElement("input");
    const text = document.createElement("span");

    option.className = "rsvp-choice";
    input.type = "radio";
    input.name = "guest-" + guest.guest_id;
    input.value = value;
    input.checked = guest.rsvp === value;
    text.textContent = label;

    option.append(input, text);
    return option;
  }

  function groupGuestsByGroup(guests) {
    return guests.reduce((groups, guest) => {
      if (!groups.has(guest.group_id)) {
        groups.set(guest.group_id, {
          label: guest.group_label,
          guests: [],
        });
      }

      groups.get(guest.group_id).guests.push(guest);
      return groups;
    }, new Map());
  }

  function renderResults(guests) {
    const groups = groupGuestsByGroup(guests);
    const fragment = document.createDocumentFragment();
    const existingNotes = guests.find((guest) => guest.dietary_notes);

    groups.forEach((group) => {
      const groupElement = document.createElement("div");

      groupElement.className = "rsvp-group";

      group.guests.forEach((guest) => {
        const row = document.createElement("div");
        const name = document.createElement("strong");
        const choices = document.createElement("div");

        row.className = "rsvp-guest";
        name.textContent = createGuestName(guest);
        choices.className = "rsvp-choices";
        choices.append(
          createPreferenceOption(guest, "yes", "Presente"),
          createPreferenceOption(guest, "no", "Assente")
        );

        row.append(name, choices);
        groupElement.appendChild(row);
      });

      fragment.appendChild(groupElement);
    });

    resultsContainer.replaceChildren(fragment);
    notesElement.value = existingNotes ? existingNotes.dietary_notes : "";
    resultsForm.hidden = false;
  }

  function readResponses() {
    const responses = currentGuests
      .map((guest) => {
        const selected = resultsForm.querySelector(
          `input[name="guest-${guest.guest_id}"]:checked`
        );

        return {
          guest_id: guest.guest_id,
          rsvp: selected ? selected.value : null,
        };
      })
      .filter((response) => response.rsvp !== null);

    return responses;
  }

  async function searchGuests(event) {
    event.preventDefault();

    if (!db || window.SUPABASE_ANON_KEY === "INSERISCI_QUI_LA_TUA_ANON_KEY") {
      setStatus("Configura la chiave anon di Supabase prima di usare l'RSVP.", "error");
      return;
    }

    const firstName = normalizeValue(document.getElementById("rsvpFirstName").value);
    const lastName = normalizeValue(document.getElementById("rsvpLastName").value);

    if (!firstName) {
      setStatus("Inserisci almeno il nome.", "error");
      return;
    }

    setLoading(true);
    setStatus("Cerco gli invitati...", "");
    resultsForm.hidden = true;
    resultsContainer.replaceChildren();
    currentGuests = [];

    const { data, error } = await db.rpc("search_rsvp_guests", {
      p_first_name: firstName,
      p_last_name: lastName || null,
    });

    setLoading(false);

    if (error) {
      setStatus("Non riesco a cercare gli invitati. Controlla la configurazione Supabase.", "error");
      return;
    }

    if (!data || data.length === 0) {
      setStatus("Non abbiamo trovato invitati con questi dati.", "error");
      return;
    }

    if (!lastName && groupGuestsByGroup(data).size > 1) {
      setStatus("Abbiamo trovato piu gruppi con questo nome. Inserisci anche il cognome.", "error");
      return;
    }

    currentGuests = data;
    renderResults(data);
    setStatus("Abbiamo trovato gli invitati collegati. Indica la presenza per ciascuno.", "success");
  }

  async function submitResponses(event) {
    event.preventDefault();

    const responses = readResponses();

    if (responses.length === 0) {
      setStatus("Seleziona almeno una preferenza prima di inviare.", "error");
      return;
    }

    setLoading(true);
    setStatus("Salvo la conferma...", "");

    const { error } = await db.rpc("submit_rsvp_preferences", {
      p_responses: responses,
      p_notes: normalizeValue(notesElement.value),
    });

    if (error) {
      console.error("Errore salvataggio RSVP:", error);
      setLoading(false);
      setStatus("Non riesco a salvare la conferma: " + error.message, "error");
      return;
    }

    setLoading(false);

    currentGuests = currentGuests.map((guest) => {
      const response = responses.find((item) => item.guest_id === guest.guest_id);
      return {
        ...guest,
        rsvp: response ? response.rsvp : guest.rsvp,
        dietary_notes: normalizeValue(notesElement.value),
      };
    });

    renderResults(currentGuests);
    setStatus("Conferma salvata. Grazie!", "success");
  }

  searchForm.addEventListener("submit", searchGuests);
  resultsForm.addEventListener("submit", submitResponses);
})();
