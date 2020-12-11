<script>
  import { stores, goto } from "@sapper/app";
  import { authRouteState } from "../auth";

  const { page } = stores();

  export let text = "Login",
    getAuth,
    onClick;
  let className;
  export { className as class };

  export let logoutUrl;

  const {
    login,
    logout,
    isLoading,
    authError,
    isAuthenticated,
    userInfo
  } = getAuth();

  const handleLogin = async () => {
    authRouteState.set({
      ...$page
    });
    await goto("/login");
  };
</script>

{#if $isLoading}
  <button class="{className} loginButton bg-accent-2">Loading...</button>
{:else if $authError}
  <button class="{className} loginButton bg-accent-1">
    Login service error
  </button>
{:else if !$isAuthenticated}
  <button
    class="{className} loginButton"
    on:click={onClick}
    on:click={handleLogin}>
    {text}
  </button>
{:else}
  <button
    class="{className} loginButton"
    on:click={onClick}
    on:click={() => logout(logoutUrl)}>
    Logout
  </button>
{/if}
<!--
{#if user}
    <br />
    <p>Logged in as {user}</p>
{/if}
-->
