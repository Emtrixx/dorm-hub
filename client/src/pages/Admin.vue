<template>
  <div>
    <header class="dh-page-head">
      <span class="dh-eyebrow">Administration</span>
      <h1>User roles</h1>
    </header>

    <div v-if="!isAdmin" class="alert alert-warning">
      You need the admin role to manage users.
    </div>
    <p v-else-if="loading">loading ...</p>
    <div v-else class="dh-card p-3">
      <div class="table-responsive">
        <table class="table align-middle mb-0">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th v-for="role in allRoles" :key="role" class="text-center text-capitalize">
                {{ role }}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user._id">
              <td>{{ user.firstName }} {{ user.lastName }}</td>
              <td>{{ user.email }}</td>
              <td v-for="role in allRoles" :key="role" class="text-center">
                <input
                  class="form-check-input"
                  type="checkbox"
                  :checked="user.roles.includes(role)"
                  :disabled="isSelfAdminToggle(user, role)"
                  :title="isSelfAdminToggle(user, role) ? 'You cannot remove your own admin role' : ''"
                  @change="toggleRole(user, role)"
                />
              </td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-primary"
                  :disabled="!isDirty(user) || saving === user._id"
                  @click="save(user)"
                >
                  {{ savedRecently === user._id ? "Saved" : "Save" }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api.js";
import { useAuthStore } from "@/stores/auth.js";

export default {
  data() {
    return {
      users: [],
      originalRoles: {},
      loading: true,
      saving: null,
      savedRecently: null,
      allRoles: ["news", "wiki", "hubs", "admin"],
    };
  },
  computed: {
    isAdmin() {
      return useAuthStore().hasRole("admin");
    },
  },
  created() {
    if (this.isAdmin) {
      this.fetchUsers();
    }
  },
  methods: {
    async fetchUsers() {
      this.users = await api.get("admin/secure/users", { auth: true });
      this.originalRoles = Object.fromEntries(
        this.users.map((u) => [u._id, [...u.roles]])
      );
      this.loading = false;
    },
    isSelfAdminToggle(user, role) {
      return role === "admin" && user._id === useAuthStore().userId;
    },
    toggleRole(user, role) {
      if (user.roles.includes(role)) {
        user.roles = user.roles.filter((r) => r !== role);
      } else {
        user.roles.push(role);
      }
    },
    isDirty(user) {
      const original = this.originalRoles[user._id] || [];
      return (
        user.roles.length !== original.length ||
        user.roles.some((r) => !original.includes(r))
      );
    },
    async save(user) {
      this.saving = user._id;
      try {
        const updated = await api.post(
          `admin/secure/users/${user._id}/roles`,
          { roles: user.roles },
          { auth: true }
        );
        user.roles = updated.roles;
        this.originalRoles[user._id] = [...updated.roles];
        this.savedRecently = user._id;
        setTimeout(() => {
          if (this.savedRecently === user._id) this.savedRecently = null;
        }, 2000);
      } catch (error) {
        alert(error.message);
      } finally {
        this.saving = null;
      }
    },
  },
};
</script>
