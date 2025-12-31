async function fetchUsers() {
  try {
    const res = await fetch("/admin/get_users");
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch users");

    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";

    if (!data.users || data.users.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7">No users found</td></tr>`;
      return;
    }

    data.users.forEach(u => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${u.id}</td>
        <td>${u.username}</td>
        <td>${u.email}</td>
        <td>${u.role}</td>
        <td>${u.is_active ? "Yes" : "No"}</td>
        <td>${u.failed_attempts}</td>
        <td>
          ${u.role !== "admin"
            ? `<button class="${u.is_active ? "disable-btn" : "enable-btn"}"
                       onclick="toggleUser(${u.id}, ${u.is_active ? 'false' : 'true'})">
                 ${u.is_active ? "Disable" : "Enable"}
               </button>`
            : "Admin"}
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Error fetching users:", err);
    alert("Error loading users");
  }
}

// Toggle user status
async function toggleUser(userId, isActive) {
  try {
    const res = await fetch("/admin/toggle_user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, is_active: isActive })
    });

    const data = await res.json();
    alert(data.message || "Updated");
    fetchUsers(); // refresh table
  } catch (err) {
    console.error("Error toggling user:", err);
    alert("Failed to update user");
  }
}

document.addEventListener("DOMContentLoaded", fetchUsers);
